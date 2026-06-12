const ITEMS = [
  "Real-time facial recognition",
  "pgvector similarity search",
  "Zero raw-image storage",
  "ZIP bulk enrollment",
  "UUID-secured events",
  "FastAPI + SQLAlchemy 2.0",
  "Microsecond matching",
  "Unattended-only query pool",
];

export function StackStrip() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="strip">
      <div className="marquee">
        {row.map((t, i) => (
          <span key={i}>{t}</span>
        ))}
      </div>
    </div>
  );
}
