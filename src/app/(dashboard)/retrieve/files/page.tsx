"use client";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { CopyIcon } from "lucide-react";
import { nowIstIso } from "@/lib/time";

export default function Home() {
  const [isRetrieving, setIsRetrieving] = useState(false);
  const [otp, setOtp] = useState("");
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleRetrieve = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) return;

    try {
      setIsRetrieving(true);
      setError("");
      setFileUrl(null);

      const nowIso = nowIstIso();

      const { data, error } = await supabase
        .from("Clip_Board")
        .select("file_url, expire_at")
        .eq("code", otp)
        .gt("expire_at", nowIso)
        .single();

      if (error) throw error;

      if (!data) {
        setError("Invalid OTP");
        return;
      }
      setFileUrl(data.file_url);
      console.log("File URL:", data.file_url);
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setIsRetrieving(false);
    }
  };

  const handleCopy = async () => {
    if (!fileUrl) return;
    try {
      await navigator.clipboard.writeText(fileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  const handleDownload = async () => {
    if (!fileUrl) return;

    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = decodeURIComponent(fileUrl.split("/").pop() || "downloaded-file");
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed", err);
      alert("Download failed");
    }
  };

  const fileName = fileUrl ? decodeURIComponent(fileUrl.split("/").pop() || "downloaded-file") : "downloaded-file";

  return (
    <main className="flex h-full  flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-2xl font-bold">Retrieve File</h1>

      <div className="w-full max-w-xl bg-card text-card-foreground rounded-3xl p-6 sm:p-8 shadow-sm border border-border overflow-hidden relative">
        <div className="relative z-10 flex flex-col">
          <form
            onSubmit={handleRetrieve}
            className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-500"
          >
            <div className="flex justify-center">
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

            <p className="mt-4 text-center text-sm text-muted-foreground">
              Enter your 6-digit code to fetch the shared file
            </p>

            <div className="flex justify-center mt-4 pt-4 border-t border-border">
              <button
                type="submit"
                disabled={!otp || otp.length !== 6 || isRetrieving}
                className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium shadow-sm hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRetrieving ? "Retrieving..." : "Retrieve"}
                {!isRetrieving && (
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
        <div className="w-full max-w-xl rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {fileUrl && (
        <div className="w-full max-w-xl bg-card text-card-foreground rounded-3xl p-6 shadow-sm border border-border animate-in fade-in slide-in-from-bottom-2 duration-500">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            File Ready
          </h2>

          <div className="mt-3 rounded-xl border border-border bg-background px-4 py-3">
            <p className="text-sm font-medium break-all">{fileName}</p>
            <p className="text-xs text-muted-foreground mt-1">Retrieved successfully</p>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <Link
              href={fileUrl}
              target="_blank"
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl border border-border bg-background hover:bg-accent transition"
            >
              Open File
            </Link>

            <button
              onClick={handleDownload}
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition"
              type="button"
            >
              Download File
            </button>

            <button
              onClick={handleCopy}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-border bg-background hover:bg-accent transition"
              type="button"
            >
              <CopyIcon className="w-4 h-4" />
              {copied ? "Copied" : "Copy Link"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
