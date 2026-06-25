import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Auth
import LoginPage    from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'

// Admin
import AdminDashboard   from '../pages/admin/AdminDashboard'
import AdminUsers       from '../pages/admin/AdminUsers'
import AdminRecruiters  from '../pages/admin/AdminRecruiters'
import AdminJobs        from '../pages/admin/AdminJobs'
import AdminAnalytics   from '../pages/admin/AdminAnalytics'

// Recruiter
import RecruiterDashboard from '../pages/recruiter/RecruiterDashboard'
import ManageJobs         from '../pages/recruiter/ManageJobs'
import CreateJob          from '../pages/recruiter/CreateJob'
import EditJob            from '../pages/recruiter/EditJob'
import ViewApplicants     from '../pages/recruiter/ViewApplicants'

// Seeker
import SeekerDashboard   from '../pages/seeker/SeekerDashboard'
import ProfilePage       from '../pages/seeker/ProfilePage'
import SkillManagement   from '../pages/seeker/SkillManagement'
import ResumeUpload      from '../pages/seeker/ResumeUpload'
import JobSearch         from '../pages/seeker/JobSearch'
import JobDetail         from '../pages/seeker/JobDetail'
import SavedJobs         from '../pages/seeker/SavedJobs'
import MyApplications    from '../pages/seeker/MyApplications'
import Recommendations   from '../pages/seeker/Recommendations'

// Layouts
import AdminLayout    from '../components/common/AdminLayout'
import RecruiterLayout from '../components/common/RecruiterLayout'
import SeekerLayout   from '../components/common/SeekerLayout'

// Guards
function RequireAuth({ children, role }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to="/login" replace />
  return children
}

function GuestOnly({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user) {
    const dest = user.role === 'ADMIN' ? '/admin/dashboard'
               : user.role === 'RECRUITER' ? '/recruiter/dashboard'
               : '/seeker/dashboard'
    return <Navigate to={dest} replace />
  }
  return children
}

export default function AppRouter() {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Auth */}
      <Route path="/login"    element={<GuestOnly><LoginPage /></GuestOnly>} />
      <Route path="/register" element={<GuestOnly><RegisterPage /></GuestOnly>} />

      {/* Admin */}
      <Route path="/admin" element={<RequireAuth role="ADMIN"><AdminLayout /></RequireAuth>}>
        <Route index                element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard"     element={<AdminDashboard />} />
        <Route path="users"         element={<AdminUsers />} />
        <Route path="recruiters"    element={<AdminRecruiters />} />
        <Route path="jobs"          element={<AdminJobs />} />
        <Route path="analytics"     element={<AdminAnalytics />} />
      </Route>

      {/* Recruiter */}
      <Route path="/recruiter" element={<RequireAuth role="RECRUITER"><RecruiterLayout /></RequireAuth>}>
        <Route index                    element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard"         element={<RecruiterDashboard />} />
        <Route path="jobs"              element={<ManageJobs />} />
        <Route path="jobs/create"       element={<CreateJob />} />
        <Route path="jobs/:id/edit"     element={<EditJob />} />
        <Route path="jobs/:id/applicants" element={<ViewApplicants />} />
      </Route>

      {/* Seeker */}
      <Route path="/seeker" element={<RequireAuth role="JOB_SEEKER"><SeekerLayout /></RequireAuth>}>
        <Route index                    element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard"         element={<SeekerDashboard />} />
        <Route path="profile"           element={<ProfilePage />} />
        <Route path="skills"            element={<SkillManagement />} />
        <Route path="resume"            element={<ResumeUpload />} />
        <Route path="jobs"              element={<JobSearch />} />
        <Route path="jobs/:id"          element={<JobDetail />} />
        <Route path="saved-jobs"        element={<SavedJobs />} />
        <Route path="applications"      element={<MyApplications />} />
        <Route path="recommendations"   element={<Recommendations />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <h1 className="text-6xl font-bold text-gray-300">404</h1>
          <p className="text-gray-500">Page not found</p>
          <a href="/" className="btn-primary">Go Home</a>
        </div>
      } />
    </Routes>
  )
}
