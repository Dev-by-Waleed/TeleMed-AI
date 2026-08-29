import { createClient } from '@/lib/supabase/server';
import { Video, MessageSquare } from 'lucide-react';
import ConsultationHistoryView from './ConsultationHistoryView';

export const metadata = {
  title: "Consultation History | TeleMed AI",
  description: "Review past patient encounters, records, and clinical summaries.",
}

export default async function ConsultationHistory() {
  const supabase = await createClient()
  const { data: records = [] } = await supabase.rpc('get_consultation_records')

  const consultations = records.map((r) => ({
    id: r.id.slice(0, 8).toUpperCase(),
    name: r.patient_name || r.doctor_name || 'Patient',
    date: new Date(r.scheduled_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    time: new Date(r.scheduled_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
    type: r.type === 'video' ? 'Video Consult' : 'Secure Chat',
    typeIcon: r.type === 'video' ? Video : MessageSquare,
    status: r.status[0].toUpperCase() + r.status.slice(1).replace('_', ' '),
  }))

  return (
    <>
      <ConsultationHistoryView consultations={consultations} />
    </>
  );
}
