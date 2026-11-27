"use client";

interface JobDescriptionProps {
  value: string;
  onChange: (value: string) => void;
}

export default function JobDescription({
  value,
  onChange,
}: JobDescriptionProps) {
  return (
    <div className="mt-7">
      <label className="mb-3 block text-sm font-semibold">
        Job Description
      </label>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Paste the job description here..."
        rows={7}
        className="w-full rounded-xl border border-slate-200 bg-white p-4 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
      />

      <div className="mt-2 flex justify-between text-xs text-slate-400">
        <span>Paste the complete job description</span>
        <span>{value.length} characters</span>
      </div>
    </div>
  );
}
