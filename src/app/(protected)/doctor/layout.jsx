import Sidebar from '@/Components/layout/Sidebar'
import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/supabase/profile'

export default async function DoctorLayout({ children }) {
  const supabase = await createClient()
  const user = await getUser(supabase)

  const fullName = user?.user_metadata?.full_name || user?.email || ''
  const userEmail = user?.email || ''

  const { data: profileRow } = await supabase
    .from('profiles')
    .select('avatar_url')
    .eq('id', user?.id)
    .maybeSingle()
  const avatarUrl = profileRow?.avatar_url || null

  return (
    <div
      className="h-screen flex font-sans overflow-hidden antialiased"
      style={{
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-on-surface)',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <Sidebar userEmail={userEmail} userName={fullName} avatarUrl={avatarUrl} />
      {children}
    </div>
  )
}
