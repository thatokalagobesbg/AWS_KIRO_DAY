# UI Specification

## Squad Assembly Tool - User Interface Design

**Document Type:** UI/UX Specification  
**Status:** Baseline v1.0  
**Design System:** Tailwind CSS  

---

## 1. Information Architecture

### 1.1 Page Structure

```
┌─────────────────────────────────────────────────────────────┐
│                        SQUIDLY                              │
│                   Squad Assembly Tool                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │  Home Page  │───▶│Create New   │───▶│  Project    │     │
│  │  (Projects) │    │  Project    │    │  Details    │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│         │                                     │             │
│         │                                     ▼             │
│         │                            ┌─────────────┐        │
│         └───────────────────────────▶│  Employee   │        │
│              (View Details)          │   Modal     │        │
│                                      └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Navigation Flow

| From | Action | To |
|------|--------|-----|
| Home | Click "Create New Project" | Create New Project Page |
| Home | Click project card "View Details" | Project Details Page |
| Create New Project | Click "Find Squad Members" | Same page with matches |
| Create New Project | Click "Save Project" | Home (saved to Current Projects) |
| Project Details | Click "Edit" | Create New Project Page (edit mode) |
| Any Page | Click employee card | Employee Modal |

---

## 2. Page Designs

### 2.1 Home Page

**Purpose:** Display current and past projects, entry point for creating new projects.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │  🦑 SQUIDLY                                                    [Home]  │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │                          Projects                                   │   │
│  │                                                                     │   │
│  │   ┌──────────────────────────────────────────────────────────────┐ │   │
│  │   │  ➕ Create New Project                                       │ │   │
│  │   │     You can only have capacity for 1 current project at a    │ │   │
│  │   │     time, so when there is one project they are the          │ │   │
│  │   │     only one for the project.                                │ │   │
│  │   │                                                              │ │   │
│  │   │     Note: this will stay below                               │ │   │
│  │   │     "New capacity at a point"                                │ │   │
│  │   └──────────────────────────────────────────────────────────────┘ │   │
│  │                                                                     │   │
│  │   ─────────────────────────────────────────────────────────────    │   │
│  │                                                                     │   │
│  │   CURRENT                                                           │   │
│  │   ┌──────────────────────────────────────────────────────────────┐ │   │
│  │   │  Project X                                      [View Details >]│ │   │
│  │   │  Past                                                        │ │   │
│  │   └──────────────────────────────────────────────────────────────┘ │   │
│  │                                                                     │   │
│  │   ─────────────────────────────────────────────────────────────    │   │
│  │                                                                     │   │
│  │   PAST PROJECTS                                                     │   │
│  │   ┌──────────────────────────────────────────────────────────────┐ │   │
│  │   │  Project Y                                      [View Details >]│ │   │
│  │   └──────────────────────────────────────────────────────────────┘ │   │
│  │   ┌──────────────────────────────────────────────────────────────┐ │   │
│  │   │  Project Z                                      [View Details >]│ │   │
│  │   └──────────────────────────────────────────────────────────────┘ │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Components:**

| Component | Type | Behavior |
|-----------|------|----------|
| Header | Fixed | App logo "SQUIDLY" with squid icon, Home link |
| Create New Project Card | Clickable Card | Navigates to Create New Project page |
| Current Projects Section | List | Shows active/draft projects (max 1 at a time based on notes) |
| Past Projects Section | List | Shows confirmed projects, sorted by date desc |
| Project Card | Clickable | Shows name, status badge; "View Details" navigates to details |

**States:**
- Empty state: "No projects yet. Create your first project!"
- With current project: Shows in "Current" section
- Past projects: Listed chronologically

---

### 2.2 Create New Project Page

**Purpose:** Capture project details, select roles and skills, find matching squad members.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │  🦑 SQUIDLY                                                    [Home]  │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  Home > Create New Project                                                  │
│                                                                             │
│  ┌───────────────────────────────────┬─────────────────────────────────┐   │
│  │                                   │                                 │   │
│  │  PROJECT DETAILS                  │  SQUAD MATCHES                  │   │
│  │                                   │                                 │   │
│  │  Enter Project Name...            │  Click on each employee to      │   │
│  │  ┌─────────────────────────────┐  │  view more details              │   │
│  │  │                             │  │                                 │   │
│  │  └─────────────────────────────┘  │  ┌─────────────────────────┐   │   │
│  │                                   │  │ 📷 Employee 1    | Role │   │   │
│  │  Project Description...           │  │ Star ⭐          | Fit% │   │   │
│  │  ┌─────────────────────────────┐  │  └─────────────────────────┘   │   │
│  │  │                             │  │                                 │   │
│  │  │                             │  │  ┌─────────────────────────┐   │   │
│  │  │                             │  │  │ 📷 Employee 2    | Role │   │   │
│  │  └─────────────────────────────┘  │  │ Star             | Fit% │   │   │
│  │                                   │  └─────────────────────────┘   │   │
│  │  Urgency ⓘ                        │                                 │   │
│  │  ┌─────────────────────────────┐  │  ┌─────────────────────────┐   │   │
│  │  │ Select ▼                    │  │  │ 📷 Employee 3    | Role │   │   │
│  │  │ ┌─────────────────────────┐ │  │  │ Star             | Fit% │   │   │
│  │  │ │ 🔴 High                 │ │  │  └─────────────────────────┘   │   │
│  │  │ │ 🟡 Medium               │ │  │                                 │   │
│  │  │ │ 🟢 Low                  │ │  │  Filter: ┌──────────────────┐  │   │
│  │  │ └─────────────────────────┘ │  │          │ Role/Skills/Avail▼│  │   │
│  │  └─────────────────────────────┘  │          └──────────────────┘  │   │
│  │                                   │                                 │   │
│  │  Select required roles & skills   │  ─────────────────────────────  │   │
│  │  ┌─────────────────────────────┐  │                                 │   │
│  │  │ Select Role ▼               │  │  SELECTED MEMBERS               │   │
│  │  │ ┌─────────────────────────┐ │  │  ┌─────────────────────────┐   │   │
│  │  │ │ ☑ Frontend Developer   │ │  │  │                         │   │   │
│  │  │ │ ☑ Backend Developer    │ │  │  │   (Empty until user     │   │   │
│  │  │ │ ☐ UX/UI Designer       │ │  │  │    selects members)     │   │   │
│  │  │ │ ☐ Feature Analyst      │ │  │  │                         │   │   │
│  │  │ │ ☐ Quality Engineer     │ │  │  └─────────────────────────┘   │   │
│  │  │ └─────────────────────────┘ │  │                                 │   │
│  │  └─────────────────────────────┘  │  ┌─────────────────────────┐   │   │
│  │                                   │  │      Edit Team          │   │   │
│  │  Select skills (required)         │  └─────────────────────────┘   │   │
│  │  for each role:                   │                                 │   │
│  │  → each one needs 1 or more skill │                                 │   │
│  │  ┌─────────────────────────────┐  │                                 │   │
│  │  │ Frontend Dev Skills:        │  │                                 │   │
│  │  │ ☑ React    ☑ TypeScript    │  │                                 │   │
│  │  │ ☐ Angular  ☐ Vue.js        │  │                                 │   │
│  │  │ ☐ Tailwind ☐ JavaScript    │  │                                 │   │
│  │  │ Backend Dev Skills:         │  │                                 │   │
│  │  │ ☐ Node.js  ☐ Express       │  │                                 │   │
│  │  │ ☑ Python   ☑ PostgreSQL    │  │                                 │   │
│  │  └─────────────────────────────┘  │                                 │   │
│  │                                   │                                 │   │
│  │  Start Date 📅    End Date 📅     │                                 │   │
│  │  ┌───────────┐    ┌───────────┐   │                                 │   │
│  │  │ YYYY-MM-DD│    │ YYYY-MM-DD│   │                                 │   │
│  │  └───────────┘    └───────────┘   │                                 │   │
│  │                                   │                                 │   │
│  │  Duration automatically           │                                 │   │
│  │  writes duration based on above.  │                                 │   │
│  │  ┌─────────────────────────────┐  │                                 │   │
│  │  │ 4 weeks                     │  │                                 │   │
│  │  └─────────────────────────────┘  │                                 │   │
│  │                                   │                                 │   │
│  │  Expected Duration                │                                 │   │
│  │  ┌─────────────────────────────┐  │                                 │   │
│  │  │ 2 sprints (4 weeks)         │  │                                 │   │
│  │  └─────────────────────────────┘  │                                 │   │
│  │                                   │                                 │   │
│  └───────────────────────────────────┴─────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  [Find Squad Members ▷]                              [Save Project] │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Components:**

| Component | Type | Behavior |
|-----------|------|----------|
| Breadcrumb | Navigation | Home > Create New Project |
| Project Name | Text Input | Required, max 100 chars |
| Project Description | Textarea | Required, max 1000 chars |
| Urgency Dropdown | Select | Options: High (🔴), Medium (🟡), Low (🟢) with tooltip |
| Role Selection | Multi-select Dropdown | Checkboxes for 5 roles |
| Skills Checklist | Grouped Checkboxes | Shows skills per selected role, at least 1 required per role |
| Start Date | Date Picker | Required |
| End Date | Date Picker | Required, must be after start date |
| Duration Display | Calculated Read-only | Auto-calculates from dates (e.g., "4 weeks") |
| Squad Matches Panel | Card List | Shows matched employees after "Find Squad Members" |
| Employee Card | Clickable | Photo, Name, Role, Fit Score; opens modal |
| Filter Dropdown | Multi-select | Filter matches by role, skills, availability |
| Selected Members | Card List | Shows employees user has selected for squad |
| Edit Team Button | Button | Allows modifying selections |
| Find Squad Members | Primary Button | Triggers matching algorithm |
| Save Project | Secondary Button | Saves and navigates to Home |

**Interaction Flow:**
1. Fill in project details (name, description, urgency, dates)
2. Select required roles (dropdown with checkboxes)
3. For each selected role, select required skills (skill checkboxes appear)
4. Click "Find Squad Members" → right panel populates with ranked matches
5. Click employee cards to view details in modal
6. Select employees to add to "Selected Members"
7. Click "Save Project" to confirm squad and save

---

### 2.3 Project Details Page

**Purpose:** View saved/confirmed project details and squad composition (read-only for past projects).

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │  🦑 SQUIDLY                                                    [Home]  │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  Home > Project Details                                                     │
│                                                                             │
│  ┌───────────────────────────────────┬─────────────────────────────────┐   │
│  │                                   │                                 │   │
│  │  PROJECT DETAILS                  │  SQUAD MATCHES                  │   │
│  │                                   │                                 │   │
│  │  Project: PROJECT NAME            │  Click on each employee to      │   │
│  │                                   │  view more details              │   │
│  │  Urgency: 🔴 High                 │                                 │   │
│  │                                   │  ┌─────────────────────────┐   │   │
│  │  Description:                     │  │ 📷 Employee 1    | Role │   │   │
│  │  ┌─────────────────────────────┐  │  │ Star ⭐          | Fit% │   │   │
│  │  │ Lorem ipsum dolor sit amet, │  │  └─────────────────────────┘   │   │
│  │  │ consectetur adipiscing...   │  │                                 │   │
│  │  └─────────────────────────────┘  │  ┌─────────────────────────┐   │   │
│  │                                   │  │ 📷 Employee 2    | Role │   │   │
│  │  Select required roles & skills   │  │ Star             | Fit% │   │   │
│  │  ┌─────────────────────────────┐  │  └─────────────────────────┘   │   │
│  │  │ Role 1: Frontend Developer  │  │                                 │   │
│  │  │ Skills: React, TypeScript   │  │  ┌─────────────────────────┐   │   │
│  │  │                             │  │  │ 📷 Employee 3    | Role │   │   │
│  │  │ Role 2: Backend Developer   │  │  │ Star             | Fit% │   │   │
│  │  │ Skills: Node.js, PostgreSQL │  │  └─────────────────────────┘   │   │
│  │  └─────────────────────────────┘  │                                 │   │
│  │                                   │  Filter: ┌──────────────────┐  │   │
│  │  Start Date: 2024-01-15           │          │ Role/Skills/Avail▼│  │   │
│  │  End Date: 2024-02-15             │          └──────────────────┘  │   │
│  │                                   │                                 │   │
│  │  Duration automatically           │  ─────────────────────────────  │   │
│  │  writes duration based on above.  │                                 │   │
│  │  ┌─────────────────────────────┐  │  SELECTED MEMBERS               │   │
│  │  │ 4 weeks (2 sprints)         │  │  ┌─────────────────────────┐   │   │
│  │  └─────────────────────────────┘  │  │ 📷 Sarah M.  | FE Dev   │   │   │
│  │                                   │  │ 📷 James C.  | BE Dev   │   │   │
│  │  Expected Duration                │  └─────────────────────────┘   │   │
│  │  ┌─────────────────────────────┐  │                                 │   │
│  │  │ 2 sprints                   │  │  ┌─────────────────────────┐   │   │
│  │  └─────────────────────────────┘  │  │      Edit Team          │   │   │
│  │                                   │  └─────────────────────────┘   │   │
│  │  Project Description.             │                                 │   │
│  │  ┌─────────────────────────────┐  │                                 │   │
│  │  │ Description text here...    │  │                                 │   │
│  │  └─────────────────────────────┘  │                                 │   │
│  │                                   │                                 │   │
│  └───────────────────────────────────┴─────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  [Edit ✏️]  (only for current/draft projects)                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Components:**

| Component | Type | Behavior |
|-----------|------|----------|
| Breadcrumb | Navigation | Home > Project Details |
| Project Info | Read-only Display | Name, urgency badge, description |
| Roles & Skills | Read-only List | Shows selected roles with their skills |
| Dates & Duration | Read-only | Start, end, calculated duration |
| Squad Matches | Card List | Same as create page, shows all matches |
| Selected Members | Card List | Shows confirmed squad members |
| Edit Button | Button | Only visible for draft/current projects; navigates to edit mode |
| Filter | Dropdown | Filter squad matches by role/skills/availability |

**States:**
- **Draft/Current Project:** Edit button visible, can modify
- **Confirmed/Past Project:** Read-only, no edit button, "Edit Team" becomes "View Team"

---

### 2.4 Employee Modal

**Purpose:** Display detailed employee information when clicking an employee card.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│    ┌─────────────────────────────────────────────────────────────────┐     │
│    │                                                            [X]  │     │
│    │                                                                 │     │
│    │   ┌──────────────────────────────────────────────────────────┐ │     │
│    │   │                                                          │ │     │
│    │   │   📷                                                     │ │     │
│    │   │                                                          │ │     │
│    │   │   ID: EMP001                                             │ │     │
│    │   │                                                          │ │     │
│    │   │   Employee Name: Sarah Mitchell                          │ │     │
│    │   │                                                          │ │     │
│    │   │   Role: Frontend Developer                               │ │     │
│    │   │                                                          │ │     │
│    │   │   Skills:                                                │ │     │
│    │   │   ─────────────────────────────────────────              │ │     │
│    │   │   • React         ✓ (matched)                            │ │     │
│    │   │   • TypeScript    ✓ (matched)                            │ │     │
│    │   │   • JavaScript                                           │ │     │
│    │   │   • Tailwind CSS                                         │ │     │
│    │   │   • REST API Integration                                 │ │     │
│    │   │   • Git                                                  │ │     │
│    │   │                                                          │ │     │
│    │   │   Available: Yes ✓  (or No ✗)                            │ │     │
│    │   │   → 32 hrs / 40 hrs                                      │ │     │
│    │   │                                                          │ │     │
│    │   │   Capacity: 80%                                          │ │     │
│    │   │   ┌────────────────────────────────┐                     │ │     │
│    │   │   │████████████████████░░░░░░░░░░░│ 80%                  │ │     │
│    │   │   └────────────────────────────────┘                     │ │     │
│    │   │                                                          │ │     │
│    │   │   Fit Score: 85.5 / 100                                  │ │     │
│    │   │   ┌────────────────────────────────┐                     │ │     │
│    │   │   │█████████████████████████░░░░░░│ 85.5%                │ │     │
│    │   │   └────────────────────────────────┘                     │ │     │
│    │   │                                                          │ │     │
│    │   │   Score Breakdown:                                       │ │     │
│    │   │   • Skills:       45/50 (90%)                            │ │     │
│    │   │   • Availability: 24/30 (80%)                            │ │     │
│    │   │   • Role Match:   20/20 (100%)                           │ │     │
│    │   │                                                          │ │     │
│    │   │   ┌─────────────────┐  ┌─────────────────┐               │ │     │
│    │   │   │  Add to Squad   │  │     Close       │               │ │     │
│    │   │   └─────────────────┘  └─────────────────┘               │ │     │
│    │   │                                                          │ │     │
│    │   └──────────────────────────────────────────────────────────┘ │     │
│    │                                                                 │     │
│    └─────────────────────────────────────────────────────────────────┘     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Components:**

| Component | Type | Description |
|-----------|------|-------------|
| Close Button | Icon Button | X in top right, closes modal |
| Employee Photo | Avatar | Placeholder or actual image |
| Employee ID | Text | e.g., "EMP001" |
| Employee Name | Text | Full name |
| Role | Badge | Role type with color coding |
| Skills List | List | All skills, with checkmarks for matched skills |
| Availability | Status + Text | Yes/No indicator with hours fraction |
| Capacity Bar | Progress Bar | Visual representation of available hours |
| Fit Score | Number + Progress Bar | Total score with visual bar |
| Score Breakdown | Detail List | Skills, Availability, Role Match components |
| Add to Squad | Primary Button | Adds employee to selected members |
| Close | Secondary Button | Closes modal |

**Conditional Display:**
- If employee is ineligible: Show warning banner with reasons
- If already in squad: Change "Add to Squad" to "Remove from Squad"

---

## 3. Component Library

### 3.1 Color Palette (Tailwind)

| Usage | Color | Tailwind Class |
|-------|-------|----------------|
| Primary (Brand) | Indigo | `bg-indigo-600`, `text-indigo-600` |
| Secondary | Blue | `bg-blue-500`, `text-blue-500` |
| Success/Available | Green | `bg-green-500`, `text-green-500` |
| Warning/Medium | Yellow/Amber | `bg-amber-500`, `text-amber-500` |
| Danger/High/Unavailable | Red | `bg-red-500`, `text-red-500` |
| Low Urgency | Green | `bg-green-500` |
| Background | Gray | `bg-gray-50`, `bg-white` |
| Text | Gray | `text-gray-900`, `text-gray-600` |

### 3.2 Urgency Badges

```
🔴 HIGH    → bg-red-100 text-red-800 border-red-200
🟡 MEDIUM  → bg-amber-100 text-amber-800 border-amber-200  
🟢 LOW     → bg-green-100 text-green-800 border-green-200
```

### 3.3 Role Badges

```
FA  Feature Analyst      → bg-purple-100 text-purple-800
UX  UX/UI Designer       → bg-pink-100 text-pink-800
FE  Frontend Developer   → bg-blue-100 text-blue-800
BE  Backend Developer    → bg-green-100 text-green-800
QE  Quality Engineer     → bg-orange-100 text-orange-800
```

### 3.4 Button Styles

| Type | Style |
|------|-------|
| Primary | `bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg` |
| Secondary | `bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 font-semibold py-2 px-4 rounded-lg` |
| Danger | `bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg` |
| Disabled | `bg-gray-300 text-gray-500 cursor-not-allowed py-2 px-4 rounded-lg` |

### 3.5 Card Styles

```css
/* Project Card */
.project-card {
  @apply bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 border border-gray-200;
}

/* Employee Card */
.employee-card {
  @apply bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-3 border border-gray-200 cursor-pointer;
}

/* Selected Employee Card */
.employee-card-selected {
  @apply bg-indigo-50 rounded-lg shadow-sm p-3 border-2 border-indigo-500;
}
```

### 3.6 Form Elements

| Element | Style |
|---------|-------|
| Text Input | `w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500` |
| Textarea | Same as input + `min-h-[100px]` |
| Select | Same as input + custom dropdown arrow |
| Checkbox | `w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500` |
| Date Picker | Native HTML5 date input with custom styling |

---

## 4. Responsive Behavior

### 4.1 Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | < 640px | Single column, stacked panels |
| Tablet | 640px - 1024px | Two columns, side panel collapsible |
| Desktop | > 1024px | Full two-panel layout |

### 4.2 Mobile Adaptations

- **Home Page:** Project cards stack vertically
- **Create/Details Page:** Left panel (form) and right panel (matches) stack vertically; matches panel becomes expandable accordion
- **Employee Modal:** Full-screen on mobile
- **Navigation:** Hamburger menu on mobile

---

## 5. Accessibility Requirements

| Requirement | Implementation |
|-------------|----------------|
| Keyboard Navigation | All interactive elements focusable, logical tab order |
| Screen Reader | ARIA labels on icons, buttons, form fields |
| Color Contrast | Minimum 4.5:1 ratio for text |
| Focus Indicators | Visible focus rings on all interactive elements |
| Error Messages | Associated with form fields via aria-describedby |
| Modal | Focus trap, escape to close, aria-modal="true" |

---

## 6. Loading & Empty States

### 6.1 Loading States

```
┌─────────────────────────────────┐
│  ◌ Finding squad matches...    │
│  ████████░░░░░░░░░░░░░░░░░░░░  │
└─────────────────────────────────┘
```

### 6.2 Empty States

**No Projects:**
```
┌─────────────────────────────────┐
│         📋                      │
│   No projects yet               │
│   Create your first project     │
│   to get started!               │
│                                 │
│   [Create New Project]          │
└─────────────────────────────────┘
```

**No Matches Found:**
```
┌─────────────────────────────────┐
│         🔍                      │
│   No matches found              │
│   Try adjusting your skill      │
│   requirements or check         │
│   employee availability.        │
└─────────────────────────────────┘
```

---

## 7. Error States

### 7.1 Form Validation Errors

```
┌─────────────────────────────────┐
│  Project Name *                 │
│  ┌─────────────────────────────┐
│  │                             │ ← Red border
│  └─────────────────────────────┘
│  ⚠️ Project name is required    │ ← Red text below
└─────────────────────────────────┘
```

### 7.2 Date Validation Error

```
┌─────────────────────────────────┐
│  ⚠️ End date must be after      │
│     start date                  │
└─────────────────────────────────┘
```

### 7.3 Incomplete Role Error

```
┌─────────────────────────────────┐
│  ⚠️ Please select at least one  │
│     skill for: Frontend Dev     │
└─────────────────────────────────┘
```

---

## 8. Interaction Specifications

### 8.1 Find Squad Members Flow

1. User fills in all required fields
2. User clicks "Find Squad Members"
3. Button shows loading spinner
4. API calculates scores for all employees
5. Right panel populates with ranked results
6. Results grouped by role requirement
7. User can filter results
8. User clicks employee cards to view modal
9. User adds employees to squad from modal or card

### 8.2 Save Project Flow

1. User has selected at least one member per role
2. User clicks "Save Project"
3. Confirmation dialog appears (optional)
4. API saves project and squad
5. User redirected to Home page
6. Success toast notification shown

---

## 9. Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-09-30 | Team | Initial UI spec based on wireframe sketches |
