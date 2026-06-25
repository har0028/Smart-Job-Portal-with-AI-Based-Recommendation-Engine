import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Users, ArrowLeft, ChevronDown } from 'lucide-react'
import { jobApi } from '../../api/jobApi'
import Badge from '../../components/common/Badge'
import EmptyState from '../../components/common/EmptyState'
import { PageSpinner } from '../../components/common/Spinner'
import { formatDate } from '../../utils/dateUtils'
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
      toast.success('Status updated')
    } catch { toast.error('Update failed') }
    finally { setUpdating(null) }
  }

  if (loading) return <PageSpinner />

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link to="/recruiter/jobs" className="p-2 rounded-lg hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Applicants</h1>
          <p className="text-sm text-gray-500">{jobTitle} · {applicants.length} applications</p>
        </div>
      </div>

      {applicants.length === 0 ? (
        <EmptyState icon={Users} title="No applications yet" description="Share your job to attract candidates." />
      ) : (
        <div className="space-y-3">
          {applicants.map(app => (
            <div key={app.id} className="card">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-gray-900">{app.seekerName}</p>
                    <Badge status={app.status} />
                    <span className="text-xs text-gray-400">Match: {app.matchScore?.toFixed(1)}%</span>
                  </div>
                  <p className="text-sm text-gray-500">{app.seekerEmail}</p>
                  <p className="text-xs text-gray-400 mt-1">Applied {formatDate(app.appliedAt)}</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <select
                      disabled={updating === app.id}
                      value={app.status}
                      onChange={e => handleStatusChange(app.id, e.target.value)}
                      className="input-field text-sm pr-8 py-1.5 appearance-none"
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                  </div>
                  <button
                    onClick={() => setExpanded(expanded === app.id ? null : app.id)}
                    className="btn-secondary text-sm py-1.5"
                  >
                    {expanded === app.id ? 'Hide' : 'Cover Letter'}
                  </button>
                </div>
              </div>

              {expanded === app.id && app.coverLetter && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Cover Letter</p>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{app.coverLetter}</p>
                </div>
              )}
              {expanded === app.id && !app.coverLetter && (
                <p className="text-sm text-gray-400 mt-3 pt-3 border-t border-gray-100">No cover letter provided.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
