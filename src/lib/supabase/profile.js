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