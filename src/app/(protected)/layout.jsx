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

  // The doctor portal uses its own vertical Sidebar (rendered in the doctor
  // layout), so it shouldn't also render the top Navbar. Patient and admin
  // portals get the shared top navigation.
  const hasTopNav = role !== 'doctor'

  return (
    <>
      {hasTopNav && <Navbar key={role} role={role} userEmail={user?.email} />}
      <main className={hasTopNav ? 'pt-16' : ''}>{children}</main>
    </>
  );
}
