// Squadly API Service - matches API Design.txt

const API_BASE = '/api';

// ============================================
// Types (matching API responses)
// ============================================

export interface Skill {
  skillId: number;
  skillName: string;
}

export interface Role {
  roleId: number;
  roleName: string;
  code?: string;
}

export interface RecommendedMember {
  empId: string;
  empName: string;
  role: string;
  roleId?: number;
  capacity: number;
  availability: 'Available' | 'Unavailable';
  ranking: number;
  matchScore: number;
  rationale: string;
  skills: string[];
  matchedSkills?: string[];
  missingSkillCount?: number;
  forRoleId?: number;
  requestedRoleId?: number;
}

export interface ProjectSummary {
  projectId: number;
  projectName: string;
  urgency: string;
  startDate: string;
  endDate: string;
  status: string;
}

export interface ProjectDetail extends ProjectSummary {
  projectDescription: string;
  projectMembers: RecommendedMember[];
  potentialMembers: RecommendedMember[];
}

// ============================================
// GET /api/skills
// ============================================

export async function getSkills(): Promise<Skill[]> {
  const res = await fetch(`${API_BASE}/skills`);
  if (!res.ok) throw new Error('Failed to fetch skills');
  const data = await res.json();
  return data.skills;
}

// ============================================
// GET /api/roles
// ============================================

export async function getRoles(): Promise<Role[]> {
  const res = await fetch(`${API_BASE}/roles`);
  if (!res.ok) throw new Error('Failed to fetch roles');
  const data = await res.json();
  return data.roles;
}

// ============================================
// GET /api/roles/:roleId/skills
// ============================================

export async function getSkillsForRole(roleId: number): Promise<Skill[]> {
  const res = await fetch(`${API_BASE}/roles/${roleId}/skills`);
  if (!res.ok) throw new Error('Failed to fetch skills for role');
  const data = await res.json();
  return data.skills;
}

// ============================================
// POST /api/requests/evaluate
// ============================================

export interface EvaluateRequest {
  urgency: string;
  startDate: string;
  endDate: string;
  roles: {
    roleId: number;
    skills: number[];
  }[];
}

export async function evaluateSquad(request: EvaluateRequest): Promise<RecommendedMember[]> {
  const res = await fetch(`${API_BASE}/requests/evaluate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!res.ok) throw new Error('Failed to evaluate squad');
  const data = await res.json();
  return data.recommendedMembers;
}

// ============================================
// GET /api/projects
// ============================================

export async function getProjects(): Promise<ProjectSummary[]> {
  const res = await fetch(`${API_BASE}/projects`);
  if (!res.ok) throw new Error('Failed to fetch projects');
  const data = await res.json();
  return data.projects;
}

// ============================================
// GET /api/projects/:projectId
// ============================================

export async function getProject(projectId: number): Promise<ProjectDetail> {
  const res = await fetch(`${API_BASE}/projects/${projectId}`);
  if (!res.ok) throw new Error('Failed to fetch project');
  return res.json();
}

// ============================================
// POST /api/projects
// ============================================

export interface CreateProjectRequest {
  projectName: string;
  projectDescription: string;
  urgency: string;
  startDate: string;
  endDate: string;
  roles: {
    roleId: number;
    skills: number[];
  }[];
  projectMembers: {
    empId: string;
    roleId: number;
    matchScore?: number;
    rationale?: string;
    selected: boolean;
  }[];
}

export async function createProject(request: CreateProjectRequest): Promise<ProjectDetail> {
  const res = await fetch(`${API_BASE}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!res.ok) throw new Error('Failed to create project');
  return res.json();
}

// ============================================
// PUT /api/projects/:projectId
// ============================================

export interface UpdateProjectRequest {
  projectName?: string;
  projectDescription?: string;
  urgency?: string;
  startDate?: string;
  endDate?: string;
  projectMembers?: {
    empId: string;
    selected: boolean;
  }[];
}

export async function updateProject(projectId: number, request: UpdateProjectRequest): Promise<void> {
  const res = await fetch(`${API_BASE}/projects/${projectId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!res.ok) throw new Error('Failed to update project');
}

// ============================================
// DELETE /api/projects/:projectId  
// ============================================

export async function deleteProject(projectId: number): Promise<void> {
  const res = await fetch(`${API_BASE}/projects/${projectId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete project');
}
