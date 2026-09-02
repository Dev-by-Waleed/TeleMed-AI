"use client"
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import createClient from '@/lib/supabase/client'
import {
  Video,
  FileText,
  LayoutDashboard,
  History,
  LogOut,
  Users,
  Pill,
  UserRound,
} from 'lucide-react'
import NotificationBell from '@/Components/layout/NotificationBell'

const NAV_CONFIG = [
  { label: 'Overview', path: '/doctor/dashboard', icon: LayoutDashboard },
  { label: 'My Patients', path: '/doctor/consultations', icon: Users },
  { label: 'Consultation History', path: '/doctor/consultation-history', icon: History },
  { label: 'Prescriptions', path: '/doctor/prescriptions', icon: Pill },
  { label: 'My Profile', path: '/doctor/profile', icon: UserRound },
]

export default function Sidebar({ userName = '', userEmail = '', avatarUrl = null }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const displayName = userName || userEmail || 'Doctor'
  const initials = displayName
    .split(/\s+/)
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
    router.push('/login')
  }

  // Consultation rooms are full-screen (patient profile + chat). Hide the
  // app-nav sidebar there so it doesn't render as a second sidebar. This is
  // decided client-side via usePathname so it updates instantly on navigation,
  // unlike a server layout which is cached across client-side navigation.
  if (pathname === '/doctor/consultation' || pathname.startsWith('/doctor/consultation/')) {
    return null
  }

  return (
    <aside
      className="hidden md:flex flex-col h-full w-64 border-r py-6 px-4 shrink-0 space-y-2"
      style={{
        backgroundColor: 'var(--color-surface-container-low)',
        borderColor: 'var(--color-outline-variant)',
      }}
    >
      {/* Doctor Header */}
      <div className="flex items-center gap-3 mb-8 px-2">
        {avatarUrl ? (
          <Image src={avatarUrl} alt="Profile" width={48} height={48} className="w-12 h-12 rounded-full object-cover shrink-0 border" style={{ borderColor: 'var(--color-outline-variant)' }} />
        ) : (
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0 border"
            style={{
              backgroundColor: 'var(--color-primary-container)',
              color: 'var(--color-on-primary)',
              borderColor: 'var(--color-outline-variant)',
            }}
          >
            {initials || 'Dr'}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold leading-snug truncate" style={{ color: 'var(--color-primary)' }}>
            {displayName}
          </h2>
          <p className="text-xs truncate" style={{ color: 'var(--color-on-surface-variant)' }}>
            {userEmail || 'Doctor'}
          </p>
        </div>
        <div className="shrink-0">
          <NotificationBell align="left" />
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex-1 space-y-1">
        {NAV_CONFIG.map(({ label, path, icon: Icon }) => {
          const isActive = pathname === path || pathname.startsWith(`${path}/`)
          return (
            <Link
              key={path}
              href={path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold text-xs transition-transform shadow-sm ${
                isActive ? '' : 'transition-colors hover:bg-[var(--color-surface-container-high)]'
              }`}
              style={
                isActive
                  ? {
                      backgroundColor: 'var(--color-secondary-container)',
                      color: 'var(--color-on-secondary-container)',
                    }
                  : { color: 'var(--color-on-surface-variant)' }
              }
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* CTA & Footer */}
      <div className="mt-auto space-y-4">
        <Link
          href="/doctor/consultations"
          className="w-full py-2.5 px-4 rounded-lg text-xs font-semibold transition-colors flex justify-center items-center gap-2 shadow-sm hover:opacity-90"
          style={{
            backgroundColor: 'var(--color-primary-container)',
            color: 'var(--color-on-primary)',
          }}
        >
          <Video className="w-4 h-4" />
          <span>Start Consultation</span>
        </Link>

        <div className="border-t pt-3 space-y-1" style={{ borderColor: 'var(--color-outline-variant)' }}>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors hover:bg-[var(--color-surface-container-high)]"
            style={{ color: 'var(--color-on-surface-variant)' }}
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
