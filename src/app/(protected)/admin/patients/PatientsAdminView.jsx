'use client';

import React, { useActionState, useState } from 'react';
import { Users, Loader2, Ban, CheckCircle2, FileText, X, Activity } from 'lucide-react';
import { setUserStatusAction, getPatientProfileAction } from '@/actions/admin';

function statusPill(value) {
  const colors = {
    active: { color: '#047857', bg: '#d1fae5' },
    suspended: { color: '#b91c1c', bg: '#fee2e2' },
  };
  const c = colors[value] || { color: 'var(--color-on-surface-variant)', bg: 'var(--color-surface-container-low)' };
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold" style={{ color: c.color, backgroundColor: c.bg }}>
      {value}
    </span>
  );
}

function StatusToggle({ patient }) {
  const [state, formAction, isPending] = useActionState(setUserStatusAction, null);
  const suspended = patient.account_status === 'suspended';
  return (
    <form action={formAction} className="inline-flex items-center gap-2">
      <input type="hidden" name="user_id" value={patient.id} />
      <input type="hidden" name="role" value="patient" />
      <input type="hidden" name="status" value={suspended ? 'active' : 'suspended'} />
      <button
        type="submit"
        disabled={isPending}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 ${
          suspended
            ? 'text-white bg-[#047857] hover:bg-[#065f46]'
            : 'text-white bg-[#b91c1c] hover:bg-[#991b1b]'
        }`}
      >
        {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : suspended ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
        {suspended ? 'Activate' : 'Suspend'}
      </button>
      {state?.error && <span className="text-xs text-red-600">{state.error}</span>}
    </form>
  );
}

function Th({ children }) {
  return <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[var(--color-on-surface-variant)]">{children}</th>;
}
function Td({ children }) {
  return <td className="px-4 py-3 text-sm text-[var(--color-on-surface)] whitespace-nowrap">{children || '—'}</td>;
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-on-surface-variant)] mb-1">{label}</p>
      <p className="text-sm text-[var(--color-on-surface)]">{value || '—'}</p>
    </div>
  );
}

function ProfileDrawer({ patient, onClose }) {
  const [state, formAction, isPending] = useActionState(getPatientProfileAction, null);
  const opened = !!state?.success;
  const p = state?.profile;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50" onClick={onClose}>
      <div
        className="bg-[var(--color-surface-card)] border-l border-[var(--color-outline-variant)] w-full max-w-md h-full overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-[var(--color-outline-variant)] bg-[var(--color-surface-card)]">
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-foreground)]">{patient.full_name}</h2>
            <p className="text-sm text-[var(--color-on-surface-variant)]">{patient.email}</p>
          </div>
          <button type="button" onClick={onClose} className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-foreground)]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <form action={formAction}>
            <input type="hidden" name="user_id" value={patient.id} />
            <button
              type="submit"
              disabled={isPending || opened}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--color-primary)] text-white rounded-lg text-sm font-semibold hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-60"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
              {opened ? 'Medical Profile Loaded' : 'Load Medical Profile'}
            </button>
            {state?.error && <p role="alert" className="mt-3 text-sm text-red-600">{state.error}</p>}
          </form>

          {p && (
            <div className="mt-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Age" value={p.age} />
                <Field label="Gender" value={p.gender ? p.gender[0]?.toUpperCase() + p.gender.slice(1) : ''} />
                <Field label="Height (cm)" value={p.height_cm} />
                <Field label="Weight (kg)" value={p.weight_kg} />
                <Field label="Blood Group" value={p.blood_group} />
                <Field label="Smoking" value={p.smoking_status} />
              </div>
              <Field label="Emergency Contact" value={p.emergency_contact} />
              <Field label="Allergies" value={p.allergy_summary} />
              <Field label="Medications" value={p.medication_summary} />
              <Field label="Conditions" value={p.condition_summary} />
              <Field label="Past Surgeries" value={p.past_surgeries} />
              <Field label="Chronic Illness Notes" value={p.chronic_illness_notes} />
              <Field label="Additional Notes" value={p.notes} />
              <div className="pt-2 border-t border-[var(--color-outline-variant)]">
                <p className="text-xs text-[var(--color-on-surface-variant)]">
                  {p.completed_onboarding ? 'Onboarding completed' : 'Onboarding incomplete'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PatientsAdminView({ patients = [] }) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="p-6 md:p-10 max-w-[1440px] mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-[var(--color-foreground)] mb-1">Manage Patients</h1>
        <p className="text-base text-[var(--color-on-surface-variant)]">Suspend, reactivate, or review patient medical profiles.</p>
      </div>

      <div className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px]">
            <thead className="border-b border-[var(--color-outline-variant)]">
              <tr>
                <Th>Name</Th><Th>Email</Th><Th>Age</Th><Th>Gender</Th><Th>Status</Th><Th>Onboarded</Th><Th>Profile</Th><Th>Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-outline-variant)]">
              {patients.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <Users className="w-8 h-8 text-[var(--color-on-surface-variant)] mx-auto mb-3" />
                    <p className="text-sm text-[var(--color-on-surface-variant)]">No patients yet.</p>
                  </td>
                </tr>
              )}
              {patients.map((p) => (
                <tr key={p.id} className="hover:bg-[var(--color-secondary)]/40">
                  <Td>{p.full_name}</Td>
                  <Td>{p.email}</Td>
                  <Td>{p.age ?? '—'}</Td>
                  <Td>{p.gender ? (p.gender[0]?.toUpperCase() + p.gender.slice(1)) : '—'}</Td>
                  <td className="px-4 py-3">{statusPill(p.account_status)}</td>
                  <Td>{p.completed_onboarding ? 'Yes' : 'No'}</Td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setSelected(p)}
                      disabled={!p.completed_onboarding}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-primary)] hover:underline disabled:opacity-40 disabled:no-underline"
                    >
                      <Activity className="w-3.5 h-3.5" /> View
                    </button>
                  </td>
                  <td className="px-4 py-3"><StatusToggle patient={p} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && <ProfileDrawer patient={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
