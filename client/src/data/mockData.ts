// Types
export type RoleType = 'FA' | 'UX' | 'FE' | 'BE' | 'QE';

export interface Employee {
  id: string;
  name: string;
  role: RoleType;
  skills: string[];
  availableHours: number;
}

export interface RoleRequirement {
  id: string;
  roleType: RoleType;
  requiredSkills: string[];
}

export interface Project {
  id: string;
  projectName: string;
  projectDescription: string;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH';
  startDate: string;
  endDate: string;
  status: 'DRAFT' | 'SUBMITTED' | 'SQUAD_CONFIRMED';
  createdAt: string;
  roleRequirements: RoleRequirement[];
  squadMembers: { roleRequirementId: string; employeeId: string }[];
}

export interface Recommendation {
  employee: Employee;
  roleRequirementId: string;
  totalScore: number;
  skillScore: number;
  availabilityScore: number;
  roleScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  isEligible: boolean;
  ineligibilityReasons: string[];
}

// Role display info
export const roleInfo: Record<RoleType, { name: string; color: string }> = {
  FA: { name: 'Feature Analyst', color: 'purple' },
  UX: { name: 'UX/UI Designer', color: 'pink' },
  FE: { name: 'Frontend Developer', color: 'blue' },
  BE: { name: 'Backend Developer', color: 'green' },
  QE: { name: 'Quality Engineer', color: 'orange' },
};

// Skills by role
export const skillsByRole: Record<RoleType, string[]> = {
  FA: [
    'Requirements Gathering',
    'User Story Writing',
    'Acceptance Criteria Definition',
    'Stakeholder Management',
    'Business Process Mapping',
    'JIRA',
    'Confluence',
    'Agile/Scrum Methodologies',
    'Workshop Facilitation',
    'Documentation',
  ],
  UX: [
    'Figma',
    'Sketch',
    'Adobe XD',
    'User Research',
    'Wireframing',
    'Prototyping',
    'Design Systems',
    'Accessibility (WCAG)',
    'Usability Testing',
    'Responsive Design',
  ],
  FE: [
    'React',
    'Angular',
    'Vue.js',
    'TypeScript',
    'JavaScript',
    'HTML5',
    'CSS3',
    'Tailwind CSS',
    'REST API Integration',
    'State Management (Redux/Zustand)',
    'Unit Testing (Jest/Vitest)',
    'Git',
  ],
  BE: [
    'Node.js',
    'Java',
    'Python',
    'C++',
    'C#/.NET',
    'Express.js',
    'Spring Boot',
    'PostgreSQL',
    'MongoDB',
    'REST API Design',
    'Docker',
    'AWS',
    'Unit Testing',
    'Git',
  ],
  QE: [
    'Test Planning',
    'Test Case Design',
    'Selenium',
    'Playwright',
    'Cypress',
    'Postman',
    'API Testing',
    'Performance Testing',
    'CI/CD Pipelines',
    'Bug Tracking',
    'Regression Testing',
    'Test Automation Frameworks',
  ],
};

// Mock employees data
export const mockEmployees: Employee[] = [
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

// Sample historical projects
export const mockProjects: Project[] = [
  {
    id: 'PROJ001',
    projectName: 'Customer Portal Redesign',
    projectDescription: 'Complete overhaul of the customer-facing portal with improved UX and performance.',
    urgency: 'HIGH',
    startDate: '2026-08-01',
    endDate: '2026-09-15',
    status: 'SQUAD_CONFIRMED',
    createdAt: '2026-07-28T10:00:00Z',
    roleRequirements: [
      { id: 'RR001', roleType: 'FE', requiredSkills: ['React', 'TypeScript', 'Tailwind CSS'] },
      { id: 'RR002', roleType: 'UX', requiredSkills: ['Figma', 'User Research', 'Prototyping'] },
    ],
    squadMembers: [
      { roleRequirementId: 'RR001', employeeId: 'EMP021' },
      { roleRequirementId: 'RR002', employeeId: 'EMP011' },
    ],
  },
  {
    id: 'PROJ002',
    projectName: 'API Gateway Migration',
    projectDescription: 'Migrate existing API infrastructure to new gateway with improved security.',
    urgency: 'MEDIUM',
    startDate: '2026-07-15',
    endDate: '2026-08-30',
    status: 'SQUAD_CONFIRMED',
    createdAt: '2026-07-10T14:30:00Z',
    roleRequirements: [
      { id: 'RR003', roleType: 'BE', requiredSkills: ['Node.js', 'REST API Design', 'Docker'] },
      { id: 'RR004', roleType: 'QE', requiredSkills: ['API Testing', 'Postman', 'Test Planning'] },
    ],
    squadMembers: [
      { roleRequirementId: 'RR003', employeeId: 'EMP031' },
      { roleRequirementId: 'RR004', employeeId: 'EMP041' },
    ],
  },
];

// Scoring function
export function calculateRecommendations(
  employees: Employee[],
  roleRequirement: RoleRequirement
): Recommendation[] {
  return employees.map((employee) => {
    const matchedSkills = roleRequirement.requiredSkills.filter((skill) =>
      employee.skills.includes(skill)
    );
    const missingSkills = roleRequirement.requiredSkills.filter(
      (skill) => !employee.skills.includes(skill)
    );

    // Calculate scores
    const skillScore = roleRequirement.requiredSkills.length > 0
      ? (matchedSkills.length / roleRequirement.requiredSkills.length) * 50
      : 0;
    const availabilityScore = (employee.availableHours / 40) * 30;
    const roleScore = employee.role === roleRequirement.roleType ? 20 : 0;
    const totalScore = skillScore + availabilityScore + roleScore;

    // Determine eligibility
    const isEligible =
      employee.role === roleRequirement.roleType &&
      missingSkills.length === 0 &&
      employee.availableHours > 0;

    const ineligibilityReasons: string[] = [];
    if (employee.role !== roleRequirement.roleType) {
      ineligibilityReasons.push(`Role mismatch: ${roleInfo[employee.role].name}`);
    }
    if (missingSkills.length > 0) {
      ineligibilityReasons.push(`Missing skills: ${missingSkills.join(', ')}`);
    }
    if (employee.availableHours === 0) {
      ineligibilityReasons.push('No available capacity');
    }

    return {
      employee,
      roleRequirementId: roleRequirement.id,
      totalScore,
      skillScore,
      availabilityScore,
      roleScore,
      matchedSkills,
      missingSkills,
      isEligible,
      ineligibilityReasons,
    };
  }).sort((a, b) => {
    // Eligible first
    if (a.isEligible !== b.isEligible) return a.isEligible ? -1 : 1;
    // Then by score
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
    // Then by availability
    if (b.employee.availableHours !== a.employee.availableHours) {
      return b.employee.availableHours - a.employee.availableHours;
    }
    // Then by ID
    return a.employee.id.localeCompare(b.employee.id);
  });
}
