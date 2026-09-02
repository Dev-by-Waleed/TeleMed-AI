import Navbar from '@/Components/layout/Navbar'
import { createClient } from '@/lib/supabase/server'
import { getUser, getUserRole } from '@/lib/supabase/profile'

export const metadata = {
  title: "Portal | TeleMed AI",
  description: "Your TeleMed AI portal.",
};

export default async function ProtectedLayout({ children }) {
  const supabase = await createClient()

  // Resolve the authenticated user and their role ONCE for the whole portal.
  const user = await getUser(supabase)
  const role = await getUserRole(supabase, user?.id)

  // Fetch the profile picture (if set) so the top navbar can show it.
  let avatarUrl = null
  if (user?.id && role !== 'doctor') {
    const { data: profileRow } = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('id', user.id)
      .maybeSingle()
    avatarUrl = profileRow?.avatar_url || null
  }

  // The doctor and admin portals use their own vertical Sidebars (rendered in
  // their layouts), so only the patient portal gets the shared top navigation.
  const hasTopNav = role === 'patient'

  return (
    <>
      {hasTopNav && <Navbar key={role} role={role} userEmail={user?.email} avatarUrl={avatarUrl} />}
      <main className={hasTopNav ? 'pt-16' : ''}>{children}</main>
    </>
  );
}
