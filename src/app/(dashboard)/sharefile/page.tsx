"use client";

import { useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { CopyIcon } from "lucide-react";
import generateLink from "@/lib/id";
import { expiresInMinutesIstIso } from "@/lib/time";

export default function Home() {
  const [copied, setCopied] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [code, setCode] = useState("");
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "0 KB";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);

    const dropped = e.dataTransfer.files;
    if (dropped.length === 0) return;

    setFile(dropped[0]);
  };

  const handleCancelFile = () => {
    setFile(null);
    setUploadProgress(0);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Select a file first");

    let progressTimer: ReturnType<typeof setInterval> | null = null;

    try {
      setUploading(true);
      setUploadProgress(5);

      // Supabase storage upload doesn't expose native browser progress here,
      // so we keep a smooth progress indicator until completion.
      progressTimer = setInterval(() => {
        setUploadProgress((prev) => (prev >= 95 ? prev : prev + 5));
      }, 250);

      const filePath = `files/${Date.now()}-${file.name}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("Clip_Board")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from("Clip_Board")
        .getPublicUrl(filePath);

      const fileUrl = data.publicUrl;

      // Generate code
      const generatedCode = generateLink();

      const expiresAtIso = expiresInMinutesIstIso(10);

      // Store in DB
      const { error: dbError } = await supabase.from("Clip_Board").insert([
        {
          code: generatedCode,
          file_url: fileUrl,
          expire_at: expiresAtIso,
        },
      ]);

      if (dbError) throw dbError;

      setUploadProgress(100);
      setCode(generatedCode);
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Upload failed";
      alert(message);
    } finally {
      if (progressTimer) clearInterval(progressTimer);
      setUploading(false);
    }
  };

  return (
    <main className="flex  flex-col w-full h-full items-center justify-center gap-6 p-6">
      <h1 className="text-2xl font-bold">File Upload</h1>

      <div className="mx-auto border rounded-3xl border-border bg-card text-card-foreground w-full max-w-2xl p-4 max-h-[80vh] shadow-sm flex flex-col">
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragActive(true);
          }}
          onDragLeave={() => setIsDragActive(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 min-h-55 flex flex-col items-center justify-center text-center cursor-pointer transition ${
            isDragActive
              ? "border-primary bg-accent"
              : "border-border hover:bg-accent"
          }`}
        >
          <p className="text-lg font-medium">
            Drag and drop a file here or click to upload
          </p>
          <p className="text-sm text-muted-foreground">Select a file to upload up to 50MB</p>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={onFileChange}
          />
        </div>

        {file && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between border border-border bg-background p-3 rounded-lg">
              <div className="w-full pr-4">
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </p>

                <div className="mt-2">
                  <div className="h-1.5 w-full rounded bg-secondary overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    {uploading
                      ? `${uploadProgress}% uploaded`
                      : uploadProgress === 100
                        ? "100% uploaded"
                        : "Ready to upload"}
                  </p>
                </div>
              </div>

              <button
                onClick={handleCancelFile}
                className="text-muted-foreground hover:text-destructive"
                disabled={uploading}
                type="button"
              >
                ✕
              </button>
            </div>

            <button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center"
            >
              {uploading ? "Uploading..." : "Upload File"}
            </button>
          </div>
        )}

        {code && (
          <div className="flex p-2 justify-center items-center gap-2">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Code to Retreive {code}
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
        )}
      </div>
    </main>
  );
}
