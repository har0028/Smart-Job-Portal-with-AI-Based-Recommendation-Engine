import { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import { adminApi } from '../../api/adminApi'
import { PageSpinner } from '../../components/common/Spinner'
import toast from 'react-hot-toast'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export default function AdminAnalytics() {
  const [stats, setStats]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi.getDashboard()
      .then(r => setStats(r.data.data))
      .catch(() => toast.error('Failed to load analytics'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <PageSpinner />

  const userDistribution = [
    { name: 'Admins',      value: stats.totalUsers - stats.totalRecruiters - stats.totalJobSeekers },
    { name: 'Recruiters',  value: stats.totalRecruiters },
    { name: 'Job Seekers', value: stats.totalJobSeekers },
  ]

  const jobData = [
    { name: 'Active',  value: stats.activeJobs },
    { name: 'Closed',  value: stats.totalJobs - stats.activeJobs },
  ]

  const appData = [
    { name: 'Pending',    value: stats.pendingApplications },
    { name: 'Processing', value: stats.totalApplications - stats.pendingApplications },
  ]

  const barData = [
    { name: 'Users',       count: stats.totalUsers },
    { name: 'Recruiters',  count: stats.totalRecruiters },
    { name: 'Seekers',     count: stats.totalJobSeekers },
    { name: 'Jobs',        count: stats.totalJobs },
    { name: 'Apps',        count: stats.totalApplications },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500">Platform-wide statistics and trends</p>
      </div>

      <div className="card">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Platform Overview</h2>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: 'User Distribution', data: userDistribution },
          { title: 'Job Status',        data: jobData },
          { title: 'Applications',      data: appData },
        ].map(({ title, data }) => (
          <div key={title} className="card">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">{title}</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  )
}
