# TeleMed AI

A full-stack telemedicine web app built with **Next.js 16 (App Router)**, **Supabase** (PostgreSQL, Realtime, Storage, Auth), **React 19**, **Tailwind CSS v4**, and **lucide-react** icons. It supports three roles — **patient**, **doctor**, and **admin** — with appointment booking, real-time consultation chat, AI-assisted report summarization, and admin management.

## Features

- **Auth & onboarding** — email/password sign-up with email confirmation, password reset, role-based routing, and a mandatory patient onboarding flow.
- **Patient portal** — dashboard with live overview stats, browse active doctors (with an already-booked state), book appointments, view an active-consultation hub, join consultation chat, upload medical reports, manage appointments, and see prescriptions & doctor summaries. See [Patient features](#patient-features) below.
- **Doctor portal** — dashboard with today's appointments and next appointment, a "My Patients" list (grouped per patient) with per-patient detail pages, consultation history, per-appointment chat rooms, prescribing, a profile editor (with password change and profile picture), and full appointment lifecycle control (confirm/decline bookings, mark consultations complete). See [Doctor features](#doctor-features) below.
- **Admin portal** — a dedicated sidebar (Dashboard / Doctors / Patients / Appointments / Prescriptions / Reviews / Reports / Notifications), platform-wide management, a create-doctor flow with invite links, refill-request resolution, review moderation, appointment lifecycle control, notification broadcasts, and onboarding-funnel visibility. See [Admin features](#admin-features) below.
- **Real-time consultation chat** — messages persisted to `messages`, scoped to an appointment via realtime subscriptions.
- **AI report summaries** — PDF upload to Supabase Storage, text extraction, and a Gemini summary (with a non-medical-advice disclaimer).

## Patient features

Living feature set for the patient role; each entry records the routes, data
model, and behavior. All are implemented.

### Profile (view/edit medical profile)
- `GET /patient/profile` (page + `ProfileForm.jsx`, `src/actions/profile.js`).
- Pre-populated editable form over the existing `patient_profiles` table; server
  action validates using the same ranges/values as onboarding (age, height,
  weight, gender, blood group, smoking, emergency contact) and preserves
  `completed_onboarding = true`. Loaded from the navbar dropdown.

### Appointment management (My Appointments)
- `GET /patient/my-appointments` (page + `AppointmentsClient.jsx`,
  `src/actions/appointments.js`).
- Full history grouped into **Upcoming** (pending/confirmed) and **Past**
  (completed/cancelled), with status badges. **Cancel** validates ownership and
  cancellability; **Reschedule** cancels the old slot and redirects to booking
  so a patient can never hold two slots.

### Server-side slot availability
- `get_available_slots(p_doctor_id, p_slots timestamptz[])` returns the subset
  of candidate slots still bookable (future, non-overlapping with
  pending/confirmed appointments within a 30-minute window).
- `is_slot_available(p_doctor_id, p_start, p_duration)` closes the race at
  booking time — `bookAppointmentAction` re-checks before inserting.
- `BookingForm.jsx` renders only genuinely available slots.
- Known gap: the pending → confirmed workflow is still pending (roadmap).

### Appointment notifications
- `handle_appointment_notifications()` trigger (`trg_appointment_notifications`,
  AFTER INSERT OR UPDATE): patients get a notification on requested/confirmed/
  cancelled/completed. Deduplicated against the doctor's existing
  `trg_notify_new_appointment`. `notifications` is in the Realtime publication,
  so the bell badge updates live.

### Prescriptions & refills
- `GET /patient/prescriptions` (page + `PrescriptionsClient.jsx`,
  `src/actions/prescriptions.js`), new navbar entry.
- New `prescriptions` table (RLS: patient read/update own, prescribing doctor
  manages theirs, admins all) with `trg_refill_request` timestamping refill
  asks and ringing bell notifications for patient + doctor.
- "Request Refill" only offered on active, not-yet-requested prescriptions.

### Post-consultation summary (doctor's notes)
- `appointments.consultation_notes` column; `get_consultation_records()` now
  returns it as `summary`.
- Doctors write notes via a "View Summary" modal in consultation history
  (`src/actions/consultation.js`, RLS limits writes to the treating doctor).
- Patients read "Doctor's Summary" on completed appointment cards.

### Reviews & ratings
- New `reviews` table (UNIQUE `appointment_id`, rating 1–5, RLS scoped).
  `review_recompute_doctor_rating()` trigger keeps `doctors.rating` /
  `doctors.reviews_count` live.
- Completed (unreviewed) appointments show a **Rate this visit** modal;
  reviewed ones show "Rated X/5".

### Dashboard (optimized hub)
- `GET /patient/dashboard` — stats row (Upcoming, Active Medications, Medical
  Reports, Unread Notifications) whose tiles link into each page; doctor cards
  show a **Booked** state for doctors with a pending/confirmed appointment; a
  **Latest Summary** card surfaces the most recent doctor-written notes.
- No redundant "Quick Access" section — the navbar already provides it.

## Doctor features

Doctor-role workflow features.

### Appointment lifecycle (confirm / decline / complete)
- Server actions in `src/actions/doctor-appointments.js`:
  - `confirmAppointmentAction` — pending → confirmed.
  - `declineAppointmentAction` — pending → cancelled.
  - `completeAppointmentAction` — confirmed → completed.
- All three re-fetch the appointment and require `doctor_id === auth.uid()`;
  RLS already scopes the update (`Doctors update their own appointments`).
- Patient is notified on each status change by the existing
  `trg_appointment_notifications` trigger.
- **Dashboard** (`/doctor/dashboard`):
  - The "Patient Requests" panel is now live: pending bookings with a count
    badge, each with Confirm / Decline buttons (`PendingRequests.jsx`).
  - Today's appointments render via `TodayAppointments.jsx` with a **Complete**
    quick action on confirmed rows (the dead kebab menu was removed) and a
    working **View All** link to `/doctor/consultations`.
- **Consultation room** (`ConsultationRoom.jsx`): a "Complete Consultation"
  control appears for the treating doctor while the appointment is `confirmed`;
  completing it flips to `completed` (disabled afterward) and unlocks patient
  reviews and doctor/patient summaries.

### Prescriptions (write & manage)
- Server actions in `src/actions/doctor-prescriptions.js`:
  - `createPrescriptionAction` — validates an existing doctor–patient
    relationship (at least one appointment), writes an `active` prescription
    scoped to `doctor_id = auth.uid()` (RLS enforces this on INSERT).
  - `discontinuePrescriptionAction` — active → discontinued, only for
    prescriptions the doctor wrote.
- `GET /doctor/prescriptions` (`DoctorPrescriptions.jsx`): a "New Prescription"
  form with the doctor's own patients in a picker, plus Active and
  Completed/Discontinued lists. Refill-requested items show a blue badge.
- Sidebar gained a **Prescriptions** entry (`Pill` icon).
- **Consultation room**: a "Prescribe" button (treating doctor only) opens a
  modal pre-filled with the current patient (`patientId` now passed through
  `loadConsultationRoom`).
- Prescriptions appear instantly on the patient side (`/patient/prescriptions`)
  and, when requested, notify the doctor via `trg_refill_request`.

### Patient detail page
- `GET /doctor/patients/[id]` (page + `PatientDetail.jsx`), reached via the
  **Profile** button on "My Patients" cards.
- Shows the patient's basic profile + email, medical profile (vitals,
  conditions, allergies, medications), visit history with consultation notes,
  prescriptions this doctor wrote, and reports.
- Authorization is enforced by RLS: the migration
  `attending_doctor_read_patient_profiles` added SELECT policies on `profiles`
  and `patient_profiles` gated by `is_attending_doctor(id)`, so only doctors
  who actually have an appointment/consultation with the patient can load the
  page (`notFound()` otherwise). This also corrects the consultation room,
  whose patient-context sidebar previously couldn't read the patient's data.
- Quick actions: **Prescribe** (→ `/doctor/prescriptions`) and **Continue
  Visit** (→ the room for a pending/confirmed appointment).

### Doctor profile & settings
- `GET /doctor/profile` (page + `DoctorProfileForm.jsx`,
  `src/actions/doctor-profile.js`), new sidebar entry ("My Profile").
- Edits the doctor bio. `updateDoctorProfileAction` writes the `doctors` row
  (source of truth for the directory, RLS `Doctors can update their own
  profile`).
- **Full name and specialty are read-only and admin-managed** — both are set at
  doctor creation in the admin panel (`createDoctorAction`), not editable from
  the doctor profile, to keep directory credentials trustworthy.

### Account security (shared by both roles)
- `src/actions/account.js` + `src/Components/account/*`:
  - `ChangePasswordForm` — change password on the patient and doctor profile
    pages. `changePasswordAction` first verifies the current password via
    `signInWithPassword` (so the wrong password fails fast), then applies
    `auth.updateUser({ password })`.
  - `AvatarUpload` — upload/remove a profile picture on both profile pages.
    `uploadAvatarAction` stores the image in a public `avatars` bucket under
    `{user.id}/avatar.ext` (RLS keys the folder to `auth.uid()`, so users can
    only manage their own) and writes `profiles.avatar_url`. The avatar then
    shows in the patient top navbar and the doctor sidebar.
- Migrations: `profile_avatars_storage` (public `avatars` bucket + 4 RLS
  policies), `add_profiles_avatar_url` (`profiles.avatar_url` text column).

## Admin features

Admin-role oversight features. The admin portal uses its own vertical
`AdminSidebar.jsx`, so the shared top navbar is patient-only.

### Navigator
- The admin sidebar (`AdminSidebar.jsx`) lists **Dashboard, Doctors, Patients,
  Appointments, Consultations, Prescriptions, Reviews, Reports, Messages,
  Notifications** with the NotificationBell in the header. `hasTopNav` is now
  `role === 'patient'` (`src/app/(protected)/layout.jsx`); the admin layout
  renders the sidebar.

### Prescriptions & refill oversight
- `GET /admin/prescriptions` (page + `PrescriptionsAdminView.jsx`,
  `src/actions/admin.js`).
- RPC `admin_get_prescriptions()` (SECURITY DEFINER, `is_admin()`-guarded)
  returns every prescription joined to patient/doctor names.
- **Pending refills** tab lists active prescriptions with pending requests —
  each row has **Approve** / **Deny** (`resolveRefillAction`). Resolving clears
  `refill_requested` and notifies the patient through the `notifications` table.
- Tabs for Pending / Active / Completed & Discontinued plus summary stat cards.

### Review moderation
- `GET /admin/reviews` (page + `ReviewsAdminView.jsx`, `src/actions/admin.js`).
- RPC `admin_get_reviews()` lists reviews with patient, doctor, specialty and
  rating stars. `deleteReviewAction` removes a review; the existing
  `trg_reviews_recompute_rating` trigger recalculates `doctors.rating` and
  `doctors.reviews_count`.

### Appointment lifecycle control
- `GET /admin/appointments` (page + `AppointmentsAdminView.jsx`,
  `src/actions/admin.js`).
- Reuses `admin_get_appointments()` with status filter pills. 
  `setAppointmentStatusAction` **completes** (pending/confirmed → completed) or
  **cancels** (→ cancelled) any appointment; the existing
  `trg_appointment_notifications` trigger keeps the patient notified.

### Notification broadcasts
- `GET /admin/notifications` (page + `NotificationsAdminView.jsx`,
  `src/actions/admin.js`).
- `broadcastNotificationAction` → RPC `admin_broadcast_notifications(audience,
  title, body, link)` (SECURITY DEFINER) inserts an in-app notification for one
  of `all` / `patients` / `doctors` / `admins` (active accounts only) and
  returns the reach count. `notifications` is in the Realtime publication, so
  the bell badge updates live.
- RPC `admin_get_notifications()` provides a recent-notifications audit trail,
  **excluding `message`-type** alerts (those are moderated on the Messages
  page).
- New RLS policy **Admins manage notifications** (ALL) on `notifications`.

### Message moderation
- `GET /admin/messages` (page + `MessagesAdminView.jsx`,
  `src/actions/admin.js`).
- RPC `admin_get_messages()` (SECURITY DEFINER, `is_admin()`-guarded) lists
  every chat message with sender name/role, the patient ↔ doctor context, and
  specialty. Filter pills isolate patient- vs doctor-sent messages.
- `deleteMessageAction` removes a message — the row disappears from both sides
  of the live consultation room (backed by the existing **Admins manage
  messages** ALL RLS policy).

### Onboarding funnel visibility
- The Patients page (`/admin/patients`, `PatientsAdminView.jsx`) gained a
  filter chip showing the count of patients who **haven't completed onboarding**
  and a "Showing: Incomplete onboarding" toggle to isolate them (data from
  `admin_get_patients().completed_onboarding`).

## Tech stack

| Layer    | Tech |
|----------|------|
| Framework | Next.js 16 (App Router), React 19 |
| Backend   | Supabase (PostgreSQL, Auth, Realtime, Storage) |
| Styling   | Tailwind CSS v4 (via `@import "tailwindcss"` + `@theme` tokens) |
| AI        | Gemini 1.5 Flash (report summarization) |

## Getting started

1. Clone the repo and install dependencies:

   ```bash
   npm install
   ```

2. Create your `.env` from the example and fill in your Supabase project values:

   ```bash
   cp .env.example .env
   ```

   See `.env.example` for the required variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`, optional `GEMINI_API_KEY`, and the server-only `SUPABASE_SERVICE_ROLE_KEY`).

3. Apply the Supabase schema (RLS, tables, RPCs, triggers) from the migrations, then run the dev server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Useful scripts

```bash
npm run dev      # start the dev server
npm run build    # production build
npm run start    # run the production build
npm run lint     # ESLint
```

## Database & security notes

- Row Level Security (RLS) is enabled and forced on tables holding user/medical data; anonymous write access is revoked.
- Roles are forced in the database (a sign-up trigger always creates `patient`); the client never supplies a role, and a trigger blocks role escalation.
- Doctor/patient/admin data is fetched through scoped security-definer RPCs (e.g. `get_doctor_appointments`, `get_consultation_records`, `admin_get_stats`, `admin_get_patients`, `admin_get_prescriptions`, `admin_get_reviews`, `admin_get_notifications`, `admin_broadcast_notifications`, `get_available_slots`, `is_slot_available`) that join `profiles`/`doctors` and filter by `auth.uid()` / `is_admin()`.
- Consultations are modelled on the `appointments` table; `messages` are scoped to `appointment_id` and exposed via realtime.
- Patient-era additions: `prescriptions` and `reviews` tables (RLS on, UNIQUE review per appointment) and triggers `trg_appointment_notifications` (status → bell), `trg_refill_request` (refill asks), `trg_reviews_recompute_rating` (live doctor rating). Admin-oversight additions: **Admins manage notifications** RLS policy (ALL) plus the `admin_get_*` / `admin_broadcast_notifications` RPCs. RLS helper functions `is_attending_doctor(uuid)` and `is_doctor()` must have `EXECUTE` granted to `authenticated`/`anon` — see migration `grant_rls_helper_function_execute`.

## Project structure

```
src/
  app/                     # App Router pages (public, auth, protected portals)
  Components/              # layout + ui components
  actions/                 # server actions (auth, onboarding, appointments, booking/availability, reports, profile, prescriptions, consultation, reviews, admin, password)
  lib/                     # supabase clients, profile helpers, consultation-room helper, specialties
```
