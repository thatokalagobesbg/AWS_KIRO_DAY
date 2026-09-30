# Requirements: Squad Assembly Tool

## Overview
Squadly is a squad assembly tool for Standard Bank hackathon that helps delivery leads find and assemble cross-functional teams by matching employee skills to project requirements.

## Functional Requirements

### FR-1: Employee Management
- **FR-1.1**: Users shall be able to add new employees with name, email, job title, and skills
- **FR-1.2**: Users shall be able to view a list of all employees
- **FR-1.3**: Users shall be able to edit employee details
- **FR-1.4**: Users shall be able to delete employees
- **FR-1.5**: Users shall be able to search/filter employees by name or skills

### FR-2: Skills Management
- **FR-2.1**: Users shall be able to add skills to an employee
- **FR-2.2**: Users shall be able to remove skills from an employee
- **FR-2.3**: System shall maintain a master list of available skills
- **FR-2.4**: Users shall be able to add new skills to the master list

### FR-3: Project Management
- **FR-3.1**: Users shall be able to create new projects with title and description
- **FR-3.2**: Users shall be able to define required skills for a project
- **FR-3.3**: Users shall be able to view all projects
- **FR-3.4**: Users shall be able to edit project details
- **FR-3.5**: Users shall be able to delete projects

### FR-4: Squad Recommendations
- **FR-4.1**: System shall recommend employees for a project based on skill matching
- **FR-4.2**: Recommendations shall use weighted scoring algorithm:
  - Skills Match: 50%
  - Availability: 30%
  - Role Match: 20%
- **FR-4.3**: Users shall be able to view recommended squad members with match scores
- **FR-4.4**: Users shall be able to add recommended employees to project squad

### FR-5: Squad Management
- **FR-5.1**: Users shall be able to view current squad members for a project
- **FR-5.2**: Users shall be able to remove members from a project squad
- **FR-5.3**: Users shall be able to manually add any employee to a project squad

### FR-6: Data Export
- **FR-6.1**: Users shall be able to export project details to PDF
- **FR-6.2**: PDF export shall include project info, required skills, and squad members

## Non-Functional Requirements

### NFR-1: Performance
- **NFR-1.1**: API responses shall complete within 500ms for typical operations
- **NFR-1.2**: Squad recommendations shall compute within 2 seconds for up to 1000 employees

### NFR-2: Usability
- **NFR-2.1**: UI shall be responsive and work on desktop and tablet screens
- **NFR-2.2**: All forms shall provide validation feedback

### NFR-3: Security
- **NFR-3.1**: All database queries shall use parameterized queries
- **NFR-3.2**: API shall validate and sanitize all input data

### NFR-4: Maintainability
- **NFR-4.1**: Code shall follow TypeScript strict mode
- **NFR-4.2**: Components shall be modular and reusable
