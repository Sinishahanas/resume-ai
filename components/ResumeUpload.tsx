"use client";

import { useRef, useState } from "react";

interface ResumeUploadProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
}

export default function ResumeUpload({
  file,
  onFileChange,
}: ResumeUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  const handleFileChange = (selectedFile: File | undefined) => {
    setError("");

    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB.");
      return;
    }

    onFileChange(selectedFile);
  };

  return (
    <div className="mt-6">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={(event) => handleFileChange(event.target.files?.[0])}
      />

      {file ? (
        <div className="flex items-center justify-between rounded-xl border border-violet-200 bg-violet-50 p-4">
          <div>
            <p className="text-sm font-semibold text-slate-800">{file.name}</p>
            <p className="text-xs text-slate-500">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              onFileChange(null);
              if (inputRef.current) {
                inputRef.current.value = "";
              }
            }}
            className="mt-4 inline-block rounded-lg bg-red-600 px-5 py-2 font-semibold text-white shadow-sm transition hover:bg-red-700"
          >
            Remove
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full rounded-xl border-2 border-dashed border-violet-200 bg-violet-50/50 p-10 text-center transition hover:bg-violet-50"
        >
          <div className="text-4xl">📄</div>
          <h3 className="mt-4 inline-block rounded-lg bg-violet-600 px-5 py-2 font-semibold text-white shadow-sm transition hover:bg-violet-700">
            Upload your resume
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            PDF format · Maximum 5MB
          </p>
        </button>
      )}

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
