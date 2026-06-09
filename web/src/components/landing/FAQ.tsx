const faqs = [
  {
    q: "Does SmartPass store the actual photos of attendees?",
    a: "No. When you upload an image, the API extracts a 128-dimensional mathematical vector (the facial embedding) and immediately discards the raw image from memory. Only the embedding is stored — and it can't be reversed back into a face.",
  },
  {
    q: "How accurate is the face matching?",
    a: "SmartPass uses the dlib-based face_recognition library which produces 128-dim ResNet embeddings. Matching is done via pgvector L2 distance with a default threshold of 0.6. In practice, false matches are rare unless attendees are identical twins.",
  },
  {
    q: "How fast is a check-in?",
    a: "Sub-100ms for events with up to thousands of attendees. Face matching runs as a single SQL query inside PostgreSQL — no Python loops. For very large events, add an HNSW or IVFFlat index on the embedding column.",
  },
  {
    q: "What happens if no face is in the webcam frame?",
    a: "The API silently returns a 400 with 'no face detected' — the frontend treats this as a no-op so you can stream frames in a loop without spamming errors. The next frame with a face will be matched normally.",
  },
  {
    q: "Can I use SmartPass without writing code?",
    a: "Yes. This dashboard wraps the entire API — create events, upload attendees, run check-ins from your webcam. No backend code needed. The API is also available if you want to build your own client.",
  },
  {
    q: "Is SmartPass open source?",
    a: "Yes — MIT licensed. Self-host the backend with Docker Compose, deploy to Railway or Supabase, run the frontend on Vercel. Or just clone and modify everything.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-24 px-7">
      <div className="max-w-[820px] mx-auto">
        <div className="text-center mb-[60px]">
          <span className="section-label reveal">Frequently Asked</span>
          <h2 className="reveal text-[clamp(30px,4vw,46px)] font-extrabold tracking-[-1.5px] leading-[1.1]" data-d="1">
            Questions, answered.
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {faqs.map((f, i) => (
            <details
              key={f.q}
              className="faq reveal group rounded-[10px] border border-[var(--border)] bg-[var(--surface)] overflow-hidden transition-colors hover:border-[var(--border-hi)]"
              data-d={(((i % 4) + 1).toString()) as "1" | "2" | "3" | "4"}
            >
              <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer select-none">
                <span className="text-[15px] font-semibold text-[var(--text)]">{f.q}</span>
                <span
                  className="faq-icon flex items-center justify-center w-6 h-6 rounded-full bg-[var(--accent-dim)] text-[var(--accent)] text-lg leading-none transition-transform duration-200 flex-shrink-0"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <div className="px-6 pb-6 pt-0 text-[14px] text-[var(--text-muted)] leading-[1.7]">
                {f.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
