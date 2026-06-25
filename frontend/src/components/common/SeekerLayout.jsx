import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import {
  LayoutDashboard, User, Star, FileText, Search,
  Bookmark, ClipboardList, Sparkles, Upload
} from 'lucide-react'

const links = [
  { to: '/seeker/dashboard',     icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/seeker/profile',       icon: User,            label: 'My Profile' },
  { to: '/seeker/skills',        icon: Star,            label: 'My Skills' },
  { to: '/seeker/resume',        icon: Upload,          label: 'Resume' },
  { to: '/seeker/jobs',          icon: Search,          label: 'Search Jobs' },
  { to: '/seeker/saved-jobs',    icon: Bookmark,        label: 'Saved Jobs' },
  { to: '/seeker/applications',  icon: ClipboardList,   label: 'Applications' },
  { to: '/seeker/recommendations', icon: Sparkles,      label: 'Recommendations' },
]

export default function SeekerLayout() {
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
