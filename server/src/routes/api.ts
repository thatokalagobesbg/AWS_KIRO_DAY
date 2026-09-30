import { Router } from 'express';
import db from '../db/database.js';
import { seedDatabase } from '../db/seed.js';

export const apiRouter = Router();

// ============================================
// Health & Utility
// ============================================

apiRouter.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

apiRouter.post('/seed', (_req, res) => {
  try {
    seedDatabase();
    res.json({ message: 'Database seeded successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to seed database' });
  }
});

// ============================================
// GET /api/skills
// ============================================

apiRouter.get('/skills', (_req, res) => {
  const skills = db.prepare(`
    SELECT id as skillId, name as skillName 
    FROM skills 
    ORDER BY name
  `).all();
  
  res.json({ skills });
});

// ============================================
// GET /api/roles
// ============================================

apiRouter.get('/roles', (_req, res) => {
  const roles = db.prepare(`
    SELECT id as roleId, name as roleName
    FROM roles 
    ORDER BY name
  `).all();
  
  res.json({ roles });
});

// Get skills for a specific role
apiRouter.get('/roles/:roleId/skills', (req, res) => {
  const { roleId } = req.params;
  
  const skills = db.prepare(`
    SELECT s.id as skillId, s.name as skillName
    FROM skills s
    JOIN role_skills rs ON s.id = rs.skill_id
    WHERE rs.role_id = ?
    ORDER BY s.name
  `).all(roleId);
  
  res.json({ skills });
});

// ============================================
// POST /api/requests/evaluate
// ============================================

apiRouter.post('/requests/evaluate', (req, res) => {
  const { urgency, startDate, endDate, roles: requestedRoles } = req.body;

  if (!requestedRoles || !Array.isArray(requestedRoles) || requestedRoles.length === 0) {
    return res.status(400).json({ error: 'At least one role with skills is required' });
  }

  const recommendedMembers: any[] = [];

  for (const roleReq of requestedRoles) {
    const { roleId, skills: requiredSkillIds } = roleReq;

    if (!requiredSkillIds || requiredSkillIds.length === 0) {
      continue;
    }

    // Get all employees with this role
    const employees = db.prepare(`
      SELECT 
        e.id as empId,
        e.name as empName,
        e.available_hours as capacity,
        r.name as role
      FROM employees e
      JOIN roles r ON e.role_id = r.id
      WHERE e.role_id = ?
    `).all(roleId) as any[];

    for (const emp of employees) {
      // Get employee's skills
      const empSkills = db.prepare(`
        SELECT s.id as skillId, s.name as skillName
        FROM skills s
        JOIN employee_skills es ON s.id = es.skill_id
        WHERE es.employee_id = ?
      `).all(emp.empId) as any[];

      const empSkillIds = empSkills.map((s: any) => s.skillId);
      const empSkillNames = empSkills.map((s: any) => s.skillName);

      // Calculate matched skills
      const matchedSkillIds = requiredSkillIds.filter((id: number) => empSkillIds.includes(id));

      // Calculate scores (matching your requirements doc)
      // Skills: 50%, Availability: 30%, Role: 20%
      const skillScore = requiredSkillIds.length > 0 
        ? (matchedSkillIds.length / requiredSkillIds.length) * 50 
        : 0;
      const availabilityScore = (emp.capacity / 40) * 30;
      const roleScore = 20; // Role matches since we filtered by role_id
      const totalScore = skillScore + availabilityScore + roleScore;

      // Determine availability
      const availability = emp.capacity > 0 ? 'Available' : 'Unavailable';

      // Generate rationale
      let rationale = '';
      if (matchedSkillIds.length === requiredSkillIds.length && emp.capacity >= 32) {
        rationale = 'Strong match for required skills and availability.';
      } else if (matchedSkillIds.length === requiredSkillIds.length) {
        rationale = 'All required skills matched with limited availability.';
      } else if (matchedSkillIds.length > 0 && emp.capacity >= 20) {
        rationale = 'Good skill match with moderate capacity.';
      } else if (matchedSkillIds.length > 0) {
        rationale = `Partial skill match (${matchedSkillIds.length}/${requiredSkillIds.length} skills).`;
      } else {
        rationale = 'Role match only, skills not matched.';
      }

      recommendedMembers.push({
        empId: emp.empId,
        empName: emp.empName,
        role: emp.role,
        capacity: emp.capacity,
        availability,
        matchScore: Math.round(totalScore * 10) / 10,
        rationale,
        skills: empSkillNames,
        forRoleId: roleId, // Which role this recommendation is for
      });
    }
  }

  // Sort: available first, then by score descending
  recommendedMembers.sort((a, b) => {
    if (a.availability !== b.availability) {
      return a.availability === 'Available' ? -1 : 1;
    }
    return b.matchScore - a.matchScore;
  });

  // Add ranking
  recommendedMembers.forEach((m, i) => {
    m.ranking = i + 1;
  });

  res.json({ recommendedMembers });
});

// ============================================
// GET /api/projects
// ============================================

apiRouter.get('/projects', (_req, res) => {
  const projects = db.prepare(`
    SELECT 
      id as projectId,
      name as projectName,
      urgency,
      start_date as startDate,
      end_date as endDate,
      status
    FROM projects
    ORDER BY created_at DESC
  `).all();

  res.json({ projects });
});

// ============================================
// GET /api/projects/:projectId
// ============================================

apiRouter.get('/projects/:projectId', (req, res) => {
  const { projectId } = req.params;

  const project = db.prepare(`
    SELECT 
      id as projectId,
      name as projectName,
      description as projectDescription,
      urgency,
      start_date as startDate,
      end_date as endDate,
      status
    FROM projects
    WHERE id = ?
  `).get(projectId) as any;

  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  // Get project members with full details
  const members = db.prepare(`
    SELECT 
      e.id as empId,
      e.name as empName,
      r.name as role,
      e.available_hours as capacity,
      pm.match_score as matchScore,
      pm.rationale,
      pm.selected
    FROM project_members pm
    JOIN employees e ON pm.employee_id = e.id
    JOIN project_roles pr ON pm.project_role_id = pr.id
    JOIN roles r ON pr.role_id = r.id
    WHERE pm.project_id = ?
  `).all(projectId) as any[];

  // Add skills and availability for each member
  for (const member of members) {
    const skills = db.prepare(`
      SELECT s.name
      FROM skills s
      JOIN employee_skills es ON s.id = es.skill_id
      WHERE es.employee_id = ?
    `).all(member.empId).map((s: any) => s.name);
    
    member.skills = skills;
    member.availability = member.capacity > 0 ? 'Available' : 'Unavailable';
  }

  // Separate selected (confirmed) from potential members
  const projectMembers = members.filter(m => m.selected).map((m, i) => ({ ...m, ranking: i + 1 }));
  const potentialMembers = members.filter(m => !m.selected).map((m, i) => ({ ...m, ranking: i + 1 }));

  res.json({
    ...project,
    projectMembers,
    potentialMembers,
  });
});

// ============================================
// POST /api/projects
// ============================================

apiRouter.post('/projects', (req, res) => {
  const { 
    projectName, 
    projectDescription, 
    urgency, 
    startDate, 
    endDate, 
    roles: projectRoles,
    projectMembers 
  } = req.body;

  if (!projectName || !urgency || !startDate || !endDate) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Insert project
    const projectResult = db.prepare(`
      INSERT INTO projects (name, description, urgency, start_date, end_date, status)
      VALUES (?, ?, ?, ?, ?, 'Active')
    `).run(projectName, projectDescription || '', urgency, startDate, endDate);

    const projectId = projectResult.lastInsertRowid as number;

    // Insert project roles and track mapping
    const roleIdToProjectRoleId = new Map<number, number>();
    
    if (projectRoles && Array.isArray(projectRoles)) {
      for (const role of projectRoles) {
        const prResult = db.prepare(`
          INSERT INTO project_roles (project_id, role_id)
          VALUES (?, ?)
        `).run(projectId, role.roleId);
        
        const projectRoleId = prResult.lastInsertRowid as number;
        roleIdToProjectRoleId.set(role.roleId, projectRoleId);

        // Insert required skills
        if (role.skills && Array.isArray(role.skills)) {
          for (const skillId of role.skills) {
            db.prepare(`
              INSERT OR IGNORE INTO project_role_skills (project_role_id, skill_id)
              VALUES (?, ?)
            `).run(projectRoleId, skillId);
          }
        }
      }
    }

    // Insert project members
    const insertedMembers: any[] = [];
    if (projectMembers && Array.isArray(projectMembers)) {
      for (const member of projectMembers) {
        // Find the project_role_id for this member's role
        let projectRoleId = roleIdToProjectRoleId.get(member.roleId);
        
        // If no roleId provided, get the first project role
        if (!projectRoleId) {
          const firstRole = db.prepare('SELECT id FROM project_roles WHERE project_id = ? LIMIT 1').get(projectId) as any;
          projectRoleId = firstRole?.id;
        }
        
        if (projectRoleId) {
          db.prepare(`
            INSERT INTO project_members (project_id, project_role_id, employee_id, match_score, rationale, selected)
            VALUES (?, ?, ?, ?, ?, 1)
          `).run(
            projectId, 
            projectRoleId, 
            member.empId, 
            member.matchScore || null,
            member.rationale || null
          );

          // Get full employee details for response
          const emp = db.prepare(`
            SELECT e.id as empId, e.name as empName, r.name as role, e.available_hours as capacity
            FROM employees e
            JOIN roles r ON e.role_id = r.id
            WHERE e.id = ?
          `).get(member.empId) as any;

          if (emp) {
            const skills = db.prepare(`
              SELECT s.name FROM skills s
              JOIN employee_skills es ON s.id = es.skill_id
              WHERE es.employee_id = ?
            `).all(member.empId).map((s: any) => s.name);

            insertedMembers.push({
              empId: emp.empId,
              empName: emp.empName,
              role: emp.role,
              capacity: emp.capacity,
              availability: emp.capacity > 0 ? 'Available' : 'Unavailable',
              ranking: insertedMembers.length + 1,
              matchScore: member.matchScore || 0,
              rationale: member.rationale || 'Selected by delivery lead.',
              skills,
            });
          }
        }
      }
    }

    // Return response matching your API design
    res.status(201).json({
      projectId,
      projectName,
      projectDescription: projectDescription || '',
      urgency,
      startDate,
      endDate,
      projectMembers: insertedMembers,
      potentialMembers: [],
    });

  } catch (error: any) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project', details: error.message });
  }
});

// ============================================
// PUT /api/projects/:projectId
// ============================================

apiRouter.put('/projects/:projectId', (req, res) => {
  const { projectId } = req.params;
  const { projectName, projectDescription, urgency, startDate, endDate, projectMembers } = req.body;

  const existing = db.prepare('SELECT id FROM projects WHERE id = ?').get(projectId);
  if (!existing) {
    return res.status(404).json({ error: 'Project not found' });
  }

  try {
    db.prepare(`
      UPDATE projects 
      SET name = COALESCE(?, name),
          description = COALESCE(?, description),
          urgency = COALESCE(?, urgency),
          start_date = COALESCE(?, start_date),
          end_date = COALESCE(?, end_date),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(projectName, projectDescription, urgency, startDate, endDate, projectId);

    // Update members if provided
    if (projectMembers && Array.isArray(projectMembers)) {
      db.prepare('DELETE FROM project_members WHERE project_id = ?').run(projectId);
      
      const projectRole = db.prepare('SELECT id FROM project_roles WHERE project_id = ? LIMIT 1').get(projectId) as any;
      
      if (projectRole) {
        for (const member of projectMembers) {
          db.prepare(`
            INSERT INTO project_members (project_id, project_role_id, employee_id, match_score, rationale, selected)
            VALUES (?, ?, ?, ?, ?, 1)
          `).run(projectId, projectRole.id, member.empId, member.matchScore || null, member.rationale || null);
        }
      }
    }

    res.json({ message: 'Project updated successfully' });

  } catch (error: any) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// ============================================
// DELETE /api/projects/:projectId
// ============================================

apiRouter.delete('/projects/:projectId', (req, res) => {
  const { projectId } = req.params;
  const result = db.prepare('DELETE FROM projects WHERE id = ?').run(projectId);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Project not found' });
  }

  res.json({ message: 'Project deleted successfully' });
});
