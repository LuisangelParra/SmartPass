const stack = [
  "FastAPI",
  "PostgreSQL 17",
  "pgvector",
  "SQLAlchemy 2.0",
  "dlib / face_recognition",
  "OpenCV",
  "Pydantic V2",
  "Python 3.10+",
];

export function StackStrip() {
  return (
    <section className="py-14 px-7" style={{ background: "var(--surface)" }}>
      <div className="max-w-[1160px] mx-auto text-center">
        <span className="block font-mono text-[10px] tracking-[3px] uppercase text-[var(--text-muted)] mb-7">
          Powered by
        </span>
        <div className="flex flex-wrap justify-center gap-2.5">
          {stack.map((name) => (
            <span key={name} className="tech-badge">
              <span className="tech-badge-dot" aria-hidden="true" />
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
