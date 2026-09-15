import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Search, MapPin, SlidersHorizontal, X, Briefcase, Filter, ArrowUpRight, Sparkles, Zap, Flame, Building2 } from 'lucide-react'
import { jobApi } from '../../api/jobApi'
import JobCard from '../../components/common/JobCard'
import EmptyState from '../../components/common/EmptyState'
import { PageSpinner } from '../../components/common/Spinner'
import { JOB_TYPES } from '../../utils/constants'
import { MotionPage, MotionGrid, MotionItem } from '../../components/common/MotionContainer'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

export default function JobSearch() {
  const [jobs, setJobs]         = useState([])
  const [loading, setLoading]   = useState(false)
  const [filters, setFilters]   = useState({ keyword: '', location: '', jobType: '' })
  const [page, setPage]         = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [showFilters, setShowFilters] = useState(false)

  const fetchJobs = useCallback(async (params, pageNum = 0) => {
    setLoading(true)
    try {
      const res = await jobApi.searchJobs({
        keyword:  params.keyword  || undefined,
        location: params.location || undefined,
        jobType:  params.jobType  || undefined,
        page: pageNum,
        size: 10,
      })
      const data = res.data.data
      setJobs(data.content || [])
      setTotalPages(data.totalPages || 0)
      setPage(pageNum)
    } catch {
      toast.error('Failed to search jobs')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchJobs(filters, 0)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchJobs(filters, 0)
  }

  const applyPreset = (preset) => {
    const next = { ...filters, ...preset }
    setFilters(next)
    fetchJobs(next, 0)
  }

  const clearFilter = (key) => {
    const next = { ...filters, [key]: '' }
    setFilters(next)
    fetchJobs(next, 0)
  }

  const activeFilters = Object.entries(filters).filter(([, v]) => v)

  const presetFilters = [
    { label: '🌐 Remote Positions', preset: { jobType: 'REMOTE' } },
    { label: '☕ Java / Spring Boot', preset: { keyword: 'Java' } },
    { label: '⚛️ React / Frontend', preset: { keyword: 'React' } },
    { label: '💰 High Salary (15+ LPA)', preset: { keyword: 'LPA' } },
    { label: '🚀 Full-Time Roles', preset: { jobType: 'FULL_TIME' } },
  ]

  return (
    <MotionPage className="space-y-8">
      {/* Search Command Center Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel-glowing p-8 sm:p-10 relative overflow-hidden border border-white/20 shadow-2xl"
      >
        <div className="ambient-glow w-96 h-96 bg-indigo-600/30 -top-20 -left-20 animate-pulse-glow" />
        <div className="ambient-glow w-96 h-96 bg-cyan-600/25 -bottom-20 -right-20 animate-pulse-glow" />

        <div className="relative z-10 flex items-start justify-between flex-wrap gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-black mb-3 backdrop-blur-md shadow-lg">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <Briefcase className="h-4 w-4 text-indigo-400" />
              <span>Real-Time Enterprise Job Pipeline Active</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white tracking-tight">
              Explore Enterprise Openings
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              Filter through verified tech opportunities, high-growth startups, and enterprise remote roles.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-950/70 border border-white/10 text-xs font-mono text-cyan-300 shadow-md">
            <Sparkles className="h-4 w-4 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
            <span>AI Match Ready</span>
          </div>
        </div>
      </motion.div>

      {/* Glassmorphic Search Form with VFX */}
      <form onSubmit={handleSearch} className="glass-panel p-6 sm:p-8 border border-white/20 shadow-2xl space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="relative md:col-span-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-400" />
            <input
              className="glass-input pl-12 py-3.5 text-sm font-semibold placeholder-slate-400 border-white/15 focus:border-indigo-500 shadow-inner"
              placeholder="Search by job title, skill vector (Java, React...), or company..."
              value={filters.keyword}
              onChange={e => setFilters({ ...filters, keyword: e.target.value })}
            />
          </div>

          <div className="relative md:col-span-4">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-cyan-400" />
            <input
              className="glass-input pl-12 py-3.5 text-sm font-semibold placeholder-slate-400 border-white/15 focus:border-cyan-500 shadow-inner"
              placeholder="City, Bangalore, Remote, Pune..."
              value={filters.location}
              onChange={e => setFilters({ ...filters, location: e.target.value })}
            />
          </div>

          <div className="flex gap-2 md:col-span-2">
            <button 
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`p-3.5 rounded-xl border transition-all flex items-center justify-center shrink-0 cursor-pointer ${
                showFilters 
                  ? 'bg-indigo-500/25 border-indigo-500 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.3)]' 
                  : 'bg-slate-900/80 border-white/15 text-slate-300 hover:text-white hover:border-white/30'
              }`}
            >
              <SlidersHorizontal className="h-5 w-5" />
            </button>

            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit" 
              className="btn-glow w-full py-3.5 text-sm font-extrabold flex items-center justify-center gap-2 shadow-xl cursor-pointer"
            >
              <Search className="h-4 w-4" /> Search
            </motion.button>
          </div>
        </div>

        {/* Quick Filter Presets Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 border-t border-white/10 no-scrollbar">
          <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 shrink-0 mr-1 flex items-center gap-1">
            <Zap className="h-3.5 w-3.5 text-amber-400" /> Quick Presets:
          </span>
          {presetFilters.map(p => (
            <button
              key={p.label}
              type="button"
              onClick={() => applyPreset(p.preset)}
              className="text-xs font-bold px-3.5 py-1.5 rounded-full border border-white/10 bg-slate-950/60 hover:bg-indigo-500/20 hover:border-indigo-500/40 hover:text-indigo-300 text-slate-300 transition-all shrink-0 cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Expandable Employment Filter Drawer */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-4 border-t border-white/10"
            >
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Employment Type:</span>
                <div className="flex flex-wrap gap-2">
                  {JOB_TYPES.map(t => {
                    const isSelected = filters.jobType === t.value
                    return (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => setFilters({ ...filters, jobType: isSelected ? '' : t.value })}
                        className={`text-xs font-extrabold px-4 py-1.5 rounded-full border transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-500/25 border-indigo-500 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                            : 'border-white/10 bg-slate-950/60 text-slate-400 hover:text-white hover:border-white/20'
                        }`}
                      >
                        {t.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-3 border-t border-white/10">
            {activeFilters.map(([key, val]) => (
              <span key={key} className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md shadow-sm">
                <span className="capitalize">{key}:</span> <strong className="text-white">{val}</strong>
                <button onClick={() => clearFilter(key)} className="hover:text-rose-400 ml-1 cursor-pointer">
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}
      </form>

      {/* Job Results Feed */}
      {loading ? (
        <PageSpinner />
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No open positions match your query"
          description="Try clearing active filters or searching for generic tech keywords (e.g. Java, React, Developer)."
        />
      ) : (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Flame className="h-4 w-4 text-amber-400" />
              Showing {jobs.length} Verified Enterprise Openings
            </p>
          </div>

          <MotionGrid className="space-y-5">
            {jobs.map(job => (
              <MotionItem key={job.id}>
                <JobCard
                  job={job}
                  actions={
                    <Link to={`/seeker/jobs/${job.id}`}>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-glow text-xs font-extrabold py-2.5 px-5 flex items-center gap-1.5 cursor-pointer"
                      >
                        View Position & Apply <ArrowUpRight className="h-4 w-4" />
                      </motion.button>
                    </Link>
                  }
                />
              </MotionItem>
            ))}
          </MotionGrid>

          {/* High-Tech Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-8">
              <button
                disabled={page === 0}
                onClick={() => fetchJobs(filters, page - 1)}
                className="btn-secondary text-xs font-bold px-5 py-2.5 disabled:opacity-40"
              >
                Previous Page
              </button>
              <span className="text-xs font-mono font-bold text-slate-400 bg-slate-900 border border-white/10 px-4 py-2 rounded-xl">
                Page <strong className="text-indigo-400">{page + 1}</strong> of {totalPages}
              </span>
              <button
                disabled={page + 1 >= totalPages}
                onClick={() => fetchJobs(filters, page + 1)}
                className="btn-secondary text-xs font-bold px-5 py-2.5 disabled:opacity-40"
              >
                Next Page
              </button>
            </div>
          )}
        </div>
      )}
    </MotionPage>
  )
}

