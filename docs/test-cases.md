# Test Cases: Rapid Assembly of Cross-Functional Delivery Squads

> Derived from the EARS requirements document (REQ-001..REQ-057, BR-001..BR-014)
> 
> Format: Given / When / Then with requirement traceability

---

## Table of Contents

1. [End-to-End Scenarios](#1-end-to-end-scenarios)
2. [Delivery Request Creation](#2-delivery-request-creation)
3. [Role and Skill Management](#3-role-and-skill-management)
4. [Candidate Matching and Scoring](#4-candidate-matching-and-scoring)
5. [Recommendation Results](#5-recommendation-results)
6. [Proposed Squad Formation](#6-proposed-squad-formation)
7. [Project History](#7-project-history)
8. [Reuse Previous Project Requirements](#8-reuse-previous-project-requirements)
9. [Report Generation](#9-report-generation)
10. [Business Rule Verification](#10-business-rule-verification)
11. [Traceability Coverage Summary](#11-traceability-coverage-summary)
12. [Cases Blocked by Open Decisions](#12-cases-blocked-by-open-decisions)

---

## 1. End-to-End Scenarios

### Positive Scenarios

#### TC-E2E-001: Capture new project delivery request - 1 squad member

| | |
|---|---|
| **Given** | The Delivery Lead has logged on to the system AND the new project page is available to capture a new delivery request |
| **When** | The Delivery Lead enters a valid project name, valid description, valid urgency, valid start date, and valid end date |
| **Then** | The system scores and ranks candidates AND lists 1 potential squad member |
| **Trace** | REQ-002, REQ-003, REQ-004, REQ-005 |

#### TC-E2E-002: Capture new project delivery request - 5 squad members

| | |
|---|---|
| **Given** | The Delivery Lead has logged on to the system AND the new project page is available to capture a new delivery request |
| **When** | The Delivery Lead enters a valid project name, valid description, valid urgency, valid start date, and valid end date |
| **Then** | The system scores and ranks candidates AND lists 5 potential squad members |
| **Trace** | REQ-002, REQ-003, REQ-004, REQ-005 |

#### TC-E2E-003: Capture new project delivery request - 10 (max) squad members

| | |
|---|---|
| **Given** | The Delivery Lead has logged on to the system AND the new project page is available to capture a new delivery request |
| **When** | The Delivery Lead enters a valid project name, valid description, valid urgency, valid start date, and valid end date |
| **Then** | The system scores and ranks candidates AND lists 10 potential squad members |
| **Trace** | REQ-002, REQ-003, REQ-004, REQ-005 |

### Negative Scenarios

#### TC-E2E-004: Capture new project delivery request - end date before start date

| | |
|---|---|
| **Given** | The Delivery Lead has logged on to the system AND the new project page is available to capture a new delivery request |
| **When** | The Delivery Lead enters a valid project name, valid description, valid urgency, but an end date earlier than the start date |
| **Then** | The system treats the duration as invalid and prevents submission AND identifies the duration field as requiring correction |
| **Trace** | REQ-007, REQ-008 |

---

## 2. Delivery Request Creation

*Requirements: REQ-001..REQ-008*

#### TC-001: Create a delivery request

| | |
|---|---|
| **Given** | A Delivery Lead is on the Create Request screen |
| **When** | They start a new delivery request |
| **Then** | The system allows the request to be created |
| **Trace** | REQ-001 |

#### TC-002: Capture mandatory project fields

| | |
|---|---|
| **Given** | A new delivery request |
| **When** | The Delivery Lead enters project name, description, urgency, start date, and end date/duration |
| **Then** | The system stores each captured value |
| **Trace** | REQ-002, REQ-003, REQ-004, REQ-005 |

#### TC-003: Urgency accepts only Low/Medium/High

| | |
|---|---|
| **Given** | A delivery request |
| **When** | The Delivery Lead sets urgency |
| **Then** | Only Low, Medium, or High are selectable |
| **Trace** | REQ-004 |

#### TC-004: Enable submission when all mandatory data valid

| | |
|---|---|
| **Given** | Valid project information and at least one valid role requirement |
| **When** | The Delivery Lead attempts to submit |
| **Then** | The system enables submission |
| **Trace** | REQ-006 |

#### TC-005: Prevent submission on missing/invalid project info

| | |
|---|---|
| **Given** | A request missing project name, description, urgency, or duration |
| **When** | The Delivery Lead attempts to submit |
| **Then** | The system prevents submission |
| **Trace** | REQ-007 |

#### TC-006: Identify each field requiring correction

| | |
|---|---|
| **Given** | Submission was prevented due to invalid data |
| **When** | The prevention occurs |
| **Then** | The system identifies every field that requires correction |
| **Trace** | REQ-008 |

#### TC-007: End date precedes start date (edge case)

| | |
|---|---|
| **Given** | A request where the end date is earlier than the start date |
| **When** | The Delivery Lead attempts to submit |
| **Then** | The duration is treated as invalid, submission is prevented, and the duration field is identified |
| **Trace** | REQ-007, REQ-008 |

---

## 3. Role and Skill Management

*Requirements: REQ-009..REQ-014*

#### TC-008: Add one or more role requirements

| | |
|---|---|
| **Given** | A delivery request |
| **When** | The Delivery Lead adds a role requirement |
| **Then** | The system attaches the role requirement to the request (supports multiple) |
| **Trace** | REQ-009 |

#### TC-009: Capture role type/description per role

| | |
|---|---|
| **Given** | A role requirement |
| **When** | The Delivery Lead enters a role type or role description |
| **Then** | The system captures exactly one role type/description for that role |
| **Trace** | REQ-010 |

#### TC-010: Assign one or more skills per role

| | |
|---|---|
| **Given** | A role requirement |
| **When** | The Delivery Lead assigns required skills |
| **Then** | The system associates one or more skills with that role |
| **Trace** | REQ-011 |

#### TC-011: Add Another Role creates separate section

| | |
|---|---|
| **Given** | An existing role requirement |
| **When** | The Delivery Lead selects Add Another Role |
| **Then** | The system creates a separate, independent role requirement section |
| **Trace** | REQ-012 |

#### TC-012: Remove role removes its skills

| | |
|---|---|
| **Given** | A role requirement with associated skills |
| **When** | The Delivery Lead removes the role |
| **Then** | The system removes the role and all its associated skills from the request |
| **Trace** | REQ-013 |

#### TC-013: Prevent submission when a role has no skills

| | |
|---|---|
| **Given** | A role requirement with no required skills |
| **When** | The Delivery Lead attempts to submit |
| **Then** | The system prevents submission and identifies the incomplete role |
| **Trace** | REQ-014 |

#### TC-014: No role requirement added (edge case)

| | |
|---|---|
| **Given** | A request with valid project info but zero role requirements |
| **When** | The Delivery Lead attempts to submit |
| **Then** | The system prevents submission because at least one role is mandatory |
| **Trace** | REQ-006, REQ-007 |

---

## 4. Candidate Matching and Scoring

*Requirements: REQ-015..REQ-025, BR-001..BR-004, BR-012*

#### TC-015: Evaluate only available candidates on submit

| | |
|---|---|
| **Given** | A valid submitted request and a mock employee pool |
| **When** | Evaluation runs |
| **Then** | The system evaluates every candidate marked available |
| **Trace** | REQ-015 |

#### TC-016: Evaluate candidates independently per role

| | |
|---|---|
| **Given** | A request with multiple role requirements |
| **When** | Evaluation runs |
| **Then** | Each candidate is evaluated separately for each role |
| **Trace** | REQ-016 |

#### TC-017: One suitability score per candidate-role combination

| | |
|---|---|
| **Given** | A candidate evaluated against a role |
| **When** | Scoring completes |
| **Then** | Exactly one suitability score exists for that candidate-role pair |
| **Trace** | REQ-017 |

#### TC-018: Score uses weighted components

| | |
|---|---|
| **Given** | A candidate with known skill match, availability, and workload components |
| **When** | The suitability score is calculated |
| **Then** | It equals (Skill × 50%) + (Availability × 30%) + (Role Match × 20%) |
| **Trace** | REQ-018, BR-001, BR-002, BR-003 |

#### TC-019: Matched skill included in skill-match calc

| | |
|---|---|
| **Given** | A candidate possessing a required skill |
| **When** | Skill match is calculated |
| **Then** | That skill is included in the calculation |
| **Trace** | REQ-019 |

#### TC-020: Distinct matched skills counted once

| | |
|---|---|
| **Given** | A candidate possessing multiple required skills (including any duplicates) |
| **When** | Skill match is calculated |
| **Then** | Each distinct matched required skill is counted exactly once |
| **Trace** | REQ-020, BR-012 |

#### TC-021: Availability above 75% applies configured contribution ⚠️ TBD

| | |
|---|---|
| **Given** | A candidate whose availability exceeds 75% |
| **When** | The availability component is scored |
| **Then** | The configured availability score contribution is applied |
| **Trace** | REQ-021 (formula TBD) |

#### TC-022: Availability exactly at 75% (boundary) ⚠️ TBD

| | |
|---|---|
| **Given** | A candidate whose availability equals 75% |
| **When** | The availability component is scored |
| **Then** | The system applies the treatment defined for exactly 75% availability |
| **Trace** | REQ-021 (Open Decision) |

#### TC-023: Fully allocated candidate excluded

| | |
|---|---|
| **Given** | A candidate at 100% allocation (fully allocated) |
| **When** | Recommendations are generated |
| **Then** | The candidate is excluded from all recommendations |
| **Trace** | REQ-022, BR-004 |

#### TC-024: Workload above threshold reduces workload score ⚠️ TBD

| | |
|---|---|
| **Given** | A candidate exceeding the configured workload threshold |
| **When** | The workload component is scored |
| **Then** | The workload score contribution is reduced |
| **Trace** | REQ-023 (threshold TBD) |

#### TC-025: No full skill match returns best partial matches

| | |
|---|---|
| **Given** | No candidate matches all required skills for a role |
| **When** | Recommendations are generated |
| **Then** | The highest-scoring eligible partial matches are recommended |
| **Trace** | REQ-024 |

#### TC-026: Tie-break on equal scores ⚠️ TBD

| | |
|---|---|
| **Given** | Two eligible candidates with equal suitability scores |
| **When** | Ranking is applied |
| **Then** | The configured tie-break rule determines order |
| **Trace** | REQ-025 (tie-break rule TBD) |

---

## 5. Recommendation Results

*Requirements: REQ-026..REQ-034, BR-005..BR-007, BR-013*

#### TC-027: Candidates ordered by descending score

| | |
|---|---|
| **Given** | Evaluation is complete for a role |
| **When** | Results are displayed |
| **Then** | Candidates appear in descending order of suitability score |
| **Trace** | REQ-026, BR-005 |

#### TC-028: Display suitability score per candidate

| | |
|---|---|
| **Given** | Recommended candidates |
| **When** | Results are shown |
| **Then** | Each candidate's suitability score is displayed |
| **Trace** | REQ-027 |

#### TC-029: Score displayed as percentage 0-100%

| | |
|---|---|
| **Given** | A recommended candidate |
| **When** | The score is displayed |
| **Then** | It is presented as a percentage between 0% and 100% |
| **Trace** | REQ-027, BR-013 |

#### TC-030: Display matched required skills

| | |
|---|---|
| **Given** | Recommended candidates |
| **When** | Results are shown |
| **Then** | Each candidate's matched required skills are displayed |
| **Trace** | REQ-028 |

#### TC-031: Display availability and workload percentages

| | |
|---|---|
| **Given** | Recommended candidates |
| **When** | Results are shown |
| **Then** | Each candidate's availability % and workload % are displayed |
| **Trace** | REQ-029 |

#### TC-032: Display recommendation rationale

| | |
|---|---|
| **Given** | Recommended candidates |
| **When** | Results are shown |
| **Then** | A rationale is displayed for each candidate |
| **Trace** | REQ-030, BR-006 |

#### TC-033: Show at least three eligible candidates per role

| | |
|---|---|
| **Given** | A role with at least three eligible candidates |
| **When** | Results are shown |
| **Then** | At least three candidates are displayed for that role |
| **Trace** | REQ-031, BR-007 |

#### TC-034: Fewer than three eligible candidates

| | |
|---|---|
| **Given** | A role with fewer than three eligible candidates |
| **When** | Results are shown |
| **Then** | All eligible candidates for that role are displayed |
| **Trace** | REQ-032 |

#### TC-035: Select an eligible candidate while displayed

| | |
|---|---|
| **Given** | Recommendations are displayed |
| **When** | The Delivery Lead selects an eligible candidate for a role |
| **Then** | The selection is allowed |
| **Trace** | REQ-033 |

#### TC-036: No eligible candidate shows role unfilled

| | |
|---|---|
| **Given** | A role with no eligible candidate |
| **When** | Results are shown |
| **Then** | The system displays the role as unfilled |
| **Trace** | REQ-034 |

---

## 6. Proposed Squad Formation

*Requirements: REQ-035..REQ-042*

#### TC-037: Selecting a candidate adds to squad

| | |
|---|---|
| **Given** | Displayed recommendations |
| **When** | The Delivery Lead selects a candidate for a role |
| **Then** | The candidate is added to the proposed squad for that role |
| **Trace** | REQ-035 |

#### TC-038: Replacing a candidate updates the squad

| | |
|---|---|
| **Given** | A role with a selected candidate |
| **When** | The Delivery Lead replaces that candidate |
| **Then** | The proposed squad is updated with the replacement |
| **Trace** | REQ-036 |

#### TC-039: Removing a candidate marks role unfilled

| | |
|---|---|
| **Given** | A role with a selected candidate |
| **When** | The Delivery Lead removes the candidate |
| **Then** | The associated role is marked unfilled |
| **Trace** | REQ-037 |

#### TC-040: Display filled and unfilled roles

| | |
|---|---|
| **Given** | A proposed squad in progress |
| **When** | The squad is viewed |
| **Then** | Both filled and unfilled role requirements are displayed |
| **Trace** | REQ-038 |

#### TC-041: Display squad summary

| | |
|---|---|
| **Given** | A proposed squad |
| **When** | The summary is viewed |
| **Then** | Each role and its selected candidate are shown |
| **Trace** | REQ-039 |

#### TC-042: Enable confirmation when all mandatory roles filled ⚠️ TBD

| | |
|---|---|
| **Given** | Every mandatory role has a selected eligible candidate |
| **When** | The Delivery Lead attempts confirmation |
| **Then** | Squad confirmation is enabled |
| **Trace** | REQ-040 (which roles are mandatory - Open Decision) |

#### TC-043: Prevent confirmation when mandatory role unfilled ⚠️ TBD

| | |
|---|---|
| **Given** | One or more mandatory roles are unfilled |
| **When** | The Delivery Lead attempts confirmation |
| **Then** | Confirmation is prevented |
| **Trace** | REQ-041 |

#### TC-044: Confirm sets squad status to Confirmed

| | |
|---|---|
| **Given** | A proposed squad eligible for confirmation |
| **When** | The Delivery Lead confirms |
| **Then** | The squad status is set to Confirmed |
| **Trace** | REQ-042 |

---

## 7. Project History

*Requirements: REQ-043..REQ-048, BR-008..BR-009, BR-011*

#### TC-045: List completed mock projects

| | |
|---|---|
| **Given** | Completed mock projects exist |
| **When** | The Delivery Lead opens Project History |
| **Then** | The list of completed projects is displayed |
| **Trace** | REQ-043 |

#### TC-046: History ordered by descending completion date

| | |
|---|---|
| **Given** | Multiple historical projects |
| **When** | The history list is displayed |
| **Then** | Projects appear in descending order of completion date |
| **Trace** | REQ-044, BR-008 |

#### TC-047: Display name, duration, completion date

| | |
|---|---|
| **Given** | The history list |
| **When** | It is displayed |
| **Then** | Each project shows project name, duration, and completion date |
| **Trace** | REQ-045 |

#### TC-048: Select historical project shows details

| | |
|---|---|
| **Given** | The history list |
| **When** | The Delivery Lead selects a historical project |
| **Then** | Its project details are displayed |
| **Trace** | REQ-046 |

#### TC-049: Display historical roles and squad members

| | |
|---|---|
| **Given** | A selected historical project |
| **When** | Its details are shown |
| **Then** | The roles and previously assigned squad members are displayed |
| **Trace** | REQ-047 |

#### TC-050: Historical record is read-only

| | |
|---|---|
| **Given** | A historical project is displayed |
| **When** | The Delivery Lead attempts to modify the historical record |
| **Then** | The modification is prevented |
| **Trace** | REQ-048, BR-009 |

---

## 8. Reuse Previous Project Requirements

*Requirements: REQ-049..REQ-053, BR-010*

#### TC-051: Initiate reuse from a historical project

| | |
|---|---|
| **Given** | A historical project is displayed |
| **When** | The Delivery Lead initiates reuse of its role/skill requirements |
| **Then** | The reuse action is allowed |
| **Trace** | REQ-049 |

#### TC-052: Reuse creates a populated new request

| | |
|---|---|
| **Given** | The Delivery Lead initiates reuse |
| **When** | Reuse executes |
| **Then** | A new delivery request is created, populated with the historical role and skill requirements |
| **Trace** | REQ-050 |

#### TC-053: Edit reused request without altering history

| | |
|---|---|
| **Given** | A new request created from reused requirements |
| **When** | The Delivery Lead edits the new request |
| **Then** | The edits apply to the new request and the historical project remains unchanged |
| **Trace** | REQ-051, BR-009 |

#### TC-054: Reused request re-evaluates former members

| | |
|---|---|
| **Given** | A reused request is submitted |
| **When** | Evaluation runs |
| **Then** | Former squad members are re-evaluated against current mock availability and workload |
| **Trace** | REQ-052, BR-010 |

#### TC-055: Ineligible former member replaced by next best

| | |
|---|---|
| **Given** | A former squad member is now ineligible or unavailable |
| **When** | Recommendations are generated for that role |
| **Then** | The next highest-scoring eligible candidate is recommended |
| **Trace** | REQ-053 |

---

## 9. Report Generation

*Requirements: REQ-054..REQ-057*

#### TC-056: Generate Report action available on history details

| | |
|---|---|
| **Given** | Historical project details are displayed |
| **When** | The Delivery Lead views the screen |
| **Then** | A Generate Report action is available |
| **Trace** | REQ-054 |

#### TC-057: Report contains project details, roles, squad

| | |
|---|---|
| **Given** | Historical project details are displayed |
| **When** | The Delivery Lead selects Generate Report |
| **Then** | A report is generated containing the displayed project details, roles, and squad members |
| **Trace** | REQ-055 |

#### TC-058: Successful report available for download ⚠️ TBD

| | |
|---|---|
| **Given** | Report generation succeeds |
| **When** | Generation completes |
| **Then** | The report is available for download in the configured report format |
| **Trace** | REQ-056 (report format - Open Decision) |

#### TC-059: Report generation failure handling

| | |
|---|---|
| **Given** | Report generation fails |
| **When** | The failure occurs |
| **Then** | An error message is displayed and the historical project details remain on screen |
| **Trace** | REQ-057 |

---

## 10. Business Rule Verification

*Requirements: BR-001..BR-014*

#### TC-060: Weight sum equals 100%

| | |
|---|---|
| **Given** | The scoring model |
| **When** | Weights are applied |
| **Then** | Skill 50% + Availability 30% + Role Match 20% = 100% |
| **Trace** | BR-001, BR-002, BR-003 |

#### TC-061: No AI/ML - deterministic output

| | |
|---|---|
| **Given** | Identical request and identical mock data |
| **When** | Evaluation runs multiple times |
| **Then** | The recommendation output is identical each time (deterministic, rules-based) |
| **Trace** | BR-014 |

#### TC-062: Mock data only for history

| | |
|---|---|
| **Given** | The project history feature |
| **When** | Historical data is displayed |
| **Then** | It originates solely from mock data (no real HR integration) |
| **Trace** | BR-011 |

---

## 11. Traceability Coverage Summary

| Workflow Stage | Requirements | Test Cases |
|---------------|--------------|------------|
| End-to-end scenarios | REQ-002..REQ-008 | TC-E2E-001..TC-E2E-004 |
| Create and capture request | REQ-001..REQ-008 | TC-001..TC-007 |
| Add roles and skills | REQ-009..REQ-014 | TC-008..TC-014 |
| Find and score candidates | REQ-015..REQ-025 | TC-015..TC-026 |
| Review recommendations | REQ-026..REQ-034 | TC-027..TC-036 |
| Build and confirm squad | REQ-035..REQ-042 | TC-037..TC-044 |
| View project history | REQ-043..REQ-048 | TC-045..TC-050 |
| Reuse historical requirements | REQ-049..REQ-053 | TC-051..TC-055 |
| Generate report | REQ-054..REQ-057 | TC-056..TC-059 |
| Business rules | BR-001..BR-014 | TC-018, TC-020, TC-023, TC-027, TC-029, TC-032, TC-033, TC-046, TC-050, TC-054, TC-060..TC-062 |

---

## 12. Cases Blocked by Open Decisions

The following test cases cannot be fully baselined until configuration values are agreed:

| Open Decision | Affected Test Cases |
|--------------|---------------------|
| Score normalization / rounding | TC-018, TC-021, TC-024, TC-029 |
| Workload threshold | TC-024 |
| Availability treatment at exactly 75% | TC-022 |
| Tie-break rule | TC-026 |
| Mandatory vs optional roles | TC-042, TC-043 |
| Report format/filename/metadata | TC-058 |
| One person filling multiple roles | Not yet covered |
| Field length limits | Boundary cases not yet writable |
| Confirmation reopen behaviour | Post-confirmation case not yet writable |

---

*Document generated from delivery-squad-test-cases.txt*
