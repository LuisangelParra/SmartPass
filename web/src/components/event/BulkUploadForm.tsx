"use client";

import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Archive, ChevronDown, ChevronUp } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import type { BulkResult } from "@/types";

interface Props {
  eventId: string;
}

export function BulkUploadForm({ eventId }: Props) {
  const qc = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<BulkResult | null>(null);
  const [errorsOpen, setErrorsOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      const form = new FormData();
      form.append("zip_file", file!);
      return api.bulkUpload(eventId, form);
    },
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["attendants", eventId] });
      setResult(res);
      setFile(null);
      toast.success(res.message);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex flex-col gap-4">
      <h3 className="font-semibold text-[var(--text)]">Bulk Upload</h3>

      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="flex flex-col items-center gap-2 py-8 rounded-lg border-2 border-dashed border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
      >
        <Archive className="h-6 w-6" />
        <span className="text-sm">
          {file ? file.name : "Click to upload ZIP file"}
        </span>
      </button>

      <input
        ref={fileRef}
        type="file"
        accept="application/zip,.zip"
        className="hidden"
        onChange={(e) => {
          setFile(e.target.files?.[0] ?? null);
          setResult(null);
        }}
      />

      <p className="text-xs text-[var(--text-muted)]">
        Filenames become names: <code>john_doe.jpg</code> → John Doe
      </p>

      <Button onClick={() => mutate()} disabled={!file || isPending}>
        {isPending ? "Uploading…" : "Upload ZIP"}
      </Button>

      {result && (
        <div className="rounded-lg bg-[var(--surface-2)] border border-[var(--border)] p-4 text-sm">
          <p className="text-[var(--text)]">{result.message}</p>
          {result.errors.length > 0 && (
            <div className="mt-3">
              <button
                onClick={() => setErrorsOpen((o) => !o)}
                className="flex items-center gap-1.5 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
              >
                {errorsOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                {result.errors.length} error{result.errors.length !== 1 ? "s" : ""}
              </button>
              {errorsOpen && (
                <ul className="mt-2 space-y-1">
                  {result.errors.map((e, i) => (
                    <li key={i} className="text-xs text-red-400">
                      <span className="font-mono">{e.file}</span>: {e.error}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
