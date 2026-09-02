"use client";
import React, { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  CheckIcon,
  ClipboardPasteIcon,
  CopyIcon,
  DownloadIcon,
  KeyRoundIcon,
  SearchIcon,
} from "lucide-react";

const RetrieveTextPage = () => {
  const [isRetreiving, setIsRetreiving] = useState(false);
  const [otp, setOtp] = useState("");
  const [text, setText] = useState("");
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  const handleRetrieve = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) return;
    setIsRetreiving(true);
    setError("");
    setText("");
    setFileUrl(null);
    setFileName(null);

    try {
      const res = await fetch(`/api/text?code=${otp}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Failed to retrieve text");
        return;
      }

      if (!data?.content && !data?.fileUrl) {
        setError("Shared content not found");
        return;
      }

      setText(data.content || "");
      setFileUrl(data.fileUrl || null);
      setFileName(data.fileName || null);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while retrieving text");
    } finally {
      setIsRetreiving(false);
    }
  };

  const handleDownload = async () => {
    if (!fileUrl) return;

    try {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = downloadUrl;
      anchor.download = fileName || "shared-file";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error(err);
      setError("Unable to download the shared file");
    }
  };

  return (
    <div className="min-h-full w-full bg-background text-foreground font-sans selection:bg-primary/20">
      {/* Main Dashboard */}
      <main className="flex min-h-full flex-col justify-start items-center gap-5 p-4 py-8 sm:justify-center sm:gap-6 sm:p-6">
        {/* Primary Action Card */}
        <div className="w-full max-w-xl bg-card text-card-foreground rounded-3xl p-4 sm:p-8 shadow-sm border border-border overflow-hidden relative">
          {/* Dynamic Content Area */}
          <div className="relative z-10 flex flex-col">
            <form
              onSubmit={handleRetrieve}
              className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-500"
            >
              <div className="flex justify-center rounded-2xl bg-muted/40 p-3 sm:p-4">
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <div className="mt-4 flex justify-center border-t border-border pt-4">
                <button
                  type="submit"
                  disabled={!otp || otp.length !== 6 || isRetreiving}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3 font-medium text-primary-foreground shadow-sm transition-all duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  {isRetreiving ? "Retreiving..." : "Retreive"}
                  {!isRetreiving && (
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
              </div>
            </form>
          </div>
        </div>

        {error && (
          <div className="w-full max-w-xl rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {(text || fileUrl) && (
          <div className="mt-1 w-full max-w-xl overflow-hidden rounded-3xl border border-border bg-card p-4 text-card-foreground shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500 sm:p-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 border-b border-border pb-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted">
                  <ClipboardPasteIcon className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider">
                    Retrieved content
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Your shared items are ready.
                  </p>
                </div>
              </div>
              {fileUrl && (
                <div className="rounded-2xl border border-border bg-muted/40 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="min-w-0 break-all text-sm font-medium">
                      {fileName || "Shared file"}
                    </p>
                    <button
                      onClick={handleDownload}
                      className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                      type="button"
                    >
                      <DownloadIcon className="h-4 w-4" />
                      Download file
                    </button>
                  </div>
                </div>
              )}
              {text && (
                <div className="relative rounded-2xl border border-border bg-muted/40 p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Text
                    </p>
                    <button
                      onClick={handleCopy}
                      className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium transition hover:bg-muted"
                      title={copied ? "Copied!" : "Copy text"}
                      aria-label="Copy text"
                      type="button"
                    >
                      {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <p className="whitespace-pre-wrap wrap-break-word text-base leading-relaxed">
                    {text}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default RetrieveTextPage;
