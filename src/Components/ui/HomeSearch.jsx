"use client"
import React, { useState } from 'react'
import { Search, Stethoscope, ShieldCheck } from 'lucide-react'

const TABS = ['Find Doctor', 'By Symptoms', 'Clinics & Labs']

const TAB_ICONS = {
  'Find Doctor': Search,
  'By Symptoms': Stethoscope,
  'Clinics & Labs': ShieldCheck,
}

export default function HomeSearch() {
  const [activeTab, setActiveTab] = useState(TABS[0])

  return (
    <div
      className="p-3 rounded-2xl shadow-xl max-w-xl border transition-colors"
      style={{ backgroundColor: 'var(--color-surface-bright)', borderColor: 'var(--color-outline-variant)' }}
    >
      <div className="flex items-center gap-2 mb-3 border-b pb-2" style={{ borderColor: 'var(--color-outline-variant)' }}>
        {TABS.map((tab) => {
          const Icon = TAB_ICONS[tab]
          const isActive = activeTab === tab
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive ? '' : 'hover:bg-[var(--color-surface-container-low)]'
              }`}
              style={
                isActive
                  ? { backgroundColor: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' }
                  : { color: 'var(--color-on-surface-variant)' }
              }
            >
              <Icon className="w-4 h-4" />
              {tab}
            </button>
          )
        })}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl transition-colors" style={{ backgroundColor: 'var(--color-surface-container-low)' }}>
          <Search className="w-5 h-5" style={{ color: 'var(--color-on-surface-variant)' }} />
          <input
            type="text"
            placeholder="Search doctor, speciality, or symptoms..."
            className="bg-transparent border-none outline-none w-full text-sm placeholder:text-[var(--color-on-surface-variant)]"
            style={{ color: 'var(--color-foreground)' }}
          />
        </div>
        <button
          className="px-8 py-3 rounded-xl font-medium hover:opacity-90 transition-colors"
          style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }}
        >
          Search
        </button>
      </div>
    </div>
  )
}
