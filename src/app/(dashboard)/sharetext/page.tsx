"use client";

import generateLink from "@/lib/id";
import Link from "next/link";
import React, { useState } from "react";

const CopyIcon = ({ className = "w-4 h-4" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
    />
  </svg>
);

const UserIcon = ({ className = "w-5 h-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
    />
  </svg>
);

export default function ShareDashboard() {
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [link, setLink] = useState<string >("");
  const [copied, setCopied] = useState(false);
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/retrieve/text/${link}`;

  // Example recent items

  const handleClear = () => {
    setText("");
    setSuccess(false);
    setLink("");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  const handleTextSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim()) return;
    const link = generateLink();
    setLink(link);
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/text/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text, link }),
      });
      await res.json();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
      setSuccess(true);
    }
  };

  return (
    <div className="h-full w-full bg-background text-foreground font-sans selection:bg-primary/20">
      {/* Main Dashboard */}
      <main className="flex flex-col h-full w-full justify-center items-center gap-6 p-6">
        <h1 className="text-2xl font-bold">Text Upload</h1>
        {/* Primary Action Card (Spans 8 cols on tablet/desktop) */}
        <div className="w-full md:col-span-8 bg-card text-card-foreground rounded-3xl p-6 sm:p-8 shadow-sm border border-border overflow-hidden relative">
          {/* Dynamic Content Area */}
          <div className="relative z-10 min-h-70 flex flex-col">
            <form
              onSubmit={handleTextSubmit}
              className="flex flex-col grow animate-in fade-in slide-in-from-bottom-2 duration-500"
            >
              <div className="grow relative group">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste or type your text here..."
                  className="w-full h-full min-h-50 resize-none bg-transparent text-lg text-foreground placeholder:text-muted-foreground focus:outline-none p-2 leading-relaxed"
                />

                {/* Character Count */}
                <div className="absolute bottom-4 right-2 text-xs font-medium text-muted-foreground transition-opacity flex gap-4  p-2 rounded-xl ">
                  <span>{text.length} chars</span>
                  <span>
                    {text.split(/\s+/).filter((word) => word.length > 0).length}{" "}
                    words
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-4 pt-4 border-t border-border">
                <button
                  type="submit"
                  disabled={!text.trim() || isSubmitting}
                  className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium shadow-sm hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending..." : "Send Text"}
                  {!isSubmitting && (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z"
                      />
                    </svg>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium shadow-sm hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Clear
                </button>
              </div>
            </form>
          </div>
          {success && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-muted-foreground tracking-wider">
                  Code to Retrieve {link}
                </p>
                <button
                  onClick={handleCopy}
                  className=" p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/80 transition"
                  title={copied ? "Copied!" : "Copy to clipboard"}
                  aria-label="Copy to clipboard"
                  type="button"
                >
                  <CopyIcon className="w-4 h-4" />
                </button>
                {copied && (
                  <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded shadow">
                    Copied!
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
