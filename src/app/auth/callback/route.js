import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next") || "/reset-password"

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      // The recovery/confirmation code is single-use and may have already
      // been exchanged, or it may have genuinely expired. Send the user back
      // to the forgot-password screen with a clear message path instead of a
      // broken/empty reset page.
      console.error("Code exchange failed:", error.status, error.code)
      return NextResponse.redirect(
        new URL("/forgot-password?status=invalid_link", requestUrl.origin)
      )
    }
  }

  // Strip the code (and any PKCE/flow params) from the URL so it is never
  // exchanged a second time — single-use links must not re-fire.
  const cleanUrl = new URL(next, requestUrl.origin)
  cleanUrl.search = ""
  return NextResponse.redirect(cleanUrl)
}
