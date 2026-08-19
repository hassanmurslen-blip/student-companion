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
  title: {
    default: "Student Companion",
    template: "%s | Student Companion",
  },
  description:
    "Student Companion is an all-in-one academic productivity tool for university students. Manage your CGPA, study sessions, deadlines, flashcards, quizzes, and AI assistance in one place.",
  keywords: [
    "student companion",
    "student productivity",
    "CGPA calculator",
    "GPA calculator",
    "study timer",
    "deadline tracker",
    "flashcards",
    "AI study assistant",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}