import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://app.jobsyc.co"),
  title: {
    default: "JobSyc – Swipe do zaposlenja | Najbrži hiring u regionu",
    template: "%s | JobSyc"
  },
  description:
    "JobSyc je najbrža platforma za povezivanje kandidata i poslodavaca – swipe, match i zaposli se. Pametni algoritmi, premium vidljivost i moderan hiring proces.",
  keywords: [
    "posao",
    "zapošljavanje",
    "job platforma",
    "jobsyc",
    "job sync",
    "job search",
    "karijera",
    "poslodavci",
    "kandidati",
    "hiring",
    "recruitment",
    "IT poslovi",
    "marketing poslovi"
  ],
  openGraph: {
    title: "JobSyc – Swipe do zaposlenja",
    description:
      "Najmodernija platforma za zapošljavanje – swipe, match i zaposli se.",
    url: "https://app.jobsyc.co",
    siteName: "JobSyc",
    images: [
      {
        url: "/images/jobsycmockup.png",
        width: 1200,
        height: 630,
        alt: "JobSyc platform mockup"
      }
    ],
    locale: "bs_BA",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "JobSyc – Swipe do zaposlenja",
    description:
      "Najmodernija platforma za zapošljavanje – swipe, match i zaposli se.",
    images: ["/images/jobsycmockup.png"]
  },
  alternates: {
    canonical: "https://app.jobsyc.co",
    languages: {
      "bs-BA": "https://app.jobsyc.co/bs",
      "en-US": "https://app.jobsyc.co/en"
    }
  },
  authors: [{ name: "JobSyc Team", url: "https://jobsyc.co" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  category: "Business & Employment",
  applicationName: "JobSyc",
  generator: "Next.js 15 + JobSyc Optimized SEO Engine",
  referrer: "strict-origin-when-cross-origin",
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F0F7FF" },
    { media: "(prefers-color-scheme: dark)", color: "#0D0D0D" }
  ],
  other: {
    "og:image:alt": "JobSyc platform mockup – najbrži hiring u regionu",
    "twitter:creator": "@jobsyc",
    "twitter:site": "@jobsyc",
    "format-detection": "telephone=no",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-title": "JobSyc",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent"
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
