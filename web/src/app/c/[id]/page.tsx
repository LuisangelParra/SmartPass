import type { Metadata } from "next";
import { MobileCheckIn } from "@/components/checkin/MobileCheckIn";

export const metadata: Metadata = {
  title: "Mobile Check-In · SmartPass",
  description: "Scan in with biometric verification.",
  robots: { index: false, follow: false },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#080B0F",
};

export default async function MobileCheckInPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <MobileCheckIn eventId={id} />;
}
