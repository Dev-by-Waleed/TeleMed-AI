import InviteActivationForm from "./InviteActivationForm"

export const metadata = {
  title: "Set Your Password | TeleMed AI",
  description: "Activate your doctor account.",
}

export default async function DoctorInvitePage({ params }) {
  const { token } = await params
  return <InviteActivationForm token={token} />
}
