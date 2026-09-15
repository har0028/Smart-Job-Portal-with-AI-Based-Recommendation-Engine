import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, Edit2, Trash2, Users, PlusCircle, Building2 } from 'lucide-react'
import { jobApi } from '../../api/jobApi'
import Badge from '../../components/common/Badge'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import EmptyState from '../../components/common/EmptyState'
import { PageSpinner } from '../../components/common/Spinner'
import { formatDate } from '../../utils/dateUtils'
import { MotionPage, MotionGrid, MotionItem } from '../../components/common/MotionContainer'
import toast from 'react-hot-toast'
import PaymentModal from '../../components/common/PaymentModal'

export default function ManageJobs() {
  const [jobs, setJobs]       = useState([])
  const [loading, setLoading] = useState(true)
  const [confirm, setConfirm] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [selectedJobForFeature, setSelectedJobForFeature] = useState(null)

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
      toast.success('Job deleted successfully')
    } catch { toast.error('Delete failed') }
    finally { setDeleting(false); setConfirm(null) }
  }

  if (loading) return <PageSpinner />

  return (
    <MotionPage className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold mb-2">
            <Building2 className="h-3.5 w-3.5" />
            <span>Position Listings</span>
          </div>
          <h1 className="text-3xl font-display font-extrabold text-white tracking-tight">Manage Job Openings</h1>
          <p className="text-slate-400 text-sm mt-1">{jobs.length} active and closed positions</p>
        </div>
        <Link to="/recruiter/jobs/create" className="btn-primary flex items-center gap-2 text-xs py-2.5 px-5">
          <PlusCircle className="h-4 w-4" /> Post a New Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No jobs created yet"
          description="Create your first job posting to start matching with candidate profiles."
          action={
            <Link to="/recruiter/jobs/create" className="btn-primary flex items-center gap-2 text-xs">
              <PlusCircle className="h-4 w-4" /> Post a Job
            </Link>
          }
        />
      ) : (
        <MotionGrid className="space-y-4">
          {jobs.map(j => (
            <MotionItem key={j.id}>
              <div className="glass-card p-6 border border-white/10 hover:border-brand-500/30">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <h3 className="font-bold text-white text-lg">{j.title}</h3>
                      <Badge status={j.status} />
                      {j.isFeatured ? (
                        <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-gradient-to-r from-amber-500/20 to-purple-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 shadow-glow-sm">
                          🔥 FEATURED
                        </span>
                      ) : (
                        <button
                          onClick={() => setSelectedJobForFeature(j)}
                          className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 flex items-center gap-1 transition-all cursor-pointer"
                        >
                          ⚡ Feature Job (₹499)
                        </button>
                      )}
                    </div>
                    <p className="text-xs font-medium text-slate-400">
                      {j.location || 'Remote'} · {j.jobType?.replace('_', ' ')} · {j.salaryRange || 'Negotiable'}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                      <span>Posted {formatDate(j.postedAt)}</span>
                      <span className="font-semibold text-cyan-300 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                        {j.applicationCount ?? 0} Candidate Submissions
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link to={`/recruiter/jobs/${j.id}/applicants`} className="btn-primary text-xs flex items-center gap-1.5 py-2 px-3.5">
                      <Users className="h-4 w-4" /> View Applicants
                    </Link>
                    <Link to={`/recruiter/jobs/${j.id}/edit`} className="p-2.5 rounded-xl bg-slate-900/60 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white transition-colors">
                      <Edit2 className="h-4 w-4" />
                    </Link>
                    <button onClick={() => setConfirm(j)} className="p-2.5 rounded-xl bg-slate-900/60 border border-white/10 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </MotionItem>
          ))}
        </MotionGrid>
      )}

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Job Listing"
        message={`Are you sure you want to delete "${confirm?.title}"? All applicant records for this position will be permanently removed.`}
        confirmLabel="Delete Listing"
        danger
      />

      <PaymentModal
        isOpen={!!selectedJobForFeature}
        onClose={() => setSelectedJobForFeature(null)}
        onSuccess={() => {
          setSelectedJobForFeature(null)
          load()
        }}
        planDetails={
          selectedJobForFeature
            ? {
                title: `Featured Job Boost - ${selectedJobForFeature.title}`,
                amount: 499,
                paymentType: 'JOB_FEATURE',
                relatedJobId: selectedJobForFeature.id,
              }
            : null
        }
      />
    </MotionPage>
  )
}
