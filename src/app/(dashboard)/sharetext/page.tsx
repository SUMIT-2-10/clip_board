"use client";

import React, { useState, useRef, DragEvent } from "react";

// --- SVG Icons ---
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

const UploadIcon = ({ className = "w-8 h-8" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
  </svg>
);

const CopyIcon = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
  </svg>
);

const UserIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);


export default function ShareDashboard() {
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [link, setLink] = useState<number | null>(null);


  // Example recent items

  const handleClear = () => {
    setText("");
    setSuccess(false);
    setLink(null);
  };


  const handleTextSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim()) return;
    const link = Math.floor(100000 + Math.random() * 900000);
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
    <div className="min-h-screen w-full bg-background text-foreground font-sans selection:bg-primary/20">

      {/* Main Dashboard */}
      <main className="flex w-full justify-center items-center h-screen">

        {/* Primary Action Card (Spans 8 cols on tablet/desktop) */}
        <div className="w-full md:col-span-8 bg-card text-card-foreground rounded-3xl p-6 sm:p-8 shadow-sm border border-border overflow-hidden relative">

          {/* Dynamic Content Area */}
          <div className="relative z-10 min-h-[280px] flex flex-col">

            <form onSubmit={handleTextSubmit} className="flex flex-col flex-grow animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex-grow relative group">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste or type your text here..."
                  className="w-full h-full min-h-[200px] resize-none bg-transparent text-lg text-foreground placeholder:text-muted-foreground focus:outline-none p-2 leading-relaxed"
                />

                {/* Character Count */}
                <div className="absolute bottom-4 right-2 text-xs font-medium text-muted-foreground transition-opacity flex gap-4  p-2 rounded-xl ">
                  <span>{text.length} chars</span>
                  <span>{text.split(/\s+/).filter((word) => word.length > 0).length} words</span>
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

                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
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
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Code to Retreive {link}</p>
          )}
        </div>
      </main >
    </div>

  );
}
