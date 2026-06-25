import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, Bookmark, ClipboardList, Sparkles, ArrowRight } from 'lucide-react'
import { seekerApi } from '../../api/seekerApi'
import StatCard from '../../components/common/StatCard'
import Badge from '../../components/common/Badge'
import { PageSpinner } from '../../components/common/Spinner'
import { useAuth } from '../../context/AuthContext'
import { formatDate } from '../../utils/dateUtils'
import toast from 'react-hot-toast'

export default function SeekerDashboard() {
  const { user } = useAuth()
  const [data, setData]       = useState({ apps: [], saved: [], skills: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      seekerApi.getMyApplications(),
      seekerApi.getSavedJobs(),
      seekerApi.getMySkills(),
    ]).then(([apps, saved, skills]) => setData({
      apps:   apps.data.data   || [],
      saved:  saved.data.data  || [],
      skills: skills.data.data || [],
    })).catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <PageSpinner />

  const recentApps = [...data.apps].sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt)).slice(0, 4)

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.fullName} 👋</h1>
        <p className="text-sm text-gray-500 mt-1">Here's your job search overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Applications" value={data.apps.length}   icon={ClipboardList} color="primary" />
        <StatCard title="Saved Jobs"   value={data.saved.length}  icon={Bookmark}      color="blue" />
        <StatCard title="Skills"       value={data.skills.length} icon={Sparkles}      color="green" />
        <StatCard title="Shortlisted"  value={data.apps.filter(a => a.status === 'SHORTLISTED').length} icon={Briefcase} color="yellow" />
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { to: '/seeker/jobs',            label: 'Search Jobs',       color: 'bg-primary-50 text-primary-700' },
          { to: '/seeker/recommendations', label: 'AI Picks',          color: 'bg-purple-50 text-purple-700' },
          { to: '/seeker/profile',         label: 'Update Profile',    color: 'bg-green-50 text-green-700' },
          { to: '/seeker/skills',          label: 'Manage Skills',     color: 'bg-yellow-50 text-yellow-700' },
        ].map(q => (
          <Link key={q.to} to={q.to}
            className={`${q.color} rounded-xl p-4 text-sm font-medium hover:opacity-80 transition-opacity flex items-center justify-between`}>
            {q.label}<ArrowRight className="h-4 w-4" />
          </Link>
        ))}
      </div>

      {/* Recent applications */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900">Recent Applications</h2>
          <Link to="/seeker/applications" className="text-sm text-primary-600 hover:underline">View all</Link>
        </div>
        {recentApps.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <ClipboardList className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No applications yet</p>
            <Link to="/seeker/jobs" className="text-sm text-primary-600 hover:underline mt-1 inline-block">Browse jobs</Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentApps.map(app => (
              <div key={app.id} className="flex items-center justify-between py-3 flex-wrap gap-2">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{app.jobTitle}</p>
                  <p className="text-xs text-gray-500">{app.companyName} · {formatDate(app.appliedAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{app.matchScore?.toFixed(0)}% match</span>
                  <Badge status={app.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
