import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SmartPass — Biometric Event Check-In",
    short_name: "SmartPass",
    description:
      "Biometric event check-in powered by facial recognition. No tickets, no QR codes.",
    start_url: "/",
    display: "standalone",
    background_color: "#080B0F",
    theme_color: "#00E5C8",
    orientation: "portrait",
    categories: ["business", "productivity", "utilities"],
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
