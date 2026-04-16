# fitness_frontend

React frontend for the Fitness Dashboard Suite.

## Run
1. Copy env template:
   - `cp .env.example .env` (or set via orchestrator)
2. Install and start:
   - `npm install`
   - `npm start`

Runs on port **3000**.

## Configuration
- `REACT_APP_BACKEND_URL` points to `fitness_backend` (e.g. `http://localhost:8000`)
- `REACT_APP_API_BASE` defaults to `/api`
- `REACT_APP_HEALTHCHECK_PATH` defaults to `/health`

## Notes
This template is **local-first**:
- onboarding/profile/workouts/scheduler/notifications/admin demo data is stored in `localStorage`
- wire real endpoints in `src/api/*` once the backend OpenAPI spec/routes are available
