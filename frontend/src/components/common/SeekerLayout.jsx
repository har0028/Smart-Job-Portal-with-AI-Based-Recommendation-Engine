import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, User, Star, Search,
  Bookmark, ClipboardList, Sparkles, Upload, Crown
} from 'lucide-react'

const links = [
  { to: '/seeker/dashboard',       icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/seeker/pro-upgrade',     icon: Crown,           label: '👑 VIP Career Pass', featured: true },
  { to: '/seeker/recommendations', icon: Sparkles,        label: 'AI Match Engine' },
  { to: '/seeker/jobs',            icon: Search,          label: 'Search Jobs' },
  { to: '/seeker/applications',    icon: ClipboardList,   label: 'Applications' },
  { to: '/seeker/saved-jobs',      icon: Bookmark,        label: 'Saved Jobs' },
  { to: '/seeker/profile',         icon: User,            label: 'My Profile' },
  { to: '/seeker/skills',          icon: Star,            label: 'My Skills' },
  { to: '/seeker/resume',          icon: Upload,          label: 'Resume Upload' },
]

export default function SeekerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 overflow-hidden relative">
        {/* Ambient glow backgrounds */}
        <div className="ambient-glow w-96 h-96 bg-brand-500/10 top-10 left-1/4 pointer-events-none" />
        <div className="ambient-glow w-96 h-96 bg-accent-violet/10 bottom-10 right-1/4 pointer-events-none" />

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
