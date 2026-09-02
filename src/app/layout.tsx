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
    default: "DropBoard",
    template: "%s | DropBoard",
  },
  description:
    "DropBoard is a fast, simple way to share text and files between devices using a temporary six-digit retrieval code.",
  applicationName: "DropBoard",
  keywords: [
    "DropBoard",
    "share text online",
    "share files online",
    "transfer files between devices",
    "temporary file sharing",
  ],
  authors: [{ name: "DropBoard" }],
  creator: "DropBoard",
  publisher: "DropBoard",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "DropBoard",
    title: "DropBoard | Share Text and Files Instantly",
    description:
      "Share text and files between devices with one simple, temporary retrieval code.",
    url: "/",
  },
  twitter: {
    card: "summary",
    title: "DropBoard | Share Text and Files Instantly",
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
