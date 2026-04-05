"use client"
import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { CopyIcon } from "lucide-react";

const page = () => {
    const { id } = useParams();
    const [text, setText] = useState("");
    const [isRetreiving, setIsRetreiving] = useState(false);
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

    const handleRetrieve = async () => {
        setIsRetreiving(true);
        try {
            const res = await fetch(`/api/text?code=${id}`, {
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

    useEffect(() => {
        handleRetrieve();
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">

            {/* Main Dashboard */}
            <main className="flex flex-col justify-center items-center min-h-screen p-4">

                {text && (
                    <div className="w-full max-w-xl bg-card text-card-foreground rounded-3xl p-6 sm:p-8 shadow-sm border border-border overflow-hidden relative mt-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-row justify-between gap-4">
                                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Retrieved Content</h3>
                                <button
                                    onClick={handleCopy}
                                    className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/80 transition"
                                    title={copied ? "Copied!" : "Copy to clipboard"}
                                    aria-label="Copy to clipboard"
                                    type="button"
                                >
                                    <CopyIcon className="w-4 h-4" />
                                </button>
                                {copied && (
                                    <span className="absolute top-2 right-12 bg-primary text-primary-foreground text-xs px-2 py-1 rounded shadow">Copied!</span>
                                )}
                            </div>
                            <p className="max-h-40 overflow-y-auto text-lg font-medium whitespace-pre-wrap wrap-break-word bg-muted/50 p-4 rounded-xl border border-border pr-12">
                                {text}
                            </p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}

export default page