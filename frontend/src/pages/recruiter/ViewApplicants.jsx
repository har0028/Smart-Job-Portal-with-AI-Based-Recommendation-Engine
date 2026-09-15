import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Users, ArrowLeft, ChevronDown, Sparkles, Mail, Clock } from 'lucide-react'
import { jobApi } from '../../api/jobApi'
import Badge from '../../components/common/Badge'
import EmptyState from '../../components/common/EmptyState'
import { PageSpinner } from '../../components/common/Spinner'
import { formatDate } from '../../utils/dateUtils'
import { MotionPage, MotionGrid, MotionItem } from '../../components/common/MotionContainer'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

const STATUSES = ['PENDING', 'REVIEWING', 'SHORTLISTED', 'REJECTED', 'HIRED']

export default function ViewApplicants() {
  const { id } = useParams()
  const [applicants, setApplicants] = useState([])
  const [jobTitle, setJobTitle]     = useState('')
  const [loading, setLoading]       = useState(true)
  const [updating, setUpdating]     = useState(null)
  const [expanded, setExpanded]     = useState(null)

  useEffect(() => {
    Promise.all([
      jobApi.getApplicants(id),
      jobApi.getJobById(id),
    ]).then(([appRes, jobRes]) => {
      setApplicants(appRes.data.data || [])
      setJobTitle(jobRes.data.data?.title || '')
    }).catch(() => toast.error('Failed to load applicants'))
      .finally(() => setLoading(false))
  }, [id])

  const handleStatusChange = async (appId, status) => {
    setUpdating(appId)
    try {
      const res = await jobApi.updateApplicationStatus(appId, { status })
      setApplicants(prev => prev.map(a => a.id === appId ? { ...a, status: res.data.data.status } : a))
      toast.success('Applicant status updated!')
    } catch { toast.error('Update failed') }
    finally { setUpdating(null) }
  }

  if (loading) return <PageSpinner />

  return (
    <MotionPage className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/recruiter/jobs" className="p-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-slate-300 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-3xl font-display font-extrabold text-white tracking-tight">Candidate Submissions</h1>
          <p className="text-slate-400 text-sm mt-0.5">{jobTitle} · {applicants.length} total applicants</p>
        </div>
      </div>

      {applicants.length === 0 ? (
        <EmptyState icon={Users} title="No applicants yet" description="Candidates matching your required skill vector will appear here once they apply." />
      ) : (
        <MotionGrid className="space-y-4">
          {applicants.map(app => (
            <MotionItem key={app.id}>
              <div className="glass-card p-6 border border-white/10">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <h3 className="font-bold text-white text-lg">{app.seekerName}</h3>
                      <Badge status={app.status} />
                      {app.matchScore !== undefined && (
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          {app.matchScore?.toFixed(0)}% Vector Match
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-medium text-slate-400 flex items-center gap-1.5 mt-1">
                      <Mail className="h-3.5 w-3.5 text-brand-400" />
                      {app.seekerEmail}
                    </p>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      Submitted {formatDate(app.appliedAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <select
                        disabled={updating === app.id}
                        value={app.status}
                        onChange={e => handleStatusChange(app.id, e.target.value)}
                        className="glass-input bg-slate-900 text-xs pr-8 py-2 font-bold focus:border-brand-500"
                      >
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                    </div>

                    <button
                      onClick={() => setExpanded(expanded === app.id ? null : app.id)}
                      className="btn-secondary text-xs py-2 px-3.5"
                    >
                      {expanded === app.id ? 'Hide Note' : 'Cover Letter'}
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {expanded === app.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-white/10"
                    >
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-2">Candidate Cover Letter</span>
                      {app.coverLetter ? (
                        <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                          {app.coverLetter}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">No optional cover letter provided with this submission.</p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </MotionItem>
          ))}
        </MotionGrid>
      )}
    </MotionPage>
  )
}
