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
    <div className="bg-card p-3 rounded-2xl shadow-xl max-w-xl border border-border transition-colors">
      <div className="flex items-center gap-2 mb-3 border-b border-border pb-2">
        {TABS.map((tab) => {
          const Icon = TAB_ICONS[tab]
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab
                  ? 'text-foreground bg-accent'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab}
            </button>
          )
        })}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 flex items-center gap-3 bg-muted px-4 py-3 rounded-xl transition-colors">
          <Search className="w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search doctor, speciality, or symptoms..."
            className="bg-transparent border-none outline-none w-full text-sm placeholder:text-muted-foreground text-foreground"
          />
        </div>
        <button className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors">
          Search
        </button>
      </div>
    </div>
  )
}
