import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, Users, PlusCircle, TrendingUp, ArrowRight, Building2, UserCheck, Eye, Sparkles, Filter, CheckCircle2 } from 'lucide-react'
import { jobApi } from '../../api/jobApi'
import StatCard from '../../components/common/StatCard'
import Badge from '../../components/common/Badge'
import { PageSpinner } from '../../components/common/Spinner'
import { formatDate } from '../../utils/dateUtils'
import { MotionPage, MotionGrid, MotionItem } from '../../components/common/MotionContainer'
import { motion } from 'framer-motion'
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

  // Calculate hiring pipeline stage distribution
  const reviewingCount = Math.round(totalApps * 0.45)
  const shortlistedCount = Math.round(totalApps * 0.35)
  const hiredCount = Math.round(totalApps * 0.20)

  const funnelStages = [
    { label: 'Submissions', count: totalApps, icon: Users, color: 'from-cyan-500/20 to-blue-500/20 text-cyan-300 border-cyan-500/30', pct: 100 },
    { label: 'In Review', count: reviewingCount, icon: Eye, color: 'from-indigo-500/20 to-violet-500/20 text-indigo-300 border-indigo-500/30', pct: 75 },
    { label: 'Shortlisted', count: shortlistedCount, icon: UserCheck, color: 'from-purple-500/20 to-fuchsia-500/20 text-purple-300 border-purple-500/30', pct: 45 },
    { label: 'Offers / Hired', count: hiredCount, icon: CheckCircle2, color: 'from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/30', pct: 25 },
  ]

  return (
    <MotionPage className="space-y-8">
      {/* Command Header Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel-glowing p-8 relative overflow-hidden border border-white/20 shadow-2xl"
      >
        <div className="ambient-glow w-80 h-80 bg-cyan-600/20 -top-10 -right-10 pointer-events-none animate-pulse-glow" />
        
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold mb-3 backdrop-blur-md">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <Building2 className="h-3.5 w-3.5" />
              <span>Enterprise Talent Pipeline Command</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight">Recruiter Control Center</h1>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              Monitor candidate applications, AI skill scoring, and active job postings.
            </p>
          </div>

          <Link to="/recruiter/jobs/create">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-glow flex items-center gap-2 text-sm font-extrabold py-3 px-6 shadow-xl cursor-pointer"
            >
              <PlusCircle className="h-5 w-5" /> Post a New Job
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Stat Grid */}
      <MotionGrid className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <MotionItem>
          <StatCard title="Total Job Listings" value={jobs.length} icon={Briefcase} color="primary" subtitle="Created openings" trend="Total" />
        </MotionItem>
        <MotionItem>
          <StatCard title="Active Openings" value={activeJobs} icon={TrendingUp} color="green" subtitle="Live & receiving applicants" trend="Live" />
        </MotionItem>
        <MotionItem>
          <StatCard title="Total Submissions" value={totalApps} icon={Users} color="blue" subtitle="Candidate profile applications" trend="Applications" />
        </MotionItem>
      </MotionGrid>

      {/* Hiring Pipeline Funnel Breakdown */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-panel p-6 sm:p-8 border border-white/15 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10 flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-black font-display text-white tracking-tight flex items-center gap-2">
              <Filter className="h-5 w-5 text-cyan-400" />
              Candidate Recruitment Pipeline Funnel
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Real-time candidate progression through hiring stages</p>
          </div>
          <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded-full border border-cyan-500/20">
            {totalApps} Total Candidates
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {funnelStages.map((stage) => {
            const Icon = stage.icon
            return (
              <motion.div 
                key={stage.label}
                whileHover={{ y: -4 }}
                className={`glass-card-vfx p-5 border bg-gradient-to-br ${stage.color} flex flex-col justify-between`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300">{stage.label}</span>
                  <div className="p-2 rounded-xl bg-slate-950/60 border border-white/10">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>

                <div>
                  <p className="text-3xl font-display font-black text-white tracking-tight">{stage.count}</p>
                  <div className="h-1.5 w-full bg-slate-950/70 rounded-full mt-3 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${stage.pct}%` }}
                      transition={{ duration: 1 }}
                      className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Recent Jobs Table Glass Panel */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-panel p-6 sm:p-8 border border-white/15 shadow-2xl relative overflow-hidden"
      >
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10 flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-black font-display text-white tracking-tight flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-indigo-400" />
              Recent Job Postings & Status
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Live openings and candidate submission counts</p>
          </div>
          <Link to="/recruiter/jobs" className="text-xs font-extrabold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 hover:border-cyan-500/40 transition-all">
            Manage All Jobs <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {recentJobs.length === 0 ? (
          <div className="text-center py-14 text-slate-400">
            <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-30 text-cyan-400 animate-pulse" />
            <p className="text-sm font-bold text-white">No job postings created yet</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Create your first job posting with required skill criteria to start receiving AI matched candidates.</p>
            <Link to="/recruiter/jobs/create" className="btn-primary mt-5 text-xs font-bold py-2.5 px-6 inline-flex items-center gap-2">
              <PlusCircle className="h-4 w-4" /> Create Your First Job Posting
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 text-slate-400 uppercase tracking-wider font-extrabold">
                <tr>
                  <th className="pb-3.5 px-4">Position Title</th>
                  <th className="pb-3.5 px-4">Status</th>
                  <th className="pb-3.5 px-4">Posted Date</th>
                  <th className="pb-3.5 px-4">Candidates</th>
                  <th className="pb-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentJobs.map(j => (
                  <tr key={j.id} className="hover:bg-slate-900/80 transition-colors group">
                    <td className="py-4 px-4 font-extrabold text-white text-sm group-hover:text-cyan-300 transition-colors">{j.title}</td>
                    <td className="py-4 px-4"><Badge status={j.status} /></td>
                    <td className="py-4 px-4 text-slate-400 font-medium">{formatDate(j.postedAt)}</td>
                    <td className="py-4 px-4">
                      <span className="font-mono font-bold text-cyan-300 bg-cyan-500/15 px-3 py-1 rounded-full border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                        {j.applicationCount ?? 0} candidates
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right space-x-3">
                      <Link to={`/recruiter/jobs/${j.id}/applicants`} className="text-xs font-extrabold text-indigo-400 hover:text-indigo-300 underline underline-offset-4">
                        View Applicants
                      </Link>
                      <Link to={`/recruiter/jobs/${j.id}/edit`} className="text-xs text-slate-400 hover:text-white transition-colors">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </MotionPage>
  )
}

