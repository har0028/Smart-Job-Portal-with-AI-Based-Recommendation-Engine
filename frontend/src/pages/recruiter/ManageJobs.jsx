import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, Edit2, Trash2, Users, PlusCircle } from 'lucide-react'
import { jobApi } from '../../api/jobApi'
import Badge from '../../components/common/Badge'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import EmptyState from '../../components/common/EmptyState'
import { PageSpinner } from '../../components/common/Spinner'
import { formatDate } from '../../utils/dateUtils'
import toast from 'react-hot-toast'

export default function ManageJobs() {
  const [jobs, setJobs]       = useState([])
  const [loading, setLoading] = useState(true)
  const [confirm, setConfirm] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = () =>
    jobApi.getMyJobs()
      .then(r => setJobs(r.data.data || []))
      .catch(() => toast.error('Failed to load jobs'))
      .finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await jobApi.deleteJob(confirm.id)
      setJobs(prev => prev.filter(j => j.id !== confirm.id))
      toast.success('Job deleted')
    } catch { toast.error('Delete failed') }
    finally { setDeleting(false); setConfirm(null) }
  }

  if (loading) return <PageSpinner />

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Jobs</h1>
          <p className="text-sm text-gray-500">{jobs.length} job postings</p>
        </div>
        <Link to="/recruiter/jobs/create" className="btn-primary flex items-center gap-2 text-sm">
          <PlusCircle className="h-4 w-4" /> Post New Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No jobs posted yet"
          description="Create your first job posting to start receiving applications."
          action={
            <Link to="/recruiter/jobs/create" className="btn-primary flex items-center gap-2 text-sm">
              <PlusCircle className="h-4 w-4" /> Post a Job
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {jobs.map(j => (
            <div key={j.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-gray-900">{j.title}</h3>
                    <Badge status={j.status} />
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {j.location || 'Remote'} · {j.jobType?.replace('_', ' ')} · {j.salaryRange || 'Negotiable'}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                    <span>Posted {formatDate(j.postedAt)}</span>
                    <span>{j.applicationCount ?? 0} applications</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link to={`/recruiter/jobs/${j.id}/applicants`}
                    className="btn-secondary text-sm flex items-center gap-1.5">
                    <Users className="h-4 w-4" /> Applicants
                  </Link>
                  <Link to={`/recruiter/jobs/${j.id}/edit`}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600">
                    <Edit2 className="h-4 w-4" />
                  </Link>
                  <button onClick={() => setConfirm(j)}
                    className="p-2 rounded-lg border border-red-200 hover:bg-red-50 text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Job"
        message={`Delete "${confirm?.title}"? All applications will be removed.`}
        confirmLabel="Delete"
        danger
      />
    </div>
  )
}
