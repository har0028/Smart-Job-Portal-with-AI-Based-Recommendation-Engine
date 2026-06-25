import { useEffect, useState } from 'react'
import { Building2, Globe, Search } from 'lucide-react'
import { adminApi } from '../../api/adminApi'
import EmptyState from '../../components/common/EmptyState'
import { PageSpinner } from '../../components/common/Spinner'
import toast from 'react-hot-toast'

export default function AdminRecruiters() {
  const [recruiters, setRecruiters] = useState([])
  const [filtered, setFiltered]     = useState([])
  const [search, setSearch]         = useState('')
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    adminApi.getAllRecruiters()
      .then(r => { setRecruiters(r.data.data); setFiltered(r.data.data) })
      .catch(() => toast.error('Failed to load recruiters'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(recruiters.filter(r =>
      r.fullName.toLowerCase().includes(q) ||
      r.companyName.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q)
    ))
  }, [search, recruiters])

  if (loading) return <PageSpinner />

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recruiters</h1>
          <p className="text-sm text-gray-500">{recruiters.length} registered recruiters</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input className="input-field pl-9" placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Building2} title="No recruiters found" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(r => (
            <div key={r.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{r.companyName}</p>
                  <p className="text-sm text-gray-500 truncate">{r.fullName} · {r.designation || 'HR'}</p>
                  <p className="text-xs text-gray-400 truncate">{r.email}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-500">{r.totalJobs ?? 0} jobs posted</span>
                {r.companyWebsite && (
                  <a href={r.companyWebsite} target="_blank" rel="noreferrer"
                    className="text-xs text-primary-600 flex items-center gap-1 hover:underline">
                    <Globe className="h-3 w-3" /> Website
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
