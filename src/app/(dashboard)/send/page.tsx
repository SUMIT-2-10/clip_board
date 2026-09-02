"use client";

import generateLink from "@/lib/id";
import { supabase } from "@/lib/supabase";
import React, { useState } from "react";
import { useRef } from "react";
import { XIcon } from "lucide-react";

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
const FileIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
  </svg>
);

export default function ShareDashboard() {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [link, setLink] = useState<string >("");
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Example recent items

  const handleClear = () => {
    setText("");
    setFile(null);
    setSuccess(false);
    setLink("");
  };

  const handleDismissSuccess = () => {
    setSuccess(false);
    setCopied(false);
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
    if (!text.trim() && !file) return;
    const link = generateLink();
    setLink(link);
    setIsSubmitting(true);
    try {
      let fileUrl: string | undefined;

      if (file) {
        const filePath = `files/${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("Clip_Board")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        fileUrl = supabase.storage.from("Clip_Board").getPublicUrl(filePath)
          .data.publicUrl;
      }

      const res = await fetch("/api/text/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: text,
          link,
          fileUrl,
          fileName: file?.name,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || "Failed to share content");
      }
      setSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-full w-full bg-background text-foreground font-sans selection:bg-primary/20">
      {/* Main Dashboard */}
      <main className="flex min-h-full w-full flex-col items-center justify-start gap-5 p-4 py-8 sm:justify-center sm:gap-6 sm:p-6">
        {/* Primary Action Card (Spans 8 cols on tablet/desktop) */}
        <div className="w-full max-w-3xl bg-card text-card-foreground rounded-3xl p-4 sm:p-8 shadow-sm border border-border overflow-hidden relative">
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

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-3 w-full rounded-xl border border-dashed border-border px-4 py-3 text-left text-sm text-muted-foreground hover:bg-accent sm:w-auto bg-muted/10"
                ><FileIcon className="w-4 h-4 mr-2 inline-block" />
                  {file ? `Attached: ${file.name}` : "Attach a file (optional)"}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                />
              </div>

              <div className="flex flex-col-reverse gap-3 mt-4 pt-4 pb-4 border-t border-border sm:flex-row sm:justify-end sm:gap-4">
                <button
                  type="submit"
                  disabled={(!text.trim() && !file) || isSubmitting}
                  className="flex w-full items-center justify-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium shadow-sm hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto"
                >
                  {isSubmitting ? "Sending..." : "Send"}
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
                  className="flex w-full items-center justify-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium shadow-sm hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto"
                >
                  Clear
                </button>
              </div>
            </form>
          </div>
          {success && (
            <div className="relative mt-2 rounded-2xl border border-border bg-background p-4 shadow-sm sm:p-5">
              <button
                onClick={handleDismissSuccess}
                className="absolute right-3 top-3 rounded-full p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                title="Dismiss retrieve key"
                aria-label="Dismiss retrieve key"
                type="button"
              >
                <XIcon className="h-4 w-4" />
              </button>

              <div className="pr-8">
                <p className="text-xs font-medium uppercase tracking-wider text-foreground">
                  Your retrieve key
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Expires in 10 minutes
                </p>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex min-h-12 min-w-0 flex-1 items-center justify-center rounded-xl bg-primary px-4 py-3 font-mono text-xl font-bold tracking-[0.3em] text-primary-foreground sm:text-2xl">
                  <span className="break-all text-center">{link}</span>
                </div>
                <button
                  onClick={handleCopy}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border bg-muted/40 px-5 py-3 text-sm font-medium transition hover:bg-muted"
                  title={copied ? "Copied!" : "Copy retrieve key"}
                  aria-label="Copy retrieve key"
                  type="button"
                >
                  <CopyIcon className="h-4 w-4" />
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>

              <p className="mt-3 text-center text-xs text-muted-foreground">
                Share this key with the recipient to let them retrieve your content.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
