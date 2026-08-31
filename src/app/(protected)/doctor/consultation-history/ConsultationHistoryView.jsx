'use client';

import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  FileText,
  Check,
  X,
} from 'lucide-react';

const STATUS_OPTIONS = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

export default function ConsultationHistoryView({ consultations }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const filterRef = useRef(null);

  const PAGE_SIZE = 5;
  const resetPage = () => setPage(1);

  // Close the filter popover when clicking outside.
  useEffect(() => {
    function handleClickOutside(e) {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeFilterCount = statusFilter ? 1 : 0;

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return consultations.filter((c) => {
      if (term &&
        !c.name.toLowerCase().includes(term) &&
        !c.id.toLowerCase().includes(term) &&
        !c.status.toLowerCase().includes(term)) {
        return false;
      }
      if (statusFilter && c.status !== statusFilter) return false;
      return true;
    });
  }, [consultations, searchTerm, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(startIndex, startIndex + PAGE_SIZE);

  const clearFilters = () => {
    setStatusFilter(null);
    resetPage();
  };

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
                onChange={(e) => { setSearchTerm(e.target.value); resetPage(); }}
                placeholder="Search history..."
                className="w-full pl-9 pr-4 py-2 border rounded-lg focus:outline-none text-xs"
                style={{
                  backgroundColor: 'var(--color-surface-card)',
                  borderColor: 'var(--color-outline-variant)',
                  color: 'var(--color-on-surface)',
                }}
              />
            </div>

          <div className="relative" ref={filterRef}>
            <button
              type="button"
              onClick={() => setFilterOpen((v) => !v)}
              className="flex items-center space-x-2 px-3.5 py-2 border rounded-lg transition-colors text-xs font-semibold shadow-sm hover:opacity-90"
              style={{
                backgroundColor: 'var(--color-surface-card)',
                borderColor: activeFilterCount > 0 ? 'var(--color-primary)' : 'var(--color-outline-variant)',
                color: activeFilterCount > 0 ? 'var(--color-primary)' : 'var(--color-on-surface)',
              }}
            >
              <Filter className="w-4 h-4" style={{ color: activeFilterCount > 0 ? 'var(--color-primary)' : 'var(--color-outline)' }} />
              <span>Filter</span>
              {activeFilterCount > 0 && (
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold"
                  style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }}>
                  {activeFilterCount}
                </span>
              )}
            </button>

            {filterOpen && (
              <div
                className="absolute right-0 mt-2 w-64 rounded-xl border shadow-xl p-4 z-30"
                style={{ backgroundColor: 'var(--color-surface-card)', borderColor: 'var(--color-outline-variant)' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-on-surface-variant)' }}>
                    Filters
                  </span>
                  <button type="button" onClick={() => setFilterOpen(false)} style={{ color: 'var(--color-on-surface-variant)' }}>
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--color-on-surface-variant)' }}>
                  Status
                </label>
                <div className="flex flex-wrap gap-1.5 my-2">
                  {STATUS_OPTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => { setStatusFilter(statusFilter === s ? null : s); resetPage(); }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors"
                      style={
                        statusFilter === s
                          ? { backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }
                          : { backgroundColor: 'var(--color-surface-container-low)', color: 'var(--color-on-surface)', border: '1px solid var(--color-outline-variant)' }
                      }
                    >
                      {statusFilter === s && <Check className="w-3 h-3" />}
                      {s}
                    </button>
                  ))}
                </div>

                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="w-full mt-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>
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
                    Status
                  </th>
                  <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-right" style={{ color: 'var(--color-on-surface-variant)' }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y text-xs" style={{ borderColor: 'var(--color-outline-variant)' }}>
                {pageItems.map((item, index) => {
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
                {pageItems.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                      {activeFilterCount > 0 || searchTerm.trim()
                        ? 'No consultations match your search or filters.'
                        : 'No consultations yet.'}
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
              Showing {pageItems.length} of {filtered.length} {filtered.length === 1 ? 'entry' : 'entries'}
            </span>
            {totalPages > 1 && (
              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  className="p-1 rounded disabled:opacity-40 hover:bg-[var(--color-surface-container-high)]"
                  style={{ color: 'var(--color-on-surface-variant)' }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setPage(n)}
                    className="w-7 h-7 rounded text-xs font-semibold flex items-center justify-center transition-colors hover:bg-[var(--color-surface-container-high)]"
                    style={
                      n === safePage
                        ? { backgroundColor: 'var(--color-primary)', color: 'var(--color-surface-card)', boxShadow: '0 1px 2px rgba(0,0,0,0.15)' }
                        : { color: 'var(--color-on-surface)' }
                    }
                  >
                    {n}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                  className="p-1 rounded disabled:opacity-40 hover:bg-[var(--color-surface-container-high)]"
                  style={{ color: 'var(--color-on-surface-variant)' }}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}
