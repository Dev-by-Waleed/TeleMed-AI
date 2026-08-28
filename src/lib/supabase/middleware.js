import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { getUser, getUserRole, hasCompletedOnboarding } from '@/lib/supabase/profile'

// Boundary-safe prefix check: matches `/prefix` exactly or `/prefix/...`,
// but not `/prefixsomething` (avoids accidental path collisions).
function pathStartsWith(pathname, prefix) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`)
}

export async function updateSession(request) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const pathname = request.nextUrl.pathname

    // The auth callback performs the single, explicit PKCE code exchange and
    // then strips the code from the URL. Bypass the proxy here so the
    // auto-exchange (triggered by getUser below) never consumes the single-use
    // code before the callback route handler does.
    if (pathStartsWith(pathname, '/auth/callback')) {
        return supabaseResponse
    }

    // 1. Initialize Supabase Server Client with Cookie Handlers
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // 2. Fetch authenticated user
    const user = await getUser(supabase)

    // Route classifications
    const isAuthRoute = pathStartsWith(pathname, '/login') || pathStartsWith(pathname, '/signup')
    const isProtectedRoute = pathStartsWith(pathname, '/patient') ||
                             pathStartsWith(pathname, '/doctor') ||
                             pathStartsWith(pathname, '/admin') ||
                             pathStartsWith(pathname, '/features')

    // 3. CASE 1: Unauthenticated user trying to access protected routes
    if (!user && isProtectedRoute) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    // 4. Fetch User Role if logged in and accessing protected OR auth routes
    if (user && (isProtectedRoute || isAuthRoute)) {
        const userRole = await getUserRole(supabase, user.id)
        const defaultDashboard = `/${userRole}/dashboard`

        // 5. CASE 2: Logged-in user tries to visit /login or /signup -> Redirect to their dashboard
        if (isAuthRoute) {
            return NextResponse.redirect(new URL(defaultDashboard, request.url))
        }

        // 6. CASE 3: Role-Based Access Control (RBAC) Enforcement
        if (pathStartsWith(pathname, '/admin') && userRole !== 'admin') {
            return NextResponse.redirect(new URL('/unauthorized', request.url))
        }

        if (pathStartsWith(pathname, '/doctor') && userRole !== 'doctor' && userRole !== 'admin') {
            return NextResponse.redirect(new URL('/unauthorized', request.url))
        }

        if (pathStartsWith(pathname, '/patient') && userRole !== 'patient' && userRole !== 'admin') {
            return NextResponse.redirect(new URL('/unauthorized', request.url))
        }

        // Patients who haven't completed onboarding are kept on the onboarding
        // page until they save their medical profile, instead of landing on
        // an empty dashboard. Applies to both the login action and direct
        // navigation to any /patient/* route.
        if (pathStartsWith(pathname, '/patient') && userRole === 'patient') {
            const completed = await hasCompletedOnboarding(supabase, user.id)
            if (!completed) {
                return NextResponse.redirect(new URL('/features/onboarding', request.url))
            }
        }

        // Onboarding lives under /features and is a patient flow.
        if (pathStartsWith(pathname, '/features') && userRole !== 'patient' && userRole !== 'admin') {
            return NextResponse.redirect(new URL('/unauthorized', request.url))
        }
    }

    return supabaseResponse
}