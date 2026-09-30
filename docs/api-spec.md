# Squadly API Specification

> Squad Recommendation API for Rapid Assembly of Cross-Functional Delivery Squads

## Table of Contents

- [Overview](#overview)
- [Base URL](#base-url)
- [Authentication](#authentication)
- [Endpoints](#endpoints)
  - [Reference Data](#reference-data)
  - [Squad Evaluation](#squad-evaluation)
  - [Project Management](#project-management)
- [Data Models](#data-models)
- [Error Handling](#error-handling)

---

## Overview

The Squadly API provides endpoints for:
- Retrieving reference data (skills, roles)
- Evaluating and recommending squad members based on project requirements
- Creating and managing delivery projects
- Viewing project history and details

## Base URL

```
/api
```

## Authentication

*Note: Authentication is not implemented in this prototype. All endpoints are publicly accessible.*

---

## Endpoints

### Reference Data

#### Get Skills

Retrieves all available skills in the system.

```
GET /api/skills
```

**Response**

```json
{
  "skills": [
    {
      "skillId": 1,
      "skillName": "Java"
    },
    {
      "skillId": 2,
      "skillName": "Azure"
    },
    {
      "skillId": 3,
      "skillName": "React"
    }
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `skills` | array | List of all skills |
| `skills[].skillId` | integer | Unique skill identifier |
| `skills[].skillName` | string | Human-readable skill name |

---

#### Get Roles

Retrieves all available roles in the system.

```
GET /api/roles
```

**Response**

```json
{
  "roles": [
    {
      "roleId": 1,
      "roleName": "Feature Analyst"
    },
    {
      "roleId": 2,
      "roleName": "UX/UI Designer"
    },
    {
      "roleId": 3,
      "roleName": "Frontend Developer"
    },
    {
      "roleId": 4,
      "roleName": "Backend Developer"
    },
    {
      "roleId": 5,
      "roleName": "Quality Engineer"
    }
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `roles` | array | List of all roles |
| `roles[].roleId` | integer | Unique role identifier |
| `roles[].roleName` | string | Human-readable role name |

---

#### Get Skills for Role

Retrieves skills associated with a specific role.

```
GET /api/roles/{roleId}/skills
```

**Path Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `roleId` | integer | The role identifier |

**Response**

```json
{
  "skills": [
    {
      "skillId": 21,
      "skillName": "React"
    },
    {
      "skillId": 22,
      "skillName": "TypeScript"
    },
    {
      "skillId": 23,
      "skillName": "Tailwind CSS"
    }
  ]
}
```

---

### Squad Evaluation

#### Evaluate Squad Recommendations

Evaluates available employees and returns ranked recommendations based on project requirements.

```
POST /api/requests/evaluate
```

**Request Body**

```json
{
  "urgency": "High",
  "startDate": "2026-10-01",
  "endDate": "2026-12-31",
  "roles": [
    {
      "roleId": 1,
      "skills": [101, 102, 103]
    },
    {
      "roleId": 2,
      "skills": [201, 202]
    }
  ]
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `urgency` | string | Yes | Project urgency: `"Low"`, `"Medium"`, or `"High"` |
| `startDate` | string | Yes | Project start date (YYYY-MM-DD) |
| `endDate` | string | Yes | Project end date (YYYY-MM-DD) |
| `roles` | array | Yes | List of role requirements |
| `roles[].roleId` | integer | Yes | Role identifier |
| `roles[].skills` | array | Yes | List of required skill IDs for this role |

**Response**

```json
{
  "recommendedMembers": [
    {
      "empId": "EMP001",
      "empName": "John Smith",
      "role": "Frontend Developer",
      "roleId": 3,
      "capacity": 40,
      "availability": "Available",
      "ranking": 1,
      "matchScore": 95,
      "rationale": "Strong match for required skills and availability.",
      "skills": ["React", "TypeScript", "Tailwind CSS"],
      "matchedSkills": ["React", "TypeScript"],
      "missingSkillCount": 1,
      "requestedRoleId": 3
    }
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `recommendedMembers` | array | Ranked list of recommended employees |
| `empId` | string | Employee identifier |
| `empName` | string | Employee full name |
| `role` | string | Employee's role name |
| `roleId` | integer | Employee's role identifier |
| `capacity` | integer | Available hours per week (0-40) |
| `availability` | string | `"Available"` or `"Unavailable"` |
| `ranking` | integer | Position in recommendation list |
| `matchScore` | number | Suitability score (0-100) |
| `rationale` | string | Human-readable recommendation reason |
| `skills` | array | All skills the employee possesses |
| `matchedSkills` | array | Skills matching the requirements |
| `missingSkillCount` | integer | Number of required skills not matched |
| `requestedRoleId` | integer | Role this recommendation is for |

**Scoring Algorithm**

The match score is calculated as:
- **Skills Match (50%)**: Percentage of required skills matched
- **Availability (30%)**: Based on capacity / 40 hours
- **Role Match (20%)**: Full points if employee role matches requested role

---

### Project Management

#### Create Project

Creates a new project with selected squad members.

```
POST /api/projects
```

**Request Body**

```json
{
  "projectName": "Digital Transformation",
  "projectDescription": "Migration of legacy applications.",
  "urgency": "High",
  "startDate": "2026-10-01",
  "endDate": "2026-12-31",
  "roles": [
    {
      "roleId": 1,
      "skills": [101, 102]
    }
  ],
  "projectMembers": [
    {
      "empId": "EMP001",
      "roleId": 1,
      "matchScore": 95,
      "rationale": "Strong match for required skills.",
      "selected": true
    }
  ]
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `projectName` | string | Yes | Project name (max 100 chars) |
| `projectDescription` | string | No | Project description (max 1000 chars) |
| `urgency` | string | Yes | `"Low"`, `"Medium"`, or `"High"` |
| `startDate` | string | Yes | Start date (YYYY-MM-DD) |
| `endDate` | string | Yes | End date (YYYY-MM-DD) |
| `roles` | array | No | Role requirements with skills |
| `projectMembers` | array | No | Selected squad members |

**Response**

```json
{
  "projectId": 1001,
  "projectName": "Digital Transformation",
  "projectDescription": "Migration of legacy applications.",
  "urgency": "High",
  "startDate": "2026-10-01",
  "endDate": "2026-12-31",
  "projectMembers": [
    {
      "empId": "EMP001",
      "empName": "John Smith",
      "role": "Frontend Developer",
      "capacity": 40,
      "availability": "Available",
      "ranking": 1,
      "matchScore": 95,
      "rationale": "Strong match for required skills.",
      "skills": ["React", "TypeScript", "Tailwind CSS"]
    }
  ],
  "potentialMembers": []
}
```

---

#### Get All Projects

Retrieves list of all projects (project history).

```
GET /api/projects
```

**Response**

```json
{
  "projects": [
    {
      "projectId": 1001,
      "projectName": "Digital Transformation",
      "urgency": "High",
      "startDate": "2026-10-01",
      "endDate": "2026-12-31",
      "status": "Active"
    },
    {
      "projectId": 1002,
      "projectName": "API Gateway Migration",
      "urgency": "Medium",
      "startDate": "2026-11-01",
      "endDate": "2027-01-31",
      "status": "Completed"
    }
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `projects` | array | List of all projects |
| `projectId` | integer | Unique project identifier |
| `projectName` | string | Project name |
| `urgency` | string | Project urgency level |
| `startDate` | string | Project start date |
| `endDate` | string | Project end date |
| `status` | string | `"Draft"`, `"Active"`, or `"Completed"` |

---

#### Get Project Details

Retrieves detailed information about a specific project.

```
GET /api/projects/{projectId}
```

**Path Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `projectId` | integer | The project identifier |

**Response**

```json
{
  "projectId": 1001,
  "projectName": "Digital Transformation",
  "projectDescription": "Migration of legacy applications.",
  "urgency": "High",
  "startDate": "2026-10-01",
  "endDate": "2026-12-31",
  "status": "Active",
  "projectMembers": [
    {
      "empId": "EMP001",
      "empName": "John Smith",
      "role": "Frontend Developer",
      "capacity": 40,
      "availability": "Available",
      "matchScore": 95,
      "rationale": "Strong match for required skills.",
      "skills": ["React", "TypeScript", "Tailwind CSS"]
    }
  ],
  "potentialMembers": []
}
```

---

#### Update Project

Updates an existing project's details or squad members.

```
PUT /api/projects/{projectId}
```

**Path Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `projectId` | integer | The project identifier |

**Request Body**

```json
{
  "projectName": "Digital Transformation v2",
  "projectDescription": "Updated project scope.",
  "urgency": "Medium",
  "startDate": "2026-10-15",
  "endDate": "2027-01-31",
  "projectMembers": [
    {
      "empId": "EMP001",
      "selected": true
    },
    {
      "empId": "EMP002",
      "selected": true
    }
  ]
}
```

All fields are optional. Only provided fields will be updated.

**Response**

```json
{
  "message": "Project updated successfully"
}
```

---

#### Delete Project

Deletes a project.

```
DELETE /api/projects/{projectId}
```

**Path Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `projectId` | integer | The project identifier |

**Response**

```json
{
  "message": "Project deleted successfully"
}
```

---

## Data Models

### Employee

| Field | Type | Description |
|-------|------|-------------|
| `empId` | string | Unique employee identifier (e.g., "EMP001") |
| `empName` | string | Full name |
| `role` | string | Role name |
| `roleId` | integer | Role identifier |
| `capacity` | integer | Available hours per week (0-40) |
| `availability` | string | "Available" or "Unavailable" |
| `skills` | array | List of skill names |

### Project

| Field | Type | Description |
|-------|------|-------------|
| `projectId` | integer | Unique identifier |
| `projectName` | string | Name (max 100 chars) |
| `projectDescription` | string | Description (max 1000 chars) |
| `urgency` | string | "Low", "Medium", or "High" |
| `startDate` | string | Start date (YYYY-MM-DD) |
| `endDate` | string | End date (YYYY-MM-DD) |
| `status` | string | "Draft", "Active", or "Completed" |

---

## Error Handling

### Error Response Format

```json
{
  "error": "Error message describing what went wrong"
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `201` | Created successfully |
| `400` | Bad request - Invalid input |
| `404` | Not found - Resource doesn't exist |
| `500` | Internal server error |

### Common Errors

| Endpoint | Error | Description |
|----------|-------|-------------|
| `POST /api/requests/evaluate` | 400 | At least one role with skills is required |
| `POST /api/projects` | 400 | Missing required fields |
| `GET /api/projects/{id}` | 404 | Project not found |
| `PUT /api/projects/{id}` | 404 | Project not found |
| `DELETE /api/projects/{id}` | 404 | Project not found |

---

## API Structure Summary

```
Reference Data:
  GET    /api/skills              # Get all skills
  GET    /api/roles               # Get all roles
  GET    /api/roles/{roleId}/skills  # Get skills for a role

Squad Evaluation:
  POST   /api/requests/evaluate   # Evaluate and recommend squad members

Project Management:
  GET    /api/projects            # List all projects (history)
  POST   /api/projects            # Create new project
  GET    /api/projects/{id}       # Get project details
  PUT    /api/projects/{id}       # Update project
  DELETE /api/projects/{id}       # Delete project
```
