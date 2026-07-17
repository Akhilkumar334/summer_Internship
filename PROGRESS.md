# Project Progress (Frontend Only)

This repository currently contains the standalone React frontend for demonstration purposes. The backend and database have been removed to keep the UI plain and easy to present.

## Completed Features
- [x] Scaffolded React frontend using Vite.
- [x] Configured `react-router-dom` for public and protected routes in `App.jsx`.
- [x] Created `AuthContext` for global authentication state management.
- [x] Implemented a mock login/signup system that works instantly without a backend.
- [x] Developed clean and plain `Login` and `Signup` UI pages with role selection (Candidate vs Employer).
- [x] Created `CandidateDashboard` UI featuring:
  - Profile section
  - Job Matches section
  - Recent Applications status tracker
- [x] Created `EmployerDashboard` UI featuring:
  - Active Job Postings table
  - Recent Applications list
  - Placeholder button to post a new job
- [x] Added clean, minimalistic styling across the application via `index.css`.

## Next Steps
- Add Shimmer UI or skeleton loaders for transitions between pages.
- Expand interactive mock data within the dashboards (e.g. clicking "View All" or editing the profile).
