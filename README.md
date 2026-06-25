# 🚀 Smart Job Portal — Full Stack Project

> AI-powered job matching platform with skill-based recommendation engine

**Stack:** Java 21 · Spring Boot 3 · React 18 · MySQL 8 · JWT · Tailwind CSS · Docker

---

## 📁 Project Structure

```
smart-job-portal/
├── backend/          ← Spring Boot 3 REST API
├── frontend/         ← React 18 + Tailwind CSS SPA
├── docker-compose.yml
├── .github/
│   └── workflows/
│       └── ci-cd.yml
└── README.md
```

---

## ⚡ Run with Docker (Recommended — Zero Config)

```bash
git clone <your-repo-url>
cd smart-job-portal
docker-compose up --build
```

| Service   | URL                      |
|-----------|--------------------------|
| 🌐 Frontend  | http://localhost:3000  |
| ⚙️ Backend   | http://localhost:8080  |
| 🗄️ MySQL    | localhost:3306         |

**Default Admin Login:**
- Email: `admin@smartjobportal.com`
- Password: `Admin@123`

**Sample Users (password: `Password@123`):**
| Role      | Email                        |
|-----------|------------------------------|
| Recruiter | recruiter1@techcorp.com      |
| Recruiter | recruiter2@startupxyz.com    |
| Seeker    | john.doe@gmail.com           |
| Seeker    | jane.smith@gmail.com         |

---

## 🖥️ Run Locally (Without Docker)

### 1. MySQL Setup
```sql
CREATE DATABASE smart_job_portal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend
```bash
cd backend
# Edit src/main/resources/application.properties — set DB credentials
mvn clean spring-boot:run
# Runs on http://localhost:8080
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

---

## 🎯 Features

### Admin
- Dashboard with platform statistics
- Manage users, recruiters, jobs
- Block/unblock accounts
- Analytics charts (Recharts)

### Recruiter
- Post, edit, delete jobs with skill tags
- View applicants per job
- Update application status (Pending → Reviewing → Shortlisted → Hired/Rejected)

### Job Seeker
- Profile management with bio, location, experience
- Skill management with proficiency levels (1–5)
- PDF resume upload (drag & drop)
- Job search with keyword, location, type filters
- Save jobs, apply with cover letter
- Application status tracking with progress bar
- **AI-powered job recommendations**

### 🤖 AI Recommendation Engine
- Skill matching using Jaccard similarity: `score = |matched| / |required| × 100`
- Weighted composite score: `skills × 0.70 + experience × 0.20 + recency × 0.10`
- Returns match percentage, matched skills, missing skills, and human-readable explanation
- Visual match gauge with color coding (green ≥75%, yellow ≥50%, red <50%)

---

## 🧪 Tests
```bash
cd backend
mvn test
```
- `JaccardScorerTest` — AI scoring unit tests
- `SkillNormalizerTest` — alias resolution tests
- `RecommendationExplainerTest` — explanation generation tests
- `SmartJobPortalApplicationTests` — Spring context integration test (H2)

---

## 🔑 API Quick Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | Public | Login → JWT |
| POST | `/api/auth/register` | Public | Register |
| GET | `/api/jobs` | Public | Search jobs |
| GET | `/api/recommendations` | JOB_SEEKER | AI recommendations |
| POST | `/api/seeker/jobs/{id}/apply` | JOB_SEEKER | Apply for job |
| POST | `/api/recruiter/jobs` | RECRUITER | Post a job |
| GET | `/api/admin/dashboard` | ADMIN | Platform stats |

Import `backend/SmartJobPortal.postman_collection.json` for all 28 endpoints.

---

## 🏗️ Architecture

```
React SPA (Vite + Tailwind)
        │  JWT Bearer
        ▼
Spring Security Filter Chain
        │
   JwtAuthFilter
        │
  Role-Based Guard
        │
   REST Controllers
   ┌────┴────┐
Service Layer  AI Engine (SkillNormalizer → JaccardScorer → WeightedRanker → Explainer)
   └────┬────┘
 JPA Repositories
        │
     MySQL 8
```

---

## 📦 Tech Stack

| Layer     | Technology |
|-----------|------------|
| Frontend  | React 18, React Router v6, Axios, Tailwind CSS, Recharts, Vite |
| Backend   | Java 21, Spring Boot 3.2, Spring Security, JWT (JJWT 0.12) |
| Database  | MySQL 8.0, Spring Data JPA, Hibernate |
| DevOps    | Docker, Docker Compose, GitHub Actions CI/CD |
| Tests     | JUnit 5, Spring Boot Test, H2 (in-memory) |
