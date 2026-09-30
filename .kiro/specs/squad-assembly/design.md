# Design: Squad Assembly Tool

## System Architecture

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                        Client (React)                        │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────────┐ │
│  │  Pages  │  │  Comps  │  │  API    │  │  Utils (PDF)    │ │
│  └─────────┘  └─────────┘  └─────────┘  └─────────────────┘ │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP/JSON
┌──────────────────────────▼──────────────────────────────────┐
│                      Server (Express)                        │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                      │
│  │ Routes  │  │ Services│  │   DB    │                      │
│  └─────────┘  └─────────┘  └─────────┘                      │
└──────────────────────────┬──────────────────────────────────┘
                           │
                    ┌──────▼──────┐
                    │   SQLite    │
                    │ (squadly.db)│
                    └─────────────┘
```

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Express.js + TypeScript + better-sqlite3
- **Database**: SQLite
- **Build**: npm workspaces monorepo

## Database Design

### Entity Relationship Diagram
```
┌──────────────┐       ┌───────────────────┐       ┌──────────────┐
│   Employee   │       │  employee_skills  │       │    Skill     │
├──────────────┤       ├───────────────────┤       ├──────────────┤
│ id (PK)      │───────│ employee_id (FK)  │       │ id (PK)      │
│ name         │       │ skill_id (FK)     │───────│ name         │
│ email        │       └───────────────────┘       │ category     │
│ job_title    │                                   └──────────────┘
│ availability │
└──────────────┘

┌──────────────┐       ┌───────────────────┐       ┌──────────────┐
│   Project    │       │  project_skills   │       │    Skill     │
├──────────────┤       ├───────────────────┤       ├──────────────┤
│ id (PK)      │───────│ project_id (FK)   │       │ (references  │
│ title        │       │ skill_id (FK)     │───────│  above)      │
│ description  │       └───────────────────┘       └──────────────┘
│ status       │
│ created_at   │       ┌───────────────────┐
└──────────────┘───────│  project_members  │
                       ├───────────────────┤       ┌──────────────┐
                       │ project_id (FK)   │       │   Employee   │
                       │ employee_id (FK)  │───────│ (references  │
                       │ role              │       │  above)      │
                       └───────────────────┘       └──────────────┘
```

## API Design

### Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/employees | List all employees |
| POST | /api/employees | Create employee |
| GET | /api/employees/:id | Get employee details |
| PUT | /api/employees/:id | Update employee |
| DELETE | /api/employees/:id | Delete employee |
| GET | /api/skills | List all skills |
| POST | /api/skills | Create skill |
| GET | /api/projects | List all projects |
| POST | /api/projects | Create project |
| GET | /api/projects/:id | Get project details |
| PUT | /api/projects/:id | Update project |
| DELETE | /api/projects/:id | Delete project |
| GET | /api/projects/:id/recommendations | Get squad recommendations |
| POST | /api/projects/:id/members | Add member to squad |
| DELETE | /api/projects/:id/members/:employeeId | Remove member |

## Component Architecture

### Page Components
- `HomePage` - Dashboard with project overview
- `EmployeesPage` - Employee CRUD operations
- `EmployeeFormPage` - Add/Edit employee form
- `ProjectsPage` - Project listing
- `ProjectFormPage` - Create/Edit project
- `ProjectDetailsPage` - Project details with squad management

### Shared Components
- `Navbar` - Navigation header
- `EmployeeCard` - Employee display card
- `ProjectCard` - Project display card
- `SkillBadge` - Skill tag display
- `ConfirmModal` - Confirmation dialogs

## Scoring Algorithm

### Recommendation Scoring Formula
```
Total Score = (Skills Match × 0.5) + (Availability × 0.3) + (Role Match × 0.2)

Where:
- Skills Match = (matching_skills / required_skills) × 100
- Availability = employee.availability (0-100)
- Role Match = job_title relevance score (0-100)
```

### Score Thresholds
- **Excellent Match**: Score >= 80
- **Good Match**: Score >= 60
- **Fair Match**: Score >= 40
- **Poor Match**: Score < 40
