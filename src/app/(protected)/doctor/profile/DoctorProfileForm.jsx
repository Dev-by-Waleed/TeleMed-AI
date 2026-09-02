"use client";

import { useActionState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Save, Loader2, Stethoscope, Mail, UserRound, ShieldCheck, IdCard } from "lucide-react";
import { updateDoctorProfileAction } from "@/actions/doctor-profile";
import { doctorProfileSchema } from "@/lib/validations";
import AvatarUpload from "@/Components/account/AvatarUpload";
import ChangePasswordForm from "@/Components/account/ChangePasswordForm";
import ProfileRequestForm from "./ProfileRequestForm";

const inputCls =
  "w-full h-12 rounded-lg bg-[var(--color-surface)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] px-4 py-2 transition-colors outline-none input-glow";
const textareaCls =
  "w-full rounded-lg bg-[var(--color-surface)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] px-4 py-2 transition-colors resize-none outline-none input-glow";

function Field({ label, htmlFor, error, children, hint, className = "" }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-sm font-semibold text-[var(--color-on-surface)]" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      {hint && (
        <p className="text-[11px] text-[var(--color-on-surface-variant)]">{hint}</p>
      )}
    </div>
  );
}

function ReadOnlyValue({ label, value, metaText, metaIcon: MetaIcon, hint }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm font-semibold text-[var(--color-on-surface)]">{label}</p>
      <div className="w-full h-12 rounded-lg bg-[var(--color-surface)] border border-[var(--color-outline-variant)] px-4 py-2 flex items-center justify-between text-sm">
        <span className="text-[var(--color-on-surface)] truncate">{value}</span>
        <span className="text-[10px] font-semibold uppercase tracking-wider inline-flex items-center gap-1 shrink-0 ml-2 text-[var(--color-on-surface-variant)]">
          <MetaIcon className="w-3 h-3" />
          {metaText}
        </span>
      </div>
      {hint && <p className="text-[11px] text-[var(--color-on-surface-variant)]">{hint}</p>}
    </div>
  );
}

function SectionCard({ icon: Icon, title, subtitle, children }) {
  return (
    <section className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl shadow-sm">
      <div className="flex items-center gap-3 px-6 pt-6 pb-4 border-b border-[var(--color-outline-variant)]">
        <div className="bg-[var(--color-secondary)] p-2 rounded-lg text-[var(--color-primary)]">
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-[var(--color-foreground)]">{title}</h2>
          {subtitle && (
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

export default function DoctorProfileForm({ doctor, userEmail, fullName, avatarUrl, requests = [] }) {
  const [state, formAction, isPending] = useActionState(updateDoctorProfileAction, null);
  const router = useRouter();
  const [, startTransition] = useTransition();

  const d = doctor || {};

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(doctorProfileSchema),
    mode: "onTouched",
    defaultValues: {
      bio: d.bio || "",
    },
  });

  useEffect(() => {
    if (state?.success) {
      toast.success("Profile saved successfully.");
      router.refresh();
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  function onSubmit(data) {
    const fd = new FormData();
    fd.set("bio", data.bio ?? "");
    startTransition(() => formAction(fd));
  }

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="p-4 md:p-10 max-w-[1200px] mx-auto w-full">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-[var(--color-foreground)] mb-1">
          My Profile
        </h1>
        <p className="text-base text-[var(--color-on-surface-variant)]">
          Update how you appear to patients across the booking flow and your practice.
        </p>
      </header>

      {/* Identity card */}
      <div className="mb-8 bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl p-6 flex flex-col md:flex-row md:items-center gap-5">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="shrink-0">
            <AvatarUpload avatarUrl={avatarUrl} fallbackText={fullName || "Doctor"} />
          </div>
          <div className="min-w-0">
            <p className="text-base font-semibold flex items-center gap-1.5 text-[var(--color-foreground)]">
              <UserRound className="w-4 h-4 text-[var(--color-primary)]" />
              <span className="truncate">{fullName || "Doctor"}</span>
            </p>
            <p className="text-xs text-[var(--color-on-surface-variant)] flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5 text-[var(--color-outline)]" />
              <span className="truncate">{userEmail}</span>
            </p>
          </div>
        </div>
        {d.specialty && (
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-secondary)] text-[var(--color-foreground)] text-xs font-semibold border border-[var(--color-outline-variant)]"
            title="Managed by your administrator"
          >
            <Stethoscope className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            {d.specialty}
          </span>
        )}
      </div>

      {state?.error && (
        <div
          role="alert"
          className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm font-medium text-center"
        >
          {state.error}
        </div>
      )}

      <div className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Practice Details */}
          <SectionCard
            icon={IdCard}
            title="Practice Details"
            subtitle="Your identity and specialty, plus the bio patients see."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ReadOnlyValue
                label="Full Name"
                value={fullName || "Doctor"}
                metaText="admin-managed"
                metaIcon={ShieldCheck}
                hint="Set by your administrator. Contact them to update it."
              />
              <ReadOnlyValue
                label="Specialty"
                value={d.specialty || "General Medicine"}
                metaText="admin-managed"
                metaIcon={Stethoscope}
                hint="Set by your administrator. Contact them to update it."
              />
            </div>

            <div className="mt-6">
              <Field
                label="Bio"
                htmlFor="bio"
                error={errors.bio?.message}
                hint="A short introduction patients see when choosing a doctor."
              >
                <textarea
                  id="bio"
                  rows={4}
                  placeholder="A short introduction patients see when choosing a doctor"
                  {...register("bio")}
                  className={textareaCls}
                />
              </Field>
            </div>
          </SectionCard>

          {/* Actions */}
          <div className="flex justify-end gap-3">
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

        <ProfileRequestForm doctor={doctor || {}} requests={requests} />

        <ChangePasswordForm />
      </div>
      </div>
    </main>
  );
}
