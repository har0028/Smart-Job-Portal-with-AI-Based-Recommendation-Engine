import { useEffect, useState } from 'react'
import { ClipboardList, Trash2, CheckCircle2, Clock, Sparkles } from 'lucide-react'
import { seekerApi } from '../../api/seekerApi'
import Badge from '../../components/common/Badge'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import EmptyState from '../../components/common/EmptyState'
import { PageSpinner } from '../../components/common/Spinner'
import { formatDate } from '../../utils/dateUtils'
import { MotionPage, MotionGrid, MotionItem } from '../../components/common/MotionContainer'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

const STATUS_ORDER = ['PENDING', 'REVIEWING', 'SHORTLISTED', 'HIRED', 'REJECTED']

export default function MyApplications() {
  const [apps, setApps]         = useState([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState('ALL')
  const [confirm, setConfirm]   = useState(null)
  const [withdrawing, setWithdrawing] = useState(false)

  useEffect(() => {
    seekerApi.getMyApplications()
      .then(r => setApps(r.data.data || []))
      .catch(() => toast.error('Failed to load applications'))
      .finally(() => setLoading(false))
  }, [])

  const handleWithdraw = async () => {
    setWithdrawing(true)
    try {
      await seekerApi.withdrawApplication(confirm.id)
      setApps(prev => prev.filter(a => a.id !== confirm.id))
      toast.success('Application withdrawn')
    } catch {
      toast.error('Failed to withdraw application')
    } finally {
      setWithdrawing(false)
      setConfirm(null)
    }
  }

  const displayed = filter === 'ALL' ? apps : apps.filter(a => a.status === filter)

  if (loading) return <PageSpinner />

  return (
    <MotionPage className="space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold mb-2">
          <ClipboardList className="h-3.5 w-3.5" />
          <span>Real-time Application Tracker</span>
        </div>
        <h1 className="text-3xl font-display font-extrabold text-white tracking-tight">My Applications</h1>
        <p className="text-slate-400 text-sm mt-1">{apps.length} active application trajectories</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap pb-2 border-b border-white/10">
        {['ALL', ...STATUS_ORDER].map(s => {
          const isSelected = filter === s
          const count = s === 'ALL' ? apps.length : apps.filter(a => a.status === s).length
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all duration-200 ${
                isSelected
                  ? 'bg-brand-500/20 border border-brand-500 text-white shadow-glow-sm'
                  : 'bg-slate-900/60 border border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {s === 'ALL' ? 'All Applications' : s} ({count})
            </button>
          )
        })}
      </div>

      {displayed.length === 0 ? (
        <EmptyState 
          icon={ClipboardList} 
          title="No applications in this pipeline state" 
          description="Submit applications to job openings to track live status updates here." 
        />
      ) : (
        <MotionGrid className="space-y-4">
          {displayed.map(app => (
            <MotionItem key={app.id}>
              <div className="glass-card p-6 border border-white/10 hover:border-brand-500/30">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-base">{app.jobTitle}</h3>
                    <p className="text-xs font-semibold text-brand-300 mt-0.5">{app.companyName}</p>
                    
                    <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />Applied {formatDate(app.appliedAt)}</span>
                      {app.matchScore !== undefined && (
                        <span className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                          <Sparkles className="h-3 w-3" />
                          {app.matchScore?.toFixed(0)}% Vector Match
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge status={app.status} />
                    {app.status === 'PENDING' && (
                      <button
                        onClick={() => setConfirm(app)}
                        className="p-2 rounded-xl bg-slate-950/60 border border-white/10 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 transition-colors"
                        title="Withdraw application"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Animated Pipeline Stage Bar */}
                <div className="mt-5 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-1.5">
                    {STATUS_ORDER.filter(s => s !== 'REJECTED').map((s, i, arr) => {
                      const currentIdx = arr.indexOf(app.status)
                      const stepIdx    = arr.indexOf(s)
                      const isDone     = app.status === 'REJECTED' ? false : stepIdx <= currentIdx
                      return (
                        <div key={s} className="flex items-center flex-1">
                          <div className={`h-2 rounded-full flex-1 transition-all duration-300 ${isDone ? 'bg-gradient-to-r from-brand-500 to-accent-violet shadow-glow-sm' : 'bg-slate-800'}`} />
                          {i < arr.length - 1 && <div className="w-1" />}
                        </div>
                      )
                    })}
                  </div>
                  <div className="flex justify-between text-[11px] font-medium text-slate-400 mt-2 px-1">
                    <span>Pending</span>
                    <span>Reviewing</span>
                    <span>Shortlisted</span>
                    <span>Hired</span>
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
        onConfirm={handleWithdraw}
        loading={withdrawing}
        title="Withdraw Application"
        message={`Are you sure you want to withdraw your application for "${confirm?.jobTitle}"?`}
        confirmLabel="Withdraw"
        danger
      />
    </MotionPage>
  )
}
