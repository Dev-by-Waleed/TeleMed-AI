"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, Stethoscope, Mail, UserRound, FileText, ShieldCheck } from "lucide-react";
import { updateDoctorProfileAction } from "@/actions/doctor-profile";
import AvatarUpload from "@/Components/account/AvatarUpload";
import ChangePasswordForm from "@/Components/account/ChangePasswordForm";

export default function DoctorProfileForm({ doctor, userEmail, fullName, avatarUrl }) {
  const [state, formAction, isPending] = useActionState(updateDoctorProfileAction, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.refresh();
    }
  }, [state, router]);

  const d = doctor || {};

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8" style={{ backgroundColor: "var(--color-surface-bright)" }}>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight" style={{ color: "var(--color-on-surface)" }}>
            My Profile
          </h1>
          <p className="text-xs mt-1" style={{ color: "var(--color-on-surface-variant)" }}>
            Update how you appear to patients across the booking flow and your practice.
          </p>

          <div className="mt-6 bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl p-5 flex flex-wrap items-center gap-x-8 gap-y-2">
            <AvatarUpload avatarUrl={avatarUrl} fallbackText={fullName || "Doctor"} />
            <div>
              <p className="text-sm font-semibold flex items-center gap-1.5" style={{ color: "var(--color-on-surface)" }}>
                <UserRound className="w-4 h-4" style={{ color: "var(--color-primary)" }} />
                {fullName || "Doctor"}
              </p>
              <p className="text-xs mt-0.5 flex items-center gap-1.5" style={{ color: "var(--color-on-surface-variant)" }}>
                <Mail className="w-3.5 h-3.5" style={{ color: "var(--color-outline)" }} />
                {userEmail}
              </p>
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-lg flex items-center gap-1.5" style={{ backgroundColor: "var(--color-secondary)", color: "var(--color-primary-dark)" }} title="Managed by your administrator">
              <Stethoscope className="w-3.5 h-3.5" />
              {d.specialty || "General Medicine"}
            </span>
          </div>
        </div>

        {state?.error && (
          <div role="alert" className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm font-medium text-center">
            {state.error}
          </div>
        )}

        {state?.success && (
          <div role="status" className="mb-6 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-700 text-sm font-medium text-center">
            Profile saved successfully.
          </div>
        )}

        <form action={formAction} className="space-y-6">
          <section className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl p-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)] mb-6">
              Practice Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-[var(--color-on-surface)]" htmlFor="fullName">
                  Full Name
                </label>
                <div
                  id="fullName"
                  className="w-full h-12 rounded-lg bg-[var(--color-surface)] border border-[var(--color-outline-variant)] px-4 py-2 flex items-center justify-between text-sm"
                >
                  <span style={{ color: "var(--color-on-surface)" }}>{fullName || "Doctor"}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider inline-flex items-center gap-1" style={{ color: "var(--color-on-surface-variant)" }}>
                    <ShieldCheck className="w-3 h-3" />
                    admin-managed
                  </span>
                </div>
                <p className="text-[11px]" style={{ color: "var(--color-on-surface-variant)" }}>
                  Set by your administrator. Contact them to update it.
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-[var(--color-on-surface)]" htmlFor="specialty">
                  Specialty
                </label>
                <div
                  id="specialty"
                  className="w-full h-12 rounded-lg bg-[var(--color-surface)] border border-[var(--color-outline-variant)] px-4 py-2 flex items-center justify-between text-sm"
                >
                  <span style={{ color: "var(--color-on-surface)" }}>{d.specialty || "General Medicine"}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider inline-flex items-center gap-1" style={{ color: "var(--color-on-surface-variant)" }}>
                    <Stethoscope className="w-3 h-3" />
                    admin-managed
                  </span>
                </div>
                <p className="text-[11px]" style={{ color: "var(--color-on-surface-variant)" }}>
                  Set by your administrator. Contact them to update it.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-1 mt-6">
              <label className="text-sm font-semibold text-[var(--color-on-surface)] flex items-center gap-2 text-[var(--color-on-surface)]" htmlFor="bio">
                <FileText className="w-4 h-4 text-[var(--color-outline)]" />
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                placeholder="A short introduction patients see when choosing a doctor"
                defaultValue={d.bio || ""}
                className="w-full rounded-lg bg-[var(--color-surface)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] px-4 py-2 transition-colors resize-none outline-none input-glow"
              />
            </div>
          </section>

          <ChangePasswordForm />

          <div className="pt-2 flex justify-end gap-3">
            <a
              href="/doctor/dashboard"
              className="px-6 py-3 rounded-lg text-sm font-semibold border border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-variant)] transition-colors"
            >
              Cancel
            </a>
            <button
              type="submit"
              disabled={isPending}
              className="bg-[var(--color-primary)] text-white text-sm font-semibold rounded-lg px-6 py-3 hover:bg-[var(--color-primary-dark)] transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}