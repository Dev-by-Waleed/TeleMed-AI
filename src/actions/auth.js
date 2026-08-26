"use server"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

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
    return { error: signInError.message || "Invalid login credentials." }
  }

  // 2. Fetch role from profiles table
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single()

  const userRole = profile?.role || "patient"

  // 3. Perform server-side redirect (automatically updates headers and cookies)
  if (userRole === "admin") {
    redirect("/admin/dashboard")
  } else if (userRole === "doctor") {
    redirect("/doctor/dashboard")
  } else {
    redirect("/patient/dashboard")
  }
}