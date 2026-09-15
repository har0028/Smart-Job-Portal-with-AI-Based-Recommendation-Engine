import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, Briefcase, Building2, ClipboardList, UserX, TrendingUp, ShieldCheck, Activity, Cpu, ArrowRight, DollarSign, Lock } from 'lucide-react'
import { adminApi } from '../../api/adminApi'
import StatCard from '../../components/common/StatCard'
import { PageSpinner } from '../../components/common/Spinner'
import { MotionPage, MotionGrid, MotionItem } from '../../components/common/MotionContainer'
import { motion } from 'framer-motion'
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

  const healthMetrics = [
    { label: 'Platform Activation', value: stats ? Math.round((1 - stats.blockedUsers / (stats.totalUsers || 1)) * 100) : 0, unit: '%', desc: 'Active vs restricted accounts', color: 'from-emerald-400 to-cyan-400' },
    { label: 'Job Fulfillment Rate', value: stats ? Math.round((stats.totalJobs - stats.activeJobs) / (stats.totalJobs || 1) * 100) : 0, unit: '%', desc: 'Completed hiring postings', color: 'from-indigo-400 to-purple-400' },
    { label: 'Applications Density', value: stats ? (stats.totalApplications / (stats.totalJobs || 1)).toFixed(1) : '0', unit: ' / job', desc: 'Average candidates per opening', color: 'from-cyan-400 to-blue-400' },
    { label: 'Pending Processing', value: stats ? Math.round(stats.pendingApplications / (stats.totalApplications || 1) * 100) : 0, unit: '%', desc: 'Applications awaiting review', color: 'from-amber-400 to-orange-400' },
  ]

  const adminShortcuts = [
    { to: '/admin/users', label: 'User Directory', desc: 'Manage & block user profiles', icon: Users, color: 'from-indigo-600/30 to-purple-600/20 text-indigo-300 border-indigo-500/40' },
    { to: '/admin/recruiters', label: 'Recruiters & Companies', desc: 'Verify employer accounts', icon: Building2, color: 'from-cyan-500/30 to-blue-600/20 text-cyan-300 border-cyan-500/40' },
    { to: '/admin/revenue', label: 'Pro Upgrade Revenue', desc: 'Financial telemetry & stats', icon: DollarSign, color: 'from-emerald-500/30 to-teal-600/20 text-emerald-300 border-emerald-500/40' },
    { to: '/admin/jobs', label: 'Job Moderation', desc: 'Review & audit job posts', icon: Briefcase, color: 'from-purple-500/30 to-pink-600/20 text-purple-300 border-purple-500/40' },
  ]

  return (
    <MotionPage className="space-y-8">
      {/* Header Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel-glowing p-8 relative overflow-hidden border border-white/20 shadow-2xl"
      >
        <div className="ambient-glow w-96 h-96 bg-purple-600/25 -top-10 -right-10 pointer-events-none animate-pulse-glow" />
        
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold mb-3 backdrop-blur-md">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Enterprise Governance Telemetry Active</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight">Admin System Control Center</h1>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              Platform security analytics, server health metrics, and account management.
            </p>
          </div>

          <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-950/70 border border-white/10 text-xs font-mono text-emerald-400">
            <Activity className="h-4 w-4 animate-pulse text-emerald-400" />
            <span>Server Uptime: <strong>99.98%</strong></span>
          </div>
        </div>
      </motion.div>

      {/* 8 Metric Stat Widgets */}
      <MotionGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MotionItem>
          <StatCard title="Registered Users" value={stats?.totalUsers} icon={Users} color="primary" subtitle="Platform accounts" trend="Users" />
        </MotionItem>
        <MotionItem>
          <StatCard title="Verified Recruiters" value={stats?.totalRecruiters} icon={Building2} color="blue" subtitle="Recruiter accounts" trend="Recruiters" />
        </MotionItem>
        <MotionItem>
          <StatCard title="Active Job Seekers" value={stats?.totalJobSeekers} icon={Users} color="green" subtitle="Seeker profiles" trend="Seekers" />
        </MotionItem>
        <MotionItem>
          <StatCard title="Total Openings" value={stats?.totalJobs} icon={Briefcase} color="purple" subtitle="Platform job posts" trend="Jobs" />
        </MotionItem>
        <MotionItem>
          <StatCard title="Active Positions" value={stats?.activeJobs} icon={TrendingUp} color="green" subtitle="Receiving applications" trend="Active" />
        </MotionItem>
        <MotionItem>
          <StatCard title="Submissions" value={stats?.totalApplications} icon={ClipboardList} color="yellow" subtitle="All time applications" trend="Total" />
        </MotionItem>
        <MotionItem>
          <StatCard title="Pending Review" value={stats?.pendingApplications} icon={ClipboardList} color="blue" subtitle="Awaiting recruiter review" trend="Pending" />
        </MotionItem>
        <MotionItem>
          <StatCard title="Blocked Accounts" value={stats?.blockedUsers} icon={UserX} color="red" subtitle="Restricted access accounts" trend="Blocked" />
        </MotionItem>
      </MotionGrid>

      {/* Administrative Shortcuts */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="h-4 w-4 text-purple-400" />
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Admin Controls & Governance</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {adminShortcuts.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.to} to={item.to}>
                <motion.div
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className={`glass-card-vfx p-5 border bg-gradient-to-br ${item.color} transition-all duration-300 flex items-center justify-between group cursor-pointer`}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-slate-950/70 border border-white/10 group-hover:scale-110 transition-transform">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-white group-hover:text-purple-300 transition-colors">{item.label}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{item.desc}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-white group-hover:translate-x-1.5 transition-all" />
                </motion.div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Platform Health Telemetry Glass Panel */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-panel p-6 sm:p-8 border border-white/15 shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-black font-display text-white tracking-tight">System Telemetry & Platform Health Ratios</h2>
            <p className="text-xs text-slate-400 mt-0.5">Automated health evaluation based on platform activity</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {healthMetrics.map(item => (
            <motion.div 
              key={item.label}
              whileHover={{ y: -5 }}
              className="glass-card-vfx p-6 border border-white/10 bg-slate-950/60 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-black text-slate-300 uppercase tracking-wider">{item.label}</p>
                  <span className="text-xs font-mono font-bold text-slate-400">{item.desc}</span>
                </div>
                
                <p className="text-3xl font-display font-black text-white mt-1">
                  <span className={`bg-clip-text text-transparent bg-gradient-to-r ${item.color}`}>
                    {item.value}
                  </span>
                  <span className="text-sm font-semibold text-slate-400 ml-1">{item.unit}</span>
                </p>

                {/* Progress bar visualizer */}
                <div className="h-2 w-full bg-slate-900 rounded-full mt-4 overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(typeof item.value === 'number' ? item.value : 50, 100)}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </MotionPage>
  )
}

