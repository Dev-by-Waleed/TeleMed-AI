'use client';

import React, { useMemo, useState } from 'react';
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  FileText
} from 'lucide-react';

export default function ConsultationHistoryView({ consultations }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return consultations;
    return consultations.filter((c) =>
      c.name.toLowerCase().includes(term) ||
      c.id.toLowerCase().includes(term) ||
      c.type.toLowerCase().includes(term) ||
      c.status.toLowerCase().includes(term)
    );
  }, [consultations, searchTerm]);

  return (
    <main
      className="flex-1 overflow-y-auto p-4 md:p-8"
      style={{ backgroundColor: 'var(--color-surface-bright)' }}
    >
      <div className="max-w-[1440px] mx-auto space-y-6">

        {/* Header & Filter Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight" style={{ color: 'var(--color-on-surface)' }}>
              Consultation History
            </h1>
            <p className="text-xs mt-1" style={{ color: 'var(--color-on-surface-variant)' }}>
              Review past patient encounters, records, and clinical summaries.
            </p>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                style={{ color: 'var(--color-outline)' }}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search history..."
                className="w-full pl-9 pr-4 py-2 border rounded-lg focus:outline-none text-xs"
                style={{
                  backgroundColor: 'var(--color-surface-card)',
                  borderColor: 'var(--color-outline-variant)',
                  color: 'var(--color-on-surface)',
                }}
              />
            </div>

            <button
              className="flex items-center space-x-2 px-3.5 py-2 border rounded-lg transition-colors text-xs font-semibold shadow-sm hover:opacity-90"
              style={{
                backgroundColor: 'var(--color-surface-card)',
                borderColor: 'var(--color-outline-variant)',
                color: 'var(--color-on-surface)',
              }}
            >
              <Filter className="w-4 h-4" style={{ color: 'var(--color-outline)' }} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* History Data Table Container */}
        <div
          className="rounded-xl border shadow-sm overflow-hidden"
          style={{
            backgroundColor: 'var(--color-surface-card)',
            borderColor: 'var(--color-outline-variant)',
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr
                  className="border-b"
                  style={{
                    backgroundColor: 'var(--color-surface-container-low)',
                    borderColor: 'var(--color-outline-variant)',
                  }}
                >
                  <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-on-surface-variant)' }}>
                    Patient Name
                  </th>
                  <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-on-surface-variant)' }}>
                    Date & Time
                  </th>
                  <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-on-surface-variant)' }}>
                    Type
                  </th>
                  <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-on-surface-variant)' }}>
                    Status
                  </th>
                  <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-right" style={{ color: 'var(--color-on-surface-variant)' }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y text-xs" style={{ borderColor: 'var(--color-outline-variant)' }}>
                {filtered.map((item, index) => {
                  const TypeIcon = item.typeIcon;
                  return (
                    <tr key={index} className="transition-colors hover:bg-[var(--color-surface-container-low)]">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center font-bold border"
                            style={{
                              backgroundColor: 'var(--color-surface-container-high)',
                              color: 'var(--color-primary)',
                              borderColor: 'var(--color-outline-variant)',
                            }}
                          >
                            {item.name.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold" style={{ color: 'var(--color-on-surface)' }}>
                              {item.name}
                            </div>
                            <div className="text-[10px]" style={{ color: 'var(--color-on-surface-variant)' }}>
                              ID: {item.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4" style={{ color: 'var(--color-on-surface)' }}>
                        <div className="font-medium">{item.date}</div>
                        <div className="text-[10px]" style={{ color: 'var(--color-on-surface-variant)' }}>{item.time}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2 font-medium" style={{ color: 'var(--color-on-surface)' }}>
                          <TypeIcon className="w-4 h-4" style={{ color: 'var(--color-tertiary)' }} />
                          <span>{item.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold"
                          style={{
                            backgroundColor: 'var(--color-surface-container-high)',
                            color: 'var(--color-primary-dark)',
                          }}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          className="px-3.5 py-1.5 rounded-lg font-semibold text-xs transition-colors inline-flex items-center gap-1.5 hover:opacity-90"
                          style={{
                            backgroundColor: 'var(--color-secondary)',
                            color: 'var(--color-primary-dark)',
                          }}
                        >
                          <FileText className="w-3.5 h-3.5" />
                          View Summary
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                      No consultations match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div
            className="px-6 py-3 border-t flex items-center justify-between"
            style={{
              borderColor: 'var(--color-outline-variant)',
              backgroundColor: 'var(--color-surface-container-low)',
            }}
          >
            <span className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>
              Showing {filtered.length} {filtered.length === 1 ? 'entry' : 'entries'}
            </span>
            <div className="flex items-center space-x-1.5">
              <button
                disabled
                className="p-1 rounded disabled:opacity-40"
                style={{ color: 'var(--color-on-surface-variant)' }}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                className="w-7 h-7 rounded text-xs font-semibold flex items-center justify-center shadow-sm"
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-surface-card)',
                }}
              >
                1
              </button>
              <button
                className="w-7 h-7 rounded text-xs font-semibold flex items-center justify-center transition-colors hover:bg-[var(--color-surface-container-high)]"
                style={{ color: 'var(--color-on-surface)' }}
              >
                2
              </button>
              <button
                className="w-7 h-7 rounded text-xs font-semibold flex items-center justify-center transition-colors hover:bg-[var(--color-surface-container-high)]"
                style={{ color: 'var(--color-on-surface)' }}
              >
                3
              </button>
              <span className="text-xs px-1" style={{ color: 'var(--color-on-surface-variant)' }}>...</span>
              <button
                className="p-1 rounded hover:bg-[var(--color-surface-container-high)]"
                style={{ color: 'var(--color-on-surface-variant)' }}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
