# TeleMed AI

A full-stack telemedicine web app built with **Next.js 16 (App Router)**, **Supabase** (PostgreSQL, Realtime, Storage, Auth), **React 19**, **Tailwind CSS v4**, and **lucide-react** icons. It supports three roles — **patient**, **doctor**, and **admin** — with appointment booking, real-time consultation chat, AI-assisted report summarization, and admin management.

## Features

- **Auth & onboarding** — email/password sign-up with email confirmation, password reset, role-based routing, and a mandatory patient onboarding flow.
- **Patient portal** — browse active doctors, book appointments, view an active-consultation hub, join consultation chat, and upload medical reports.
- **Doctor portal** — dashboard with today's appointments and next appointment, a "My Patients" list (grouped per patient), consultation history, and per-appointment chat rooms.
- **Admin portal** — overview stats, and Patients / Doctors / Appointments / Consultations / Reports management, plus a create-doctor flow with invite links.
- **Real-time consultation chat** — messages persisted to `messages`, scoped to an appointment via realtime subscriptions.
- **AI report summaries** — PDF upload to Supabase Storage, text extraction, and a Gemini summary (with a non-medical-advice disclaimer).

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
- Doctor/patient/admin data is fetched through scoped security-definer RPCs (e.g. `get_doctor_appointments`, `get_consultation_records`, `admin_get_stats`) that join `profiles`/`doctors` and filter by `auth.uid()`.
- Consultations are modelled on the `appointments` table; `messages` are scoped to `appointment_id` and exposed via realtime.

## Project structure

```
src/
  app/                     # App Router pages (public, auth, protected portals)
  Components/              # layout + ui components
  actions/                 # server actions (auth, onboarding, appointments, reports, admin, password)
  lib/                     # supabase clients, profile helpers, consultation-room helper, specialties
```
