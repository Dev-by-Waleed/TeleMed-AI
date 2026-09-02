"use server"
import { createClient } from "@/lib/supabase/server"

const MAX_BYTES = 2 * 1024 * 1024 // 2 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]

export async function changePasswordAction(prevState, formData) {
  const currentPassword = String(formData.get("currentPassword") || "")
  const newPassword = String(formData.get("newPassword") || "")
  const confirmPassword = String(formData.get("confirmPassword") || "")

  if (!currentPassword) {
    return { error: "Please enter your current password." }
  }
  if (newPassword.length < 8) {
    return { error: "New password must be at least 8 characters." }
  }
  if (newPassword !== confirmPassword) {
    return { error: "New and confirm passwords do not match." }
  }

  // Verify the current password before changing it.
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user?.email) {
    return { error: "You must be signed in to change your password." }
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  })
  if (signInError) {
    return { error: "Your current password is incorrect." }
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  })
  if (updateError) {
    console.error("Password update failed:", updateError.message)
    return { error: "We couldn't update your password. Please try again." }
  }

  return { success: true }
}

export async function uploadAvatarAction(prevState, formData) {
  const file = formData.get("avatar")

  if (!file) {
    return { error: "Please choose an image to upload." }
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: "Please upload a JPG, PNG, WEBP, GIF, or AVIF image." }
  }
  if (file.size > MAX_BYTES) {
    return { error: "Image must be 2 MB or smaller." }
  }

  const bytes = new Uint8Array(await file.arrayBuffer())
  let binary = ""
  const CHUNK = 0x8000
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK))
  }
  const base64 = btoa(binary)

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "You must be signed in to upload a profile picture." }
  }

  const ext = (file.name.split(".").pop() || "png").toLowerCase()
  const filePath = `${user.id}/avatar.${ext}`

  // Public bucket, so a full public URL is returned by getPublicUrl.
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, bytes, { contentType: file.type, upsert: true })
  if (uploadError) {
    // ARIA/other mismatch — try removing the unknown extension and re-uploading.
    console.error("Avatar upload failed:", uploadError.message)
    return { error: "We couldn't upload your profile picture. Please try again." }
  }

  const { data: urlData } = supabase.storage
    .from("avatars")
    .getPublicUrl(filePath)
  const avatarUrl = urlData?.publicUrl || `${supabase.storage.from("avatars").getPublicUrl(filePath).data.publicUrl}`

  // Persist on profiles so every surface (navbar/sidebar/dashboard cards) can read it.
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: avatarUrl })
    .eq("id", user.id)
  if (updateError) {
    console.error("Avatar profile save failed:", updateError.message)
    return { error: "We couldn't save your profile picture. Please try again." }
  }

  return { success: true, avatarUrl }
}

export async function removeAvatarAction() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "You must be signed in to manage your profile picture." }
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: null })
    .eq("id", user.id)
  if (updateError) {
    console.error("Avatar remove failed:", updateError.message)
    return { error: "We couldn't remove your profile picture. Please try again." }
  }

  return { success: true }
}