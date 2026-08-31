# TeleMed AI — PRD Implementation Roadmap

**Source:** Student MVP PRD (auth, onboarding, reports + AI, booking, live chat, doctor/admin dashboards)
**Status legend:** `[ ]` pending · `[~]` in progress · `[x]` done
**Last updated:** 2026-08-29

---

## Fit Audit (start of work)

The project is **not** yet a fit for the full PRD. Solid foundations exist, but the core MVP features are missing.

### Already satisfied (no action)
- [x] **Epic 1 (partial):** Email/password auth, confirm-email, password reset, RBAC middleware (patient/doctor/admin route guards), role persisted in `profiles`.
- [x] **Epic 2 (partial):** Mandatory patient onboarding + redirect loop (`/features/onboarding`).
- [x] **Epic 6 (partial):** Dynamic doctor dashboard (appointments, next appt) and patient dashboard via scoped RPCs.
- [x] **Epic 7 (partial):** Admin dashboard with live counts (new `admin_get_stats` RPC).

### Gaps (work required)
| Epic | Requirement missing |
|------|---------------------|
| 1 | Admin-created doctor accounts (temp password / invite link). Currently signup is locked to `patient`. |
| 2 | Onboarding missing required **Emergency Contact** + optional fields (blood group, notes, past surgeries, smoking, chronic illness). |
| 3 | **My Reports:** PDF upload → storage → AI summary → status + disclaimer. Page is fully hardcoded; no storage/AI/upload. |
| 4 | **Appointment booking:** no booking page / time-slot UI / booking action. |
| 5 | **Live consultation chat:** chat is hardcoded UI; no realtime, no messages tied to appointment, no persistence. |
| 7 | Admin dashboard has no **Patients / Doctors / Appointments tabs** and no **create-doctor** flow. |

### Data-model gaps vs PRD
- `patient_profiles`: add `emergency_contact`, `blood_group`, `notes`, `past_surgeries`, `smoking_status`, `chronic_illness_notes`, `completed_onboarding`.
- `doctors`: add `active_status`, `created_by_admin`, `invite_token`, `temp_password_status`.
- `profiles`: add `account_status`.
- `reports`: table exists but unused (no upload/storage/AI wiring).
- `messages`/`appointments`: exist but chat not wired to `appointment_id`.

---

## Roadmap Steps

### Step 1 — Extend the data model
- [x] Add onboarding fields to `patient_profiles` (emergency_contact + optional fields + `completed_onboarding`).
- [x] Add doctor admin fields to `doctors` (`active_status`, `created_by_admin`, `invite_token`, `temp_password_status`).
- [x] Add `account_status` to `profiles`.
- [x] (Data model part done.) Realtime for `messages` enabled in Step 4.

### Step 2 — Complete Epic 2: Patient onboarding
- [x] Collect emergency contact + optional fields in onboarding form.
- [x] Persist via `saveOnboardingAction`; set `completed_onboarding = true`.
- [x] Remove PRD out-of-scope fields if any (none) — keep all required fields validated.

### Step 3 — Epic 4: Appointment booking
- [x] Patients page lists active doctors with book button.
- [x] Time-slot selection and booking action (creates `appointments` row, link patient/doctor/date/time/status).
- [x] Booking confirmation UI; blocked until onboarding complete.

### Step 4 — Epic 5: Live consultation chat
- [x] Real-time chat (Supabase Realtime) tied to `appointment_id`.
- [x] Persist messages to `messages`; history survives refresh; split-screen context panel.
- [x] Scope messages/consultations to the appointment; RLS ensures correct access.

### Step 5 — Epic 3: PDF upload + AI summary
- [x] My Reports: PDF-only upload → Supabase Storage.
- [x] Extract text → AI summary (Gemini 1.5 Flash per recommended stack).
- [x] Save `reports` row (file_url, ai_summary, status) and display status + disclaimer.

### Step 6 — Epic 7: Admin tabs + doctor creation
- [x] Admin dashboard tabs: Patients, Doctors, Appointments tables (read-only RPCs `admin_get_patients` / `admin_get_doctors` / `admin_get_appointments`).
- [x] Create-doctor flow (name/email/specialty) with temp password or invite link; auto Doctor role via `admin_promote_to_doctor`.
- [x] New doctor appears in Doctors tab; invites/status shown; invite-activation route `/doctor-invite/[token]`.

### Step 7 — Wrap-up
- [x] Run `npm run lint` and `npm run build`; fix issues.
- [x] Verify each epic end-to-end.
- [x] Update this file: mark all steps `[x]`.

---
## Notes
- Recommended stack (per PRD): Next.js + Supabase + PostgreSQL + Realtime + Storage + Gemini 1.5 Flash. Fits the current project (already Next.js + Supabase).
- AI summary is informational only — include non-medical-advice disclaimer.
- Out of scope per PRD: video/audio, payments, prescriptions, email verification flow (confirm-email kept but out-of-scope optional), advanced scheduling.
