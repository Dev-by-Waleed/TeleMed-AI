'use client';

import React, { useActionState, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Users,
  Stethoscope,
  FileText,
  ShieldAlert,
  UserPlus,
  X,
  Copy,
  Check,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { createDoctorAction } from '@/actions/admin';
import { SPECIALTIES } from '@/lib/specialties';
import { createDoctorSchema } from '@/lib/validations';
import { fmtDateTime } from '@/lib/date';

const EMPTY = { text: '—' };

const tabs = [
  { id: 'doctors', label: 'Doctors', icon: Stethoscope },
  { id: 'patients', label: 'Patients', icon: Users },
  { id: 'appointments', label: 'Appointments', icon: FileText },
];

function statusPill(value, opts = {}) {
  if (!value) return <span className="text-[var(--color-on-surface-variant)] text-xs">{opts.empty ?? '—'}</span>;
  const color = opts.colors?.[value] ?? 'var(--color-on-surface-variant)';
  const bg = opts.bg?.[value] ?? 'var(--color-surface-container-low)';
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold" style={{ color, backgroundColor: bg }}>
      {value}
    </span>
  );
}

function Th({ children }) {
  return <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[var(--color-on-surface-variant)]">{children}</th>;
}
function Td({ children }) {
  return <td className="px-4 py-3 text-sm text-[var(--color-on-surface)] whitespace-nowrap">{children || EMPTY.text}</td>;
}

export default function AdminDashboardView({ stats, doctors = [], patients = [], appointments = [] }) {
  const [activeTab, setActiveTab] = useState('doctors');
  const [showCreate, setShowCreate] = useState(false);
  const [created, setCreated] = useState(null);

  const statCards = [
    { label: 'Total Patients', value: stats?.total_patients ?? 0, icon: Users },
    { label: 'Active Doctors', value: stats?.active_doctors ?? 0, icon: Stethoscope },
    { label: 'Consultations', value: stats?.total_consultations ?? 0, icon: FileText },
    { label: 'Pending Reviews', value: stats?.pending_reviews ?? 0, icon: ShieldAlert },
  ];

  const dismissCreate = () => {
    setShowCreate(false);
    setCreated(null);
  };

  return (
    <div className="p-6 md:p-10 max-w-[1440px] mx-auto w-full">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-[var(--color-foreground)] mb-1">Admin Dashboard</h1>
          <p className="text-base text-[var(--color-on-surface-variant)]">Manage doctors, patients, and appointments.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--color-primary)] text-white rounded-lg text-sm font-semibold hover:bg-[var(--color-primary-dark)] transition-colors"
        >
          <UserPlus className="w-4 h-4" /> Add Doctor
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl p-6 flex flex-col gap-4">
            <Icon className="w-7 h-7 text-[var(--color-primary)]" />
            <div>
              <p className="text-3xl font-bold text-[var(--color-foreground)]">{value}</p>
              <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl overflow-hidden">
        <div className="flex border-b border-[var(--color-outline-variant)] overflow-x-auto">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`inline-flex items-center gap-2 px-5 py-3.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
                activeTab === id
                  ? 'text-[var(--color-primary)] border-[var(--color-primary)]'
                  : 'text-[var(--color-on-surface-variant)] border-transparent hover:text-[var(--color-foreground)]'
              }`}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          {activeTab === 'doctors' && (
            <table className="w-full min-w-[720px]">
              <thead className="border-b border-[var(--color-outline-variant)]">
                <tr>
                  <Th>Name</Th><Th>Email</Th><Th>Specialty</Th><Th>Status</Th><Th>Source</Th><Th>Temp Password</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-outline-variant)]">
                {doctors.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-6 text-center text-sm text-[var(--color-on-surface-variant)]">No doctors yet.</td></tr>
                )}
                {doctors.map((d) => (
                  <tr key={d.id} className="hover:bg-[var(--color-secondary)]/40">
                    <Td>{d.full_name}</Td>
                    <Td>{d.email}</Td>
                    <Td>{d.specialty}</Td>
                    <td className="px-4 py-3">{statusPill(d.account_status || d.active_status, {
                      colors: { active: '#047857', invited: '#b45309', suspended: '#b91c1c', inactive: '#6b7280', pending_change: '#b45309' },
                      bg: { active: '#d1fae5', invited: '#fef3c7', suspended: '#fee2e2', inactive: '#f3f4f6', pending_change: '#fef3c7' },
                    })}</td>
                    <Td>{d.created_by_admin ? 'Admin' : 'Self-signup'}</Td>
                    <Td>{d.temp_password_status === 'pending_change' ? 'Pending change' : '—'}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'patients' && (
            <table className="w-full min-w-[720px]">
              <thead className="border-b border-[var(--color-outline-variant)]">
                <tr><Th>Name</Th><Th>Email</Th><Th>Age</Th><Th>Gender</Th><Th>Status</Th><Th>Onboarded</Th></tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-outline-variant)]">
                {patients.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-6 text-center text-sm text-[var(--color-on-surface-variant)]">No patients yet.</td></tr>
                )}
                {patients.map((p) => (
                  <tr key={p.id} className="hover:bg-[var(--color-secondary)]/40">
                    <Td>{p.full_name}</Td>
                    <Td>{p.email}</Td>
                    <Td>{p.age ?? '—'}</Td>
                    <Td>{p.gender ? (p.gender[0]?.toUpperCase() + p.gender.slice(1)) : '—'}</Td>
                    <td className="px-4 py-3">{statusPill(p.account_status, {
                      colors: { active: '#047857', suspended: '#b91c1c' },
                      bg: { active: '#d1fae5', suspended: '#fee2e2' },
                    })}</td>
                    <Td>{p.completed_onboarding ? 'Yes' : 'No'}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'appointments' && (
            <table className="w-full min-w-[820px]">
              <thead className="border-b border-[var(--color-outline-variant)]">
                <tr><Th>Patient</Th><Th>Doctor</Th><Th>Specialty</Th><Th>Date</Th><Th>Duration</Th><Th>Status</Th></tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-outline-variant)]">
                {appointments.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-6 text-center text-sm text-[var(--color-on-surface-variant)]">No appointments yet.</td></tr>
                )}
                {appointments.map((a) => (
                  <tr key={a.id} className="hover:bg-[var(--color-secondary)]/40">
                    <Td>{a.patient_name}</Td>
                    <Td>{a.doctor_name}</Td>
                    <Td>{a.specialty}</Td>
                    <Td>{fmtDateTime(a.scheduled_at) || '—'}</Td>
                    <Td>{a.duration_min ? `${a.duration_min} min` : '—'}</Td>
                    <td className="px-4 py-3">{statusPill(a.status, {
                      colors: { pending: '#b45309', approved: '#047857', confirmed: '#047857', cancelled: '#b91c1c', completed: '#0e7490' },
                      bg: { pending: '#fef3c7', approved: '#d1fae5', confirmed: '#d1fae5', cancelled: '#fee2e2', completed: '#cffafe' },
                    })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={dismissCreate}>
          <div className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl max-w-lg w-full p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[var(--color-foreground)]">
                {created ? 'Doctor Created' : 'Add a New Doctor'}
              </h2>
              <button type="button" onClick={dismissCreate} className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-foreground)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {created ? (
              <SuccessMessage created={created} onClose={dismissCreate} />
            ) : (
              <CreateDoctorForm onCancel={dismissCreate} onCreated={setCreated} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CreateDoctorForm({ onCancel, onCreated }) {
  const [state, formAction, isPending] = useActionState(createDoctorAction, null);
  const [, startTransition] = React.useTransition();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(createDoctorSchema),
    defaultValues: { fullName: '', email: '', specialty: '', deliveryMode: 'direct' },
  });

  React.useEffect(() => {
    if (state?.success) {
      toast.success('Doctor created successfully!');
      onCreated(state);
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, onCreated]);

  const onSubmit = (data) => {
    const fd = new FormData();
    fd.set('full_name', data.fullName);
    fd.set('email', data.email);
    fd.set('specialty', data.specialty);
    fd.set('delivery_mode', data.deliveryMode);
    startTransition(() => formAction(fd));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {state?.error && <p role="alert" className="text-sm text-red-600 font-medium">{state.error}</p>}
      <div>
        <label className="block text-sm font-medium text-[var(--color-on-surface-variant)] mb-1">Full Name</label>
        <input {...register('fullName')} required className="w-full px-3 py-2 rounded-lg border border-[var(--color-outline-variant)] bg-[var(--color-surface)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40" placeholder="Dr. Jane Smith" />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--color-on-surface-variant)] mb-1">Email</label>
        <input {...register('email')} type="email" required className="w-full px-3 py-2 rounded-lg border border-[var(--color-outline-variant)] bg-[var(--color-surface)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40" placeholder="jane@clinic.com" />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--color-on-surface-variant)] mb-1">Specialty</label>
        <select {...register('specialty')} required className="w-full px-3 py-2 rounded-lg border border-[var(--color-outline-variant)] bg-[var(--color-surface)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40">
          {SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--color-on-surface-variant)] mb-1">Account Delivery</label>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="radio" {...register('deliveryMode')} value="direct" className="accent-[var(--color-primary)]" />
            Generate a temporary password (shown once now — doctor changes it on first login)
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="radio" {...register('deliveryMode')} value="invite" className="accent-[var(--color-primary)]" />
            Generate an invite link the doctor can use to set their own password
          </label>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 px-4 py-2.5 rounded-lg border border-[var(--color-outline-variant)] text-sm font-semibold text-[var(--color-on-surface-variant)] hover:bg-[var(--color-secondary)] transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={isPending} className="flex-1 px-4 py-2.5 bg-[var(--color-primary)] text-white rounded-lg text-sm font-semibold hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2">
          {isPending ? (<><Loader2 className="w-4 h-4 animate-spin" /> Creating...</>) : 'Create Doctor'}
        </button>
      </div>
    </form>
  );
}

function CopyButton({ label, value }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => { await navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-primary)] hover:underline"
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

function SuccessMessage({ created, onClose }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--color-on-surface)]">
        Doctor <strong>{created.fullName}</strong> ({created.email}) was created with the <strong>Doctor</strong> role.
      </p>
      <div className="rounded-lg border border-[var(--color-outline-variant)] bg-[var(--color-surface)] p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm text-[var(--color-on-surface-variant)]">Login email</p>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[var(--color-foreground)]">{created.email}</span>
            <CopyButton label="email" value={created.email} />
          </div>
        </div>
        {created.isInvite ? (
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-[var(--color-on-surface-variant)]">Invite link</p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-[var(--color-on-surface)] break-all">{`${window.location.origin}/doctor-invite/${created.inviteToken}`}</span>
              <CopyButton label="invite" value={`${window.location.origin}/doctor-invite/${created.inviteToken}`} />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-[var(--color-on-surface-variant)]">Temporary password</p>
            <div className="flex items-center gap-2">
              <code className="text-sm font-semibold text-[var(--color-primary)]">{created.password}</code>
              <CopyButton label="password" value={created.password} />
            </div>
          </div>
        )}
      </div>
      <p className="text-xs text-[var(--color-on-surface-variant)]">
        {created.isInvite
          ? 'Share this invite link with the doctor. They will set their own password on first login.'
          : 'Share the temporary password securely with the doctor. They will be asked to change it on first login.'}
      </p>
      <button type="button" onClick={onClose} className="w-full px-4 py-2.5 bg-[var(--color-primary)] text-white rounded-lg text-sm font-semibold hover:bg-[var(--color-primary-dark)] transition-colors">
        Done
      </button>
    </div>
  );
}
