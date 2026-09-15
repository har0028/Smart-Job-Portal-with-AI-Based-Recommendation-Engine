import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Users, Briefcase, Building2, BarChart3, IndianRupee
} from 'lucide-react'

const links = [
  { to: '/admin/dashboard',  icon: LayoutDashboard, label: 'Control Center' },
  { to: '/admin/revenue',    icon: IndianRupee,     label: 'Revenue & Earnings 💰' },
  { to: '/admin/users',      icon: Users,           label: 'User Directory' },
  { to: '/admin/recruiters', icon: Building2,       label: 'Companies' },
  { to: '/admin/jobs',       icon: Briefcase,       label: 'All Listings' },
  { to: '/admin/analytics',  icon: BarChart3,       label: 'Analytics & Insights' },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 overflow-hidden relative">
        <div className="ambient-glow w-96 h-96 bg-purple-500/10 top-10 left-1/3 pointer-events-none" />
        <Sidebar links={links} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative z-10">
          <AnimatePresence mode="wait">
            <div key={location.pathname}>
              <Outlet />
            </div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
