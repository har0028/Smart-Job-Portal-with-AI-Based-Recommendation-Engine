import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bookmark } from 'lucide-react'
import { seekerApi } from '../../api/seekerApi'
import JobCard from '../../components/common/JobCard'
import EmptyState from '../../components/common/EmptyState'
import { PageSpinner } from '../../components/common/Spinner'
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
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Saved Jobs</h1>
        <p className="text-sm text-gray-500 mt-1">{jobs.length} saved jobs</p>
      </div>

      {jobs.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No saved jobs yet"
          description="Save jobs you're interested in to apply later."
          action={<Link to="/seeker/jobs" className="btn-primary text-sm">Browse Jobs</Link>}
        />
      ) : (
        <div className="space-y-3">
          {jobs.map(job => (
            <JobCard
              key={job.id}
              job={job}
              actions={
                <>
                  <Link to={`/seeker/jobs/${job.id}`} className="btn-primary text-sm">
                    View & Apply
                  </Link>
                  <button
                    onClick={() => handleUnsave(job.id)}
                    disabled={removing === job.id}
                    className="btn-secondary text-sm"
                  >
                    {removing === job.id ? 'Removing...' : 'Remove'}
                  </button>
                </>
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}
