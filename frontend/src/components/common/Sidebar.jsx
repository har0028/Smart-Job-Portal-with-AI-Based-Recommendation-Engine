import { NavLink } from 'react-router-dom'

export default function Sidebar({ links, open, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={onClose} />}

      <aside className={`
        fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200
        z-30 flex flex-col transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:h-auto
      `}>
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-1
                 ${isActive
                   ? 'bg-primary-50 text-primary-700'
                   : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                 }`
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}
