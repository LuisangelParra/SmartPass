"use client";

import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  eventId: string;
}

export function RegisterForm({ eventId }: Props) {
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      const form = new FormData();
      form.append("name", name.trim());
      form.append("image", file!);
      return api.addAttendant(eventId, form);
    },
    onSuccess: (a) => {
      qc.invalidateQueries({ queryKey: ["attendants", eventId] });
      toast.success(`${a.name} registered`);
      setName("");
      setFile(null);
      setPreview(null);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  function handleFile(f: File) {
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
  }

  return (
    <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex flex-col gap-4">
      <h3 className="font-semibold text-[var(--text)]">Single Registration</h3>

      <Input
        placeholder="Full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-40 object-cover rounded-lg"
          />
          <button
            onClick={() => {
              setFile(null);
              setPreview(null);
            }}
            className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-black/80"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex flex-col items-center gap-2 py-8 rounded-lg border-2 border-dashed border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
        >
          <Upload className="h-6 w-6" />
          <span className="text-sm">Click to upload photo (JPG, PNG)</span>
        </button>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      <Button
        onClick={() => mutate()}
        disabled={!name.trim() || !file || isPending}
      >
        {isPending ? "Registering…" : "Register Attendant"}
      </Button>
    </div>
  );
}
