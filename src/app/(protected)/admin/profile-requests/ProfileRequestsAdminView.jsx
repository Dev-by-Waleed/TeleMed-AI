"use client";

import React, { useActionState } from "react";
import { ClipboardPenLine, Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";
import { decideProfileRequestAction } from "@/actions/profile-requests";

function statusPill(value) {
  const meta = {
    pending: { label: "Pending", bg: "#fef3c7", color: "#b45309", icon: Clock },
    approved: { label: "Approved", bg: "#d1fae5", color: "#047857", icon: CheckCircle2 },
    denied: { label: "Declined", bg: "#fee2e2", color: "#b91c1c", icon: XCircle },
  };
  const m = meta[value] || meta.pending;
  const Icon = m.icon;
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold" style={{ backgroundColor: m.bg, color: m.color }}>
      <Icon className="w-3.5 h-3.5" />
      {m.label}
    </span>
  );
}

function Th({ children }) {
  return <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[var(--color-on-surface-variant)]">{children}</th>;
}
function Td({ children }) {
  return <td className="px-4 py-3 text-sm text-[var(--color-on-surface)] whitespace-nowrap">{children || "—"}</td>;
}

function DecideForm({ request }) {
  const [state, formAction, isPending] = useActionState(decideProfileRequestAction, null);
  return (
    <form action={formAction} className="flex flex-col gap-2">
      <input type="hidden" name="request_id" value={request.id} />
      <div className="flex gap-2">
        <button
          type="submit"
          name="decision"
          value="approved"
          disabled={isPending}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#047857] hover:bg-[#065f46] transition-colors disabled:opacity-50"
        >
          {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
          Approve
        </button>
        <button
          type="submit"
          name="decision"
          value="denied"
          disabled={isPending}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#b91c1c] hover:bg-[#991b1b] transition-colors disabled:opacity-50"
        >
          {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
          Decline
        </button>
      </div>
      {state?.error && <span className="text-xs text-red-600">{state.error}</span>}
    </form>
  );
}

function RequestRow({ request }) {
  const changes = [
    request.requested_full_name ? `Name → ${request.requested_full_name}` : null,
    request.requested_specialty ? `Specialty → ${request.requested_specialty}` : null,
  ]
    .filter(Boolean)
    .join(", ");
  return (
    <tr key={request.id} className="hover:bg-[var(--color-secondary)]/40 align-top">
      <Td>
        <p className="font-semibold">{request.doctor_name}</p>
        <span className="block text-xs text-[var(--color-on-surface-variant)]">{request.doctor_email}</span>
        <span className="block mt-0.5 text-xs text-[var(--color-on-surface-variant)]">{request.doctor_specialty}</span>
      </Td>
      <td className="px-4 py-3 text-sm text-[var(--color-on-surface)]">
        <p className="font-semibold">{changes}</p>
        {request.reason && (
          <p className="text-xs mt-1 max-w-xs whitespace-normal" style={{ color: "var(--color-on-surface-variant)" }}>
            {request.reason}
          </p>
        )}
      </td>
      <Td>{new Date(request.created_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}</Td>
      <td className="px-4 py-3">{statusPill(request.status)}</td>
      <td className="px-4 py-3 text-sm text-[var(--color-on-surface-variant)] whitespace-normal max-w-xs">
        {request.admin_response || "—"}
      </td>
      <td className="px-4 py-3">{request.status === "pending" ? <DecideForm request={request} /> : "—"}</td>
    </tr>
  );
}

export default function ProfileRequestsAdminView({ requests = [] }) {
  const pending = requests.filter((r) => r.status === "pending").length;
  return (
    <div className="p-6 md:p-10 max-w-[1440px] mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-[var(--color-foreground)] mb-1">Profile Requests</h1>
        <p className="text-base text-[var(--color-on-surface-variant)]">
          Review doctor requests to change their display name or specialty (admin-managed fields).
          {pending > 0 && <span className="ml-1 font-semibold text-[var(--color-primary)]">({pending} pending)</span>}
        </p>
      </div>

      <div className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px]">
            <thead className="border-b border-[var(--color-outline-variant)]">
              <tr>
                <Th>Doctor</Th>
                <Th>Requested Change</Th>
                <Th>Date</Th>
                <Th>Status</Th>
                <Th>Admin Response</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-outline-variant)]">
              {requests.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <ClipboardPenLine className="w-8 h-8 text-[var(--color-on-surface-variant)] mx-auto mb-3" />
                    <p className="text-sm text-[var(--color-on-surface-variant)]">No profile requests yet.</p>
                  </td>
                </tr>
              )}
              {requests.map((r) => (
                <RequestRow key={r.id} request={r} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
