import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Search, MapPin, SlidersHorizontal, X } from 'lucide-react'
import { jobApi } from '../../api/jobApi'
import JobCard from '../../components/common/JobCard'
import EmptyState from '../../components/common/EmptyState'
import { PageSpinner } from '../../components/common/Spinner'
import { JOB_TYPES } from '../../utils/constants'
import toast from 'react-hot-toast'

export default function JobSearch() {
  const [jobs, setJobs]         = useState([])
  const [loading, setLoading]   = useState(false)
  const [filters, setFilters]   = useState({ keyword: '', location: '', jobType: '' })
  const [page, setPage]         = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [showFilters, setShowFilters] = useState(false)

  const fetchJobs = useCallback(async (params, pageNum = 0) => {
    setLoading(true)
    try {
      const res = await jobApi.searchJobs({
        keyword:  params.keyword  || undefined,
        location: params.location || undefined,
        jobType:  params.jobType  || undefined,
        page: pageNum,
        size: 10,
      })
      const data = res.data.data
      setJobs(data.content || [])
      setTotalPages(data.totalPages || 0)
      setPage(pageNum)
    } catch {
      toast.error('Failed to search jobs')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchJobs(filters, 0)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchJobs(filters, 0)
  }

  const clearFilter = (key) => {
    const next = { ...filters, [key]: '' }
    setFilters(next)
    fetchJobs(next, 0)
  }

  const activeFilters = Object.entries(filters).filter(([, v]) => v)

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Search Jobs</h1>
        <p className="text-sm text-gray-500 mt-1">Browse active job openings</p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              className="input-field pl-9"
              placeholder="Job title, company, or keyword..."
              value={filters.keyword}
              onChange={e => setFilters({ ...filters, keyword: e.target.value })}
            />
          </div>
          <div className="relative sm:w-48">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              className="input-field pl-9"
              placeholder="Location"
              value={filters.location}
              onChange={e => setFilters({ ...filters, location: e.target.value })}
            />
          </div>
          <button type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center gap-2 sm:w-auto">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>
          <button type="submit" className="btn-primary flex items-center gap-2">
            <Search className="h-4 w-4" /> Search
          </button>
        </div>

        {showFilters && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-3 flex-wrap">
              <label className="text-sm font-medium text-gray-700">Job Type:</label>
              <div className="flex flex-wrap gap-2">
                {JOB_TYPES.map(t => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setFilters({ ...filters, jobType: filters.jobType === t.value ? '' : t.value })}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      filters.jobType === t.value
                        ? 'bg-primary-100 border-primary-300 text-primary-700 font-medium'
                        : 'border-gray-200 text-gray-600 hover:border-primary-200'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeFilters.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {activeFilters.map(([key, val]) => (
              <span key={key} className="flex items-center gap-1 bg-primary-50 text-primary-700 text-xs px-2.5 py-1 rounded-full">
                {val}
                <button onClick={() => clearFilter(key)}><X className="h-3 w-3" /></button>
              </span>
            ))}
          </div>
        )}
      </form>

      {/* Results */}
      {loading ? (
        <PageSpinner />
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No jobs found"
          description="Try different keywords or remove some filters."
        />
      ) : (
        <>
          <p className="text-sm text-gray-500">{jobs.length} jobs found</p>
          <div className="space-y-3">
            {jobs.map(job => (
              <JobCard
                key={job.id}
                job={job}
                actions={
                  <Link to={`/seeker/jobs/${job.id}`} className="btn-primary text-sm">
                    View & Apply
                  </Link>
                }
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                disabled={page === 0}
                onClick={() => fetchJobs(filters, page - 1)}
                className="btn-secondary text-sm px-4 disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-sm text-gray-500">
                Page {page + 1} of {totalPages}
              </span>
              <button
                disabled={page + 1 >= totalPages}
                onClick={() => fetchJobs(filters, page + 1)}
                className="btn-secondary text-sm px-4 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
