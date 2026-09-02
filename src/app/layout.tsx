import type { Metadata } from "next";
import NavBar from "../components/navBar"
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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  ),
  title: {
    default: "ClipPort",
    template: "%s | ClipBoard",
  },
  description:
    "ClipBoard is a fast, simple way to share text and files between devices using a temporary six-digit retrieval code.",
  applicationName: "ClipBoard",
  keywords: [
    "ClipBoard",
    "share text online",
    "share files online",
    "transfer files between devices",
    "temporary file sharing",
  ],
  authors: [{ name: "ClipBoard" }],
  creator: "ClipBoard",
  publisher: "ClipBoard",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "ClipBoard",
    title: "ClipBoard | Share Text and Files Instantly",
    description:
      "Share text and files between devices with one simple, temporary retrieval code.",
    url: "/",
  },
  twitter: {
    card: "summary",
    title: "ClipBoard | Share Text and Files Instantly",
    description:
      "Share text and files between devices with one simple, temporary retrieval code.",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
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
      <body className="min-h-screen w-full flex flex-col">
          <NavBar />
          <div className="flex min-h-0 flex-1 flex-col">
            {children}
          </div>
      </body>
    </html>
  );
}
