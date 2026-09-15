import { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import { adminApi } from '../../api/adminApi'
import { PageSpinner } from '../../components/common/Spinner'
import { MotionPage } from '../../components/common/MotionContainer'
import { BarChart3, PieChart as PieChartIcon } from 'lucide-react'
import toast from 'react-hot-toast'

const COLORS = ['#6366f1', '#10b981', '#06b6d4', '#8b5cf6', '#f43f5e']

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
    { name: 'Admins',      value: Math.max(0, stats.totalUsers - stats.totalRecruiters - stats.totalJobSeekers) },
    { name: 'Recruiters',  value: stats.totalRecruiters },
    { name: 'Job Seekers', value: stats.totalJobSeekers },
  ]

  const jobData = [
    { name: 'Active',  value: stats.activeJobs },
    { name: 'Closed',  value: Math.max(0, stats.totalJobs - stats.activeJobs) },
  ]

  const appData = [
    { name: 'Pending',    value: stats.pendingApplications },
    { name: 'Processing', value: Math.max(0, stats.totalApplications - stats.pendingApplications) },
  ]

  const barData = [
    { name: 'Users',       count: stats.totalUsers },
    { name: 'Recruiters',  count: stats.totalRecruiters },
    { name: 'Seekers',     count: stats.totalJobSeekers },
    { name: 'Jobs',        count: stats.totalJobs },
    { name: 'Apps',        count: stats.totalApplications },
  ]

  return (
    <MotionPage className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-2">
          <BarChart3 className="h-3.5 w-3.5" />
          <span>Real-time Analytics Engine</span>
        </div>
        <h1 className="text-3xl font-display font-extrabold text-white tracking-tight">System Insights & Visual Analytics</h1>
        <p className="text-slate-400 text-sm mt-1">Platform metric distributions and engagement trends.</p>
      </div>

      {/* Main Bar Chart Panel */}
      <div className="glass-panel p-8 border border-white/10">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
          <div className="p-2.5 rounded-xl bg-brand-500/20 text-brand-300 border border-brand-500/30">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-display text-white">Platform Totals Breakdown</h2>
            <p className="text-xs text-slate-400">Entities registered across the system</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '12px', color: '#fff' }}
              itemStyle={{ color: '#818cf8' }}
            />
            <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 3 Donut Pie Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'User Account Roles', data: userDistribution },
          { title: 'Job Listing Status',  data: jobData },
          { title: 'Application States',  data: appData },
        ].map(({ title, data }) => (
          <div key={title} className="glass-panel p-6 border border-white/10 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
              <PieChartIcon className="h-4 w-4 text-brand-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">{title}</h3>
            </div>

            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={4}>
                  {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '12px', color: '#fff' }}
                />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </MotionPage>
  )
}
