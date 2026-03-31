"use client";

import React, { useState, useRef } from "react";
import { upload } from "@/lib/imagekit";

export default function ShareDashboard() {
  // File state
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const fileInputRef = useRef(null);

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  };

  // Create file item objects
  const createFileItems = (rawFiles) =>
    Array.from(rawFiles).map((file) => ({
      file,
      progress: 0,
      status: "pending",
      abortController: null,
    }));

  // Handle file select
  const onFileChange = (e) => {
    const selected = createFileItems(e.target.files || []);
    if (selected.length === 0) return;
    setFiles((prev) => [...prev, ...selected]);
    e.target.value = "";
  };

  // Handle drag & drop
  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = createFileItems(e.dataTransfer.files || []);
    if (dropped.length === 0) return;
    setFiles((prev) => [...prev, ...dropped]);
  };

  // Cancel file
  const handleCancelFile = (index) => {
    setFiles((prev) => {
      const file = prev[index];
      if (file.abortController) file.abortController.abort();
      return prev.filter((_, i) => i !== index);
    });
  };

  // Upload files
  const handleUpload = async () => {
    if (files.length === 0) {
      setStatusMessage("Please select files");
      return;
    }
    setIsUploading(true);
    setStatusMessage("Uploading...");
    try {
      for (let i = 0; i < files.length; i++) {
        const controller = new AbortController();
        setFiles((prev) =>
          prev.map((f, index) =>
            index === i ? { ...f, status: "uploading", abortController: controller } : f
          )
        );
        await upload({
          file: files[i].file,
          fileName: `uploads/${Date.now()}-${files[i].file.name.replace(/\s+/g, "-")}`,
          folder: "GalleryApp",
          abortSignal: controller.signal,
          onProgress: (event) => {
            const percent = (event.loaded / event.total) * 100;
            setFiles((prev) =>
              prev.map((f, index) =>
                index === i ? { ...f, progress: percent } : f
              )
            );
          },
        });
        setFiles((prev) =>
          prev.map((f, index) =>
            index === i ? { ...f, status: "done", abortController: null } : f
          )
        );
      }
      setStatusMessage("All files uploaded successfully!");
      setFiles([]);
    } catch (err) {
      setStatusMessage("Upload stopped or failed");
    } finally {
      setIsUploading(false);
    }
  };

  const statusTone =
    statusMessage.includes("uploaded")
      ? "text-(--primary)"
      : statusMessage.includes("Uploading")
        ? "text-(--muted-foreground)"
        : "text-(--destructive)";

  return (
    <section className="p-4 flex items-center justify-center h-full bg-(--background) text-(--foreground)">
      <div className="mx-auto border rounded-3xl border-(--border) bg-(--card) text-(--card-foreground) w-full max-w-2xl p-4 max-h-[80vh] shadow-sm flex flex-col">
        {/* DROPZONE */}
        <div
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="border-2 border-dashed border-(--border) rounded-xl p-8 h-80 sm:h-96 md:h-[22rem] flex flex-col items-center justify-center text-center cursor-pointer hover:bg-(--accent) transition"
        >
          <p className="text-lg font-medium">
            Drag & drop files here or click to upload
          </p>
          <p className="text-sm text-(--muted-foreground)">Multiple files allowed</p>
          <input
            type="file"
            multiple
            ref={fileInputRef}
            className="hidden"
            onChange={onFileChange}
          />
        </div>
        {/* FILE LIST & UPLOAD BUTTON WRAPPER */}
        <div className="flex flex-col grow overflow-hidden">
          {files.length > 0 && (
            <div className="grow overflow-y-auto space-y-3 pr-2 mt-4">
              {files.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border border-(--border) bg-(--background) p-3 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium">{item.file.name}</p>
                    <p className="text-xs text-(--muted-foreground)">{formatFileSize(item.file.size)}</p>
                  </div>
                  {item.status === "uploading" ? (
                    <div className="w-32 h-2 bg-(--secondary) rounded">
                      <div
                        className="h-2 bg-(--primary) rounded"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  ) : item.status === "done" ? (
                    <span className="text-(--primary) text-sm">✓</span>
                  ) : (
                    <button
                      onClick={() => handleCancelFile(index)}
                      className="text-(--muted-foreground) hover:text-(--destructive)"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
          {files.length > 0 && (
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="mt-4 w-full bg-(--primary) text-(--primary-foreground) py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50 flex shrink-0 items-center justify-center"
            >
              {isUploading ? "Uploading..." : "Upload Files"}
            </button>
          )}
        </div>
        {statusMessage && (
          <p className={`mt-3 text-sm ${statusTone}`}>{statusMessage}</p>
        )}
      </div>
    </section>
  );
}
