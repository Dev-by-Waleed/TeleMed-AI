export async function getUser(supabase) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  } catch (err) {
    console.error("getUser failed:", err)
    return null
  }
}

export async function getUserRole(supabase, userId) {
  if (!userId) return 'patient'
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()

    return profile?.role || 'patient'
  } catch (err) {
    console.error("getUserRole failed:", err)
    return 'patient'
  }
}

// Whether the user has completed onboarding (saved a medical profile row).
// Used to re-show onboarding on login if a patient skipped it at signup.
export async function hasCompletedOnboarding(supabase, userId) {
  if (!userId) return true
  try {
    const { data } = await supabase
      .from('patient_profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle()

    return !!data
  } catch (err) {
    console.error("hasCompletedOnboarding failed:", err)
    return true
  }
}