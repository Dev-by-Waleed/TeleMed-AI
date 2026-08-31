import { redirect, notFound } from "next/navigation"
import { loadConsultationRoom } from "@/lib/consultation-room"
import ConsultationRoom from "@/Components/ui/ConsultationRoom"

export const metadata = {
  title: "Consultation | TeleMed AI",
  description: "Live consultation room.",
}

export default async function PatientConsultationPage({ params }) {
  const { appointmentId } = await params
  const result = await loadConsultationRoom(appointmentId)

  if (!result.ok) {
    if (result.reason === "unauthenticated") redirect("/login")
    if (result.reason === "forbidden") redirect("/unauthorized")
    notFound()
  }

  return <ConsultationRoom {...result} />
}
