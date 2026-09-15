import { useEffect, useState } from 'react'
import { Search, ShieldOff, Shield, Trash2, Users } from 'lucide-react'
import { adminApi } from '../../api/adminApi'
import Badge from '../../components/common/Badge'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import EmptyState from '../../components/common/EmptyState'
import { PageSpinner } from '../../components/common/Spinner'
import { formatDate } from '../../utils/dateUtils'
import { MotionPage } from '../../components/common/MotionContainer'
import toast from 'react-hot-toast'

export default function AdminUsers() {
  const [users, setUsers]     = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch]   = useState('')
  const [loading, setLoading] = useState(true)
  const [confirm, setConfirm] = useState(null)
  const [acting, setActing]   = useState(false)

  useEffect(() => {
    adminApi.getAllUsers()
      .then(r => { setUsers(r.data.data); setFiltered(r.data.data) })
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(users.filter(u =>
      u.fullName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    ))
  }, [search, users])

  const handleToggleBlock = async () => {
    setActing(true)
    try {
      const res = await adminApi.toggleBlockUser(confirm.user.id)
      const updated = res.data.data
      setUsers(prev => prev.map(u => u.id === updated.id ? updated : u))
      toast.success(updated.isActive ? 'User unblocked' : 'User blocked')
    } catch { toast.error('Action failed') }
    finally { setActing(false); setConfirm(null) }
  }

  const handleDelete = async () => {
    setActing(true)
    try {
      await adminApi.deleteUser(confirm.user.id)
      setUsers(prev => prev.filter(u => u.id !== confirm.user.id))
      toast.success('User account deleted')
    } catch { toast.error('Delete failed') }
    finally { setActing(false); setConfirm(null) }
  }

  if (loading) return <PageSpinner />

  return (
    <MotionPage className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-2">
            <Users className="h-3.5 w-3.5" />
            <span>User Security Governance</span>
          </div>
          <h1 className="text-3xl font-display font-extrabold text-white tracking-tight">Platform User Directory</h1>
          <p className="text-slate-400 text-sm mt-1">{users.length} registered accounts across roles</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            className="glass-input pl-10"
            placeholder="Search by name, email or role..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Users} title="No users found" description="Try refining your search keyword." />
      ) : (
        <div className="glass-panel border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="border-b border-white/10 text-slate-400 uppercase tracking-wider font-semibold bg-slate-900/80">
                <tr>
                  <th className="py-3.5 px-4">User Name</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Joined Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map(u => (
                  <tr key={u.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white text-sm">{u.fullName}</td>
                    <td className="py-3.5 px-4 text-slate-400">{u.email}</td>
                    <td className="py-3.5 px-4"><Badge status={u.role} /></td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${u.isActive ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' : 'bg-rose-500/15 text-rose-300 border-rose-500/30'}`}>
                        {u.isActive ? 'Active' : 'Blocked'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{formatDate(u.createdAt)}</td>
                    <td className="py-3.5 px-4 text-right">
                      {u.role !== 'ADMIN' && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setConfirm({ type: 'block', user: u })}
                            className="p-2 rounded-xl bg-slate-950/60 border border-white/10 hover:border-white/20 text-slate-400 hover:text-white transition-colors"
                            title={u.isActive ? 'Block user' : 'Unblock user'}
                          >
                            {u.isActive ? <ShieldOff className="h-4 w-4 text-rose-400" /> : <Shield className="h-4 w-4 text-emerald-400" />}
                          </button>
                          <button
                            onClick={() => setConfirm({ type: 'delete', user: u })}
                            className="p-2 rounded-xl bg-slate-950/60 border border-white/10 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirm?.type === 'block'}
        onClose={() => setConfirm(null)}
        onConfirm={handleToggleBlock}
        loading={acting}
        title={confirm?.user?.isActive ? 'Block User Account' : 'Unblock User Account'}
        message={`Are you sure you want to ${confirm?.user?.isActive ? 'block' : 'unblock'} access for ${confirm?.user?.fullName}?`}
        confirmLabel={confirm?.user?.isActive ? 'Block Access' : 'Unblock Access'}
        danger={confirm?.user?.isActive}
      />
      <ConfirmDialog
        open={confirm?.type === 'delete'}
        onClose={() => setConfirm(null)}
        onConfirm={handleDelete}
        loading={acting}
        title="Delete User Account"
        message={`Permanently delete user record for "${confirm?.user?.fullName}"? This action cannot be undone.`}
        confirmLabel="Delete Account"
        danger
      />
    </MotionPage>
  )
}
