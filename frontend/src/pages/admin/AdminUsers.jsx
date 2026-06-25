import { useEffect, useState } from 'react'
import { Search, ShieldOff, Shield, Trash2, Users } from 'lucide-react'
import { adminApi } from '../../api/adminApi'
import Badge from '../../components/common/Badge'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import EmptyState from '../../components/common/EmptyState'
import { PageSpinner } from '../../components/common/Spinner'
import { formatDate } from '../../utils/dateUtils'
import toast from 'react-hot-toast'

export default function AdminUsers() {
  const [users, setUsers]     = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch]   = useState('')
  const [loading, setLoading] = useState(true)
  const [confirm, setConfirm] = useState(null) // { type, user }
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
      toast.success('User deleted')
    } catch { toast.error('Delete failed') }
    finally { setActing(false); setConfirm(null) }
  }

  if (loading) return <PageSpinner />

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
          <p className="text-sm text-gray-500">{users.length} total users</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            className="input-field pl-9"
            placeholder="Search users…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Users} title="No users found" />
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Name', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{u.fullName}</td>
                    <td className="px-4 py-3 text-gray-500">{u.email}</td>
                    <td className="px-4 py-3"><Badge status={u.role} /></td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {u.isActive ? 'Active' : 'Blocked'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(u.createdAt)}</td>
                    <td className="px-4 py-3">
                      {u.role !== 'ADMIN' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setConfirm({ type: 'block', user: u })}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                            title={u.isActive ? 'Block user' : 'Unblock user'}
                          >
                            {u.isActive ? <ShieldOff className="h-4 w-4" /> : <Shield className="h-4 w-4 text-green-600" />}
                          </button>
                          <button
                            onClick={() => setConfirm({ type: 'delete', user: u })}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600"
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
        title={confirm?.user?.isActive ? 'Block User' : 'Unblock User'}
        message={`Are you sure you want to ${confirm?.user?.isActive ? 'block' : 'unblock'} ${confirm?.user?.fullName}?`}
        confirmLabel={confirm?.user?.isActive ? 'Block' : 'Unblock'}
        danger={confirm?.user?.isActive}
      />
      <ConfirmDialog
        open={confirm?.type === 'delete'}
        onClose={() => setConfirm(null)}
        onConfirm={handleDelete}
        loading={acting}
        title="Delete User"
        message={`Permanently delete ${confirm?.user?.fullName}? This cannot be undone.`}
        confirmLabel="Delete"
        danger
      />
    </div>
  )
}
