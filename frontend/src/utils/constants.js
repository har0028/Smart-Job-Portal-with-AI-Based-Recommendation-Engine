export const ROLES = {
  ADMIN: 'ADMIN',
  RECRUITER: 'RECRUITER',
  JOB_SEEKER: 'JOB_SEEKER',
}

export const APPLICATION_STATUS = {
  PENDING: 'PENDING',
  REVIEWING: 'REVIEWING',
  SHORTLISTED: 'SHORTLISTED',
  REJECTED: 'REJECTED',
  HIRED: 'HIRED',
}

export const JOB_STATUS = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  CLOSED: 'CLOSED',
}

export const JOB_TYPES = [
  { value: 'FULL_TIME', label: 'Full Time' },
  { value: 'PART_TIME', label: 'Part Time' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'INTERNSHIP', label: 'Internship' },
  { value: 'REMOTE', label: 'Remote' },
  { value: 'HYBRID', label: 'Hybrid' },
]

export const PROFICIENCY_LABELS = {
  1: 'Beginner',
  2: 'Elementary',
  3: 'Intermediate',
  4: 'Advanced',
  5: 'Expert',
}

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  // Admin
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_RECRUITERS: '/admin/recruiters',
  ADMIN_JOBS: '/admin/jobs',
  ADMIN_ANALYTICS: '/admin/analytics',
  // Recruiter
  RECRUITER_DASHBOARD: '/recruiter/dashboard',
  RECRUITER_JOBS: '/recruiter/jobs',
  RECRUITER_CREATE_JOB: '/recruiter/jobs/create',
  RECRUITER_EDIT_JOB: '/recruiter/jobs/:id/edit',
  RECRUITER_APPLICANTS: '/recruiter/jobs/:id/applicants',
  // Seeker
  SEEKER_DASHBOARD: '/seeker/dashboard',
  SEEKER_PROFILE: '/seeker/profile',
  SEEKER_SKILLS: '/seeker/skills',
  SEEKER_RESUME: '/seeker/resume',
  SEEKER_JOBS: '/seeker/jobs',
  SEEKER_JOB_DETAIL: '/seeker/jobs/:id',
  SEEKER_SAVED_JOBS: '/seeker/saved-jobs',
  SEEKER_APPLICATIONS: '/seeker/applications',
  SEEKER_RECOMMENDATIONS: '/seeker/recommendations',
}
