import Link from "next/link"
import { fmtDateShort, fmtDateTime } from "@/lib/date"
import {
  User,
  Mail,
  Pill,
  FileText,
  CalendarDays,
  Stethoscope,
  ClipboardList,
  HeartPulse,
  Activity,
  Users,
  MessageSquare,
  PlusCircle,
  ShieldCheck,
} from "lucide-react"

function statusLabel(status) {
  return (status || "pending").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}
function statusColor(status) {
  switch (status) {
    case "completed":
      return "#047857"
    case "confirmed":
      return "#a16207"
    case "pending":
      return "#0369a1"
    case "discontinued":
    case "cancelled":
      return "#64748b"
    default:
      return "#475569"
  }
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-on-surface-variant)" }}>
        {label}
      </p>
      <p className="text-sm font-medium mt-0.5" style={{ color: "var(--color-on-surface)" }}>
        {value || "—"}
      </p>
    </div>
  )
}

function SectionCard({ icon, title, children, trailing }) {
  return (
    <section
      className="rounded-xl border shadow-sm p-5"
      style={{ backgroundColor: "var(--color-surface-card)", borderColor: "var(--color-outline-variant)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold flex items-center gap-2" style={{ color: "var(--color-on-surface)" }}>
          <span className="p-1.5 rounded-lg" style={{ backgroundColor: "var(--color-secondary)", color: "var(--color-primary-dark)" }}>
            {icon}
          </span>
          {title}
        </h2>
        {trailing}
      </div>
      {children}
    </section>
  )
}

export default function PatientDetail({ patient, medical, reports, prescriptions, appointments }) {
  const initials = (patient.full_name || "Patient")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  const ongoing = appointments.find((a) => a.status === "confirmed" || a.status === "pending")

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8" style={{ backgroundColor: "var(--color-surface-bright)" }}>
      <div className="max-w-[1100px] mx-auto space-y-6">
        <div
          className="rounded-2xl border shadow-sm p-6"
          style={{
            backgroundColor: "var(--color-surface-card)",
            borderColor: "var(--color-outline-variant)",
            backgroundImage: "linear-gradient(135deg, transparent, color-mix(in srgb, var(--color-primary) 8%, transparent))",
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg shrink-0"
              style={{ backgroundColor: "var(--color-surface-container-high)", color: "var(--color-primary)" }}
            >
              {initials}
            </div>
            <div className="flex-1">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight" style={{ color: "var(--color-on-surface)" }}>
                {patient.full_name}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm" style={{ color: "var(--color-on-surface-variant)" }}>
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  {patient.email}
                </span>
                {medical?.age ? (
                  <span className="inline-flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    {medical.age} years{medical?.gender ? ` · ${medical.gender}` : ""}
                  </span>
                ) : medical?.gender ? (
                  <span className="inline-flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    {medical.gender}
                  </span>
                ) : null}
                <span className="inline-flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5" />
                  {appointments.length} {appointments.length === 1 ? "visit" : "visits"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/doctor/prescriptions"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                <PlusCircle className="w-4 h-4" />
                Prescribe
              </Link>
              {ongoing ? (
                <Link
                  href={`/doctor/consultation/${ongoing.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "var(--color-secondary)", color: "var(--color-primary-dark)" }}
                >
                  <MessageSquare className="w-4 h-4" />
                  {ongoing.status === "confirmed" ? "Continue Visit" : "View Visit"}
                </Link>
              ) : (
                <Link
                  href="/doctor/consultations"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "var(--color-secondary)", color: "var(--color-primary-dark)" }}
                >
                  <CalendarDays className="w-4 h-4" />
                  History
                </Link>
              )}
            </div>
          </div>
        </div>

        <SectionCard icon={<Activity className="w-4 h-4" />} title="Medical Profile">
          {!medical ? (
            <p className="text-sm" style={{ color: "var(--color-on-surface-variant)" }}>
              No medical profile on file yet.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-4">
              <Field label="Age" value={medical.age ? `${medical.age} years` : null} />
              <Field label="Gender" value={medical.gender} />
              <Field label="Blood Group" value={medical.blood_group} />
              <Field label="Height" value={medical.height_cm ? `${medical.height_cm} cm` : null} />
              <Field label="Weight" value={medical.weight_kg ? `${medical.weight_kg} kg` : null} />
              <Field label="Smoking Status" value={medical.smoking_status} />
              <Field label="Emergency Contact" value={medical.emergency_contact} />
            </div>
          )}

          {medical && (
            <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-on-surface-variant)" }}>
                  Known Conditions
                </p>
                <p className="text-sm mt-1" style={{ color: "var(--color-on-surface)" }}>
                  {medical.conditions || medical.chronic_illness_notes || "None listed"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-on-surface-variant)" }}>
                  Allergies
                </p>
                <p className="text-sm mt-1" style={{ color: "var(--color-on-surface)" }}>
                  {medical.allergies || "None listed"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-on-surface-variant)" }}>
                  Current Medications
                </p>
                <p className="text-sm mt-1" style={{ color: "var(--color-on-surface)" }}>
                  {medical.medications || "None listed"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-on-surface-variant)" }}>
                  Corrections / Notes
                </p>
                <p className="text-sm mt-1" style={{ color: "var(--color-on-surface)" }}>
                  {medical.notes || "None"}
                </p>
              </div>
            </div>
          )}
        </SectionCard>

        <SectionCard
          icon={<Users className="w-4 h-4" />}
          title="Visits with You"
          trailing={
            appointments.some((a) => a.status === "completed") ? (
              <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-on-surface-variant)" }}>
                {appointments.filter((a) => a.status === "completed").length} completed
              </span>
            ) : null
          }
        >
          {appointments.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--color-on-surface-variant)" }}>
              No appointments yet.
            </p>
          ) : (
            <div className="space-y-3">
              {appointments.map((a) => (
                <div key={a.id} className="rounded-lg p-4" style={{ backgroundColor: "var(--color-surface)" }}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--color-on-surface)" }}>
                      <CalendarDays className="w-4 h-4" style={{ color: "var(--color-primary)" }} />
                      {fmtDateTime(a.scheduled_at)}
                      <span className="text-xs font-normal" style={{ color: "var(--color-on-surface-variant)" }}>
                        · {a.duration_min ?? 30} min
                      </span>
                    </div>
                    <span
                      className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full shrink-0 self-start sm:self-auto"
                      style={{ backgroundColor: "color-mix(in srgb, var(--color-outline-variant) 40%, transparent)", color: statusColor(a.status) }}
                    >
                      {statusLabel(a.status)}
                    </span>
                  </div>
                  {a.reason ? (
                    <p className="text-xs mt-1.5" style={{ color: "var(--color-on-surface-variant)" }}>
                      {a.reason}
                    </p>
                  ) : null}
                  {a.consultation_notes ? (
                    <div className="mt-2.5 rounded-lg p-3 flex items-start gap-2 text-xs" style={{ backgroundColor: "var(--color-surface-card)" }}>
                      <ClipboardList className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: "var(--color-primary-dark)" }} />
                      <span style={{ color: "var(--color-on-surface)" }}>{a.consultation_notes}</span>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard
          icon={<Pill className="w-4 h-4" />}
          title="Your Prescriptions"
          trailing={
            prescriptions.length ? (
              <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-on-surface-variant)" }}>
                {prescriptions.filter((p) => p.status === "active").length} active
              </span>
            ) : null
          }
        >
          {prescriptions.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--color-on-surface-variant)" }}>
              Nothing prescribed yet. Use the Prescribe button above to write a new prescription.
            </p>
          ) : (
            <div className="space-y-2.5">
              {prescriptions.map((p) => (
                <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 rounded-lg p-3" style={{ backgroundColor: "var(--color-surface)" }}>
                  <div className="flex items-center gap-2.5">
                    <HeartPulse className="w-4 h-4 shrink-0" style={{ color: "var(--color-primary)" }} />
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--color-on-surface)" }}>
                        {p.medication_name}
                        <span className="font-medium text-xs ml-2" style={{ color: "var(--color-on-surface-variant)" }}>
                          {p.dosage} · {p.frequency}
                        </span>
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--color-on-surface-variant)" }}>
                        {p.instructions || "No instructions"} · {fmtDateShort(p.created_at)}
                        {p.refill_requested ? " · Refill requested" : ""}
                      </p>
                    </div>
                  </div>
                  <span
                    className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full shrink-0 self-start sm:self-auto"
                    style={{
                      backgroundColor: p.refill_requested ? "color-mix(in srgb, var(--color-info) 15%, transparent)" : "color-mix(in srgb, var(--color-outline-variant) 40%, transparent)",
                      color: p.refill_requested ? "#0369a1" : statusColor(p.status),
                    }}
                  >
                    {p.refill_requested ? "Refill requested" : statusLabel(p.status)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard
          icon={<FileText className="w-4 h-4" />}
          title="Reports"
          trailing={
            reports.length ? (
              <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-on-surface-variant)" }}>
                {reports.filter((r) => r.status === "done").length} complete
              </span>
            ) : null
          }
        >
          {reports.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--color-on-surface-variant)" }}>
              No reports shared.
            </p>
          ) : (
            <div className="space-y-2.5">
              {reports.map((r) => (
                <div key={r.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 rounded-lg p-3" style={{ backgroundColor: "var(--color-surface)" }}>
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 shrink-0" style={{ color: "var(--color-primary)" }} />
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--color-on-surface)" }}>
                        {r.title}
                      </p>
                      <p className="text-xs mt-0.5 line-clamp-2" style={{ color: "var(--color-on-surface-variant)" }}>
                        {r.ai_summary || "No summary available"} · {fmtDateShort(r.created_at)}
                      </p>
                    </div>
                  </div>
                  <span
                    className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full shrink-0 self-start sm:self-auto"
                    style={{ backgroundColor: "color-mix(in srgb, var(--color-outline-variant) 40%, transparent)", color: statusColor(r.status) }}
                  >
                    {statusLabel(r.status)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </main>
  )
}