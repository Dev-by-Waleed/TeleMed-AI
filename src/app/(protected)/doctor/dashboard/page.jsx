'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import createClient from '@/lib/supabase/client';
import {
  Menu,
  Activity,
  Smile,
  Clock,
  MoreVertical,
  Pill,
  MessageSquare,
  CalendarDays
} from 'lucide-react';

export default function DoctorDashboard() {
  const [mounted, setMounted] = useState(false)
  const [currentDate, setCurrentDate] = useState('')
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }

    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      const user = data?.user
      setUserName(user?.user_metadata?.full_name || user?.email || '')
      setCurrentDate(new Date().toLocaleDateString('en-US', options))
      setMounted(true)
    })
  }, [])

  return (
    <>
      {/* Main Content Canvas */}
      <main className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: 'var(--color-background)' }}>
        
        {/* Mobile Top Nav Fallback */}
        <header
          className="md:hidden flex justify-between items-center h-16 px-4 border-b w-full shrink-0"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-outline-variant)',
          }}
        >
          <div className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
            TeleMed
          </div>
          <button style={{ color: 'var(--color-on-surface)' }}>
            <Menu className="w-6 h-6" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-10 space-y-8 max-w-7xl mx-auto w-full">
          
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ color: 'var(--color-on-background)' }}>
                Good Morning, {userName || 'Doctor'}
              </h1>
              <p className="text-sm mt-1" style={{ color: 'var(--color-on-surface-variant)' }}>
                Here is your clinical overview for today.
              </p>
            </div>

            <div
              className="text-xs py-1.5 px-3 rounded-full flex items-center gap-2 border shadow-sm"
              style={{
                backgroundColor: 'var(--color-surface-container)',
                borderColor: 'var(--color-outline-variant)',
                color: 'var(--color-on-surface-variant)',
              }}
            >
              <CalendarDays className="w-4 h-4" />
              <span>{mounted ? currentDate : ''}</span>
            </div>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Summary Widget 1 */}
            <div
              className="md:col-span-4 border rounded-xl p-4 shadow-sm flex flex-col justify-between"
              style={{
                backgroundColor: 'var(--color-surface-card)',
                borderColor: 'var(--color-outline-variant)',
              }}
            >
              <div className="flex justify-between items-start">
                <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-on-surface-variant)' }}>
                  Total Consultations
                </h3>
                <Activity className="w-5 h-5" style={{ color: 'var(--color-primary-container)' }} />
              </div>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-4xl font-bold" style={{ color: 'var(--color-on-surface)' }}>12</span>
                <span className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>Scheduled Today</span>
              </div>
            </div>

            {/* Summary Widget 2 */}
            <div
              className="md:col-span-4 border rounded-xl p-4 shadow-sm flex flex-col justify-between"
              style={{
                backgroundColor: 'var(--color-surface-card)',
                borderColor: 'var(--color-outline-variant)',
              }}
            >
              <div className="flex justify-between items-start">
                <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-on-surface-variant)' }}>
                  Patient Satisfaction
                </h3>
                <Smile className="w-5 h-5" style={{ color: 'var(--color-tertiary-container)' }} />
              </div>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-4xl font-bold" style={{ color: 'var(--color-on-surface)' }}>4.9</span>
                <span className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>/ 5.0 Average</span>
              </div>
            </div>

            {/* Summary Widget 3 */}
            <div
              className="md:col-span-4 border rounded-xl p-4 shadow-sm flex flex-col justify-between relative overflow-hidden group"
              style={{
                backgroundColor: 'var(--color-surface-card)',
                borderColor: 'var(--color-outline-variant)',
              }}
            >
              <div
                className="absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-30 group-hover:scale-110 transition-transform duration-500 blur-xl"
                style={{ backgroundColor: 'var(--color-primary-fixed-dim)' }}
              />
              <div className="flex justify-between items-start relative z-10">
                <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-on-surface-variant)' }}>
                  Next Appointment
                </h3>
                <Clock className="w-5 h-5" style={{ color: 'var(--color-primary-container)' }} />
              </div>
              <div className="mt-6 relative z-10">
                <p className="text-xl font-bold" style={{ color: 'var(--color-on-surface)' }}>10:30 AM</p>
                <p className="text-xs mt-1" style={{ color: 'var(--color-on-surface-variant)' }}>
                  Sarah Jenkins • Follow-up
                </p>
              </div>
            </div>

            {/* Main Content Row: Today's Appointments */}
            <div
              className="md:col-span-8 border rounded-xl shadow-sm flex flex-col"
              style={{
                backgroundColor: 'var(--color-surface-card)',
                borderColor: 'var(--color-outline-variant)',
              }}
            >
              <div
                className="p-4 border-b flex justify-between items-center"
                style={{ borderColor: 'var(--color-outline-variant)' }}
              >
                <h2 className="text-lg font-bold" style={{ color: 'var(--color-on-surface)' }}>
Today&apos;s Appointments
                </h2>
                <button className="text-xs font-semibold hover:underline" style={{ color: 'var(--color-primary-container)' }}>
                  View All
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-2">
                <ul className="divide-y" style={{ borderColor: 'var(--color-outline-variant)' }}>
                  
                  {/* Appointment Item 1 */}
                  <li className="p-3 rounded-lg transition-colors flex items-center justify-between hover:bg-[var(--color-surface-container-low)]">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs"
                        style={{
                          backgroundColor: 'var(--color-surface-container-high)',
                          color: 'var(--color-primary)',
                        }}
                      >
                        SJ
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>
                          Sarah Jenkins
                        </p>
                        <p className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>
                          Cardiovascular Checkup
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <p className="text-xs font-medium" style={{ color: 'var(--color-on-surface)' }}>10:30 AM</p>
                        <p className="text-[10px]" style={{ color: 'var(--color-on-surface-variant)' }}>30 Min</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                        Confirmed
                      </span>
                      <button className="hover:opacity-75 transition-opacity" style={{ color: 'var(--color-on-surface-variant)' }}>
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </li>

                  {/* Appointment Item 2 */}
                  <li className="p-3 rounded-lg transition-colors flex items-center justify-between hover:bg-[var(--color-surface-container-low)]">
                    <div className="flex items-center gap-3">
                      <Image
                        alt="Michael Chang"
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover border"
                        style={{ borderColor: 'var(--color-outline-variant)' }}
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDKvm1T-68t4W6e9mzZ_nbeYQgLAYC5wbnwtBTEJXouVsfN5lh3ek9HdRMHf4zTKCqDeZgKIUucV4ACT00VS-ZBP_xqWER8MfGEuMnBxMPmWWVt2pKBTr2g2GAJZzol7KbxBE_LjB9AOoQkvidnIlsJQCnptxRUoV4ouybYYTEdhNgN02dnsqCPriz6kpb_Uk75ktZtuvPgcu9P3jxnzUjMhZRKfGiy4htgLa5CFX_SQhvZIQQerwiFOh4ul3m1fJoeIUHPWn2UA"
                      />
                      <div>
                        <p className="text-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>
                          Michael Chang
                        </p>
                        <p className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>
                          Lab Results Review
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <p className="text-xs font-medium" style={{ color: 'var(--color-on-surface)' }}>11:15 AM</p>
                        <p className="text-[10px]" style={{ color: 'var(--color-on-surface-variant)' }}>15 Min</p>
                      </div>
                      <span
                        className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                        style={{
                          backgroundColor: 'var(--color-surface-container-high)',
                          color: 'var(--color-on-surface-variant)',
                        }}
                      >
                        In Waiting Room
                      </span>
                      <button className="hover:opacity-75 transition-opacity" style={{ color: 'var(--color-on-surface-variant)' }}>
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </li>

                  {/* Appointment Item 3 */}
                  <li className="p-3 rounded-lg transition-colors flex items-center justify-between hover:bg-[var(--color-surface-container-low)]">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs border"
                        style={{
                          backgroundColor: 'var(--color-surface-container-low)',
                          color: 'var(--color-on-surface)',
                          borderColor: 'var(--color-outline-variant)',
                        }}
                      >
                        ER
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>
                          Elena Rodriguez
                        </p>
                        <p className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>
                          Initial Consultation
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <p className="text-xs font-medium" style={{ color: 'var(--color-on-surface)' }}>1:00 PM</p>
                        <p className="text-[10px]" style={{ color: 'var(--color-on-surface-variant)' }}>45 Min</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
                        Pending
                      </span>
                      <button className="hover:opacity-75 transition-opacity" style={{ color: 'var(--color-on-surface-variant)' }}>
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Patient Requests Queue */}
            <div
              className="md:col-span-4 border rounded-xl shadow-sm flex flex-col"
              style={{
                backgroundColor: 'var(--color-surface-card)',
                borderColor: 'var(--color-outline-variant)',
              }}
            >
              <div
                className="p-4 border-b"
                style={{ borderColor: 'var(--color-outline-variant)' }}
              >
                <h2 className="text-lg font-bold" style={{ color: 'var(--color-on-surface)' }}>
                  Patient Requests
                </h2>
              </div>

              <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                
                {/* Request Card 1 */}
                <div
                  className="rounded-lg p-3 border transition-all hover:border-[var(--color-primary-fixed-dim)]"
                  style={{
                    backgroundColor: 'var(--color-surface-container-low)',
                    borderColor: 'var(--color-outline-variant)',
                  }}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-1.5" style={{ color: 'var(--color-on-surface-variant)' }}>
                      <Pill className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Refill Request</span>
                    </div>
                    <span className="text-[10px]" style={{ color: 'var(--color-on-surface-variant)' }}>2h ago</span>
                  </div>
                  <p className="text-xs font-semibold" style={{ color: 'var(--color-on-surface)' }}>
                    Lisinopril 10mg
                  </p>
                  <p className="text-[11px] mb-3" style={{ color: 'var(--color-on-surface-variant)' }}>
                    Requested by Robert Davis
                  </p>
                  <button
                    className="w-full py-1.5 rounded text-xs font-semibold transition-colors hover:opacity-90"
                    style={{
                      backgroundColor: 'var(--color-secondary)',
                      color: 'var(--color-primary-dark)',
                    }}
                  >
                    Review
                  </button>
                </div>

                {/* Request Card 2 */}
                <div
                  className="rounded-lg p-3 border transition-all hover:border-[var(--color-primary-fixed-dim)]"
                  style={{
                    backgroundColor: 'var(--color-surface-container-low)',
                    borderColor: 'var(--color-outline-variant)',
                  }}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-1.5" style={{ color: 'var(--color-on-surface-variant)' }}>
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Message</span>
                    </div>
                    <span className="text-[10px] font-bold" style={{ color: 'var(--color-error)' }}>Urgent</span>
                  </div>
                  <p className="text-xs font-semibold" style={{ color: 'var(--color-on-surface)' }}>
                    Post-op swelling inquiry
                  </p>
                  <p className="text-[11px] mb-3" style={{ color: 'var(--color-on-surface-variant)' }}>
                    From Alicia Keys
                  </p>
                  <button
                    className="w-full py-1.5 rounded text-xs font-semibold transition-colors hover:opacity-90"
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--color-on-primary)',
                    }}
                  >
                    Reply
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </main>
    </>
  );
}