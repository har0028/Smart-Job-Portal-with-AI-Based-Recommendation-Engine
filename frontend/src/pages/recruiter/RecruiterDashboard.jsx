import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, Users, PlusCircle, TrendingUp } from 'lucide-react'
import { jobApi } from '../../api/jobApi'
import StatCard from '../../components/common/StatCard'
import Badge from '../../components/common/Badge'
import { PageSpinner } from '../../components/common/Spinner'
import { formatDate } from '../../utils/dateUtils'
import toast from 'react-hot-toast'

export default function RecruiterDashboard() {
  const [jobs, setJobs]       = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    jobApi.getMyJobs()
      .then(r => setJobs(r.data.data || []))
      .catch(() => toast.error('Failed to load jobs'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <PageSpinner />

  const activeJobs  = jobs.filter(j => j.status === 'ACTIVE').length
  const totalApps   = jobs.reduce((s, j) => s + (j.applicationCount || 0), 0)
  const recentJobs  = [...jobs].sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt)).slice(0, 5)

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recruiter Dashboard</h1>
          <p className="text-sm text-gray-500">Manage your job postings and applicants</p>
        </div>
        <Link to="/recruiter/jobs/create" className="btn-primary flex items-center gap-2">
          <PlusCircle className="h-4 w-4" /> Post a Job
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Jobs"    value={jobs.length}  icon={Briefcase}   color="primary" />
        <StatCard title="Active Jobs"   value={activeJobs}   icon={TrendingUp}  color="green" />
        <StatCard title="Applications"  value={totalApps}    icon={Users}       color="blue" />
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900">Recent Job Posts</h2>
          <Link to="/recruiter/jobs" className="text-sm text-primary-600 hover:underline">View all</Link>
        </div>
        {recentJobs.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <Briefcase className="h-10 w-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No jobs posted yet</p>
            <Link to="/recruiter/jobs/create" className="btn-primary mt-3 inline-flex items-center gap-1 text-sm">
              <PlusCircle className="h-4 w-4" /> Post your first job
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100">
                <tr>
                  {['Title', 'Status', 'Posted', 'Applications', 'Actions'].map(h => (
                    <th key={h} className="text-left pb-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentJobs.map(j => (
                  <tr key={j.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 font-medium text-gray-900">{j.title}</td>
                    <td className="py-3"><Badge status={j.status} /></td>
                    <td className="py-3 text-gray-500">{formatDate(j.postedAt)}</td>
                    <td className="py-3 text-gray-500">{j.applicationCount ?? 0}</td>
                    <td className="py-3">
                      <Link to={`/recruiter/jobs/${j.id}/applicants`}
                        className="text-xs text-primary-600 hover:underline mr-3">
                        Applicants
                      </Link>
                      <Link to={`/recruiter/jobs/${j.id}/edit`}
                        className="text-xs text-gray-500 hover:underline">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
