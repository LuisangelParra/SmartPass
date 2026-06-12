"use client";

import Image from "next/image";
import { useRef, useState, type DragEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Icon } from "@/components/landing/icons";

interface Props {
  eventId: string;
}

export function RegisterForm({ eventId }: Props) {
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [over, setOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      const form = new FormData();
      form.append("name", name.trim());
      form.append("image", file!);
      return api.addAttendant(eventId, form);
    },
    onSuccess: (a) => {
      qc.invalidateQueries({ queryKey: ["attendants", eventId] });
      toast.success(`${a.name} enrolled`);
      setName("");
      setFile(null);
      setPreview(null);
    },
    onError: (err: Error) => toast.error(err.message || "Enrollment failed"),
  });

  function pick(f: File | undefined | null) {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      toast.error("That's not an image file");
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    if (!name) {
      const base = f.name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim();
      setName(base.replace(/\b\w/g, (c) => c.toUpperCase()));
    }
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setOver(false);
    pick(e.dataTransfer.files[0]);
  }

  function submit() {
    if (!name.trim()) {
      toast.error("Enter the attendant's name");
      return;
    }
    if (!file) {
      toast.error("Add a photo");
      return;
    }
    mutate();
  }

  return (
    <div className="card">
      <h3>
        <Icon name="face" size={18} /> Add an attendant
      </h3>
      <p className="hint">
        One clear photo with exactly one face. The image becomes a vector and is
        discarded.
      </p>
      <div className="field" style={{ marginBottom: 14 }}>
        <input
          className="input"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div
        className={"drop" + (over ? " over" : "")}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={onDrop}
      >
        {preview ? (
          <Image
            src={preview}
            alt="preview"
            width={64}
            height={64}
            unoptimized
            className="drop-preview"
          />
        ) : (
          <span className="di">
            <Icon name="face" size={26} />
          </span>
        )}
        <span className="dt">
          {file ? file.name : "Drop a photo or click to browse"}
        </span>
        <span className="ds">JPEG / PNG · single face</span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => pick(e.target.files?.[0])}
        />
      </div>
      <button
        className="btn btn-primary btn-block"
        style={{ marginTop: 14 }}
        disabled={isPending}
        onClick={submit}
      >
        {isPending ? (
          <span className="spin" />
        ) : (
          <Icon name="check" size={18} stroke={2.2} />
        )}
        {isPending ? "Enrolling…" : "Enroll attendant"}
      </button>
    </div>
  );
}
