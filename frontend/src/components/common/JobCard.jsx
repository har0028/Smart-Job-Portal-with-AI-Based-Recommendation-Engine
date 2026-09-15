import { Link } from 'react-router-dom'
import { MapPin, Clock, DollarSign, Briefcase, Building2, Sparkles, ArrowUpRight, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import Badge from './Badge'
import CompanyLogo from './CompanyLogo'
import { timeAgo } from '../../utils/dateUtils'

export default function JobCard({ job, actions, matchScore }) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.005 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="glass-card-vfx p-6 border border-white/15 hover:border-indigo-500/40 shadow-xl group flex flex-col justify-between cursor-pointer"
    >
      <div>
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3.5">
            <CompanyLogo name={job.companyName} className="h-12 w-12 rounded-2xl bg-slate-950 border border-white/15 p-2 shadow-lg group-hover:border-indigo-500/50 group-hover:scale-105 transition-all" />
            <div>
              <h3 className="text-lg font-black text-white group-hover:text-cyan-300 transition-colors flex items-center gap-2">
                {job.title}
              </h3>
              <p className="text-xs font-extrabold text-indigo-400 mt-0.5 flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-indigo-400" />
                {job.companyName}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <Badge status={job.status} />
            {matchScore !== undefined && (
              <div className="flex items-center gap-1 text-xs font-mono font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 rounded-full backdrop-blur-md shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                <Sparkles className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                {matchScore}% Match
              </div>
            )}
          </div>
        </div>

        {job.description && (
          <p className="text-xs text-slate-300 line-clamp-2 my-3.5 leading-relaxed font-medium">
            {job.description}
          </p>
        )}

        <div className="flex flex-wrap gap-x-4 gap-y-2 my-3.5 text-xs text-slate-300 border-y border-white/10 py-3">
          {job.location && (
            <span className="flex items-center gap-1.5 font-bold text-slate-200">
              <MapPin className="h-3.5 w-3.5 text-indigo-400" />
              {job.location}
            </span>
          )}
          {job.jobType && (
            <span className="flex items-center gap-1.5 font-bold text-slate-200">
              <Briefcase className="h-3.5 w-3.5 text-cyan-400" />
              {job.jobType.replace('_', ' ')}
            </span>
          )}
          {job.salaryRange && (
            <span className="flex items-center gap-1.5 font-extrabold text-emerald-300 bg-emerald-500/15 px-3 py-0.5 rounded-full border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
              <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
              {job.salaryRange}
            </span>
          )}
          {job.postedAt && (
            <span className="flex items-center gap-1.5 text-slate-400 font-medium ml-auto">
              <Clock className="h-3.5 w-3.5" />
              {timeAgo(job.postedAt)}
            </span>
          )}
        </div>

        {job.requiredSkills?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3.5">
            {job.requiredSkills.slice(0, 5).map(s => (
              <span key={s.id || s.name} className="bg-indigo-500/10 text-indigo-200 border border-indigo-500/25 text-[11px] font-bold px-2.5 py-1 rounded-xl backdrop-blur-sm">
                {s.name}
              </span>
            ))}
            {job.requiredSkills.length > 5 && (
              <span className="text-xs text-slate-400 self-center font-bold">+{job.requiredSkills.length - 5} more</span>
            )}
          </div>
        )}
      </div>

      {actions && (
        <div className="flex flex-wrap items-center justify-end gap-2 mt-5 pt-3.5 border-t border-white/10">
          {actions}
        </div>
      )}
    </motion.div>
  )
}

