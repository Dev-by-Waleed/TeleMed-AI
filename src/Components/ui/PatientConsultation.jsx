'use client';

import React from 'react';
import Link from 'next/link';
import { VideoOff, CalendarPlus } from 'lucide-react';

export default function PatientConsultation() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh] bg-[var(--color-surface)]">
      <div className="text-center max-w-md px-6">
        <div className="w-16 h-16 rounded-full bg-[var(--color-surface-container)] flex items-center justify-center mx-auto mb-5">
          <VideoOff className="w-8 h-8 text-[var(--color-on-surface-variant)]" />
        </div>
        <h2 className="text-xl font-bold text-[var(--color-on-surface)] mb-2">
          No Active Consultation
        </h2>
        <p className="text-sm text-[var(--color-on-surface-variant)] mb-6">
          Book an appointment to start a consultation with your doctor.
        </p>
        <Link
          href="/patient/appointments"
          className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[var(--color-primary-dark)] transition-colors shadow-sm"
        >
          <CalendarPlus className="w-4 h-4" />
          Book Appointment
        </Link>
      </div>
    </div>
  );
}
