"use client"

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Activity, User, LogOut, ChevronDown, Shield } from 'lucide-react'
import  createClient  from '@/lib/supabase/client'
import Image from 'next/image'
import NotificationBell from '@/Components/layout/NotificationBell'

const NAV_CONFIG = {
  public: [
    { label: 'Home', path: '/' },
    { label: 'Find Doctors', path: '/#doctors' },
    { label: 'Departments', path: '/#departments' },
    { label: 'About', path: '/about' }
  ],
  patient: [
    { label: 'Dashboard', path: '/patient/dashboard' },
    { label: 'Appointments', path: '/patient/my-appointments' },
    { label: 'Medications', path: '/patient/prescriptions' },
    { label: 'Medical Report', path: '/patient/reports' },
    { label: 'Consultation', path: '/patient/consultation' }
  ]
}

export default function Navbar({ role = 'patient', userEmail = '', variant = null, avatarUrl = null }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Landing/public mode shows marketing links and auth buttons instead of role links
  const isPublic = variant === 'public'
  const navItems = NAV_CONFIG[isPublic ? 'public' : role] || NAV_CONFIG.patient
  const portalTitle = isPublic ? 'TeleMed AI' : `TeleMed ${role.charAt(0).toUpperCase() + role.slice(1)} Portal`
  const userInitials = userEmail ? userEmail.substring(0, 2).toUpperCase() : 'US'

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Sign out handler
  const handleSignOut = async () => {
    setDropdownOpen(false)
    await supabase.auth.signOut()
    router.refresh()
    router.push('/login')
  }

  return (
    <nav className="bg-[var(--color-surface)] border-b border-[var(--color-outline-variant)] flex justify-between items-center w-full px-6 md:px-10 h-16 shrink-0 z-50 fixed top-0 left-0">
      
      {/* Logo Section */}
      <div className="flex items-center gap-2">
        <Activity className="text-[var(--color-primary)] w-7 h-7" />
        <span className="text-xl font-bold text-[var(--color-primary)] tracking-tight">
          {portalTitle}
        </span>
      </div>

      {/* Dynamic Links (Renders instantly based on role prop) */}
      <div className="hidden md:flex space-x-8 h-full items-center">
        {navItems.map(({ label, path }) => {
          const isActive = pathname === path || pathname.startsWith(`${path}/`)
          
          return (
            <Link 
              key={path} 
              href={path} 
              className={`text-sm font-semibold transition-colors duration-200 h-full flex items-center border-b-2 ${
                isActive 
                  ? 'text-[var(--color-primary)] border-[var(--color-primary)]' 
                  : 'text-[var(--color-on-surface-variant)] border-transparent hover:text-[var(--color-on-surface)]'
              }`}
            >
              {label}
            </Link>
          )
        })}
      </div>

        {/* Right Controls: Notifications & Profile Dropdown */}
        <div className="flex items-center space-x-3">
          {isPublic && (
            <>
              <Link
                href="/login"
                className="hidden sm:block px-4 py-2 text-sm font-semibold text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Sign Up
              </Link>
            </>
          )}
          {!isPublic && <NotificationBell />}

        {/* Profile Dropdown */}
        {!isPublic && <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-[var(--color-surface-variant)] transition-colors focus:outline-none"
          >
            {avatarUrl ? (
              <Image src={avatarUrl} alt="Profile" width={32} height={32} className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white text-xs font-bold flex items-center justify-center">
                {userInitials}
              </div>
            )}
            <ChevronDown className={`w-4 h-4 text-[var(--color-on-surface-variant)] transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 py-2 z-50 text-slate-800 dark:text-slate-200">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                  {userEmail || 'User Account'}
                </p>
                <div className="flex items-center space-x-1 mt-1 text-xs text-slate-500 capitalize">
                  <Shield className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                  <span>Role: <strong className="text-slate-700 dark:text-slate-300">{role}</strong></span>
                </div>
              </div>

              <Link
                href={`/${role}/profile`}
                onClick={() => setDropdownOpen(false)}
                className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <User className="w-4 h-4 mr-2 text-slate-500" />
                Account Profile
              </Link>

              <div className="my-1 border-t border-slate-100 dark:border-slate-800"></div>

              <button
                onClick={handleSignOut}
                className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>
            </div>
          )}
        </div>}
      </div>
    </nav>
  )
}