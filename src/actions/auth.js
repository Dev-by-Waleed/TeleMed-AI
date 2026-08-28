"use server"
import { createClient } from "@/lib/supabase/server"
import { getUserRole, hasCompletedOnboarding } from "@/lib/supabase/profile"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateWeakPassword(password) {
  if (password.length < 8) return "Password must be at least 8 characters."
  if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter."
  if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter."
  if (!/\d/.test(password)) return "Password must contain at least one number."
  return null
}

export async function signupAction(prevState, formData) {
  const fullName = (formData.get("fullName") || "").trim()
  const email = (formData.get("email") || "").trim().toLowerCase()
  const password = formData.get("password") || ""
  const confirmPassword = formData.get("confirmPassword") || ""

  if (!fullName) return { error: "Please provide your full name." }
  if (fullName.length < 2) return { error: "Please provide a valid full name." }
  if (!EMAIL_REGEX.test(email)) return { error: "Please provide a valid email address." }

  const passwordError = validateWeakPassword(password)
  if (passwordError) return { error: passwordError }

  if (password !== confirmPassword) return { error: "Passwords do not match." }

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/login`,
    },
  })

  if (error) {
    console.error("Sign-up failed:", error.status, error.code)
    // Map common Supabase auth errors to friendly messages.
    if (error.message?.toLowerCase().includes("already registered")) {
      return { error: "An account with that email already exists. Try signing in." }
    }
    if (error.status === 429) {
      return { error: "Too many attempts. Please wait a moment and try again." }
    }
    return { error: "We couldn't create your account. Please try again." }
  }

  // data.session is only present when the auth provider is configured to
  // skip email confirmation. If it's missing, a confirmation email was sent.
  if (data.session) {
    // New users land on onboarding so they complete their medical profile
    // before reaching the dashboard.
    return { destination: "/features/onboarding" }
  }

  return { destination: "/signup/confirm-email" }
}

export async function loginAction(prevState, formData) {
  const email = formData.get("email")
  const password = formData.get("password")

  if (!email || !password) {
    return { error: "Please provide both email and password." }
  }

  const supabase = await createClient()

  // 1. Authenticate user
  const { data, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (signInError) {
    // Log details server-side, but never expose them to the client.
    console.error("Sign-in failed:", signInError.status, signInError.code)

    // A valid password but an unconfirmed email deserves a clearer message
    // than a generic "Invalid email or password."
    const msg = signInError.message?.toLowerCase() || ""
    if (msg.includes("not confirmed") || msg.includes("email not confirmed")) {
      return { error: "Your email hasn't been confirmed yet. Check your inbox and click the confirmation link, then try again." }
    }

    return { error: "Invalid email or password." }
  }

  // 2. Fetch role from profiles table
  let userRole
  try {
    userRole = await getUserRole(supabase, data.user.id)
  } catch (err) {
    console.error("Failed to resolve user role:", err)
    userRole = "patient"
  }

  // 3. Return destination so the client performs the redirect.
  //    Doing the redirect client-side avoids useActionState's isPending
  //    getting stuck when redirect() is thrown inside the action.
  if (userRole === "admin") {
    return { destination: "/admin/dashboard" }
  } else if (userRole === "doctor") {
    return { destination: "/doctor/dashboard" }
  } else {
    // Patients who registered but haven't completed onboarding yet are
    // sent back to onboarding so their medical profile is finished before
    // they reach the dashboard.
    const completed = await hasCompletedOnboarding(supabase, data.user.id)
    if (!completed) {
      return { destination: "/features/onboarding" }
    }
    return { destination: "/patient/dashboard" }
  }
}