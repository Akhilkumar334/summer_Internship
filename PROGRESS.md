# Project Progress (Full Stack)

This repository contains a full-stack Job Board application with a React frontend, Node.js/Express backend, PostgreSQL database (via Sequelize), and a Python-based spaCy Resume Parser microservice.

## Completed Features

### 1. Backend & Database
- [x] Node.js & Express REST API Server.
- [x] PostgreSQL database integration using Sequelize ORM.
- [x] JWT-based Authentication (Signup, Login, Protected Routes).
- [x] Candidate and Employer profile management.
- [x] Job Management API (Create, Read, Update, Delete jobs).
- [x] Application Management API (Apply, view applications, update status).

### 2. Python Resume Parser
- [x] Standalone Flask service using spaCy's `PhraseMatcher` and NER.
- [x] Automated parsing of candidate skills and education from uploaded PDF/Word resumes.
- [x] Seamless connection with Node.js backend to save parsed attributes.

### 3. Frontend (Vite + React)
- [x] Redesigned modern, clean dashboards for both Candidates and Employers.
- [x] Visual pipelines (Applied -> Reviewed -> Interviewing -> Accepted/Rejected).
- [x] Indian Rupee (₹) formatting for all salary listings.
- [x] Auth UI Enhancements: password visibility toggles, real-time strength indicator, confirm password matching, and social sign-in buttons.

### 4. Advanced Job Recommendation Engine
- [x] Node.js based cosine similarity algorithm to match parsed candidate skills against job requirements dynamically.
- [x] Computes double-weighted required skills vs single-weighted nice-to-have skills for a realistic matching score.

---

## Postponed / Future Tasks (To Be Implemented Later)
- [ ] **Real tailored resume file upload & storage**:
  - *Current State*: The apply-time tailored resume selection UI stores only the chosen filename string and `resumeType` ('tailored') in the database `Application` model.
  - *Future Work*: Add Multer backend routing to upload the actual tailored file to `/uploads/tailored_resumes/`, link the path in the database, and allow employers to download/view the specific tailored file.
- [ ] **Real Social Auth Integration**:
  - *Current State*: Google and Facebook sign-in options are UI/CSS placeholders.
  - *Future Work*: Integrate `@react-oauth/google` and `react-facebook-login` wrappers for real token exchange.
