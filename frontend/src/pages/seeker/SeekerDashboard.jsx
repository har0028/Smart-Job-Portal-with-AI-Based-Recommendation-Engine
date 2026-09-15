import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, Bookmark, ClipboardList, Sparkles, ArrowRight, TrendingUp, Search, User, Star, Upload, Zap, ShieldCheck, Cpu, Crown } from 'lucide-react'
import { seekerApi } from '../../api/seekerApi'
import StatCard from '../../components/common/StatCard'
import Badge from '../../components/common/Badge'
import { PageSpinner } from '../../components/common/Spinner'
import { useAuth } from '../../context/AuthContext'
import { formatDate } from '../../utils/dateUtils'
import { MotionPage, MotionGrid, MotionItem } from '../../components/common/MotionContainer'
import { motion } from 'framer-motion'
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

  // Calculate profile completeness strength (0 - 100%)
  const skillScore = Math.min(data.skills.length * 15, 60)
  const appScore = Math.min(data.apps.length * 10, 30)
  const profileStrength = Math.min(10 + skillScore + appScore, 100)

  const quickActions = [
    { to: '/seeker/pro-upgrade',     label: '👑 VIP Career Pass', desc: 'Instant alert & priority badge', icon: Crown, color: 'from-amber-500/30 via-purple-600/20 to-pink-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_25px_rgba(245,158,11,0.25)]' },
    { to: '/seeker/recommendations', label: 'AI Match Engine', desc: 'Jaccard matrix scoring', icon: Cpu, color: 'from-indigo-600/30 via-violet-600/20 to-cyan-500/20 text-indigo-300 border-indigo-500/40' },
    { to: '/seeker/jobs',            label: 'Search Openings', desc: 'Browse active roles', icon: Search, color: 'from-cyan-500/30 via-blue-600/20 to-indigo-500/20 text-cyan-300 border-cyan-500/40' },
    { to: '/seeker/resume',          label: 'PDF Resume Hub',  desc: 'Instant resume parsing', icon: Upload, color: 'from-purple-500/30 via-pink-600/20 to-rose-500/20 text-purple-300 border-purple-500/40' },
  ]

  return (
    <MotionPage className="space-y-8">
      {/* Hero Welcome Banner with AI Neural Radar VFX */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-panel-glowing p-8 sm:p-10 relative overflow-hidden border border-white/20 shadow-2xl"
      >
        {/* Background Mesh Blobs & Animated Laser Radar Glow */}
        <div className="ambient-glow w-96 h-96 bg-indigo-600/30 -top-20 -left-20 animate-pulse-glow" />
        <div className="ambient-glow w-96 h-96 bg-cyan-600/25 -bottom-20 -right-20 animate-pulse-glow" />
        
        <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold mb-4 shadow-lg backdrop-blur-md">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <Sparkles className="h-3.5 w-3.5 text-cyan-300 animate-spin" style={{ animationDuration: '6s' }} />
              <span>AI Candidate Matching Engine v2.0 Active</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white tracking-tight leading-tight">
              Welcome back, <span className="text-gradient-brand">{user?.fullName}</span> 👋
            </h1>

            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              Your AI career radar is scanning opportunities against your skill vector. You have <strong className="text-emerald-400">{data.skills.length} verified skills</strong> linked.
            </p>

            {/* Profile Strength Progress Bar VFX */}
            <div className="mt-6 p-4 rounded-2xl bg-slate-950/60 border border-white/10 backdrop-blur-md max-w-xl">
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-indigo-400" /> AI Profile Readiness Score
                </span>
                <span className="text-emerald-400 font-mono text-sm">{profileStrength}%</span>
              </div>
              <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-white/5 relative">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${profileStrength}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 rounded-full shadow-[0_0_12px_rgba(52,211,153,0.8)] relative"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex lg:justify-end">
            <Link to="/seeker/recommendations">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-glow flex items-center gap-3 py-4 px-8 text-base font-extrabold shadow-2xl group cursor-pointer"
              >
                <Zap className="h-5 w-5 text-amber-300 fill-amber-300 animate-bounce" />
                <span>Launch AI Matcher</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stat Widget Cards */}
      <MotionGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MotionItem>
          <StatCard title="Applications Sent" value={data.apps.length} icon={ClipboardList} color="primary" subtitle="Real-time submission pipeline" trend="Active" />
        </MotionItem>
        <MotionItem>
          <StatCard title="Saved Listings" value={data.saved.length} icon={Bookmark} color="blue" subtitle="Bookmarked target roles" trend="Saved" />
        </MotionItem>
        <MotionItem>
          <StatCard title="Verified Skills" value={data.skills.length} icon={Sparkles} color="green" subtitle="Vector match inputs" trend="Verified" />
        </MotionItem>
        <MotionItem>
          <StatCard title="Shortlisted Roles" value={data.apps.filter(a => a.status === 'SHORTLISTED').length} icon={Briefcase} color="purple" subtitle="Interview candidate pipeline" trend="Shortlisted" />
        </MotionItem>
      </MotionGrid>

      {/* Quick Action Navigation Grid */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-4 w-4 text-indigo-400" />
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Quick Shortcuts & Workflows</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((q) => {
            const Icon = q.icon
            return (
              <Link key={q.to} to={q.to}>
                <motion.div
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className={`glass-card-vfx p-5 border bg-gradient-to-br ${q.color} transition-all duration-300 flex items-center justify-between group cursor-pointer`}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-slate-950/70 border border-white/10 group-hover:scale-110 transition-transform">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-white group-hover:text-cyan-300 transition-colors">{q.label}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{q.desc}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-white group-hover:translate-x-1.5 transition-all" />
                </motion.div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Recent Applications Table Glass Panel */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-panel p-6 sm:p-8 border border-white/15 shadow-2xl relative overflow-hidden"
      >
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10 flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-black font-display text-white tracking-tight flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-indigo-400" />
              Recent Application Trajectory
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Live application feedback and status breakdown</p>
          </div>
          <Link to="/seeker/applications" className="text-xs font-extrabold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 hover:border-indigo-500/40 transition-all">
            View All Applications <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {recentApps.length === 0 ? (
          <div className="text-center py-14 text-slate-400">
            <ClipboardList className="h-12 w-12 mx-auto mb-3 opacity-30 text-indigo-400 animate-pulse" />
            <p className="text-sm font-bold text-white">No job applications submitted yet</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Explore AI matched job listings tailored to your skill vector and apply in 1-click.</p>
            <Link to="/seeker/jobs" className="btn-primary mt-5 text-xs font-bold py-2.5 px-6">
              Explore Available Positions
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentApps.map(app => (
              <motion.div 
                key={app.id} 
                whileHover={{ scale: 1.01, x: 4 }}
                className="flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-white/10 hover:border-indigo-500/40 transition-all duration-200 shadow-md flex-wrap gap-4"
              >
                <div>
                  <p className="font-extrabold text-white text-base">{app.jobTitle}</p>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">{app.companyName} · Applied {formatDate(app.appliedAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  {app.matchScore !== undefined && (
                    <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                      {app.matchScore?.toFixed(0)}% AI Match
                    </span>
                  )}
                  <Badge status={app.status} />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </MotionPage>
  )
}

