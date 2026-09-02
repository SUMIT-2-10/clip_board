"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TextIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

const FileIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
  </svg>
);

export default function Home() {
  const pathname = usePathname();
  const navLinks = [
    {
      href: "/send",
      label: "Send",
      icon: <TextIcon />,
      match: "/send",
    },
    {
      href: "/retrieve",
      label: "Retrieve",
      icon: <FileIcon />,
      match: "/retrieve",
    },
  ];

  return (
    <nav className="w-full px-3 pt-3 sm:px-6 sm:pt-6 bg-background text-foreground font-sans">
      <div className="mx-auto grid w-full max-w-5xl grid-cols-2 gap-1 rounded-2xl border border-border bg-muted/50 p-1 backdrop-blur-sm sm:flex sm:w-fit sm:gap-0">
        {navLinks.map((link, idx) => {
          const isActive = pathname === link.match;
          return (
            <Link
              key={link.label + idx}
              href={link.href}
              className={
                `flex min-w-0 items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-center text-xs font-medium transition-all duration-300 sm:gap-2 sm:px-6 sm:text-sm ` +
                (isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-primary hover:text-primary-foreground")
              }
            >
              {link.icon}
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
