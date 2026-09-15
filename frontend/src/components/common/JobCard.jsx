import { Link } from 'react-router-dom'
import { MapPin, Clock, DollarSign, Briefcase, Building2, Sparkles, ArrowUpRight, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import Badge from './Badge'
import CompanyLogo from './CompanyLogo'
import { timeAgo } from '../../utils/dateUtils'

export default function JobCard({ job, actions, matchScore }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="saas-card p-5 sm:p-6 border border-white/[0.08] hover:border-indigo-500/35 hover:shadow-2xl hover:shadow-indigo-500/10 group flex flex-col justify-between"
    >
      <div>
        {/* Header: Company Logo, Title & Status/Match Badge */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3 min-w-0">
            <CompanyLogo 
              name={job.companyName} 
              className="h-11 w-11 shrink-0 rounded-xl bg-[#07090e] border border-white/10 p-2 shadow-md group-hover:border-indigo-500/40 transition-colors" 
            />
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                {job.title}
              </h3>
              <p className="text-xs font-medium text-slate-400 mt-0.5 flex items-center gap-1.5 truncate">
                <Building2 className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                <span className="truncate">{job.companyName}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <Badge status={job.status} />
            {matchScore !== undefined && (
              <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-md">
                <Sparkles className="h-3 w-3 text-emerald-400 animate-pulse" />
                {matchScore}% Match
              </div>
            )}
          </div>
        </div>

        {/* Short Description */}
        {job.description && (
          <p className="text-xs text-slate-300 line-clamp-2 my-3 leading-relaxed font-normal">
            {job.description}
          </p>
        )}

        {/* Key Attributes Meta Grid */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 my-3 text-xs text-slate-300 border-y border-white/[0.06] py-2.5">
          {job.location && (
            <span className="flex items-center gap-1 font-medium text-slate-300">
              <MapPin className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
              <span>{job.location}</span>
            </span>
          )}
          {job.jobType && (
            <span className="flex items-center gap-1 font-medium text-slate-300">
              <Briefcase className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
              <span>{job.jobType.replace('_', ' ')}</span>
            </span>
          )}
          {job.salaryRange && (
            <span className="flex items-center gap-1 font-semibold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <DollarSign className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>{job.salaryRange}</span>
            </span>
          )}
          {job.postedAt && (
            <span className="flex items-center gap-1 text-slate-400 text-[11px] font-normal ml-auto">
              <Clock className="h-3 w-3 shrink-0" />
              <span>{timeAgo(job.postedAt)}</span>
            </span>
          )}
        </div>

        {/* Skill Tags */}
        {job.requiredSkills?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {job.requiredSkills.slice(0, 4).map(s => (
              <span key={s.id || s.name} className="bg-white/[0.04] text-slate-300 border border-white/[0.08] text-[11px] font-medium px-2 py-0.5 rounded">
                {s.name}
              </span>
            ))}
            {job.requiredSkills.length > 4 && (
              <span className="text-[11px] text-slate-400 font-medium self-center">+{job.requiredSkills.length - 4} more</span>
            )}
          </div>
        )}
      </div>

      {/* Action CTA */}
      {actions && (
        <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-end">
          {actions}
        </div>
      )}
    </motion.div>
  )
}
