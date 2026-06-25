# Smart Job Portal — Frontend

React.js frontend for the Smart Job Portal with AI-based job recommendation engine.

**Stack:** React 18 · React Router v6 · Axios · Tailwind CSS · Context API · Vite

---

## Quick Start

```bash
cd smart-job-portal-frontend
npm install
npm run dev
```

App runs at **http://localhost:3000**

The Vite dev server proxies `/api/*` to `http://localhost:8080`, so the backend must be running.

---

## Environment Variables

Copy `.env` and adjust:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_NAME=Smart Job Portal
```

---

## Project Structure

```
src/
├── api/              # Axios API modules (authApi, jobApi, seekerApi, adminApi)
├── components/
│   ├── common/       # Shared UI: Navbar, Sidebar, Modal, Badge, JobCard, etc.
│   └── recruiter/    # JobForm (create/edit)
├── context/          # AuthContext (global auth state + JWT)
├── hooks/            # useApi (loading/error wrapper)
├── pages/
│   ├── auth/         # LoginPage, RegisterPage
│   ├── admin/        # Dashboard, Users, Recruiters, Jobs, Analytics
│   ├── recruiter/    # Dashboard, ManageJobs, CreateJob, EditJob, ViewApplicants
│   └── seeker/       # Dashboard, Profile, Skills, Resume, JobSearch, JobDetail,
│                     # SavedJobs, MyApplications, Recommendations
├── routes/           # AppRouter with role guards + GuestOnly redirect
└── utils/            # constants, tokenUtils, dateUtils
```

---

## Key Features

**Authentication**
- JWT stored in localStorage
- Auto-attach via Axios request interceptor
- 401 response → clears token + redirects to /login
- Token expiry checked on mount

**Role-Based Routing**
- `/admin/*` — ADMIN only
- `/recruiter/*` — RECRUITER only
- `/seeker/*` — JOB_SEEKER only
- Unauthenticated users → `/login`
- Authenticated users hitting `/login` → role dashboard

**AI Recommendations Page**
- Circular gauge showing match percentage
- Color-coded: green ≥75%, yellow ≥50%, red <50%
- Matched skills shown with green checkmark badges
- Missing skills shown with red alert badges
- Expandable AI explanation per job
- Refresh button to re-run the engine

---

## Build for Production

```bash
npm run build
# Output: dist/
```

---

## Run with Docker

From the project root (alongside `docker-compose.yml`):

```bash
docker-compose up --build
```

| Service   | URL                    |
|-----------|------------------------|
| Frontend  | http://localhost:3000  |
| Backend   | http://localhost:8080  |
| MySQL     | localhost:3306         |
