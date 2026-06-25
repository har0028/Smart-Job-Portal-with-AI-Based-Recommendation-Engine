import { useEffect, useState } from 'react'
import { Briefcase, Search, Trash2 } from 'lucide-react'
import { adminApi } from '../../api/adminApi'
import Badge from '../../components/common/Badge'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import EmptyState from '../../components/common/EmptyState'
import { PageSpinner } from '../../components/common/Spinner'
import { formatDate } from '../../utils/dateUtils'
import toast from 'react-hot-toast'

export default function AdminJobs() {
  const [jobs, setJobs]       = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch]   = useState('')
  const [loading, setLoading] = useState(true)
  const [confirm, setConfirm] = useState(null)
  const [acting, setActing]   = useState(false)

  useEffect(() => {
    adminApi.getAllJobs()
      .then(r => { setJobs(r.data.data); setFiltered(r.data.data) })
      .catch(() => toast.error('Failed to load jobs'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(jobs.filter(j =>
      j.title.toLowerCase().includes(q) || j.companyName?.toLowerCase().includes(q)
    ))
  }, [search, jobs])

  const handleDelete = async () => {
    setActing(true)
    try {
      await adminApi.deleteJob(confirm.id)
      setJobs(prev => prev.filter(j => j.id !== confirm.id))
      toast.success('Job removed')
    } catch { toast.error('Delete failed') }
    finally { setActing(false); setConfirm(null) }
  }

  if (loading) return <PageSpinner />

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Jobs</h1>
          <p className="text-sm text-gray-500">{jobs.length} jobs on platform</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input className="input-field pl-9" placeholder="Search jobs…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {filtered.length === 0 ? <EmptyState icon={Briefcase} title="No jobs found" /> : (
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Title', 'Company', 'Location', 'Type', 'Status', 'Posted', 'Apps', ''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(j => (
                  <tr key={j.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900 max-w-[180px] truncate">{j.title}</td>
                    <td className="px-4 py-3 text-gray-500">{j.companyName}</td>
                    <td className="px-4 py-3 text-gray-500">{j.location || '—'}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{j.jobType?.replace('_', ' ')}</td>
                    <td className="px-4 py-3"><Badge status={j.status} /></td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{formatDate(j.postedAt)}</td>
                    <td className="px-4 py-3 text-gray-500">{j.applicationCount ?? 0}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => setConfirm(j)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={handleDelete}
        loading={acting}
        title="Delete Job"
        message={`Remove "${confirm?.title}"? All applications will also be deleted.`}
        confirmLabel="Delete"
        danger
      />
    </div>
  )
}
