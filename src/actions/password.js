"use server"
import { createClient } from "@/lib/supabase/server"

function validatePasswordStrength(password) {
  if (password.length < 8) return "Password must be at least 8 characters."
  if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter."
  if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter."
  if (!/\d/.test(password)) return "Password must contain at least one number."
  return null
}

export async function resetPasswordAction(prevState, formData) {
  const password = formData.get("password") || ""
  const confirmPassword = formData.get("confirmPassword") || ""

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." }
  }

  const passwordError = validatePasswordStrength(password)
  if (passwordError) return { error: passwordError }

  const supabase = await createClient()

  // updateUser() requires an active session, which the password-recovery
  // email establishes via the recovery link (the /reset-password route).
  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    console.error("Password reset failed:", error.status, error.code)
    if (error.message?.includes("session")) {
      return { expiredLink: true, error: "Your reset link has expired or was already used." }
    }
    return { error: "We couldn't reset your password. Please try again." }
  }

  return { success: true }
}

export async function forgotPasswordAction(prevState, formData) {
  const email = formData.get("email")

  if (!email) {
    return { error: "Please provide your email address." }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback?next=/reset-password`,
  })

  if (error) {
    console.error("Password reset request failed:", error.status, error.code)
    // Do not confirm whether an account exists — avoid account enumeration.
    return { success: true }
  }

  return { success: true }
}
