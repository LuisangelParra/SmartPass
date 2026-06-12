import type { Metadata, Viewport } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "sonner";

const fontDisplay = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://smartpass.vercel.app");
const SITE_NAME = "SmartPass";
const TITLE = "SmartPass — Biometric Event Check-In";
const DESCRIPTION =
  "Open-source biometric event check-in. Register attendees once, verify faces at the door with real-time facial recognition. No tickets, no QR codes, no app. Powered by FastAPI + pgvector + dlib.";
const KEYWORDS = [
  "biometric check-in",
  "facial recognition",
  "event access control",
  "face recognition API",
  "pgvector",
  "FastAPI",
  "dlib",
  "biometric attendance",
  "event management",
  "open source check-in",
  "Next.js facial recognition",
  "vector similarity search",
];

export const viewport: Viewport = {
  themeColor: "#0b0d11",
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s · SmartPass",
  },
  description: DESCRIPTION,
  keywords: KEYWORDS,
  authors: [{ name: "Luisangel Parra", url: "https://luisangelparra.com" }],
  creator: "Luisangel Parra",
  publisher: "Luisangel Parra",
  applicationName: SITE_NAME,
  category: "technology",
  formatDetection: { email: false, address: false, telephone: false },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "SmartPass — Biometric Event Check-In",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/opengraph-image"],
    creator: "@luisangelparra",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [{ url: "/icon", type: "image/png", sizes: "32x32" }],
    apple: [{ url: "/apple-icon", sizes: "180x180" }],
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ldJson = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    description: DESCRIPTION,
    url: SITE_URL,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    license: "https://opensource.org/licenses/MIT",
    softwareVersion: "1.0",
    author: { "@type": "Person", name: "Luisangel Parra" },
  };

  return (
    <html lang="en" suppressHydrationWarning className={`${fontDisplay.variable} ${fontMono.variable}`}>
      <head>
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }}
        />
      </head>
      <body>
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <Toaster theme="dark" position="bottom-right" richColors />
        </Providers>
      </body>
    </html>
  );
}
