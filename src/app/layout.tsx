import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AppProvider } from "@/contexts/AppContext";
import SessionProvider from "@/components/SessionProvider";
import XPToastViewport from "@/components/XPToastViewport";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const vazir = Vazirmatn({
  variable: "--font-vazir",
  subsets: ["arabic", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "کوردآموز — Learn Kurdish (Sorani, Kalhori & Kurmanji)",
  description:
    "Free, modern Kurdish language learning platform with interactive lessons, smart flashcards, spaced-repetition review and side-by-side dialect comparison.",
  keywords: [
    "Kurdish",
    "learn Kurdish",
    "Sorani",
    "Kalhori",
    "Kurmanji",
    "Kurdish language",
    "Kurdish flashcards",
    "Kurdish quiz",
    "spaced repetition",
  ],
  authors: [{ name: "کوردآموز" }],
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "کوردآموز — Learn Kurdish",
    description: "Interactive lessons, flashcards, quizzes and dialect comparison for Kurdish learners.",
    siteName: "کوردآموز",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "کوردآموز — Learn Kurdish",
    description: "Interactive lessons, flashcards, quizzes and dialect comparison for Kurdish learners.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        {/* Theme-flash prevention: load /public/theme-init.js synchronously.
            next/script with beforeInteractive injects the script tag
            server-side in <head>, avoiding the React 19 "script tag in
            component" warning while guaranteeing the script runs before
            first paint. */}
        <Script
          src="/theme-init.js"
          strategy="beforeInteractive"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${vazir.variable} antialiased bg-background text-foreground`}
      >
        <AppProvider>
          <SessionProvider>
            {children}
            <XPToastViewport />
            <Toaster />
          </SessionProvider>
        </AppProvider>
      </body>
    </html>
  );
}
