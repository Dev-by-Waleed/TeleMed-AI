"use server"
import { createClient } from "@/lib/supabase/server"
import createAdminClient from "@/lib/supabase/admin"
import { getUser, getUserRole } from "@/lib/supabase/profile"

const SPECIALTIES = [
  "Cardiology",
  "Dermatology",
  "General Practice",
  "Neurology",
  "Oncology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
  "Radiology",
  "Other",
]

export { SPECIALTIES }

function randomPassword(len = 12) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%"
  let out = ""
  for (let i = 0; i < len; i++) out += chars[crypto.getRandomValues(new Uint32Array(1))[0] % chars.length]
  return out
}

export async function createDoctorAction(prevState, formData) {
  const supabase = await createClient()
  const user = await getUser(supabase)
  if (!user) {
    return { error: "You must be signed in." }
  }
  const role = await getUserRole(supabase, user.id)
  if (role !== "admin") {
    return { error: "Only admins can create doctors." }
  }

  const fullName = String(formData.get("full_name") || "").trim()
  const email = String(formData.get("email") || "").trim().toLowerCase()
  const specialty = String(formData.get("specialty") || "").trim()
  const deliveryMode = String(formData.get("delivery_mode") || "password")

  if (!fullName || !email || !specialty) {
    return { error: "Name, email, and specialty are required." }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." }
  }

  const admin = createAdminClient()

  // Create the auth user. Email verification is out of scope per the PRD, so
  // the account is confirmed immediately. The profile trigger creates a
  // "patient" profile; admin_promote_to_doctor will switch it to "doctor".
  const password = deliveryMode === "invite" ? randomPassword() : randomPassword()
  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName, role: "doctor" },
  })
  if (createErr) {
    const msg = /already registered/.test(createErr.message)
      ? "A user with that email already exists."
      : createErr.message
    return { error: msg }
  }

  const userId = created.user.id
  const isInvite = deliveryMode === "invite"
  const inviteToken = isInvite ? crypto.randomUUID() : null

  const { error: promoErr } = await supabase.rpc("admin_promote_to_doctor", {
    p_user_id: userId,
    p_full_name: fullName,
    p_specialty: specialty,
    p_created_by_admin: true,
    p_active_status: isInvite ? "invited" : "active",
    p_temp_password_status: isInvite ? "none" : "pending_change",
  })
  if (promoErr) {
    console.error("Doctor promotion failed:", promoErr.message)
    return { error: "We couldn't finalize the doctor account. Please try again." }
  }

  if (isInvite) {
    const { error: inviteErr } = await admin
      .from("doctors")
      .update({ invite_token: inviteToken })
      .eq("id", userId)
    if (inviteErr) {
      console.error("Set invite token failed:", inviteErr.message)
    }
  }

  return {
    success: true,
    doctorId: userId,
    fullName,
    email,
    isInvite,
    password: isInvite ? null : password,
    inviteToken: isInvite ? inviteToken : null,
  }
}

export async function activateInviteDoctorAction(prevState, formData) {
  const token = String(formData.get("token") || "")
  const password = String(formData.get("password") || "")
  const confirm = String(formData.get("confirm") || "")

  if (!token) return { error: "Invalid invite link." }
  if (password.length < 8) return { error: "Password must be at least 8 characters." }
  if (password !== confirm) return { error: "Passwords do not match." }

  const supabase = await createClient()
  const { data: doctor } = await supabase
    .from("doctors")
    .select("id, full_name, active_status")
    .eq("invite_token", token)
    .maybeSingle()
  if (!doctor || doctor.active_status !== "invited") {
    return { error: "This invite link is invalid or has already been used." }
  }

  const admin = createAdminClient()
  const { error: passErr } = await admin.auth.admin.updateUserById(doctor.id, { password })
  if (passErr) {
    console.error("Invite password update failed:", passErr.message)
    return { error: "We couldn't set your password. Please try again." }
  }

  const { error: dbErr } = await admin
    .from("doctors")
    .update({
      invite_token: null,
      active_status: "active",
      temp_password_status: "changed",
    })
    .eq("id", doctor.id)
  if (dbErr) {
    console.error("Invite activation DB update failed:", dbErr.message)
    return { error: "We couldn't activate your account. Please try again." }
  }

  await admin.from("profiles").update({ account_status: "active" }).eq("id", doctor.id)

  return { success: true, email: String(formData.get("email") || "") }
}

