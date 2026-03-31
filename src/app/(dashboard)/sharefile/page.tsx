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



const UserIcon = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
);


export default function ShareDashboard() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    // File state
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Drag and drop handlers
    const handleDrag = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleFileUpload = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!file) return;
        setIsSubmitting(true);
        // Simulate upload
        setTimeout(() => {
            setFile(null);
            setIsSubmitting(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
            {/* Main Dashboard */}
            <main className="flex justify-center items-center h-screen">

                {/* Primary Action Card (Spans 8 cols on tablet/desktop) */}
                <div className="md:col-span-8 bg-card text-card-foreground rounded-3xl p-6 sm:p-8 shadow-sm border border-border overflow-hidden relative">

                    {/* Dynamic Content Area */}
                    <div className="relative z-10 flex flex-col">
                        <div className="flex flex-col flex-grow animate-in fade-in slide-in-from-bottom-2 duration-500">
                            {!file ? (
                                <div
                                    className={`flex-grow flex flex-col items-center justify-center border-2 border-dashed rounded-2xl transition-all duration-300 p-8 text-center
                        ${dragActive
                                            ? "border-primary/50 bg-primary/5 scale-[1.01]"
                                            : "border-border hover:border-muted-foreground/40 hover:bg-muted/30"
                                        }`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                    onClick={() => inputRef.current?.click()}
                                >
                                    <input
                                        ref={inputRef}
                                        type="file"
                                        multiple={false}
                                        onChange={handleChange}
                                        className="hidden"
                                    />
                                    <div className={`p-4 rounded-full mb-4 transition-colors duration-300 ${dragActive ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                        <UploadIcon />
                                    </div>
                                    <h3 className="text-lg font-medium mb-1">Upload your files</h3>
                                    <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                        Drag & drop files here or <span className="text-primary font-medium hover:underline cursor-pointer">click to browse</span>
                                    </p>
                                </div>
                            ) : (
                                <div className="flex-grow flex flex-col items-center justify-center p-8 border-2 border-transparent bg-muted/30 rounded-2xl">
                                    <div className="p-4 rounded-2xl bg-card shadow-sm border border-border flex items-center justify-center mb-4 text-primary">
                                        <FileIcon className="w-10 h-10" />
                                    </div>
                                    <h4 className="font-medium text-foreground truncate max-w-xs mb-1">{file.name}</h4>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                            className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleFileUpload}
                                            disabled={isSubmitting}
                                            className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground hover:opacity-90 rounded-xl text-sm font-medium shadow-sm transition-all duration-200 disabled:opacity-50"
                                        >
                                            {isSubmitting ? "Uploading..." : "Upload File"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
