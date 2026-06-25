import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, MapPin, Briefcase, DollarSign, Clock, Bookmark, BookmarkCheck, Send } from 'lucide-react'
import { jobApi } from '../../api/jobApi'
import { seekerApi } from '../../api/seekerApi'
import Badge from '../../components/common/Badge'
import Modal from '../../components/common/Modal'
import { PageSpinner } from '../../components/common/Spinner'
import { formatDate, timeAgo } from '../../utils/dateUtils'
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
    }).catch(() => toast.error('Failed to load job'))
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
        toast.success('Job saved!')
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
      toast.success('Application submitted!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Application failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <PageSpinner />
  if (!job)    return <div className="text-center py-20 text-gray-400">Job not found</div>

  const matchPct = scoreData?.matchPercentage
  const matchColor = matchPct >= 75 ? 'text-green-600' : matchPct >= 50 ? 'text-yellow-600' : 'text-red-500'

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link to="/seeker/jobs" className="p-2 rounded-lg hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <p className="text-sm text-gray-500">Back to search</p>
      </div>

      {/* Header */}
      <div className="card">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-gray-900">{job.title}</h1>
              <Badge status={job.status} />
            </div>
            <p className="text-primary-600 font-medium mt-1">{job.companyName}</p>

            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
              {job.location && <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{job.location}</span>}
              {job.jobType  && <span className="flex items-center gap-1"><Briefcase className="h-4 w-4" />{job.jobType.replace('_', ' ')}</span>}
              {job.salaryRange && <span className="flex items-center gap-1"><DollarSign className="h-4 w-4" />{job.salaryRange}</span>}
              {job.postedAt && <span className="flex items-center gap-1"><Clock className="h-4 w-4" />Posted {timeAgo(job.postedAt)}</span>}
            </div>

            {matchPct !== undefined && (
              <div className="mt-3 inline-flex items-center gap-2 bg-gray-50 rounded-full px-3 py-1">
                <div className={`text-sm font-bold ${matchColor}`}>{matchPct.toFixed(0)}% match</div>
                <div className="h-1.5 w-24 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${matchPct >= 75 ? 'bg-green-500' : matchPct >= 50 ? 'bg-yellow-400' : 'bg-red-400'}`}
                    style={{ width: `${matchPct}%` }} />
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button onClick={handleSaveToggle} className="btn-secondary flex items-center gap-2 text-sm">
              {saved ? <BookmarkCheck className="h-4 w-4 text-primary-600" /> : <Bookmark className="h-4 w-4" />}
              {saved ? 'Saved' : 'Save'}
            </button>
            {applied ? (
              <span className="btn-secondary text-sm text-green-600 border-green-300 cursor-default">Applied</span>
            ) : (
              <button
                onClick={() => setApplyModal(true)}
                disabled={job.status !== 'ACTIVE'}
                className="btn-primary flex items-center gap-2 text-sm"
              >
                <Send className="h-4 w-4" /> Apply Now
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="card">
        <h2 className="text-base font-semibold text-gray-900 mb-3">Job Description</h2>
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{job.description}</p>
      </div>

      {/* Skills */}
      {(job.requiredSkills?.length > 0 || job.optionalSkills?.length > 0) && (
        <div className="card">
          <h2 className="text-base font-semibold text-gray-900 mb-3">Skills</h2>
          {job.requiredSkills?.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Required</p>
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills.map(s => {
                  const matched = scoreData?.matchedSkills?.includes(s.name)
                  return (
                    <span key={s.id}
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        matched ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-gray-100 text-gray-700'
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
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Good to Have</p>
              <div className="flex flex-wrap gap-2">
                {job.optionalSkills.map(s => (
                  <span key={s.id} className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full">{s.name}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* AI match details */}
      {scoreData && (scoreData.missingSkills?.length > 0) && (
        <div className="card border-l-4 border-yellow-400 bg-yellow-50">
          <p className="text-sm font-semibold text-yellow-800 mb-1">Skills to develop</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {scoreData.missingSkills.map(s => (
              <span key={s} className="bg-yellow-100 text-yellow-800 text-xs px-2.5 py-1 rounded-full">{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* Apply modal */}
      <Modal open={applyModal} onClose={() => setApplyModal(false)} title={`Apply for ${job.title}`}>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            You're applying to <strong>{job.companyName}</strong>. Add an optional cover letter to stand out.
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter (optional)</label>
            <textarea
              rows={6}
              className="input-field resize-none"
              placeholder="Introduce yourself and explain why you're a great fit..."
              value={coverLetter}
              onChange={e => setCoverLetter(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setApplyModal(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleApply} disabled={submitting} className="btn-primary flex items-center gap-2">
              <Send className="h-4 w-4" />
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
