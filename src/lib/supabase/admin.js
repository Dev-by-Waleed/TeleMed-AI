import { createClient as createSupabaseClient } from "@supabase/supabase-js"

// Admin (service-role) client — server only. Used by admin actions that need
// to create users with a chosen role (bypasses RLS, like doctor creation).
// NEVER import this from a client component.
export default function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
