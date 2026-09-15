import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, MapPin, Briefcase, DollarSign, Clock, Bookmark, BookmarkCheck, Send, Sparkles, Building2, CheckCircle2, AlertCircle } from 'lucide-react'
import { jobApi } from '../../api/jobApi'
import { seekerApi } from '../../api/seekerApi'
import Badge from '../../components/common/Badge'
import Modal from '../../components/common/Modal'
import { PageSpinner } from '../../components/common/Spinner'
import { MotionPage } from '../../components/common/MotionContainer'
import { timeAgo } from '../../utils/dateUtils'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

export default function JobDetail() {
  const { id } = useParams()
  const [job, setJob]             = useState(null)
  const [loading, setLoading]     = useState(true)
  const [saved, setSaved]         = useState(false)
  const [applied, setApplied]     = useState(false)
  const [applyModal, setApplyModal] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [submitting, setSubmitting]   = useState(false)
  const [scoreData, setScoreData]     = useState(null)

  useEffect(() => {
    Promise.all([
      jobApi.getJobById(id),
      seekerApi.getScoreForJob(id).catch(() => null),
      seekerApi.getMyApplications().catch(() => ({ data: { data: [] } })),
      seekerApi.getSavedJobs().catch(() => ({ data: { data: [] } })),
    ]).then(([jobRes, scoreRes, appsRes, savedRes]) => {
      setJob(jobRes.data.data)
      if (scoreRes) setScoreData(scoreRes.data.data)
      const apps  = appsRes.data.data || []
      const saves = savedRes.data.data || []
      setApplied(apps.some(a => a.jobId === Number(id)))
      setSaved(saves.some(s => s.id === Number(id)))
    }).catch(() => toast.error('Failed to load job details'))
      .finally(() => setLoading(false))
  }, [id])

  const handleSaveToggle = async () => {
    try {
      if (saved) {
        await seekerApi.unsaveJob(id)
        setSaved(false)
        toast.success('Removed from saved jobs')
      } else {
        await seekerApi.saveJob(id)
        setSaved(true)
        toast.success('Position bookmarked!')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed')
    }
  }

  const handleApply = async () => {
    setSubmitting(true)
    try {
      await seekerApi.applyForJob(id, { coverLetter })
      setApplied(true)
      setApplyModal(false)
      toast.success('Application submitted successfully!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Application failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <PageSpinner />
  if (!job)    return <div className="text-center py-20 text-slate-400">Position not found</div>

  const matchPct = scoreData?.matchPercentage
  const matchColor = matchPct >= 75 ? 'text-emerald-400' : matchPct >= 50 ? 'text-cyan-400' : 'text-rose-400'
  const matchBg = matchPct >= 75 ? 'bg-emerald-500' : matchPct >= 50 ? 'bg-cyan-500' : 'bg-rose-500'

  return (
    <MotionPage className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/seeker/jobs" className="p-2.5 rounded-xl bg-slate-900/60 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white transition-all">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <span className="text-xs font-semibold text-slate-400">Back to search feed</span>
      </div>

      {/* Main Header Glass Card */}
      <div className="glass-panel p-8 border border-white/15 relative overflow-hidden">
        <div className="ambient-glow w-64 h-64 bg-brand-500/15 -top-10 -right-10 pointer-events-none" />

        <div className="flex items-start justify-between gap-6 flex-wrap relative z-10">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">{job.title}</h1>
              <Badge status={job.status} />
            </div>
            <p className="text-base font-semibold text-brand-300 flex items-center gap-1.5 mb-4">
              <Building2 className="h-4 w-4 text-brand-400" />
              {job.companyName}
            </p>

            <div className="flex flex-wrap gap-4 text-xs text-slate-300 border-y border-white/10 py-3">
              {job.location && (
                <span className="flex items-center gap-1.5 font-medium">
                  <MapPin className="h-4 w-4 text-slate-400" />{job.location}
                </span>
              )}
              {job.jobType && (
                <span className="flex items-center gap-1.5 font-medium">
                  <Briefcase className="h-4 w-4 text-slate-400" />{job.jobType.replace('_', ' ')}
                </span>
              )}
              {job.salaryRange && (
                <span className="flex items-center gap-1.5 font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                  <DollarSign className="h-4 w-4" />{job.salaryRange}
                </span>
              )}
              {job.postedAt && (
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Clock className="h-4 w-4" />Posted {timeAgo(job.postedAt)}
                </span>
              )}
            </div>

            {/* AI Vector Match Gauge */}
            {matchPct !== undefined && (
              <div className="mt-4 inline-flex items-center gap-3 bg-slate-950/60 border border-white/10 px-4 py-2 rounded-2xl backdrop-blur-md">
                <Sparkles className="h-4 w-4 text-brand-400 animate-pulse" />
                <span className={`text-xs font-bold ${matchColor}`}>{matchPct.toFixed(0)}% Vector Match</span>
                <div className="h-2 w-28 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${matchPct}%` }}
                    transition={{ duration: 0.6 }}
                    className={`h-full rounded-full ${matchBg}`} 
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap gap-3 shrink-0">
            <button onClick={handleSaveToggle} className="btn-secondary text-xs flex items-center gap-2 py-2.5 px-4">
              {saved ? <BookmarkCheck className="h-4 w-4 text-brand-400" /> : <Bookmark className="h-4 w-4 text-slate-400" />}
              {saved ? 'Bookmarked' : 'Bookmark'}
            </button>

            {applied ? (
              <div className="btn-secondary text-xs text-emerald-400 border-emerald-500/30 bg-emerald-500/10 cursor-default flex items-center gap-2 py-2.5 px-4 font-bold">
                <CheckCircle2 className="h-4 w-4" /> Application Submitted
              </div>
            ) : (
              <button
                onClick={() => setApplyModal(true)}
                disabled={job.status !== 'ACTIVE'}
                className="btn-primary text-xs flex items-center gap-2 py-2.5 px-5"
              >
                <Send className="h-4 w-4" /> Apply Position
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="glass-card p-6 border border-white/10">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">Position Overview</h2>
        <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-line font-sans">
          {job.description}
        </div>
      </div>

      {/* Required & Optional Skills */}
      {(job.requiredSkills?.length > 0 || job.optionalSkills?.length > 0) && (
        <div className="glass-card p-6 border border-white/10 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Skill Vectors</h2>
          
          {job.requiredSkills?.length > 0 && (
            <div>
              <span className="text-xs font-bold text-slate-300 block mb-2">Required Skills</span>
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills.map(s => {
                  const matched = scoreData?.matchedSkills?.includes(s.name)
                  return (
                    <span key={s.id}
                      className={`text-xs px-3 py-1 rounded-xl font-semibold border ${
                        matched 
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-glow-sm' 
                          : 'bg-slate-900/60 border-white/10 text-slate-300'
                      }`}>
                      {matched && '✓ '}{s.name}
                    </span>
                  )
                })}
              </div>
            </div>
          )}

          {job.optionalSkills?.length > 0 && (
            <div>
              <span className="text-xs font-bold text-slate-300 block mb-2">Bonus / Nice to Have</span>
              <div className="flex flex-wrap gap-2">
                {job.optionalSkills.map(s => (
                  <span key={s.id} className="bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs px-3 py-1 rounded-xl font-medium">
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Apply Modal */}
      <Modal open={applyModal} onClose={() => setApplyModal(false)} title={`Apply for ${job.title}`}>
        <div className="space-y-5">
          <p className="text-xs text-slate-300">
            Submit your application directly to <strong className="text-brand-300">{job.companyName}</strong>.
          </p>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">Cover Letter / Intro Note (Optional)</label>
            <textarea
              rows={5}
              className="glass-input resize-none"
              placeholder="Introduce your core skills and why you are excited for this opportunity..."
              value={coverLetter}
              onChange={e => setCoverLetter(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
            <button onClick={() => setApplyModal(false)} className="btn-secondary text-xs">Cancel</button>
            <button onClick={handleApply} disabled={submitting} className="btn-primary text-xs flex items-center gap-2">
              <Send className="h-4 w-4" />
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </div>
      </Modal>
    </MotionPage>
  )
}
