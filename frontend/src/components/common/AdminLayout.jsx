import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import {
  LayoutDashboard, Users, Briefcase, Building2, BarChart3
} from 'lucide-react'

const links = [
  { to: '/admin/dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/users',      icon: Users,           label: 'Manage Users' },
  { to: '/admin/recruiters', icon: Building2,       label: 'Recruiters' },
  { to: '/admin/jobs',       icon: Briefcase,       label: 'Manage Jobs' },
  { to: '/admin/analytics',  icon: BarChart3,       label: 'Analytics' },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar links={links} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
