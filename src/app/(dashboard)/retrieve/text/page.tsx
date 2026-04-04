"use client";
import React, { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { CopyIcon } from "lucide-react";

const page = () => {
  const [isRetreiving, setIsRetreiving] = useState(false);
  const [otp, setOtp] = useState("");
  const [text, setText] = useState("");
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
    try {
      const res = await fetch(`/api/text?code=${otp}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      console.log(data);
      setText(data.content);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRetreiving(false);
    }
  };

  return (
    <div className="h-full w-full bg-background text-foreground font-sans selection:bg-primary/20">
      {/* Main Dashboard */}
      <main className="flex flex-col justify-center items-center h-full gap-6 p-6">
      <h1 className="text-2xl font-bold">Retrieve Text</h1>
        {/* Primary Action Card */}
        <div className="w-full max-w-xl bg-card text-card-foreground rounded-3xl p-6 sm:p-8 shadow-sm border border-border overflow-hidden relative">
          {/* Dynamic Content Area */}
          <div className="relative z-10 flex flex-col">
            <form
              onSubmit={handleRetrieve}
              className="flex flex-col  animate-in fade-in slide-in-from-bottom-2 duration-500"
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

              <div className="flex justify-center mt-4 pt-4 border-t border-border">
                <button
                  type="submit"
                  disabled={!otp || otp.length !== 6}
                  className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium shadow-sm hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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

        {text && (
          <div className="w-full max-w-xl bg-card text-card-foreground rounded-3xl p-6 sm:p-8 shadow-sm border border-border overflow-hidden relative mt-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex flex-col gap-4">
              <div className="flex flex-row gap-4"></div>
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Retrieved Content
              </h3>
              <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-2 m-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/80 transition"
                title={copied ? "Copied!" : "Copy to clipboard"}
                aria-label="Copy to clipboard"
                type="button"
              >
                <CopyIcon className="w-5 h-5  " />
              </button>
              {copied && (
                <span className="absolute top-2 right-12 bg-primary text-primary-foreground text-xs px-2 py-1 rounded shadow">
                  Copied!
                </span>
              )}
              <p className="text-lg font-medium whitespace-pre-wrap break-words bg-muted/50 p-4 rounded-xl border border-border">
                {text}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default page;
