# AGENTS.md — TeleMed AI

## Project Overview

TeleMed AI is a full-stack telemedicine web application built as a student MVP. It supports three user roles — **Patient**, **Doctor**, and **Admin** — each with its own portal, navigation, and capabilities. Features include appointment booking, real-time consultation chat, AI-assisted medical report summarization, prescription management, and full admin moderation.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React 19 |
| Backend / DB | Supabase (PostgreSQL, Auth, Realtime, Storage) |
| Styling | Tailwind CSS v4 (`@import "tailwindcss"` + `@theme` tokens) |
| AI | Google Gemini 2.5 Flash (PDF report summarization) |
| Forms / validation | react-hook-form + zod (`@hookform/resolvers`) |
| Toasts | sonner |
| Dates | date-fns (helpers in `src/lib/date.js`) |
| Markdown | react-markdown (report AI summary rendering) |
| Icons | lucide-react |
| Themes | `next-themes` (installed but NOT wired up; dark mode is OS-level only via `prefers-color-scheme`) |

## Scripts

```
npm run dev       # Start dev server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # ESLint (flat config, eslint-config-next/core-web-vitals)
```

There is no test framework configured. No `test`, `e2e`, or `typecheck` scripts exist.

## Project Structure

```
src/
  app/                      # Next.js App Router pages
    (auth)/                 # Unauthenticated route group
      login/page.jsx
      signup/page.jsx
    (protected)/            # Auth-guarded route group
      layout.jsx            # Resolves user/role server-side; renders Navbar for patients
      admin/                # Admin portal (AdminSidebar)
        layout.jsx
        dashboard/page.jsx
        doctors/page.jsx
        patients/page.jsx
        appointments/page.jsx
        prescriptions/page.jsx
        messages/page.jsx
        reports/page.jsx
        notifications/page.jsx
        reviews/page.jsx
        profile-requests/page.jsx
      doctor/               # Doctor portal (Sidebar)
        layout.jsx
        dashboard/page.jsx
        consultations/page.jsx
        consultation/[appointmentId]/page.jsx
        consultation-history/page.jsx
        prescriptions/page.jsx
        patients/[id]/page.jsx
        profile/page.jsx       # ProfileForm.jsx, ProfileRequestForm.jsx
      patient/              # Patient portal (top Navbar)
        layout.jsx
        dashboard/page.jsx
        appointments/page.jsx
        my-appointments/page.jsx
        consultation/page.jsx
        consultation/[appointmentId]/page.jsx
        prescriptions/page.jsx
        reports/page.jsx      # ReportsClient.jsx (list management)
        profile/page.jsx      # ProfileForm.jsx
      features/
        onboarding/page.jsx
    about/page.jsx
    privacy/page.jsx
    terms/page.jsx
    unauthorized/page.jsx
    forgot-password/page.jsx
    reset-password/page.jsx
    doctor-invite/[token]/page.jsx
    auth/callback/route.js
    layout.jsx              # Root layout (fonts, metadata)
    page.jsx                # Landing page
    globals.css             # Theme tokens (light + dark), Tailwind import
  actions/                  # Server actions ("use server")
    account.js              # changePassword, uploadAvatar, removeAvatar
    admin.js                # createDoctor, activateInvite, setUserStatus, getPatientProfile,
                            # resolveRefill, deleteReview, deleteMessage, setAppointmentStatus,
                            # broadcastNotification
    appointments.js         # bookAppointment, cancelAppointment, rescheduleAppointment
    auth.js                 # signupAction, loginAction
    consultation.js         # saveConsultationNotes
    doctor-appointments.js  # confirmAppointment, declineAppointment, completeAppointment
    doctor-prescriptions.js # createPrescription, discontinuePrescription
    doctor-profile.js       # updateDoctorProfile (bio only)
    onboarding.js           # saveOnboarding
    password.js             # resetPassword, forgotPassword
    prescriptions.js        # requestRefill
    profile.js              # updateProfile
    profile-requests.js     # submitProfileRequest, decideProfileRequest
    reports.js              # uploadReport, retrySummarize, deleteReport,
                            # getReportDownloadUrl
    reviews.js              # submitReview
  Components/
    account/
      ChangePasswordForm.jsx
      AvatarUpload.jsx
    forms/
      LoginForm.jsx
      SignUpForm.jsx
      ForgotPasswordForm.jsx
      ResetPasswordForm.jsx
    layout/
      Navbar.jsx            # Patient top navigation
      Sidebar.jsx           # Doctor sidebar
      AdminSidebar.jsx      # Admin sidebar
      Footer.jsx
      NotificationBell.jsx  # Supabase Realtime subscription for live notifications
    ui/
      ConsultationRoom.jsx  # Shared real-time chat room (doctor + patient)
      PatientConsultation.jsx
      HomeSearch.jsx
      PasswordStrength.jsx
      AuthField.jsx
  lib/
    supabase/
      admin.js              # Service-role client (bypasses RLS, never in browser)
      client.js             # Browser client (createBrowserClient from @supabase/ssr)
      server.js             # Server client (cookie-based, used by all server actions)
      proxy.js              # Middleware logic (session refresh, auth guards, RBAC, onboarding check)
      profile.js            # getUser, getUserRole, hasCompletedOnboarding helpers
    ai.js                   # Gemini 2.5 Flash summarization (summarizeDocument)
    consultation-room.js    # loadConsultationRoom — loads appointment, messages, patient context
    specialties.js          # SPECIALTIES constant array (10 specialties)
  proxy.js                  # Next.js middleware entry point (delegates to lib/supabase/proxy.js)
```

## Configuration Files

| File | Notes |
|---|---|
| `jsconfig.json` | Path alias: `@/*` → `./src/*` |
| `eslint.config.mjs` | ESLint 9 flat config, extends `eslint-config-next/core-web-vitals` |
| `postcss.config.mjs` | Uses `@tailwindcss/postcss` (Tailwind v4 approach) |
| `next.config.mjs` | Security headers (CSP-adjacent), image remote patterns (Unsplash, Google, pravatar) |
| `.env.example` | Documents required env vars (see Environment Variables below) |
| `opencode.json` | Supabase MCP server config |

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL       # Supabase project URL (safe for browser)
NEXT_PUBLIC_SUPABASE_ANON_KEY  # Supabase anon/public key (safe for browser)
NEXT_PUBLIC_SITE_URL           # Site origin for auth redirects (default: http://localhost:3000)
GEMINI_API_KEY                 # Google Gemini API key for AI report summarization
SUPABASE_SERVICE_ROLE_KEY      # Supabase service_role key (SERVER ONLY, never exposed to browser)
```

## Routing and Middleware

Middleware (`src/proxy.js` → `src/lib/supabase/proxy.js`) runs on every non-static request and handles:

1. **Session refresh** — reinitializes Supabase server client with cookie handlers on every request.
2. **Auth callback bypass** — skips `/auth/callback` to avoid consuming PKCE code exchange prematurely.
3. **Unauthenticated guard** — redirects unauthenticated users away from `/patient/*`, `/doctor/*`, `/admin/*`, `/features/*` to `/login`.
4. **Authenticated redirect** — redirects logged-in users away from `/login` and `/signup` to their role-based dashboard.
5. **RBAC enforcement**:
   - `/admin/*` requires `admin` role.
   - `/doctor/*` requires `doctor` or `admin` role.
   - `/patient/*` requires `patient` or `admin` role.
   - `/features/*` requires `patient` or `admin` role.
6. **Onboarding guard** — patients without completed onboarding are redirected from any `/patient/*` route to `/features/onboarding`.

Uses a `pathStartsWith` helper for boundary-safe prefix matching.

## Auth Flow

- **Signup**: `signupAction` → `supabase.auth.signUp` with email redirect → redirects to `/signup/confirm-email` or `/features/onboarding`.
- **Login**: `loginAction` → `supabase.auth.signInWithPassword` → fetches role from `profiles` table → redirects to role-based dashboard.
- **Password Reset**: `forgotPasswordAction` → `supabase.auth.resetPasswordForEmail` → `/auth/callback?next=/reset-password` → `resetPasswordAction` completes the flow.
- **OAuth**: Handled by `auth/callback/route.js` (PKCE code exchange).
- **Doctor Invite**: `/doctor-invite/[token]` → `activateInviteDoctorAction` validates token, sets password, activates account.
- Roles are **always created as `patient`** by a database trigger; doctor/admin roles are set via `admin_promote_to_doctor` RPC or `admin_set_user_status` RPC.

## Supabase Client Layers

| Client | File | Purpose |
|---|---|---|
| Server | `lib/supabase/server.js` | Cookie-based server client. Used by all server actions. |
| Browser | `lib/supabase/client.js` | `createBrowserClient` for client components (realtime subscriptions, etc.) |
| Admin | `lib/supabase/admin.js` | Service-role key. Bypasses RLS. Used for doctor creation, invite activation, password changes. **NEVER import in client components.** |
| Profile | `lib/supabase/profile.js` | Helper functions: `getUser`, `getUserRole`, `hasCompletedOnboarding`. |
| Proxy/Middleware | `lib/supabase/proxy.js` | Middleware auth logic (session refresh, RBAC, onboarding checks). |

## Database Schema

### Tables

| Table | Purpose |
|---|---|
| `profiles` | User accounts (id, email, full_name, role, avatar_url, account_status). Created by auth trigger. |
| `patient_profiles` | Patient medical data (age, gender, height, weight, allergies, medications, conditions, emergency_contact, blood_group, etc.). Upserted during onboarding. |
| `doctors` | Doctor-specific data (full_name, specialty, bio, active_status, invite_token, invited_by, temp_password_status). |
| `appointments` | Appointment bookings (patient_id, doctor_id, scheduled_at, duration_min, reason, status, consultation_notes). |
| `prescriptions` | Doctor-prescribed medications (patient_id, doctor_id, medication, dosage, frequency, status, refill_requested). |
| `reviews` | Patient reviews for completed appointments (appointment_id, doctor_id, patient_id, rating, comment). |
| `messages` | Chat messages in consultation rooms (sender_id, receiver_id, body, appointment_id). |
| `notifications` | In-app notifications (user_id, title, body, type, link, read). |
| `reports` | Patient-uploaded PDF medical reports (patient_id, title, file_url, ai_summary, status). |

### Storage Buckets

| Bucket | Purpose | Access |
|---|---|---|
| `avatars` | User profile pictures | Public, RLS-scoped by user ID folder |
| `reports` | Patient PDF medical reports | RLS-scoped by patient ID folder |

The `reports` bucket's **"Patients manage their own reports"** (ALL) policy keys the
folder to `auth.uid()`, so the cookie-based server client can **DELETE** stored
PDFs and **create signed URLs** (SELECT) for download — this is what
`deleteReportAction` and `getReportDownloadUrl` rely on. No extra storage policy
was needed.

### RPC Functions (Stored Procedures)

| RPC | Parameters | Called From | Purpose |
|---|---|---|---|
| `is_slot_available` | `p_doctor_id`, `p_start`, `p_duration` | `appointments.js` | Checks for overlapping appointments before booking. |
| `admin_promote_to_doctor` | `p_user_id`, `p_full_name`, `p_specialty`, `p_created_by_admin`, `p_active_status`, `p_temp_password_status` | `admin.js` | Promotes a profile from patient to doctor. |
| `admin_set_user_status` | `p_user_id`, `p_status`, `p_role` | `admin.js` | SECURITY DEFINER: updates account status/role, bypasses escalation trigger. |
| `admin_get_patient_profile` | `p_user_id` | `admin.js` | Fetches full patient medical profile (admin view). |
| `admin_apply_profile_request` | `p_request_id`, `p_status`, `p_admin_response` | `profile-requests.js` | Approves/denies doctor profile change requests. |
| `admin_broadcast_notifications` | `p_audience`, `p_title`, `p_body`, `p_link` | `admin.js` | Sends notifications to role-based audience. Returns count. |

### Database Triggers (Referenced in Code)

| Trigger | Purpose |
|---|---|
| Profile creation trigger | Creates a `patient` profile row when a new auth user is created. |
| `trg_appointment_notifications` | Sends patient notifications on appointment status changes (confirmed/cancelled/completed). |
| Refill notification trigger | When `refill_requested` is set to true, timestamps it and notifies the prescribing doctor. |
| Review aggregate trigger | After a review is deleted, recomputes the doctor's aggregate rating and review count. |
| Role escalation blocker | Prevents users from self-assigning non-patient roles. Bypassed by `admin_set_user_status` RPC. |

## Styling Conventions

- **Tailwind CSS v4** with `@theme` tokens defined in `globals.css`.
- **CSS custom properties** (Material Design 3-inspired): `--color-primary`, `--color-surface-card`, `--color-outline-variant`, etc.
- **Dark mode** via `@media (prefers-color-scheme: dark)` — no manual toggle.
- **Font stack**: Geist Sans, Geist Mono, Open Sans (loaded via `next/font/google`).
- **Icons**: `lucide-react` exclusively.

**Known issue**: Three styling conventions coexist — bare Tailwind theme classes, inline `style={{ backgroundColor: 'var(--color-x)' }}`, and some hardcoded `slate-*` with `dark:` prefixes. Prefer using CSS custom properties via inline styles for consistency.

## Component Patterns

- **Server components** by default. Client components marked with `'use client'` only when they need hooks/state/event handlers.
- **Server actions** for all mutations (wrapped with `"use server"`). Pages use `useActionState` from React 19.
- **Shared components**: `ConsultationRoom.jsx` is shared between doctor and patient consultation pages.
- **Layout nesting**: Root → Protected layout (resolves user/role) → Role-specific layout (Sidebar/Navbar).
- **Reusable form/`section` helpers are hoisted to module scope** — the profile pages define `Field`, `SectionCard`, and shared input-class constants *outside* the component. The React Compiler-backed `react-hooks` lint rule (`Cannot create components during render`) rejects components/functions defined inside another component, so any small presentational helper must live at module level.
- **Profile/Reports "section card" visual pattern** (used consistently on patient profile, doctor profile, and reports): an icon-in-a-rounded-square header with a bordered bottom divider, plus a body with a padding. Status pills use the design tokens (`bg-emerald-100 text-emerald-800`, etc.) instead of hardcoded hex.

### Scroll container gotcha (doctor portal)
`doctor/layout.jsx` wraps content in `h-screen flex overflow-hidden`, so the content `<main>` is the **scroll container** and **must** keep `flex-1 overflow-y-auto`. Do not put horizontal centering classes (`max-w-*`, `mx-auto`, `w-full`) on that same `<main>`, or the scrollbar breaks; instead wrap the inner content in a `max-w-[…] mx-auto` div. Patient and admin layouts scroll the document normally, so their pages can center directly on `<main>`.

## Path Aliases

```js
@/actions/*      → src/actions/*
@/Components/*   → src/Components/*
@/lib/*          → src/lib/*
@/app/*          → src/app/*
```

## Conventions and Rules

1. **NEVER import `lib/supabase/admin.js` in client components.** It uses the service-role key and bypasses RLS.
2. **NEVER log PHI (Protected Health Information) to console.** No patient data should appear in server logs.
3. **NEVER expose `SUPABASE_SERVICE_ROLE_KEY` to the browser.** It is server-only.
4. **NEVER commit secrets.** `.env` is gitignored. Never hardcode API keys or passwords.
5. **NEVER assume a role.** Always fetch the role from the `profiles` table via `getUserRole`. The database is the source of truth.
6. **NEVER skip RLS.** All user-facing queries go through RLS-scoped clients or RPCs.
7. **NEVER allow role self-escalation.** Signup always creates `patient`; doctor/admin promotion is admin-only via RPCs.
8. **Use `@/*` path aliases** for all imports (e.g., `@/lib/supabase/server`, `@/actions/auth`).
9. **Use CSS custom properties** (`var(--color-*)`) for colors, not hardcoded Tailwind color classes.
10. **Use `lucide-react`** for all icons.
11. **Password validation** must be: 8+ chars, at least one uppercase, one lowercase, one digit.
12. **File uploads**: Avatars max 2 MB (JPG/PNG/WEBP/GIF/AVIF), Reports max 10 MB (PDF only).
13. **Appointment slots** are 30 minutes long.
14. **Use `'use client'`** only when the component needs React hooks, event handlers, or browser APIs.

## Specialties List

```
Cardiology, Dermatology, General Practice, Neurology, Oncology,
Orthopedics, Pediatrics, Psychiatry, Radiology, Other
```

Defined in `src/lib/specialties.js`. Used in admin doctor-creation forms and doctor profile request forms.

## AI Integration

- **Model**: Gemini 2.5 Flash (`gemini-2.5-flash`)
- **Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`
- **Purpose**: Summarize PDF medical reports in patient-friendly language
- **Prompt**: "Act as a medical assistant. Explain this medical report in simple, easy-to-understand language for a patient. Avoid complex terminology and summarize key findings, possible concerns, and general meaning."
- **Timeout**: 60 seconds
- **Used by**: `uploadReportAction` and `retrySummarizeAction` in `src/actions/reports.js`
- **Graceful degradation**: If AI fails, report status is set to `failed` with a retry option

## Known Issues and Gotchas

### Critical
- **DB password leaked in git history.** The file `project supabase database pass.txt` was committed in an earlier commit. Requires the repo owner to purge with `git filter-repo` + force-push.

### High
- **Fail-open role defaults.** `getUserRole` returns `'patient'` on DB error; `hasCompletedOnboarding` returns `true`. On Supabase outage, anyone is treated as an onboarded patient. Consider fail-closed defaults for a medical app.

### Medium
- Dead UI elements: "AI Assistant" FAB, carousel arrows, "View all departments" have no click handlers. Patient dashboard Quick Actions link to `href="#"`.
- `ConsultationRoom.jsx` creates a new Supabase client on every render — should use `useMemo` or `useRef`.
- `next-themes` is installed but never wired up.
- Password validation is duplicated in `src/actions/auth.js` and `src/actions/password.js`.
- `auth/callback/route.js` uses the `next` param in a redirect without validating it starts with `/` (potential open redirect).
- Navbar "Account Profile" links to `/[role]/profile` which does not have a page file at that exact path (may 404).
- No `loading.jsx` or skeleton states for RPC-backed pages.
- `PatientConsultation.jsx` is `'use client'` but contains no hooks/state (should be a server component).

### Low
- Three styling conventions coexist (Tailwind classes, CSS custom properties, hardcoded dark: prefixes).
- Hardcoded `en-US` locale in date formatting.
- `X-DNS-Prefetch-Control: on` header is set (not ideal for security-sensitive app).
- Per-request auth round-trips (middleware + layout both call `getUser`/`getUserRole`) — could cache role in a signed cookie.

## Demo Accounts

9 demo doctor accounts exist (password: `12345678oO`). See `doctor-accounts.txt` for full list. General Practice is noted as "user will create manually during demo."

## Code Review Score

**7.6 / 10** — Solid, near-production-quality MVP. All three role portals are wired to real Supabase data via RBAC-scoped RPCs with realtime chat. All original PRD roadmap items are complete.
