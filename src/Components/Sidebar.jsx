"use client"
import React from 'react'
import {
  Video,
  FileText,
  LayoutDashboard,
  History,
  Settings,
  LogOut,
  Users,
  Calendar 

} from 'lucide-react';
export default function Sidebar() {
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
                <img
                    alt="Doctor Professional Avatar"
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover border shrink-0"
                    style={{ borderColor: 'var(--color-outline-variant)' }}
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAujUaO4DCxtNNLnh0Fhwu_AMGB-6hbSPI5q-N7dnGGwb7tEYnP5ZsWz-ZDQXfP4qIJeN3pi1Wp7pRfsReVShZWhCakVC4-5YcgMb1dXY6uqoe_6NCq1-Fd3yxaL48yzGiSNxv_35yluFRsolmZ_0UO3EUF8J8tBMUgXDUj0D6k52NdnFGRdIChQdWpN564FuTlZThv2yMzPhwCtBQ1BtF0leSjxRwl9CKYdmWvsG-KWWgA5B9fA8Qi3zsaDhO5XWgsMSeGBR__fQ"
                />
                <div>
                    <h2 className="text-lg font-bold leading-snug" style={{ color: 'var(--color-primary)' }}>
                        Dr. Smith
                    </h2>
                    <p className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>
                        Cardiologist
                    </p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="flex-1 space-y-1">
                <a
                    href="#"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold text-xs transition-transform shadow-sm"
                    style={{
                        backgroundColor: 'var(--color-secondary-container)',
                        color: 'var(--color-on-secondary-container)',
                    }}
                >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Overview</span>
                </a>

                <a
                    href="#"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors hover:bg-[var(--color-surface-container-high)]"
                    style={{ color: 'var(--color-on-surface-variant)' }}
                >
                    <Users className="w-4 h-4" />
                    <span>My Patients</span>
                </a>

                <a
                    href="#"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors hover:bg-[var(--color-surface-container-high)]"
                    style={{ color: 'var(--color-on-surface-variant)' }}
                >
                    <Calendar className="w-4 h-4" />
                    <span>Calendar</span>
                </a>

                <a
                    href="#"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors hover:bg-[var(--color-surface-container-high)]"
                    style={{ color: 'var(--color-on-surface-variant)' }}
                >
                    <FileText className="w-4 h-4" />
                    <span>E-Prescriptions</span>
                </a>

                <a
                    href="#"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors hover:bg-[var(--color-surface-container-high)]"
                    style={{ color: 'var(--color-on-surface-variant)' }}
                >
                    <History className="w-4 h-4" />
                    <span>Medical Records</span>
                </a>
            </nav>

            {/* CTA & Footer */}
            <div className="mt-auto space-y-4">
                <button
                    className="w-full py-2.5 px-4 rounded-lg text-xs font-semibold transition-colors flex justify-center items-center gap-2 shadow-sm hover:opacity-90"
                    style={{
                        backgroundColor: 'var(--color-primary-container)',
                        color: 'var(--color-on-primary)',
                    }}
                >
                    <Video className="w-4 h-4" />
                    <span>Start Consultation</span>
                </button>

                <div className="border-t pt-3 space-y-1" style={{ borderColor: 'var(--color-outline-variant)' }}>
                    <a
                        href="#"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors hover:bg-[var(--color-surface-container-high)]"
                        style={{ color: 'var(--color-on-surface-variant)' }}
                    >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                    </a>
                    <a
                        href="#"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors hover:bg-[var(--color-surface-container-high)]"
                        style={{ color: 'var(--color-on-surface-variant)' }}
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                    </a>
                </div>
            </div>
        </aside>
    )
}
