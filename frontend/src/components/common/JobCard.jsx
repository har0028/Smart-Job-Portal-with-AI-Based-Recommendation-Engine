import { Link } from 'react-router-dom'
import { MapPin, Clock, DollarSign, Briefcase } from 'lucide-react'
import Badge from './Badge'
import { timeAgo } from '../../utils/dateUtils'

export default function JobCard({ job, actions }) {
  return (
    <div className="card hover:shadow-md transition-shadow animate-fade-in">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <h3 className="text-base font-semibold text-gray-900 truncate">{job.title}</h3>
            <Badge status={job.status} />
          </div>
          <p className="text-sm text-primary-600 font-medium mt-0.5">{job.companyName}</p>

          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
            {job.location && (
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.location}</span>
            )}
            {job.jobType && (
              <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" />{job.jobType.replace('_', ' ')}</span>
            )}
            {job.salaryRange && (
              <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" />{job.salaryRange}</span>
            )}
            {job.postedAt && (
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{timeAgo(job.postedAt)}</span>
            )}
          </div>

          {job.requiredSkills?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {job.requiredSkills.slice(0, 5).map(s => (
                <span key={s.id} className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">{s.name}</span>
              ))}
              {job.requiredSkills.length > 5 && (
                <span className="text-xs text-gray-400">+{job.requiredSkills.length - 5} more</span>
              )}
            </div>
          )}
        </div>
      </div>

      {actions && <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">{actions}</div>}
    </div>
  )
}
