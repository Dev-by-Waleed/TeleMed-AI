'use client';

import React from 'react';
import { VideoOff, CalendarDays } from 'lucide-react';
import Link from 'next/link';

export default function DoctorConsultation() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh] bg-[var(--color-surface-bright)]">
      <div className="text-center max-w-md px-6">
        <div className="w-16 h-16 rounded-full bg-[var(--color-surface-container)] flex items-center justify-center mx-auto mb-5">
          <VideoOff className="w-8 h-8 text-[var(--color-on-surface-variant)]" />
        </div>
        <h2 className="text-xl font-bold text-[var(--color-on-surface)] mb-2">
          No Active Consultation
        </h2>
        <p className="text-sm text-[var(--color-on-surface-variant)] mb-6">
          You&apos;ll see your active consultation here when a patient joins a session.
        </p>
        <Link
          href="/doctor/dashboard"
          className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[var(--color-primary-dark)] transition-colors shadow-sm"
        >
          <CalendarDays className="w-4 h-4" />
          View Dashboard
        </Link>
      </div>
    </div>
  );
}
