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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-neutral-900 min-h-screen`}
      >
        <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur border-b border-neutral-200 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <span className="text-2xl font-bold tracking-tight">
              Brown Courses
            </span>
            {/* Future nav or actions can go here */}
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
        <Analytics />
        <FeedbackWidget />
      </body>
    </html>
  );
}
