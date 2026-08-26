import Link from 'next/link'
import { ShieldAlert, ArrowLeft, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export default async function UnauthorizedPage() {
    const supabase = await createClient()

    // Fetch logged-in user & role to route them back intelligently
    const { data: { user } } = await supabase.auth.getUser()

    let userRole = 'patient'
    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        userRole = profile?.role || 'patient'
    }

    const dashboardPath = `/${userRole}/dashboard`

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-8 text-center space-y-6">

                {/* Warning Icon Badge */}
                <div className="mx-auto w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center text-red-600 dark:text-red-400 ring-8 ring-red-50 dark:ring-red-900/20">
                    <ShieldAlert className="w-8 h-8" />
                </div>

                {/* Text Details */}
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                        403 - Access Denied
                    </h1>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        You don&apos;t have the required permissions to view this portal. You are signed in as a{' '}
                        <span className="font-semibold capitalize text-slate-900 dark:text-slate-200">
                            {userRole}
                        </span>.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <Link
                        href={dashboardPath}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-primary,#2563eb)] hover:opacity-90 text-white font-medium text-sm transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Return to Dashboard
                    </Link>

                    <form action="/auth/signout" method="post" className="w-full sm:w-auto">
                        <Link
                            href="/login"
                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium text-sm transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Switch Account
                        </Link>
                    </form>
                </div>

                {/* Footer Note */}
                <p className="text-xs text-slate-400 dark:text-slate-500 pt-2">
                    Think this is a mistake? Contact your TeleMed platform administrator.
                </p>
            </div>
        </div>
    )
}