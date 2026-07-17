# Project Progress

## Initial Setup
- [x] Scaffolded React frontend using Vite
- [x] Initialized Node.js/Express backend with `package.json`
- [x] Set up basic Express server with `/health` route and required dependencies (`express`, `pg`, `bcrypt`, `jsonwebtoken`, `cors`, `dotenv`)
- [x] Created `resume-parser` folder with `requirements.txt` (`spacy`)
- [x] Added `setup.sh` script for Python virtual environment

## Phase 1: Auth + Roles
- [x] Backend: Configured JWT authentication and bcrypt password hashing.
- [x] Backend: Created `authMiddleware` for token verification and role checking (candidate vs employer).
- [x] Backend: Implemented `/api/auth/register` and `/api/auth/login` using an in-memory mock database (to be replaced with PostgreSQL).
- [x] Frontend: Installed `react-router-dom` and `axios`.
- [x] Frontend: Created `AuthContext` for global authentication state management.
- [x] Frontend: Developed aesthetic `Login` and `Signup` UI pages with role selection.
- [x] Frontend: Configured public and protected routes in `App.jsx`.

## Phase 2: PostgreSQL Schema + Connection
- [x] Setup PostgreSQL database and connection pool.
- [x] Created database schema for `users`, `candidate_profiles`, `employer_profiles`, `jobs`, `applications`, and `resumes`.
- [x] Migrated Phase 1 Auth logic from the in-memory array to the real PostgreSQL database.

## Next Steps
- Phase 3: Job posting (employer side): employer can create/edit/delete a job with title, description, required_skills, nice_to_have_skills, experience_level, salary.


shimmer UI 
