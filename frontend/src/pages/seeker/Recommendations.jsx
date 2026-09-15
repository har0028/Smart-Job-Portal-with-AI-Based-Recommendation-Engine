import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles, RefreshCw, MapPin, Briefcase, DollarSign,
  CheckCircle, AlertTriangle, TrendingUp, ChevronDown, ArrowUpRight, Cpu, Zap, Crown, Award, ShieldCheck, Flame
} from 'lucide-react'
import { seekerApi } from '../../api/seekerApi'
import EmptyState from '../../components/common/EmptyState'
import { PageSpinner } from '../../components/common/Spinner'
import { MotionPage, MotionGrid, MotionItem } from '../../components/common/MotionContainer'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

function MatchGauge({ pct }) {
  const color = pct >= 75 ? '#34d399' : pct >= 50 ? '#38bdf8' : '#fb7185'
  const label = pct >= 75 ? '🔥 Ultra Vector Match' : pct >= 50 ? '⚡ Strong Fit' : '🎯 Potential Fit'
  const shadowGlow = pct >= 75 
    ? 'shadow-[0_0_20px_rgba(52,211,153,0.35)] border-emerald-500/40' 
    : pct >= 50 
    ? 'shadow-[0_0_20px_rgba(56,189,248,0.35)] border-cyan-500/40' 
    : 'shadow-[0_0_15px_rgba(251,113,133,0.25)] border-rose-500/30'

  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`relative w-28 flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-950/80 border backdrop-blur-xl transition-all duration-300 ${shadowGlow}`}>
        <svg viewBox="0 0 100 60" className="w-22 overflow-visible" aria-label={`${pct}% match`}>
          <path d="M10 55 A40 40 0 0 1 90 55" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" strokeLinecap="round" />
          <motion.path
            d="M10 55 A40 40 0 0 1 90 55"
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            initial={{ strokeDasharray: '0 125.6' }}
            animate={{ strokeDasharray: `${(pct / 100) * 125.6} 125.6` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
          <text x="50" y="52" textAnchor="middle" fontSize="16" fontWeight="900" fill="#ffffff">{pct.toFixed(0)}%</text>
        </svg>
      </div>
      <span className="text-[10px] font-black tracking-wider uppercase mt-1" style={{ color }}>{label}</span>
    </div>
  )
}

function RecommendationCard({ rec }) {
  const [expanded, setExpanded] = useState(false)

  // Dynamic medal styling based on rank
  const rankBadgeStyle = 
    rec.rank === 1 ? 'from-amber-500/30 via-yellow-500/20 to-amber-600/30 border-amber-400/60 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.35)]' :
    rec.rank === 2 ? 'from-cyan-500/30 via-blue-500/20 to-cyan-600/30 border-cyan-400/60 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.35)]' :
    rec.rank === 3 ? 'from-purple-500/30 via-pink-500/20 to-purple-600/30 border-purple-400/60 text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.35)]' :
    'from-indigo-500/20 to-slate-800/40 border-white/10 text-slate-300'

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.005 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="glass-card-vfx p-6 sm:p-7 border border-white/15 hover:border-indigo-500/40 relative overflow-hidden group cursor-pointer shadow-2xl"
    >
      <div className="flex items-start gap-4 flex-wrap">
        {/* Rank Medal Badge */}
        <div className={`shrink-0 h-14 w-14 rounded-2xl bg-gradient-to-br border ${rankBadgeStyle} flex flex-col items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          {rec.rank === 1 ? <Crown className="h-4 w-4 text-amber-400 animate-bounce" /> : <Award className="h-4 w-4" />}
          <span className="font-display font-black text-base tracking-tight mt-0.5">#{rec.rank}</span>
        </div>

        {/* Main Job Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h3 className="font-black text-white text-xl group-hover:text-cyan-300 transition-colors flex items-center gap-2">
                {rec.jobTitle}
              </h3>
              <p className="text-sm font-extrabold text-indigo-400 mt-0.5 flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5" />
                {rec.companyName}
              </p>
            </div>
            <MatchGauge pct={rec.matchPercentage} />
          </div>

          <div className="flex flex-wrap gap-4 mt-3.5 text-xs text-slate-300 border-y border-white/10 py-3">
            {rec.location && (
              <span className="flex items-center gap-1.5 font-bold text-slate-200">
                <MapPin className="h-4 w-4 text-indigo-400" />
                {rec.location}
              </span>
            )}
            {rec.jobType && (
              <span className="flex items-center gap-1.5 font-bold text-slate-200">
                <Briefcase className="h-4 w-4 text-cyan-400" />
                {rec.jobType.replace('_', ' ')}
              </span>
            )}
            {rec.salaryRange && (
              <span className="flex items-center gap-1.5 font-extrabold text-emerald-300 bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                <DollarSign className="h-4 w-4 text-emerald-400" />
                {rec.salaryRange}
              </span>
            )}
          </div>

          {/* Matched Skills */}
          {rec.matchedSkills?.length > 0 && (
            <div className="mt-4">
              <span className="text-[10px] uppercase tracking-widest font-black text-emerald-400 block mb-2 flex items-center gap-1">
                <CheckCircle className="h-3.5 w-3.5" /> Matched Competencies ({rec.matchedSkills.length})
              </span>
              <div className="flex flex-wrap gap-2">
                {rec.matchedSkills.map(s => (
                  <span key={s} className="flex items-center gap-1.5 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-bold px-3 py-1.5 rounded-xl backdrop-blur-md shadow-sm">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Missing Skills */}
          {rec.missingSkills?.length > 0 && (
            <div className="mt-4">
              <span className="text-[10px] uppercase tracking-widest font-black text-rose-400 block mb-2 flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5" /> Skill Gap Recommendations ({rec.missingSkills.length})
              </span>
              <div className="flex flex-wrap gap-2">
                {rec.missingSkills.map(s => (
                  <span key={s} className="flex items-center gap-1.5 bg-rose-500/15 text-rose-300 border border-rose-500/30 text-xs font-bold px-3 py-1.5 rounded-xl backdrop-blur-md shadow-sm">
                    <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* AI Explanation Drawer */}
          <div className="mt-5 pt-3.5 border-t border-white/10">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs font-extrabold text-indigo-300 hover:text-white flex items-center gap-2 bg-indigo-500/15 border border-indigo-500/30 px-4 py-2 rounded-xl transition-all shadow-md hover:border-indigo-400"
            >
              <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" />
              {expanded ? 'Collapse AI Analysis' : 'Reveal Deep AI Vector Analysis'}
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3.5 p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-indigo-950/70 to-slate-950 border border-indigo-500/40 text-xs text-slate-200 leading-relaxed shadow-2xl relative overflow-hidden"
                >
                  <div className="flex items-center gap-2 font-black text-amber-300 mb-2">
                    <Cpu className="h-4 w-4 text-cyan-400" />
                    <span>Jaccard AI Matrix Match Reason:</span>
                  </div>
                  <p className="font-medium text-slate-300 text-sm leading-relaxed">{rec.recommendationReason}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/10">
        <Link to={`/seeker/jobs/${rec.jobId}`}>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-glow text-xs font-extrabold py-3 px-6 flex items-center gap-2 cursor-pointer"
          >
            View Position & Apply <ArrowUpRight className="h-4 w-4" />
          </motion.button>
        </Link>
      </div>
    </motion.div>
  )
}

export default function Recommendations() {
  const [recs, setRecs]         = useState([])
  const [loading, setLoading]   = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const load = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    try {
      const res = await seekerApi.getRecommendations()
      setRecs(res.data.data || [])
      if (isRefresh) toast.success('AI Match Matrix recalculated!')
    } catch {
      toast.error('Failed to load recommendations')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { load() }, [])

  if (loading) return <PageSpinner />

  return (
    <MotionPage className="space-y-8">
      {/* Header Banner with Laser Radar VFX */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel-glowing p-8 sm:p-10 relative overflow-hidden border border-white/20 shadow-2xl"
      >
        <div className="ambient-glow w-96 h-96 bg-indigo-600/30 -top-20 -left-20 animate-pulse-glow" />
        <div className="ambient-glow w-96 h-96 bg-cyan-600/25 -bottom-20 -right-20 animate-pulse-glow" />

        <div className="relative z-10 flex items-start justify-between flex-wrap gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-black mb-3 backdrop-blur-md shadow-lg">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <Cpu className="h-4 w-4 text-cyan-300" />
              <span>Jaccard Similarity Vector Algorithm Active</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white tracking-tight flex items-center gap-3">
              AI Job Match Center <Sparkles className="h-7 w-7 text-amber-300 animate-spin" style={{ animationDuration: '8s' }} />
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              Weighted composite AI recommendations generated by comparing your skill vector against real-time job post requirements.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => load(true)}
            disabled={refreshing}
            className="btn-glow flex items-center gap-2.5 text-xs font-black py-3.5 px-6 shadow-xl cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Recalculating Matrix...' : 'Recalculate AI Match'}
          </motion.button>
        </div>
      </motion.div>

      {/* Interactive AI Matrix Telemetry Card */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-panel p-6 sm:p-8 border border-white/15 bg-gradient-to-r from-slate-950 via-indigo-950/60 to-slate-950 shadow-2xl"
      >
        <div className="flex items-start gap-4 flex-wrap sm:flex-nowrap">
          <div className="p-3.5 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 shrink-0 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            <TrendingUp className="h-7 w-7 text-indigo-400" />
          </div>
          <div className="text-xs text-slate-300 space-y-2">
            <h3 className="font-black text-white text-base flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              How AI Vector Scoring Works
            </h3>
            <p className="leading-relaxed text-slate-300 font-medium">
              <span className="text-cyan-300 font-mono font-bold">Score = Skill Vector (70%) + Experience Match (20%) + Post Recency (10%)</span>.
            </p>
            
            {/* Algorithm Weight Breakdown Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10">
                <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest block">Skills Vector</span>
                <span className="text-lg font-black text-white font-mono">70% Weight</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10">
                <span className="text-[10px] font-black text-cyan-300 uppercase tracking-widest block">Experience Level</span>
                <span className="text-lg font-black text-white font-mono">20% Weight</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10">
                <span className="text-[10px] font-black text-emerald-300 uppercase tracking-widest block">Freshness Decay</span>
                <span className="text-lg font-black text-white font-mono">10% Weight</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {recs.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="No recommendations match your vector yet"
          description="Add your core competencies and proficiencies to unlock AI-powered job matches."
          action={
            <Link to="/seeker/skills" className="btn-primary text-sm font-bold py-3 px-6">
              Manage Skill Matrix
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Flame className="h-4 w-4 text-amber-400" />
              Showing {recs.length} Top-Ranked Matches
            </p>
          </div>
          <MotionGrid className="space-y-5">
            {recs.map(rec => (
              <MotionItem key={rec.jobId}>
                <RecommendationCard rec={rec} />
              </MotionItem>
            ))}
          </MotionGrid>
        </div>
      )}
    </MotionPage>
  )
}

