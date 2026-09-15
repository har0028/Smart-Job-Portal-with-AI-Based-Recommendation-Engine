import React from 'react'
import { Link } from 'react-router-dom'

/**
 * Real 3D High-Tech Brand Logo for SmartJobs AI
 */
export function BrandLogoIcon({ size = 'md', className = '' }) {
  const dimensions = 
    size === 'xs' ? 'h-7 w-7' :
    size === 'sm' ? 'h-9 w-9' :
    size === 'lg' ? 'h-12 w-12' :
    size === 'xl' ? 'h-16 w-16' :
    'h-10 w-10' // default md

  return (
    <div className={`relative shrink-0 flex items-center justify-center ${dimensions} ${className}`}>
      {/* Outer Glow Halo */}
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 rounded-2xl blur-md opacity-75 animate-pulse" />
      
      {/* 3D Glass Emblem Badge */}
      <div className="relative h-full w-full rounded-2xl bg-slate-950 border border-cyan-400/40 p-0.5 shadow-2xl shadow-cyan-500/30 flex items-center justify-center overflow-hidden ring-1 ring-white/20">
        <img
          src="/logo-mark.jpg"
          alt="SmartJobs AI Logo"
          className="w-full h-full object-cover rounded-xl transform transition-transform duration-300 hover:scale-110"
        />
      </div>
    </div>
  )
}

export default function BrandLogo({ 
  size = 'md', 
  showBadge = true, 
  to = '/', 
  className = '' 
}) {
  const textSize = 
    size === 'sm' ? 'text-lg' :
    size === 'lg' ? 'text-2xl' :
    size === 'xl' ? 'text-3xl' :
    'text-xl sm:text-2xl' // md default

  const content = (
    <div className={`inline-flex items-center gap-3 group cursor-pointer ${className}`}>
      <BrandLogoIcon size={size} className="group-hover:scale-105 transition-transform duration-300" />
      <div className="flex flex-col">
        <span className={`font-display font-black ${textSize} text-white tracking-tight flex items-center gap-2`}>
          Smart<span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">Jobs</span>
          {showBadge && (
            <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 px-2.5 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider shadow-sm shadow-cyan-500/20">
              AI 2.0
            </span>
          )}
        </span>
      </div>
    </div>
  )

  if (to) {
    return <Link to={to}>{content}</Link>
  }

  return content
}

