"use client";

import { useActionState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema } from "@/lib/validations";
import { KeyRound, Loader2, Save } from "lucide-react";
import { changePasswordAction } from "@/actions/account";
import { toast } from "sonner";

export default function ChangePasswordForm() {
  const [state, formAction, isPending] = useActionState(changePasswordAction, null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    mode: "onTouched",
  });
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (state?.success) {
      toast.success("Password changed successfully.");
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  const onSubmit = (data) => {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => fd.set(k, String(v)));
    startTransition(() => formAction(fd));
  };

  return (
    <section className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl p-6">
      <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)] mb-1 flex items-center gap-2">
        <KeyRound className="w-4 h-4 text-[var(--color-primary)]" />
        Change Password
      </h2>
      <p className="text-xs mt-1 mb-6" style={{ color: "var(--color-on-surface-variant)" }}>
        Use a password of at least 8 characters.
      </p>

      {state?.error && (
        <div role="alert" className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm font-medium text-center">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div role="status" className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-700 text-sm font-medium text-center">
          Password updated successfully.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-sm">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-[var(--color-on-surface)]" htmlFor="currentPassword">
            Current Password
          </label>
          <input
            type="password"
            id="currentPassword"
            {...register("currentPassword")}
            autoComplete="current-password"
            className="w-full h-11 rounded-lg bg-[var(--color-surface)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] px-4 py-2 transition-colors outline-none input-glow"
          />
          {errors.currentPassword && (
            <p className="text-xs text-red-500 mt-1">{errors.currentPassword.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-[var(--color-on-surface)]" htmlFor="newPassword">
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            {...register("newPassword")}
            autoComplete="new-password"
            className="w-full h-11 rounded-lg bg-[var(--color-surface)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] px-4 py-2 transition-colors outline-none input-glow"
          />
          {errors.newPassword && (
            <p className="text-xs text-red-500 mt-1">{errors.newPassword.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-[var(--color-on-surface)]" htmlFor="confirmPassword">
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            {...register("confirmPassword")}
            autoComplete="new-password"
            className="w-full h-11 rounded-lg bg-[var(--color-surface)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] px-4 py-2 transition-colors outline-none input-glow"
          />
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 text-sm font-semibold rounded-lg px-5 py-2.5 bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Update Password
        </button>
      </form>
    </section>
  );
}