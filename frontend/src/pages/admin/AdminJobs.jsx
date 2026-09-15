import { useEffect, useState } from 'react'
import { Briefcase, Search, Trash2 } from 'lucide-react'
import { adminApi } from '../../api/adminApi'
import Badge from '../../components/common/Badge'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import EmptyState from '../../components/common/EmptyState'
import { PageSpinner } from '../../components/common/Spinner'
import { formatDate } from '../../utils/dateUtils'
import { MotionPage } from '../../components/common/MotionContainer'
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
      toast.success('Job listing removed')
    } catch { toast.error('Delete failed') }
    finally { setActing(false); setConfirm(null) }
  }

  if (loading) return <PageSpinner />

  return (
    <MotionPage className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-2">
            <Briefcase className="h-3.5 w-3.5" />
            <span>Listing Control & Moderation</span>
          </div>
          <h1 className="text-3xl font-display font-extrabold text-white tracking-tight">Platform Job Listings</h1>
          <p className="text-slate-400 text-sm mt-1">{jobs.length} total published and draft listings</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input className="glass-input pl-10" placeholder="Search by title or company..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {filtered.length === 0 ? <EmptyState icon={Briefcase} title="No matching jobs found" /> : (
        <div className="glass-panel border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="border-b border-white/10 text-slate-400 uppercase tracking-wider font-semibold bg-slate-900/80">
                <tr>
                  <th className="py-3.5 px-4">Position Title</th>
                  <th className="py-3.5 px-4">Company</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Posted Date</th>
                  <th className="py-3.5 px-4">Applicants</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map(j => (
                  <tr key={j.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white text-sm max-w-[200px] truncate">{j.title}</td>
                    <td className="py-3.5 px-4 font-medium text-brand-300">{j.companyName}</td>
                    <td className="py-3.5 px-4 text-slate-400">{j.location || 'Remote'}</td>
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">{j.jobType?.replace('_', ' ')}</td>
                    <td className="py-3.5 px-4"><Badge status={j.status} /></td>
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">{formatDate(j.postedAt)}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                        {j.applicationCount ?? 0}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button 
                        onClick={() => setConfirm(j)} 
                        className="p-2 rounded-xl bg-slate-950/60 border border-white/10 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 transition-colors"
                      >
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
        title="Delete Job Listing"
        message={`Permanently remove "${confirm?.title}"? Associated candidate application records will also be removed.`}
        confirmLabel="Delete Listing"
        danger
      />
    </MotionPage>
  )
}
