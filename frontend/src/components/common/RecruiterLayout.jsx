import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { LayoutDashboard, Briefcase, PlusCircle } from 'lucide-react'

const links = [
  { to: '/recruiter/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/recruiter/jobs',      icon: Briefcase,       label: 'My Jobs' },
  { to: '/recruiter/jobs/create', icon: PlusCircle,    label: 'Post a Job' },
]

export default function RecruiterLayout() {
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
