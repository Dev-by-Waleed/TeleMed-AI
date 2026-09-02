"use server"
import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import createAdminClient from "@/lib/supabase/admin"
import { getUser, getUserRole } from "@/lib/supabase/profile"

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
      .update({ invite_token: inviteToken, invited_by: user.id })
      .eq("id", userId)
    if (inviteErr) {
      console.error("Set invite token failed:", inviteErr.message)
    }
  }

  // Welcome the newly created doctor. For direct creation they can log in
  // immediately; for invite mode the notification surfaces once they activate
  // and log in for the first time.
  await supabase.from("notifications").insert({
    user_id: userId,
    type: "general",
    title: "Welcome to TeleMed",
    body: isInvite
      ? "You've been invited to join as a doctor. Use your invite link to set your password and activate your account."
      : "Your doctor account has been created. You can now log in to get started.",
    link: isInvite ? `/doctor-invite/${inviteToken}` : "/doctor/dashboard",
  })

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
    .select("id, full_name, active_status, invited_by")
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

  // Notify the admin who invited this doctor that their invite was accepted.
  if (doctor.invited_by) {
    await admin.from("notifications").insert({
      user_id: doctor.invited_by,
      type: "general",
      title: "Doctor invite accepted",
      body: `${doctor.full_name} has accepted their invitation and activated their account.`,
      link: "/admin/doctors",
    })
  }

  return { success: true, email: String(formData.get("email") || "") }
}

// Update a user's account_status (active / suspended / invited) and/or role.
// Called by the admin Doctors and Patients pages. Uses the SECURITY DEFINER
// RPC so role changes bypass the role-escalation trigger.
export async function setUserStatusAction(prevState, formData) {
  const supabase = await createClient()
  const user = await getUser(supabase)
  if (!user) {
    return { error: "You must be signed in." }
  }
  const role = await getUserRole(supabase, user.id)
  if (role !== "admin") {
    return { error: "Only admins can change account status." }
  }

  const userId = String(formData.get("user_id") || "")
  const newStatus = String(formData.get("status") || "")
  const newRole = String(formData.get("role") || "")

  if (!userId) return { error: "Missing user." }

  const status = ["active", "suspended", "invited"].includes(newStatus) ? newStatus : null
  const targetRole = ["patient", "doctor", "admin"].includes(newRole) ? newRole : null

  if (!status && !targetRole) return { error: "Nothing to update." }

  const { error } = await supabase.rpc("admin_set_user_status", {
    p_user_id: userId,
    p_status: status,
    p_role: targetRole,
  })
  if (error) {
    console.error("setUserStatus failed:", error.message)
    return { error: "We couldn't update the account. Please try again." }
  }

  // Notify the affected user when their account is suspended or reactivated.
  if (status === "suspended" || status === "active") {
    const isSuspension = status === "suspended"
    await supabase.from("notifications").insert({
      user_id: userId,
      type: "general",
      title: isSuspension ? "Account suspended" : "Account reactivated",
      body: isSuspension
        ? "Your account has been suspended. Please contact support for assistance."
        : "Your account has been reactivated. You can now log in and use TeleMed.",
      link: null,
    })
  }

  return { success: true }
}

// Fetch a patient's full medical profile (admin only). Returns the record
// fields directly for the patients management drawer.
export async function getPatientProfileAction(prevState, formData) {
  const supabase = await createClient()
  const user = await getUser(supabase)
  if (!user) {
    return { error: "You must be signed in." }
  }
  const role = await getUserRole(supabase, user.id)
  if (role !== "admin") {
    return { error: "Only admins can view patient profiles." }
  }

  const userId = String(formData.get("user_id") || "")
  if (!userId) return { error: "Missing user." }

  const { data, error } = await supabase.rpc("admin_get_patient_profile", {
    p_user_id: userId,
  })
  if (error) {
    console.error("getPatientProfile failed:", error.message)
    return { error: "We couldn't load the patient profile." }
  }

  if (!data) return { error: "This patient hasn't completed onboarding." }
  return { success: true, profile: data }
}

async function requireAdmin() {
  const supabase = await createClient()
  const user = await getUser(supabase)
  if (!user) {
    return { supabase: null, user: null, error: "You must be signed in." }
  }
  const role = await getUserRole(supabase, user.id)
  if (role !== "admin") {
    return { supabase: null, user: null, error: "Only admins can perform this action." }
  }
  return { supabase, user, error: null }
}

// Approve or deny a patient's refill request. Clears the pending flag so the
// patient can request again later, and notifies the patient of the outcome.
export async function resolveRefillAction(prevState, formData) {
  const { supabase, error: guardError } = await requireAdmin()
  if (guardError) return { error: guardError }

  const prescriptionId = String(formData.get("prescription_id") || "")
  const decision = String(formData.get("decision") || "")
  if (!prescriptionId) return { error: "Missing prescription." }
  if (decision !== "approved" && decision !== "denied") return { error: "Invalid decision." }

  const { data: rx } = await supabase
    .from("prescriptions")
    .select("id, patient_id, medication_name, status, refill_requested")
    .eq("id", prescriptionId)
    .maybeSingle()

  if (!rx) return { error: "Prescription not found." }
  if (rx.status !== "active") return { error: "Only active prescriptions can have refills resolved." }
  if (!rx.refill_requested) return { error: "There is no pending refill request for this prescription." }

  const { error: updateErr } = await supabase
    .from("prescriptions")
    .update({ refill_requested: false })
    .eq("id", prescriptionId)
  if (updateErr) {
    console.error("resolveRefill update failed:", updateErr.message)
    return { error: "We couldn't update the refill request. Please try again." }
  }

  const approved = decision === "approved"
  const { error: notifErr } = await supabase.from("notifications").insert({
    user_id: rx.patient_id,
    type: "appointment",
    title: approved ? "Refill approved" : "Refill request declined",
    body: approved
      ? `Your refill for ${rx.medication_name} was approved.`
      : `Your refill request for ${rx.medication_name} was declined. Contact your doctor for details.`,
    link: "/patient/prescriptions",
  })
  if (notifErr) {
    console.error("resolveRefill notification failed:", notifErr.message)
  }

  revalidatePath("/admin/prescriptions")
  revalidatePath("/admin/dashboard")
  return { success: true, decision: approved ? "approved" : "denied" }
}

// Remove a patient review. The reviews trigger recomputes the doctor's
// aggregate rating and review count afterward.
export async function deleteReviewAction(prevState, formData) {
  const { supabase, error: guardError } = await requireAdmin()
  if (guardError) return { error: guardError }

  const reviewId = String(formData.get("review_id") || "")
  if (!reviewId) return { error: "Missing review." }

  const { data: existing } = await supabase
    .from("reviews")
    .select("id")
    .eq("id", reviewId)
    .maybeSingle()
  if (!existing) return { error: "Review not found." }

  const { error } = await supabase.from("reviews").delete().eq("id", reviewId)
  if (error) {
    console.error("deleteReview failed:", error.message)
    return { error: "We couldn't remove the review. Please try again." }
  }

  revalidatePath("/admin/reviews")
  return { success: true }
}

// Remove a chat message (moderation). The "Admins manage messages" RLS policy
// scopes the delete; the row is gone from both sides of the consultation.
export async function deleteMessageAction(prevState, formData) {
  const { supabase, error: guardError } = await requireAdmin()
  if (guardError) return { error: guardError }

  const messageId = String(formData.get("message_id") || "")
  if (!messageId) return { error: "Missing message." }

  const { data: existing } = await supabase
    .from("messages")
    .select("id")
    .eq("id", messageId)
    .maybeSingle()
  if (!existing) return { error: "Message not found." }

  const { error } = await supabase.from("messages").delete().eq("id", messageId)
  if (error) {
    console.error("deleteMessage failed:", error.message)
    return { error: "We couldn't remove the message. Please try again." }
  }

  revalidatePath("/admin/messages")
  return { success: true }
}

// Admin lifecycle override for appointments. The appointment trigger keeps
// patient notifications consistent (confirmed / cancelled / completed).
export async function setAppointmentStatusAction(prevState, formData) {
  const { supabase, error: guardError } = await requireAdmin()
  if (guardError) return { error: guardError }

  const appointmentId = String(formData.get("appointment_id") || "")
  const newStatus = String(formData.get("status") || "")
  if (!appointmentId) return { error: "Missing appointment." }
  if (!["cancelled", "completed"].includes(newStatus)) return { error: "Invalid status." }

  const { data: appt } = await supabase
    .from("appointments")
    .select("id, status")
    .eq("id", appointmentId)
    .maybeSingle()
  if (!appt) return { error: "Appointment not found." }
  if (appt.status === "cancelled") return { error: "This appointment is already cancelled." }
  if (appt.status === "completed") return { error: "This appointment is already completed." }

  const { error } = await supabase
    .from("appointments")
    .update({ status: newStatus })
    .eq("id", appointmentId)
  if (error) {
    console.error("setAppointmentStatus failed:", error.message)
    return { error: "We couldn't update the appointment. Please try again." }
  }

  revalidatePath("/admin/appointments")
  revalidatePath("/admin/dashboard")
  return { success: true, status: newStatus }
}

// Send an in-app notification to a role-based audience. Returns how many
// users were reached.
export async function broadcastNotificationAction(prevState, formData) {
  const { supabase, error: guardError } = await requireAdmin()
  if (guardError) return { error: guardError }

  const audience = String(formData.get("audience") || "all")
  const title = String(formData.get("title") || "").trim()
  const body = String(formData.get("body") || "").trim()
  const link = String(formData.get("link") || "").trim()

  if (!["all", "patients", "doctors", "admins"].includes(audience)) {
    return { error: "Invalid audience." }
  }
  if (!title) return { error: "A title is required." }

  const { data, error } = await supabase.rpc("admin_broadcast_notifications", {
    p_audience: audience,
    p_title: title,
    p_body: body || null,
    p_link: link || null,
  })
  if (error) {
    console.error("broadcast failed:", error.message)
    return { error: "We couldn't send the notification. Please try again." }
  }

  revalidatePath("/admin/notifications")
  return { success: true, count: Number(data || 0), audience }
}

