# Squadly - System Architecture

> Technical Architecture Documentation for the Squad Assembly Tool
>
> Standard Bank Hackathon - Rapid Assembly of Cross-Functional Delivery Squads

---

## Table of Contents

1. [Overview](#1-overview)
2. [System Architecture](#2-system-architecture)
3. [Technology Stack](#3-technology-stack)
4. [Frontend Architecture](#4-frontend-architecture)
5. [Backend Architecture](#5-backend-architecture)
6. [Database Schema](#6-database-schema)
7. [Data Flow](#7-data-flow)
8. [API Design](#8-api-design)
9. [Security Considerations](#9-security-considerations)
10. [Deployment](#10-deployment)
11. [Project Structure](#11-project-structure)

---

## 1. Overview

### 1.1 Purpose

Squadly is a prototype web application designed to help delivery leads rapidly assemble cross-functional teams for project delivery. The system recommends squad members based on skills matching, availability, and role alignment using a rules-based scoring algorithm.

### 1.2 Key Features

- **Project Request Creation**: Capture project details, required roles, and skills
- **Squad Recommendations**: Evaluate employees and rank by suitability score
- **Squad Assembly**: Select team members with multi-person per role support
- **Project Management**: View, edit, and track project history
- **PDF Export**: Generate professional squad reports

### 1.3 Design Principles

| Principle | Implementation |
|-----------|----------------|
| **No AI/ML** | Deterministic, rules-based scoring algorithm |
| **Mock Data Only** | No real HR system integration |
| **Prototype Scope** | Full flow demonstration with simplified features |
| **Responsive UI** | Mobile-friendly Tailwind CSS design |

---

## 2. System Architecture

### 2.1 High-Level Architecture

The application follows a **3-tier architecture**:

1. **Presentation Tier** - React SPA with component-based UI
2. **Application Tier** - Express.js REST API with business logic
3. **Data Tier** - SQLite embedded database

### 2.2 Communication Flow

- Browser connects to Vite Dev Server on port 5173
- API calls (/api/*) are proxied to Express Server on port 3001
- Express Server queries SQLite Database (server/data/squadly.db)

---

## 3. Technology Stack

### 3.1 Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3 | UI library with functional components and hooks |
| TypeScript | 5.6 | Type safety and developer experience |
| Vite | 5.4 | Build tool and development server |
| Tailwind CSS | 3.4 | Utility-first CSS framework |
| React Router | 7.18 | Client-side routing (SPA) |
| jsPDF | 4.2 | PDF generation for exports |

### 3.2 Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 20+ | JavaScript runtime |
| Express.js | 4.21 | Web application framework |
| TypeScript | 5.6 | Type safety |
| better-sqlite3 | 13.0 | Synchronous SQLite driver |
| CORS | 2.8 | Cross-origin resource sharing |
| dotenv | 16.4 | Environment configuration |

### 3.3 Development Tools

| Tool | Purpose |
|------|---------|
| Vitest | Unit testing framework |
| Playwright | End-to-end testing |
| ESLint | Code linting |
| Prettier | Code formatting |
| Concurrently | Run multiple scripts |
| tsx | TypeScript execution |

### 3.4 Monorepo Structure

The project uses npm workspaces to manage the monorepo with server and client packages.

---

## 4. Frontend Architecture

### 4.1 Application Structure

- **main.tsx** - Application entry point
- **App.tsx** - Root component with routing
- **api/** - API Client Layer (squadlyApi.ts)
- **pages/** - Page Components (HomePage, CreateProjectPage, ProjectDetailsPage)
- **components/** - Reusable UI Components (Header, EmployeeCard, EmployeeModal)
- **utils/** - Utility Functions (exportPdf.ts)

### 4.2 Routing Configuration

| Route | Component | Purpose |
|-------|-----------|---------|
| / | HomePage | Project dashboard and list |
| /create | CreateProjectPage | New project wizard |
| /project/:id | ProjectDetailsPage | View project details |
| /edit/:id | CreateProjectPage | Edit existing project |

### 4.3 State Management

The application uses React built-in state management:
- useState for local component state
- useEffect for side effects and data fetching
- Props drilling for component communication

---

## 5. Backend Architecture

### 5.1 Application Structure

- **index.ts** - Express app entry point
- **routes/api.ts** - All REST endpoints
- **middleware/errorHandler.ts** - Global error handling
- **db/database.ts** - Database connection and schema
- **db/seed.ts** - Seed data script

### 5.2 API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Health check |
| GET | /api/skills | Get all skills |
| GET | /api/roles | Get all roles |
| GET | /api/roles/:id/skills | Get skills for role |
| POST | /api/requests/evaluate | Evaluate squad recommendations |
| GET | /api/projects | List all projects |
| POST | /api/projects | Create project |
| GET | /api/projects/:id | Get project details |
| PUT | /api/projects/:id | Update project |
| DELETE | /api/projects/:id | Delete project |

### 5.3 Scoring Algorithm

The recommendation engine uses a weighted scoring formula:

**Match Score = (Skill Score x 50%) + (Availability Score x 30%) + (Role Score x 20%)**

| Component | Weight | Formula |
|-----------|--------|---------|
| Skill Score | 50% | (matched_skills / required_skills) x 50 |
| Availability | 30% | (available_hours / 40) x 30 |
| Role Match | 20% | 20 if role matches, else 0 |

---

## 6. Database Schema

### 6.1 Core Tables

| Table | Description | Records |
|-------|-------------|---------|
| roles | Job role definitions | 5 roles |
| skills | Technical/soft skills | 57 skills |
| role_skills | Skills per role mapping | ~50 mappings |
| employees | Mock employee data | 50 employees |
| employee_skills | Employee skill assignments | ~200 mappings |

### 6.2 Project Tables

| Table | Description |
|-------|-------------|
| projects | Project header information |
| project_roles | Roles required for a project |
| project_role_skills | Skills required per project role |
| project_members | Employees assigned to project |

### 6.3 Seed Data

- **5 Roles**: Feature Analyst, UX/UI Designer, Frontend Developer, Backend Developer, Quality Engineer
- **57 Skills**: Role-specific technical and soft skills
- **50 Employees**: Mock employees with varying skills and availability (0-40 hours)

---

## 7. Data Flow

### 7.1 Create Project Flow

1. Step 1 (Form): Load roles and skills via GET /api/roles and GET /api/roles/:id/skills
2. Step 2 (Select): Evaluate candidates via POST /api/requests/evaluate
3. Save: Create project via POST /api/projects
4. Redirect to Home

### 7.2 Squad Evaluation Flow

1. Client sends POST /api/requests/evaluate with urgency, dates, and role requirements
2. Server validates request
3. For each role: query employees, get skills, calculate scores, generate rationale
4. Sort by availability then score
5. Return ranked recommendations

---

## 8. API Design

### 8.1 Design Principles

- **RESTful**: Resource-based URLs with standard HTTP methods
- **JSON**: All requests and responses use JSON format
- **Stateless**: No server-side session state
- **Consistent**: Uniform response structure

### 8.2 Status Codes

| Code | Usage |
|------|-------|
| 200 | Successful GET, PUT |
| 201 | Successful POST (created) |
| 400 | Bad request (validation error) |
| 404 | Resource not found |
| 500 | Internal server error |

---

## 9. Security Considerations

### 9.1 Current State (Prototype)

| Area | Status |
|------|--------|
| Authentication | Not implemented |
| Authorization | Not implemented |
| Input Validation | Basic server-side |
| SQL Injection | Protected (parameterized queries) |
| CORS | Enabled (dev config) |
| HTTPS | Not implemented |

### 9.2 Production Recommendations

1. JWT or OAuth 2.0 authentication
2. Role-based access control
3. TLS encryption
4. Rate limiting
5. Input sanitization
6. Audit logging

---

## 10. Deployment

### 10.1 Development

```bash
npm install
npm run dev
# Server: http://localhost:3001
# Client: http://localhost:5173
```

### 10.2 Production Build

```bash
npm run build
npm run start
```

### 10.3 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 3001 | Backend server port |
| VITE_API_URL | http://localhost:3001 | API base URL |

---

## 11. Project Structure

```
node-conf-starter/
├── package.json          # Root package (workspaces)
├── client/               # Frontend Package
│   ├── src/
│   │   ├── api/          # API client
│   │   ├── pages/        # Page components
│   │   ├── components/   # UI components
│   │   └── utils/        # Utilities
│   └── public/           # Static assets
├── server/               # Backend Package
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Express middleware
│   │   └── db/           # Database layer
│   └── data/             # SQLite database
└── docs/                 # Documentation
    ├── requirements.md
    ├── ui-spec.md
    ├── api-spec.md
    ├── test-cases.md
    └── architecture.md
```

---

## Appendix: Technology Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Database | SQLite | Embedded, zero-config, sufficient for prototype |
| ORM | None (raw SQL) | Simpler, better-sqlite3 is synchronous |
| State Management | React useState | Sufficient for app complexity |
| CSS Framework | Tailwind | Rapid UI development |
| Build Tool | Vite | Fast HMR, modern defaults |
| PDF Library | jsPDF | Client-side generation |

---

*Document Version: 1.0 | Squadly - Standard Bank Hackathon*
