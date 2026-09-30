import db from './database.js';

// Role definitions
const roles = [
  { code: 'FA', name: 'Feature Analyst' },
  { code: 'UX', name: 'UX/UI Designer' },
  { code: 'FE', name: 'Frontend Developer' },
  { code: 'BE', name: 'Backend Developer' },
  { code: 'QE', name: 'Quality Engineer' },
];

// Skills by role
const skillsByRole: Record<string, string[]> = {
  FA: [
    'Requirements Gathering', 'User Story Writing', 'Acceptance Criteria Definition',
    'Stakeholder Management', 'Business Process Mapping', 'JIRA', 'Confluence',
    'Agile/Scrum Methodologies', 'Workshop Facilitation', 'Documentation',
  ],
  UX: [
    'Figma', 'Sketch', 'Adobe XD', 'User Research', 'Wireframing', 'Prototyping',
    'Design Systems', 'Accessibility (WCAG)', 'Usability Testing', 'Responsive Design',
  ],
  FE: [
    'React', 'Angular', 'Vue.js', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3',
    'Tailwind CSS', 'REST API Integration', 'State Management (Redux/Zustand)',
    'Unit Testing (Jest/Vitest)', 'Git',
  ],
  BE: [
    'Node.js', 'Java', 'Python', 'C++', 'C#/.NET', 'Express.js', 'Spring Boot',
    'PostgreSQL', 'MongoDB', 'REST API Design', 'Docker', 'AWS', 'Unit Testing', 'Git',
  ],
  QE: [
    'Test Planning', 'Test Case Design', 'Selenium', 'Playwright', 'Cypress',
    'Postman', 'API Testing', 'Performance Testing', 'CI/CD Pipelines',
    'Bug Tracking', 'Regression Testing', 'Test Automation Frameworks',
  ],
};

// Employee data (50 employees)
const employees = [
  { id: 'EMP001', name: 'Sarah Mitchell', role: 'FA', skills: ['Requirements Gathering', 'User Story Writing', 'JIRA', 'Agile/Scrum Methodologies', 'Stakeholder Management'], availableHours: 32 },
  { id: 'EMP002', name: 'James Chen', role: 'FA', skills: ['Requirements Gathering', 'Acceptance Criteria Definition', 'Confluence', 'Workshop Facilitation', 'Documentation'], availableHours: 40 },
  { id: 'EMP003', name: 'Priya Naidoo', role: 'FA', skills: ['User Story Writing', 'Business Process Mapping', 'JIRA', 'Agile/Scrum Methodologies'], availableHours: 24 },
  { id: 'EMP004', name: 'Michael van der Berg', role: 'FA', skills: ['Requirements Gathering', 'Stakeholder Management', 'Confluence', 'Documentation', 'Workshop Facilitation'], availableHours: 16 },
  { id: 'EMP005', name: 'Aisha Mokoena', role: 'FA', skills: ['User Story Writing', 'Acceptance Criteria Definition', 'JIRA', 'Business Process Mapping', 'Agile/Scrum Methodologies'], availableHours: 40 },
  { id: 'EMP006', name: 'David Sithole', role: 'FA', skills: ['Requirements Gathering', 'Documentation', 'Confluence', 'JIRA'], availableHours: 8 },
  { id: 'EMP007', name: 'Emma Botha', role: 'FA', skills: ['Stakeholder Management', 'Workshop Facilitation', 'Agile/Scrum Methodologies', 'User Story Writing'], availableHours: 36 },
  { id: 'EMP008', name: 'Thabo Dlamini', role: 'FA', skills: ['Requirements Gathering', 'User Story Writing', 'Acceptance Criteria Definition', 'JIRA', 'Confluence', 'Business Process Mapping'], availableHours: 0 },
  { id: 'EMP009', name: 'Lisa Pretorius', role: 'FA', skills: ['Agile/Scrum Methodologies', 'Documentation', 'Stakeholder Management', 'JIRA'], availableHours: 28 },
  { id: 'EMP010', name: 'Ryan Govender', role: 'FA', skills: ['User Story Writing', 'Business Process Mapping', 'Workshop Facilitation', 'Requirements Gathering', 'Acceptance Criteria Definition'], availableHours: 40 },
  { id: 'EMP011', name: 'Sophie Williams', role: 'UX', skills: ['Figma', 'User Research', 'Wireframing', 'Prototyping', 'Design Systems'], availableHours: 40 },
  { id: 'EMP012', name: 'Daniel Ndlovu', role: 'UX', skills: ['Figma', 'Adobe XD', 'Responsive Design', 'Accessibility (WCAG)', 'Usability Testing'], availableHours: 32 },
  { id: 'EMP013', name: 'Naledi Khumalo', role: 'UX', skills: ['Sketch', 'Wireframing', 'Prototyping', 'User Research'], availableHours: 24 },
  { id: 'EMP014', name: 'Chris van Wyk', role: 'UX', skills: ['Figma', 'Design Systems', 'Responsive Design', 'Prototyping', 'Wireframing'], availableHours: 40 },
  { id: 'EMP015', name: 'Zanele Mthembu', role: 'UX', skills: ['Adobe XD', 'User Research', 'Usability Testing', 'Accessibility (WCAG)'], availableHours: 16 },
  { id: 'EMP016', name: 'Mark Thompson', role: 'UX', skills: ['Figma', 'Sketch', 'Wireframing', 'Design Systems', 'Responsive Design', 'Prototyping'], availableHours: 36 },
  { id: 'EMP017', name: 'Lerato Molefe', role: 'UX', skills: ['User Research', 'Prototyping', 'Figma', 'Usability Testing'], availableHours: 8 },
  { id: 'EMP018', name: 'Andrew Jacobs', role: 'UX', skills: ['Figma', 'Adobe XD', 'Accessibility (WCAG)', 'Design Systems', 'Wireframing'], availableHours: 40 },
  { id: 'EMP019', name: 'Nomsa Zwane', role: 'UX', skills: ['Sketch', 'Prototyping', 'Responsive Design', 'User Research', 'Wireframing'], availableHours: 0 },
  { id: 'EMP020', name: 'Peter Fourie', role: 'UX', skills: ['Figma', 'Usability Testing', 'Design Systems', 'User Research', 'Accessibility (WCAG)'], availableHours: 28 },
  { id: 'EMP021', name: 'Jessica Nkosi', role: 'FE', skills: ['React', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'REST API Integration', 'Git'], availableHours: 40 },
  { id: 'EMP022', name: 'Brandon Pillay', role: 'FE', skills: ['Angular', 'TypeScript', 'HTML5', 'CSS3', 'State Management (Redux/Zustand)', 'Unit Testing (Jest/Vitest)'], availableHours: 32 },
  { id: 'EMP023', name: 'Taryn Mbeki', role: 'FE', skills: ['React', 'JavaScript', 'HTML5', 'CSS3', 'Git'], availableHours: 24 },
  { id: 'EMP024', name: 'Kevin OBrien', role: 'FE', skills: ['Vue.js', 'TypeScript', 'Tailwind CSS', 'REST API Integration', 'Unit Testing (Jest/Vitest)', 'Git'], availableHours: 40 },
  { id: 'EMP025', name: 'Michelle Zulu', role: 'FE', skills: ['React', 'Angular', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'State Management (Redux/Zustand)'], availableHours: 16 },
  { id: 'EMP026', name: 'Simon Marais', role: 'FE', skills: ['React', 'TypeScript', 'Tailwind CSS', 'Git', 'REST API Integration'], availableHours: 36 },
  { id: 'EMP027', name: 'Thandeka Ngcobo', role: 'FE', skills: ['JavaScript', 'HTML5', 'CSS3', 'Vue.js', 'Git'], availableHours: 8 },
  { id: 'EMP028', name: 'Grant Peterson', role: 'FE', skills: ['React', 'TypeScript', 'JavaScript', 'State Management (Redux/Zustand)', 'Unit Testing (Jest/Vitest)', 'REST API Integration', 'Git'], availableHours: 40 },
  { id: 'EMP029', name: 'Portia Mahlangu', role: 'FE', skills: ['Angular', 'TypeScript', 'HTML5', 'Tailwind CSS', 'Git'], availableHours: 0 },
  { id: 'EMP030', name: 'Dylan Erasmus', role: 'FE', skills: ['React', 'Vue.js', 'JavaScript', 'CSS3', 'REST API Integration', 'Git'], availableHours: 28 },
  { id: 'EMP031', name: 'Rebecca Tshabalala', role: 'BE', skills: ['Node.js', 'Express.js', 'PostgreSQL', 'REST API Design', 'Docker', 'Git'], availableHours: 40 },
  { id: 'EMP032', name: 'Jason Venter', role: 'BE', skills: ['Java', 'Spring Boot', 'PostgreSQL', 'MongoDB', 'AWS', 'Unit Testing'], availableHours: 32 },
  { id: 'EMP033', name: 'Lindiwe Maseko', role: 'BE', skills: ['Node.js', 'Python', 'Express.js', 'MongoDB', 'REST API Design', 'Git'], availableHours: 24 },
  { id: 'EMP034', name: 'Matthew du Plessis', role: 'BE', skills: ['Node.js', 'TypeScript', 'Express.js', 'PostgreSQL', 'Docker', 'AWS', 'Git'], availableHours: 40 },
  { id: 'EMP035', name: 'Sibongile Radebe', role: 'BE', skills: ['Python', 'PostgreSQL', 'REST API Design', 'Docker', 'Unit Testing'], availableHours: 16 },
  { id: 'EMP036', name: 'Craig Wessels', role: 'BE', skills: ['Java', 'C#/.NET', 'Spring Boot', 'PostgreSQL', 'AWS', 'Unit Testing', 'Git'], availableHours: 36 },
  { id: 'EMP037', name: 'Ntombi Shabangu', role: 'BE', skills: ['Node.js', 'Express.js', 'MongoDB', 'Git'], availableHours: 8 },
  { id: 'EMP038', name: 'Willem Steyn', role: 'BE', skills: ['Node.js', 'Python', 'C++', 'PostgreSQL', 'MongoDB', 'REST API Design', 'Docker', 'AWS', 'Git'], availableHours: 40 },
  { id: 'EMP039', name: 'Grace Mabaso', role: 'BE', skills: ['Java', 'Spring Boot', 'PostgreSQL', 'Unit Testing', 'Git'], availableHours: 0 },
  { id: 'EMP040', name: 'Thomas Smit', role: 'BE', skills: ['Node.js', 'Express.js', 'Python', 'REST API Design', 'Docker', 'Git', 'Unit Testing'], availableHours: 28 },
  { id: 'EMP041', name: 'Amanda Louw', role: 'QE', skills: ['Test Planning', 'Test Case Design', 'Selenium', 'Postman', 'API Testing', 'Bug Tracking'], availableHours: 40 },
  { id: 'EMP042', name: 'Vincent Moyo', role: 'QE', skills: ['Playwright', 'Cypress', 'API Testing', 'CI/CD Pipelines', 'Test Automation Frameworks'], availableHours: 32 },
  { id: 'EMP043', name: 'Nosipho Cele', role: 'QE', skills: ['Test Planning', 'Selenium', 'Postman', 'Regression Testing', 'Bug Tracking'], availableHours: 24 },
  { id: 'EMP044', name: 'Richard Potgieter', role: 'QE', skills: ['Test Case Design', 'Playwright', 'Performance Testing', 'CI/CD Pipelines', 'Test Automation Frameworks'], availableHours: 40 },
  { id: 'EMP045', name: 'Busisiwe Mkhize', role: 'QE', skills: ['Selenium', 'Cypress', 'API Testing', 'Bug Tracking', 'Regression Testing'], availableHours: 16 },
  { id: 'EMP046', name: 'Steven Coetzee', role: 'QE', skills: ['Test Planning', 'Test Case Design', 'Postman', 'API Testing', 'Performance Testing', 'CI/CD Pipelines'], availableHours: 36 },
  { id: 'EMP047', name: 'Thandiwe Gumede', role: 'QE', skills: ['Selenium', 'Bug Tracking', 'Regression Testing'], availableHours: 8 },
  { id: 'EMP048', name: 'Johan Meyer', role: 'QE', skills: ['Test Planning', 'Playwright', 'Cypress', 'Postman', 'API Testing', 'Test Automation Frameworks', 'CI/CD Pipelines'], availableHours: 40 },
  { id: 'EMP049', name: 'Precious Sibiya', role: 'QE', skills: ['Test Case Design', 'Selenium', 'Performance Testing', 'Bug Tracking'], availableHours: 0 },
  { id: 'EMP050', name: 'Francois Joubert', role: 'QE', skills: ['Test Planning', 'Test Case Design', 'Cypress', 'API Testing', 'Regression Testing', 'Test Automation Frameworks'], availableHours: 28 },
];

export function seedDatabase() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  db.exec('DELETE FROM project_members');
  db.exec('DELETE FROM project_role_skills');
  db.exec('DELETE FROM project_roles');
  db.exec('DELETE FROM projects');
  db.exec('DELETE FROM employee_skills');
  db.exec('DELETE FROM employees');
  db.exec('DELETE FROM role_skills');
  db.exec('DELETE FROM skills');
  db.exec('DELETE FROM roles');

  // Insert roles
  const insertRole = db.prepare('INSERT INTO roles (code, name) VALUES (?, ?)');
  const roleMap = new Map<string, number>();
  for (const role of roles) {
    const result = insertRole.run(role.code, role.name);
    roleMap.set(role.code, result.lastInsertRowid as number);
  }
  console.log(`✅ Inserted ${roles.length} roles`);

  // Insert all unique skills
  const allSkills = new Set<string>();
  Object.values(skillsByRole).forEach(skills => skills.forEach(s => allSkills.add(s)));
  
  const insertSkill = db.prepare('INSERT INTO skills (name) VALUES (?)');
  const skillMap = new Map<string, number>();
  for (const skillName of allSkills) {
    const result = insertSkill.run(skillName);
    skillMap.set(skillName, result.lastInsertRowid as number);
  }
  console.log(`✅ Inserted ${allSkills.size} skills`);

  // Link roles to skills
  const insertRoleSkill = db.prepare('INSERT INTO role_skills (role_id, skill_id) VALUES (?, ?)');
  for (const [roleCode, skills] of Object.entries(skillsByRole)) {
    const roleId = roleMap.get(roleCode)!;
    for (const skillName of skills) {
      const skillId = skillMap.get(skillName)!;
      insertRoleSkill.run(roleId, skillId);
    }
  }
  console.log('✅ Linked roles to skills');

  // Insert employees
  const insertEmployee = db.prepare('INSERT INTO employees (id, name, role_id, available_hours) VALUES (?, ?, ?, ?)');
  const insertEmployeeSkill = db.prepare('INSERT INTO employee_skills (employee_id, skill_id) VALUES (?, ?)');
  
  for (const emp of employees) {
    const roleId = roleMap.get(emp.role)!;
    insertEmployee.run(emp.id, emp.name, roleId, emp.availableHours);
    
    for (const skillName of emp.skills) {
      const skillId = skillMap.get(skillName);
      if (skillId) {
        insertEmployeeSkill.run(emp.id, skillId);
      }
    }
  }
  console.log(`✅ Inserted ${employees.length} employees with skills`);

  console.log('🎉 Database seed completed!');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}
