import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function updateSession(request) {
    let supabaseResponse = NextResponse.next({
        request,
    })

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
    const { data: { user } } = await supabase.auth.getUser()
    const pathname = request.nextUrl.pathname

    // Route classifications
    const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/signup')
    const isProtectedRoute = pathname.startsWith('/patient') ||
                             pathname.startsWith('/doctor') ||
                             pathname.startsWith('/admin')

    // 3. CASE 1: Unauthenticated user trying to access protected routes
    if (!user && isProtectedRoute) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    // 4. Fetch User Role if logged in and accessing protected OR auth routes
    if (user && (isProtectedRoute || isAuthRoute)) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        const userRole = profile?.role || 'patient'
        const defaultDashboard = `/${userRole}/dashboard`

        // 5. CASE 2: Logged-in user tries to visit /login or /signup -> Redirect to their dashboard
        if (isAuthRoute) {
            return NextResponse.redirect(new URL(defaultDashboard, request.url))
        }

        // 6. CASE 3: Role-Based Access Control (RBAC) Enforcement
        if (pathname.startsWith('/admin') && userRole !== 'admin') {
            return NextResponse.redirect(new URL('/unauthorized', request.url))
        }

        if (pathname.startsWith('/doctor') && userRole !== 'doctor' && userRole !== 'admin') {
            return NextResponse.redirect(new URL('/unauthorized', request.url))
        }

        if (pathname.startsWith('/patient') && userRole !== 'patient' && userRole !== 'admin') {
            return NextResponse.redirect(new URL('/unauthorized', request.url))
        }
    }

    return supabaseResponse
}