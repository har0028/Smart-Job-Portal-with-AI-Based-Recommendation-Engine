import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bookmark, ArrowUpRight, Trash2 } from 'lucide-react'
import { seekerApi } from '../../api/seekerApi'
import JobCard from '../../components/common/JobCard'
import EmptyState from '../../components/common/EmptyState'
import { PageSpinner } from '../../components/common/Spinner'
import { MotionPage, MotionGrid, MotionItem } from '../../components/common/MotionContainer'
import toast from 'react-hot-toast'

export default function SavedJobs() {
  const [jobs, setJobs]         = useState([])
  const [loading, setLoading]   = useState(true)
  const [removing, setRemoving] = useState(null)

  useEffect(() => {
    seekerApi.getSavedJobs()
      .then(r => setJobs(r.data.data || []))
      .catch(() => toast.error('Failed to load saved jobs'))
      .finally(() => setLoading(false))
  }, [])

  const handleUnsave = async (jobId) => {
    setRemoving(jobId)
    try {
      await seekerApi.unsaveJob(jobId)
      setJobs(prev => prev.filter(j => j.id !== jobId))
      toast.success('Job removed from saved list')
    } catch {
      toast.error('Failed to unsave job')
    } finally {
      setRemoving(null)
    }
  }

  if (loading) return <PageSpinner />

  return (
    <MotionPage className="space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold mb-2">
          <Bookmark className="h-3.5 w-3.5" />
          <span>Bookmarked Positions</span>
        </div>
        <h1 className="text-3xl font-display font-extrabold text-white tracking-tight">Saved Jobs</h1>
        <p className="text-slate-400 text-sm mt-1">Review and apply to positions bookmarked for future reference.</p>
      </div>

      {jobs.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No saved positions"
          description="Bookmark positions while browsing to keep track of interesting opportunities."
          action={<Link to="/seeker/jobs" className="btn-primary text-xs">Browse Open Jobs</Link>}
        />
      ) : (
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {jobs.length} Saved Positions
          </p>
          <MotionGrid className="space-y-4">
            {jobs.map(job => (
              <MotionItem key={job.id}>
                <JobCard
                  job={job}
                  actions={
                    <>
                      <Link to={`/seeker/jobs/${job.id}`} className="btn-primary text-xs flex items-center gap-1">
                        View & Apply <ArrowUpRight className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleUnsave(job.id)}
                        disabled={removing === job.id}
                        className="btn-secondary text-xs flex items-center gap-1.5"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-slate-400" />
                        {removing === job.id ? 'Removing...' : 'Remove'}
                      </button>
                    </>
                  }
                />
              </MotionItem>
            ))}
          </MotionGrid>
        </div>
      )}
    </MotionPage>
  )
}
