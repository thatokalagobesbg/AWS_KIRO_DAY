# Requirements Specification

## Rapid Assembly of Cross-Functional Delivery Squads

**Document Type:** Business & System Requirements  
**Format:** EARS (Easy Approach to Requirements Syntax)  
**Status:** Baseline v1.0  
**Primary User:** Delivery Lead

---

## 1. Executive Summary

### 1.1 Business Objective

Enable a Delivery Lead to rapidly assemble a cross-functional delivery squad by:
1. Capturing a delivery need with project details
2. Specifying required roles and skills
3. Receiving ranked candidate recommendations based on transparent, rules-based scoring
4. Reviewing rationale and selecting candidates
5. Confirming the proposed squad

### 1.2 Core Question

> Given a delivery need, who are the best available people to help right now?

### 1.3 Constraints

| Constraint | Description |
|------------|-------------|
| Mock Data | All employee, skill, and project data is mock data |
| No AI/ML | Scoring is deterministic and rules-based |
| Single User | No authentication; single Delivery Lead user |
| No Integrations | No HR, calendar, or enterprise platform connections |
| 50 Employees | Mock talent pool of 50 employees |

---

## 2. Roles and Skills Taxonomy

### 2.1 Available Roles

| Role ID | Role Name |
|---------|-----------|
| FA | Feature Analyst |
| UX | UX/UI Designer |
| FE | Frontend Developer |
| BE | Backend Developer |
| QE | Quality Engineer |

### 2.2 Skills by Role (Multi-Select Checklists)

#### Feature Analyst (FA)
- Requirements Gathering
- User Story Writing
- Acceptance Criteria Definition
- Stakeholder Management
- Business Process Mapping
- JIRA
- Confluence
- Agile/Scrum Methodologies
- Workshop Facilitation
- Documentation

#### UX/UI Designer (UX)
- Figma
- Sketch
- Adobe XD
- User Research
- Wireframing
- Prototyping
- Design Systems
- Accessibility (WCAG)
- Usability Testing
- Responsive Design

#### Frontend Developer (FE)
- React
- Angular
- Vue.js
- TypeScript
- JavaScript
- HTML5
- CSS3
- Tailwind CSS
- REST API Integration
- State Management (Redux/Zustand)
- Unit Testing (Jest/Vitest)
- Git

#### Backend Developer (BE)
- Node.js
- Java
- Python
- C++
- C#/.NET
- Express.js
- Spring Boot
- PostgreSQL
- MongoDB
- REST API Design
- Docker
- AWS
- Unit Testing
- Git

#### Quality Engineer (QE)
- Test Planning
- Test Case Design
- Selenium
- Playwright
- Cypress
- Postman
- API Testing
- Performance Testing
- CI/CD Pipelines
- Bug Tracking
- Regression Testing
- Test Automation Frameworks

---

## 3. Data Model

### 3.1 Delivery Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Auto | Unique identifier |
| projectName | String (max 100) | Yes | Name of the project |
| projectDescription | String (max 1000) | Yes | Description of the delivery need |
| urgency | Enum | Yes | LOW, MEDIUM, HIGH |
| startDate | Date | Yes | Expected start date |
| endDate | Date | Yes | Expected end date |
| status | Enum | Auto | DRAFT, SUBMITTED, SQUAD_CONFIRMED |
| createdAt | DateTime | Auto | Creation timestamp |

### 3.2 Role Requirement

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Auto | Unique identifier |
| requestId | UUID | Yes | Parent delivery request |
| roleType | Enum | Yes | FA, UX, FE, BE, QE |
| requiredSkills | String[] | Yes | List of required skill names |

### 3.3 Employee (Mock Data)

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Unique identifier |
| name | String | Employee full name |
| role | Enum | FA, UX, FE, BE, QE |
| skills | String[] | List of skill names |
| availableHours | Integer (0-40) | Available hours per week |

### 3.4 Recommendation

| Field | Type | Description |
|-------|------|-------------|
| employeeId | UUID | Recommended employee |
| roleRequirementId | UUID | Role being filled |
| totalScore | Decimal | Suitability score (0-100) |
| skillScore | Decimal | Skill match component (0-50) |
| availabilityScore | Decimal | Availability component (0-30) |
| roleScore | Decimal | Role alignment component (0-20) |
| matchedSkills | String[] | Skills that matched |
| missingSkills | String[] | Required skills not matched |
| isEligible | Boolean | Meets all eligibility criteria |
| ineligibilityReasons | String[] | Why candidate is ineligible |

### 3.5 Proposed Squad

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Unique identifier |
| requestId | UUID | Parent delivery request |
| status | Enum | DRAFT, CONFIRMED |
| confirmedAt | DateTime | When squad was confirmed |

### 3.6 Squad Member

| Field | Type | Description |
|-------|------|-------------|
| squadId | UUID | Parent squad |
| roleRequirementId | UUID | Role being filled |
| employeeId | UUID | Selected employee |

---

## 4. Scoring Algorithm

### 4.1 Score Components

| Component | Points | Formula |
|-----------|--------|---------|
| **Skills** | 0–50 | `50 × (matchedRequiredSkills / totalRequiredSkills)` |
| **Availability** | 0–30 | `30 × (availableHours / 40)` |
| **Role Alignment** | 0–20 | `20 if employee.role === requiredRole, else 0` |
| **Total** | 0–100 | Sum of all components |

### 4.2 Eligibility Criteria

A candidate is **eligible for selection** when ALL of the following are true:
- Employee's role/discipline matches the requested role
- Employee possesses ALL required skills for the role
- Employee has available capacity > 0 hours

### 4.3 Ranking Order

1. Eligible candidates first (isEligible = true)
2. Total score descending
3. Available hours descending (tie-breaker)
4. Employee ID ascending (final tie-breaker)

### 4.4 Score Presentation

- Store and rank using full precision
- Display scores rounded to one decimal place (e.g., 85.3)
- Score represents points out of 100, not probability

---

## 5. Urgency Levels

| Level | Sprint Equivalent | Display Description |
|-------|-------------------|---------------------|
| HIGH | 1 sprint | Needed within 2 weeks |
| MEDIUM | 2-3 sprints | Needed within 6 weeks |
| LOW | 3+ sprints | Flexible timeline |

> **Note:** Urgency is informational context for the Delivery Lead. It does not affect scoring calculations.

---

## 6. Functional Requirements (EARS Format)

### 6.1 Delivery Request Creation

**REQ-001:** The system shall allow a Delivery Lead to create a delivery request. *[Ubiquitous]*

**REQ-002:** The system shall capture a project name (max 100 characters) for each delivery request. *[Ubiquitous]*

**REQ-003:** The system shall capture a project description (max 1000 characters) for each delivery request. *[Ubiquitous]*

**REQ-004:** The system shall allow the Delivery Lead to select an urgency value of LOW, MEDIUM, or HIGH. *[Ubiquitous]*

**REQ-005:** The system shall capture the project start date and end date for each delivery request. *[Ubiquitous]*

**REQ-006:** If the end date precedes the start date, then the system shall display a validation error and prevent submission. *[Unwanted]*

**REQ-007:** When all mandatory project information is valid, the system shall enable the Add Role action. *[Event-driven]*

**REQ-008:** If mandatory project information is missing or invalid, then the system shall identify each field that requires correction. *[Unwanted]*

### 6.2 Role and Skill Management

**REQ-009:** The system shall allow the Delivery Lead to add one or more role requirements to a delivery request. *[Ubiquitous]*

**REQ-010:** The system shall allow the Delivery Lead to select a role type from: Feature Analyst, UX/UI Designer, Frontend Developer, Backend Developer, or Quality Engineer. *[Ubiquitous]*

**REQ-011:** When the Delivery Lead selects a role type, the system shall display the available skills for that role as a multi-select checklist. *[Event-driven]*

**REQ-012:** The system shall allow the Delivery Lead to select one or more required skills from the role's skill checklist. *[Ubiquitous]*

**REQ-013:** When the Delivery Lead selects "Add Another Role", the system shall create a separate role requirement section. *[Event-driven]*

**REQ-014:** When the Delivery Lead removes a role requirement, the system shall remove that role and its selected skills from the request. *[Event-driven]*

**REQ-015:** If a role requirement has no required skills selected, then the system shall prevent request submission and identify the incomplete role. *[Unwanted]*

**REQ-016:** If no role requirements have been added, then the system shall prevent request submission. *[Unwanted]*

### 6.3 Request Submission

**REQ-017:** When all project information is valid and at least one role with at least one skill exists, the system shall enable request submission. *[Event-driven]*

**REQ-018:** When the Delivery Lead submits a valid request, the system shall set the request status to SUBMITTED. *[Event-driven]*

**REQ-019:** When a valid delivery request is submitted, the system shall trigger candidate evaluation for each role requirement. *[Event-driven]*

### 6.4 Candidate Matching and Scoring

**REQ-020:** When candidate evaluation is triggered, the system shall evaluate every employee in the mock dataset for each role requirement. *[Event-driven]*

**REQ-021:** The system shall calculate one suitability score for each candidate-role combination. *[Ubiquitous]*

**REQ-022:** The system shall calculate the skill score as: `50 × (matchedRequiredSkills / totalRequiredSkills)`. *[Ubiquitous]*

**REQ-023:** The system shall calculate the availability score as: `30 × (availableHours / 40)`. *[Ubiquitous]*

**REQ-024:** The system shall calculate the role alignment score as: 20 points if the employee's role matches the required role, otherwise 0 points. *[Ubiquitous]*

**REQ-025:** The system shall calculate the total score as the sum of skill score, availability score, and role alignment score. *[Ubiquitous]*

**REQ-026:** The system shall store scores at full precision and use unrounded totals for ranking. *[Ubiquitous]*

**REQ-027:** The system shall mark a candidate as eligible when: the employee's role matches the required role AND the employee possesses all required skills AND the employee's available hours is greater than zero. *[Ubiquitous]*

**REQ-028:** The system shall mark a candidate as ineligible and record the specific reasons when any eligibility criterion is not met. *[Ubiquitous]*

**REQ-029:** Where a candidate possesses a required skill, the system shall include that skill in the matched skills list. *[Optional]*

**REQ-030:** Where a candidate does not possess a required skill, the system shall include that skill in the missing skills list. *[Optional]*

### 6.5 Recommendation Results

**REQ-031:** When candidate evaluation is complete, the system shall display candidates grouped by role requirement. *[Event-driven]*

**REQ-032:** The system shall display eligible candidates before ineligible candidates within each role group. *[Ubiquitous]*

**REQ-033:** The system shall display candidates in descending order of total score within each eligibility group. *[Ubiquitous]*

**REQ-034:** When two candidates have equal scores, the system shall rank the candidate with higher available hours first. *[Event-driven]*

**REQ-035:** When two candidates have equal scores and equal available hours, the system shall rank by employee ID ascending. *[Event-driven]*

**REQ-036:** The system shall display the total score (rounded to one decimal place) for each candidate. *[Ubiquitous]*

**REQ-037:** The system shall display the matched skills for each candidate. *[Ubiquitous]*

**REQ-038:** The system shall display the missing skills for each ineligible candidate. *[Ubiquitous]*

**REQ-039:** The system shall display the available hours for each candidate. *[Ubiquitous]*

**REQ-040:** The system shall display the ineligibility reasons for each ineligible candidate. *[Ubiquitous]*

**REQ-041:** The system shall display at least three candidates per role where at least three candidates exist. *[Ubiquitous]*

**REQ-042:** If fewer than three candidates exist for a role, then the system shall display all available candidates. *[Unwanted]*

**REQ-043:** If no candidates exist for a role, then the system shall display a message indicating no candidates are available. *[Unwanted]*

### 6.6 Candidate Selection

**REQ-044:** While recommendations are displayed, the system shall allow the Delivery Lead to select a candidate for each role. *[State-driven]*

**REQ-045:** The system shall allow the Delivery Lead to select both eligible and ineligible candidates. *[Ubiquitous]*

**REQ-046:** When the Delivery Lead selects an ineligible candidate, the system shall display a warning with the ineligibility reasons. *[Event-driven]*

**REQ-047:** When the Delivery Lead selects a candidate for a role, the system shall add the candidate to the proposed squad. *[Event-driven]*

**REQ-048:** When the Delivery Lead replaces a selected candidate, the system shall update the proposed squad with the replacement. *[Event-driven]*

**REQ-049:** When the Delivery Lead removes a selected candidate, the system shall mark the role as unfilled in the proposed squad. *[Event-driven]*

### 6.7 Proposed Squad Formation

**REQ-050:** The system shall display the proposed squad showing each role and its selected candidate (or "Unfilled"). *[Ubiquitous]*

**REQ-051:** The system shall display a squad summary with total roles, filled roles, and unfilled roles. *[Ubiquitous]*

**REQ-052:** When every role requirement has a selected candidate, the system shall enable squad confirmation. *[Event-driven]*

**REQ-053:** If one or more roles are unfilled, then the system shall prevent squad confirmation. *[Unwanted]*

**REQ-054:** When the Delivery Lead confirms the squad, the system shall set the squad status to CONFIRMED and record the confirmation timestamp. *[Event-driven]*

**REQ-055:** When the squad is confirmed, the system shall set the delivery request status to SQUAD_CONFIRMED. *[Event-driven]*

### 6.8 Project History

**REQ-056:** The system shall display a list of previously confirmed squads with their associated delivery requests. *[Ubiquitous]*

**REQ-057:** The system shall display historical projects in descending order of confirmation date. *[Ubiquitous]*

**REQ-058:** The system shall display the project name, urgency, and confirmation date for each historical project. *[Ubiquitous]*

**REQ-059:** When the Delivery Lead selects a historical project, the system shall display its full details including roles and squad members. *[Event-driven]*

**REQ-060:** While a historical project is displayed, the system shall prevent modification of the historical record. *[State-driven]*

### 6.9 Reuse Previous Requirements

**REQ-061:** While a historical project is displayed, the system shall allow the Delivery Lead to reuse its role and skill requirements. *[State-driven]*

**REQ-062:** When the Delivery Lead initiates reuse, the system shall create a new delivery request populated with the historical role and skill requirements. *[Event-driven]*

**REQ-063:** When historical requirements are reused, the system shall allow the Delivery Lead to edit the new request without modifying the historical project. *[Event-driven]*

---

## 7. Business Rules

| ID | Rule | Definition |
|----|------|------------|
| BR-001 | Skill Weight | 50% of total suitability score (50 points) |
| BR-002 | Availability Weight | 30% of total suitability score (30 points) |
| BR-003 | Role Alignment Weight | 20% of total suitability score (20 points) |
| BR-004 | Zero Capacity | Employees with 0 available hours are ineligible |
| BR-005 | Skill Mismatch | Missing any required skill makes candidate ineligible |
| BR-006 | Role Mismatch | Different role/discipline makes candidate ineligible |
| BR-007 | Ranking | Eligible first, then by score desc, capacity desc, ID asc |
| BR-008 | Rationale | Every recommendation shows matched/missing skills and scores |
| BR-009 | Minimum Display | Show at least 3 candidates per role if available |
| BR-010 | History Read-Only | Historical project data cannot be modified |
| BR-011 | Mock Data Only | All employee and project data is mock data |
| BR-012 | No AI/ML | Scoring is deterministic rules-based only |
| BR-013 | Score Precision | Store full precision, display one decimal |

---

## 8. Validation Rules

| Scenario | System Behavior | Related Requirement |
|----------|-----------------|---------------------|
| Missing project name | Prevent submission, highlight field | REQ-008 |
| Missing project description | Prevent submission, highlight field | REQ-008 |
| Missing urgency selection | Prevent submission, highlight field | REQ-008 |
| Missing start date | Prevent submission, highlight field | REQ-008 |
| Missing end date | Prevent submission, highlight field | REQ-008 |
| End date before start date | Show error, prevent submission | REQ-006 |
| No role requirements added | Prevent submission | REQ-016 |
| Role with no skills selected | Prevent submission, identify role | REQ-015 |
| Employee has 0 available hours | Mark ineligible, show reason | REQ-027, REQ-028 |
| Employee missing required skill | Mark ineligible, show missing skills | REQ-027, REQ-030 |
| Employee role doesn't match | Mark ineligible, show reason | REQ-027, REQ-028 |
| No candidates for a role | Show "no candidates available" message | REQ-043 |
| Unfilled roles at confirmation | Prevent confirmation | REQ-053 |

---

## 9. Mock Data Requirements

### 9.1 Employee Dataset

- **Total employees:** 50
- **Distribution:** Approximately 10 per role (FA, UX, FE, BE, QE)
- **Skills:** Each employee has 3-8 skills from their role's skill list
- **Availability:** Random distribution from 0-40 hours

### 9.2 Historical Projects

- **Total historical projects:** 5-10 pre-seeded
- **Each contains:** Project details, role requirements, confirmed squad members

---

## 10. Glossary

| Term | Definition |
|------|------------|
| Delivery Lead | Primary user who creates requests and assembles squads |
| Delivery Request | A project staffing need with details, roles, and skills |
| Role Requirement | A needed position (e.g., Frontend Developer) with required skills |
| Suitability Score | Numeric rating (0-100) indicating candidate fit |
| Eligible Candidate | Meets all criteria: matching role, all required skills, capacity > 0 |
| Proposed Squad | Collection of selected candidates before confirmation |
| Confirmed Squad | Finalized team assignment after Delivery Lead confirmation |
| Sprint | 2-week work period used for urgency measurement |

---

## 11. Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-09-30 | Team | Initial baseline from EARS document with updated scoring model |

---

## Appendix A: EARS Pattern Reference

| Pattern | Structure | Use When |
|---------|-----------|----------|
| Ubiquitous | The system shall [action]. | Requirement always applies |
| Event-driven | When [trigger], the system shall [action]. | Something triggers behavior |
| State-driven | While [state], the system shall [behavior]. | Behavior depends on system state |
| Optional | Where [condition], the system shall [action]. | Feature may or may not apply |
| Unwanted | If [condition], then the system shall [action]. | Error or edge case handling |
