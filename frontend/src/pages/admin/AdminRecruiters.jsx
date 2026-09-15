import { useEffect, useState } from 'react'
import { Building2, Globe, Search, ArrowUpRight, Briefcase } from 'lucide-react'
import { adminApi } from '../../api/adminApi'
import EmptyState from '../../components/common/EmptyState'
import { PageSpinner } from '../../components/common/Spinner'
import { MotionPage, MotionGrid, MotionItem } from '../../components/common/MotionContainer'
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
    <MotionPage className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold mb-2">
            <Building2 className="h-3.5 w-3.5" />
            <span>Enterprise Recruiter Network</span>
          </div>
          <h1 className="text-3xl font-display font-extrabold text-white tracking-tight">Verified Companies</h1>
          <p className="text-slate-400 text-sm mt-1">{recruiters.length} active enterprise company profiles</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input className="glass-input pl-10" placeholder="Search company or recruiter..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Building2} title="No company profiles found" description="Try broadening your search criteria." />
      ) : (
        <MotionGrid className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(r => (
            <MotionItem key={r.id}>
              <div className="glass-card p-6 border border-white/10 hover:border-brand-500/30 flex flex-col justify-between">
                <div className="flex items-start gap-3.5 mb-4">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 border border-white/15 flex items-center justify-center font-display font-bold text-white text-lg shrink-0 shadow-lg shadow-cyan-500/20">
                    {r.companyName ? r.companyName.charAt(0) : 'C'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-base truncate">{r.companyName}</h3>
                    <p className="text-xs font-semibold text-brand-300 truncate mt-0.5">{r.fullName} · {r.designation || 'HR Lead'}</p>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{r.email}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                  <span className="font-bold text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20 flex items-center gap-1">
                    <Briefcase className="h-3 w-3" />
                    {r.totalJobs ?? 0} positions posted
                  </span>
                  {r.companyWebsite && (
                    <a 
                      href={r.companyWebsite} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-xs font-semibold text-brand-400 hover:text-white flex items-center gap-1"
                    >
                      <Globe className="h-3.5 w-3.5" /> Website <ArrowUpRight className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </MotionItem>
          ))}
        </MotionGrid>
      )}
    </MotionPage>
  )
}
