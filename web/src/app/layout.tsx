import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import FeedbackWidget from "../components/FeedbackWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Brown Courses",
  description: "Find courses at Brown University",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-neutral-900 min-h-screen flex flex-col`}
      >
        <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur border-b border-neutral-200 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <span className="text-2xl font-bold tracking-tight">
              Brown Courses
            </span>
            {/* Future nav or actions can go here */}
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-8 flex-1">{children}</main>
        <footer className="border-t border-neutral-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 py-6 text-sm text-neutral-600 flex items-center justify-between">
            <span>
              Made by Oliver Tu ·
              <a
                href="mailto:oliver_tu@brown.edu"
                className="ml-1 underline hover:text-neutral-800"
              >
                oliver_tu@brown.edu
              </a>
            </span>
            <span className="text-neutral-400">
              © {new Date().getFullYear()}
            </span>
          </div>
        </footer>
        <Analytics />
        <FeedbackWidget />
      </body>
    </html>
  );
}
