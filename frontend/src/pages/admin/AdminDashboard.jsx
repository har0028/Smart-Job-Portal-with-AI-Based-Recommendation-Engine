import { useEffect, useState } from 'react'
import { Users, Briefcase, Building2, ClipboardList, UserX, TrendingUp } from 'lucide-react'
import { adminApi } from '../../api/adminApi'
import StatCard from '../../components/common/StatCard'
import { PageSpinner } from '../../components/common/Spinner'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const [stats, setStats]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi.getDashboard()
      .then(r => setStats(r.data.data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <PageSpinner />

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Platform overview and statistics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users"       value={stats?.totalUsers}        icon={Users}        color="primary" />
        <StatCard title="Recruiters"        value={stats?.totalRecruiters}   icon={Building2}    color="blue" />
        <StatCard title="Job Seekers"       value={stats?.totalJobSeekers}   icon={Users}        color="green" />
        <StatCard title="Total Jobs"        value={stats?.totalJobs}         icon={Briefcase}    color="purple" />
        <StatCard title="Active Jobs"       value={stats?.activeJobs}        icon={TrendingUp}   color="green" />
        <StatCard title="Applications"      value={stats?.totalApplications} icon={ClipboardList} color="yellow" />
        <StatCard title="Pending Apps"      value={stats?.pendingApplications} icon={ClipboardList} color="yellow" />
        <StatCard title="Blocked Users"     value={stats?.blockedUsers}      icon={UserX}        color="red" />
      </div>

      <div className="card">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Platform Health</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'Activation Rate',   value: stats ? `${Math.round((1 - stats.blockedUsers / stats.totalUsers) * 100)}%` : '—' },
            { label: 'Jobs Filled Rate',  value: stats ? `${Math.round((stats.totalJobs - stats.activeJobs) / (stats.totalJobs || 1) * 100)}%` : '—' },
            { label: 'Avg Apps / Job',    value: stats ? (stats.totalApplications / (stats.totalJobs || 1)).toFixed(1) : '—' },
            { label: 'Pending Rate',      value: stats ? `${Math.round(stats.pendingApplications / (stats.totalApplications || 1) * 100)}%` : '—' },
          ].map(item => (
            <div key={item.label} className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-2xl font-bold text-primary-600">{item.value}</p>
              <p className="text-xs text-gray-500 mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
