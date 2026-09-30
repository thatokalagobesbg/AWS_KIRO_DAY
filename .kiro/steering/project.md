# Squadly Project Steering

inclusion: always

## Project Overview

Squadly is a squad assembly tool for Standard Bank hackathon. It helps delivery leads find and assemble cross-functional teams by matching employee skills to project requirements.

## Architecture

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Express.js + TypeScript + better-sqlite3
- **Database**: SQLite (server/data/squadly.db)
- **Monorepo**: npm workspaces (client/, server/)

## Key Directories

- `client/src/pages/` - React page components
- `client/src/components/` - Reusable UI components
- `client/src/api/` - API client functions
- `server/src/routes/` - Express API routes
- `server/src/db/` - Database layer
- `docs/` - Project documentation

## Coding Standards

### TypeScript
- Use strict TypeScript with proper typing
- Prefer interfaces over types for objects
- Use async/await over raw promises

### React
- Use functional components with hooks
- Keep components small and focused
- Use Tailwind CSS for styling (no CSS modules)

### API
- RESTful endpoints under /api
- JSON request/response format
- Parameterized SQL queries (no string interpolation)

## Scoring Algorithm

Squad recommendations use weighted scoring:
- Skills Match: 50%
- Availability: 30%
- Role Match: 20%

## Testing

- Unit tests: Vitest
- E2E tests: Playwright
- Run tests before committing
