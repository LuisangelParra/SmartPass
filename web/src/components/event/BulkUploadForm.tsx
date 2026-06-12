"use client";

import { useRef, useState, type DragEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Icon } from "@/components/landing/icons";
import type { BulkResult } from "@/types";

interface Props {
  eventId: string;
}

export function BulkUploadForm({ eventId }: Props) {
  const qc = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [over, setOver] = useState(false);
  const [result, setResult] = useState<BulkResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      const form = new FormData();
      form.append("zip_file", file!);
      return api.bulkUpload(eventId, form);
    },
    onSuccess: (r) => {
      qc.invalidateQueries({ queryKey: ["attendants", eventId] });
      setResult(r);
      setFile(null);
      toast.success(r.message || "Bulk upload complete");
    },
    onError: (err: Error) => toast.error(err.message || "Upload failed"),
  });

  function pick(f: File | undefined | null) {
    if (!f) return;
    const isZip =
      /\.zip$/i.test(f.name) ||
      f.type === "application/zip" ||
      f.type === "application/x-zip-compressed";
    if (!isZip) {
      toast.error("Please drop a .zip archive");
      return;
    }
    setFile(f);
    setResult(null);
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setOver(false);
    pick(e.dataTransfer.files[0]);
  }

  return (
    <div className="card">
      <h3>
        <Icon name="zip" size={18} /> Bulk enroll via ZIP
      </h3>
      <p className="hint">
        Drop one ZIP of photos labeled by name — <span className="mono">john_doe.jpg</span>{" "}
        → &ldquo;john doe&rdquo;. Processed entirely in memory.
      </p>
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
        <span className="di">
          <Icon name={isPending ? "scan" : "zip"} size={26} />
        </span>
        <span className="dt">
          {file ? file.name : "Drop guests.zip or click to browse"}
        </span>
        <span className="ds">.jpg / .jpeg / .png inside</span>
        <input
          ref={inputRef}
          type="file"
          accept=".zip,application/zip"
          hidden
          onChange={(e) => pick(e.target.files?.[0])}
        />
      </div>
      {isPending && (
        <div style={{ marginTop: 14 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              marginBottom: 7,
              color: "var(--text-muted)",
            }}
          >
            <span>decompressing &amp; encoding…</span>
            <span className="spin" />
          </div>
          <div className="bar">
            <i style={{ width: "70%", animation: "none" }} />
          </div>
        </div>
      )}
      {result && (
        <div style={{ marginTop: 14, fontSize: 13 }}>
          <div
            className="mono"
            style={{
              color: "var(--green)",
              marginBottom: result.errors && result.errors.length ? 8 : 0,
            }}
          >
            ✓ {result.message}
          </div>
          {result.errors &&
            result.errors.map((er, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 8,
                  color: "var(--text-faint)",
                  fontSize: 12,
                  padding: "3px 0",
                }}
              >
                <span style={{ color: "var(--amber)", flex: "none" }}>!</span>
                <span>
                  <b className="mono">{er.file}</b> — {er.error}
                </span>
              </div>
            ))}
        </div>
      )}
      {!isPending && (
        <button
          className="btn btn-ghost btn-block"
          style={{ marginTop: 14 }}
          disabled={!file}
          onClick={() => mutate()}
        >
          <Icon name="upload" size={17} /> Upload &amp; enroll
        </button>
      )}
    </div>
  );
}
