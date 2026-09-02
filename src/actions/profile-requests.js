"use server"
import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { getUser, getUserRole } from "@/lib/supabase/profile"

export async function submitProfileRequestAction(prevState, formData) {
  const supabase = await createClient()
  const user = await getUser(supabase)
  if (!user) {
    return { error: "You must be signed in." }
  }
  const role = await getUserRole(supabase, user.id)
  if (role !== "doctor") {
    return { error: "Only doctors can submit profile requests." }
  }

  const fullName = String(formData.get("full_name") || "").trim()
  const specialty = String(formData.get("specialty") || "").trim()
  const reason = String(formData.get("reason") || "").trim()

  if (!fullName && !specialty) {
    return { error: "Enter a new display name, specialty, or both." }
  }
  if (!reason) {
    return { error: "Please tell your admin why you need this change." }
  }

  // Don't allow submissions that don't actually change anything.
  const { data: doctor } = await supabase
    .from("doctors")
    .select("full_name, specialty")
    .eq("id", user.id)
    .maybeSingle()

  if (doctor) {
    if (fullName && fullName === doctor.full_name) {
      return { error: "That display name is already in use." }
    }
    if (specialty && specialty === doctor.specialty) {
      return { error: "That specialty is already set." }
    }
  }

  const { error: insertErr } = await supabase.from("doctor_profile_requests").insert({
    doctor_id: user.id,
    requested_full_name: fullName || null,
    requested_specialty: specialty || null,
    reason,
    status: "pending",
  })
  if (insertErr) {
    console.error("Profile request submit failed:", insertErr.message)
    return { error: "We couldn't submit your request. Please try again." }
  }

  const changes = [
    fullName ? `name to "${fullName}"` : null,
    specialty ? `specialty to "${specialty}"` : null,
  ].filter(Boolean).join(" and ")

  await supabase.from("notifications").insert({
    user_id: user.id,
    type: "general",
    title: "Profile change request submitted",
    body: `Your request to change ${changes} has been sent to the admin for review.`,
    link: "/doctor/profile",
  })

  revalidatePath("/doctor/profile")
  return { success: true }
}

export async function decideProfileRequestAction(prevState, formData) {
  const supabase = await createClient()
  const user = await getUser(supabase)
  if (!user) {
    return { error: "You must be signed in." }
  }
  const role = await getUserRole(supabase, user.id)
  if (role !== "admin") {
    return { error: "Only admins can review profile requests." }
  }

  const requestId = String(formData.get("request_id") || "")
  const decision = String(formData.get("decision") || "")
  const adminResponse = String(formData.get("admin_response") || "").trim()

  if (!requestId) return { error: "Missing request." }
  if (decision !== "approved" && decision !== "denied") return { error: "Invalid decision." }

  const { error } = await supabase.rpc("admin_apply_profile_request", {
    p_request_id: requestId,
    p_status: decision,
    p_admin_response: adminResponse || null,
  })
  if (error) {
    console.error("Profile request decision failed:", error.code, error.message)
    const msg = /already resolved/.test(error.message)
      ? "This request has already been reviewed."
      : "We couldn't process the request. Please try again."
    return { error: msg }
  }

  // Notify the requesting doctor of the approval/denial outcome.
  const { data: req } = await supabase
    .from("doctor_profile_requests")
    .select("doctor_id, requested_full_name, requested_specialty")
    .eq("id", requestId)
    .maybeSingle()
  if (req?.doctor_id) {
    const changes = [
      req.requested_full_name ? `name to "${req.requested_full_name}"` : null,
      req.requested_specialty ? `specialty to "${req.requested_specialty}"` : null,
    ].filter(Boolean).join(" and ")
    const approved = decision === "approved"
    await supabase.from("notifications").insert({
      user_id: req.doctor_id,
      type: "general",
      title: approved ? "Profile change approved" : "Profile change declined",
      body: approved
        ? `Your request to change ${changes} has been approved.`
        : `Your request to change ${changes} has been declined.${adminResponse ? ` Reason: ${adminResponse}` : ""}`,
      link: "/doctor/profile",
    })
  }

  revalidatePath("/admin/profile-requests")
  revalidatePath("/admin/doctors")
  return { success: true, decision }
}
