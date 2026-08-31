'use client';

import React, { useMemo, useState } from 'react';
import { Filter, Star, X } from 'lucide-react';

export default function AvailableDoctors({ doctors = [] }) {
  const [specialty, setSpecialty] = useState('');

  const specialties = useMemo(
    () => [...new Set(doctors.map((d) => d.specialty).filter(Boolean))].sort(),
    [doctors]
  );

  const filtered = useMemo(
    () => (specialty ? doctors.filter((d) => d.specialty === specialty) : doctors),
    [doctors, specialty]
  );

  return (
    <section className="lg:col-span-8 flex flex-col gap-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold text-[var(--color-foreground)]">
          Available Doctors
        </h2>

        <div className="relative">
          <div className="flex items-center gap-1.5">
            {specialty && (
              <button
                type="button"
                aria-label="Clear specialty filter"
                onClick={() => setSpecialty('')}
                className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1.5 rounded-lg transition-colors"
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-on-primary)',
                }}
              >
                {specialty} <X className="w-3 h-3" />
              </button>
            )}
            <div className="relative">
              <select
                aria-label="Filter doctors by specialty"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="text-sm font-medium pl-3 pr-8 py-1.5 rounded-lg border outline-none transition-colors cursor-pointer appearance-none"
                style={{
                  backgroundColor: 'var(--color-surface-card)',
                  borderColor: 'var(--color-outline-variant)',
                  color: 'var(--color-on-surface)',
                }}
              >
                <option value="">All Specialties</option>
                {specialties.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <Filter
                className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: 'var(--color-outline)' }}
              />
            </div>
          </div>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl p-8 text-center text-sm text-[var(--color-on-surface-variant)]">
          No doctors found{specialty ? ` in ${specialty}` : ''}.
        </div>
      )}

      {filtered.map((doc) => (
        <div
          key={doc.id}
          className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center hover:shadow-md transition-shadow"
        >
          <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 relative bg-[var(--color-surface-container-high)] flex items-center justify-center text-lg font-bold text-[var(--color-primary)]">
            {doc.full_name.charAt(0)}
          </div>
          <div className="flex-grow">
            <h3 className="text-lg font-semibold text-[var(--color-foreground)]">
              {doc.full_name}
            </h3>
            <p className="text-sm text-[var(--color-on-surface-variant)]">
              {doc.specialty}
            </p>
            <div className="flex items-center gap-1 mt-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="text-sm font-semibold text-[var(--color-foreground)]">
                {doc.rating}
              </span>
              <span className="text-xs text-[var(--color-outline)]">
                ({doc.reviews_count} reviews)
              </span>
            </div>
          </div>
          <div className="mt-2 sm:mt-0 w-full sm:w-auto">
            <a
              href="/patient/appointments"
              className="block w-full sm:w-auto text-center bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] transition-colors px-6 py-2.5 rounded-lg text-sm font-semibold shadow-sm"
            >
              Book Appointment
            </a>
          </div>
        </div>
      ))}
    </section>
  );
}
