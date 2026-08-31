Project Overview
TeleMed AI — A full-stack telemedicine app (Next.js 16, React 19, Supabase, Tailwind CSS v4) with three roles: patient, doctor, admin. Features include appointment booking, real-time consultation chat, AI-powered report summarization, and admin management.
Dummy Data Found
#	File	What's Hardcoded	Severity
1	src/Components/ui/PatientConsultation.jsx	Entire fake consultation — fake doctor "Dr. Sarah Smith", fake vitals, fake allergies/conditions, fake chat transcript	Critical
2	src/app/(protected)/doctor/consultations/page.jsx	Entire fake "Active Session" — fake patient "Eleanor Vance", fake vitals, fake chat, fake prescriptions	Critical
3	src/app/(protected)/doctor/dashboard/page.jsx	Hardcoded "Patient Satisfaction: 4.9/5.0" stat + fake "Patient Requests" queue (Robert Davis, Alicia Keys)	High
4	src/app/page.jsx (landing page)	Hardcoded doctor profiles, fake stats (12,500+ patients, etc.), fake departments	Medium
5	src/Components/layout/Footer.jsx	Fake phone, email, address + wrong brand name "MediCare+"	Medium