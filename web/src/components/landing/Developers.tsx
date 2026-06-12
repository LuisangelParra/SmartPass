import { Icon, type IconName } from "./icons";

type Stack = { icon: IconName; nm: string; vs: string; body: string };

const STACK: Stack[] = [
  {
    icon: "bolt",
    nm: "FastAPI",
    vs: "async",
    body: "High-throughput async endpoints for frame ingestion and check-ins.",
  },
  {
    icon: "db",
    nm: "PostgreSQL",
    vs: "16",
    body: "The single source of truth for events, guests, and signatures.",
  },
  {
    icon: "layers",
    nm: "pgvector",
    vs: "hnsw",
    body: "In-database similarity search over 128-d embeddings, indexed for speed.",
  },
  {
    icon: "cpu",
    nm: "SQLAlchemy",
    vs: "2.0",
    body: "Modern typed ORM with the new async query style throughout.",
  },
];

export function Developers() {
  return (
    <section className="section dev" id="developers">
      <div className="wrap">
        <div className="dev-grid">
          <div>
            <div className="sec-head reveal" style={{ marginBottom: 32 }}>
              <span className="eyebrow">For developers</span>
              <h2 className="h-section">
                A modern stack, doing the hard part in the database.
              </h2>
              <p className="lede">
                Matching happens where the data already lives. One indexed query
                returns the closest signature — no model server, no vector
                cache, no round trips.
              </p>
            </div>
            <div className="stack-grid reveal">
              {STACK.map((s, i) => (
                <div className="stack-card" key={i}>
                  <div className="nm">
                    <span style={{ color: "var(--green)" }}>
                      <Icon name={s.icon} size={18} />
                    </span>
                    {s.nm} <span className="vs">{s.vs}</span>
                  </div>
                  <p>{s.body}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="code-window reveal">
            <div className="code-top">
              <span className="tl" style={{ background: "var(--red)" }} />
              <span className="tl" style={{ background: "var(--amber)" }} />
              <span className="tl" style={{ background: "var(--green)" }} />
              <span className="fname">checkin.py</span>
            </div>
            <div className="code-body">
              <span className="ln">
                <span className="cm"># incoming webcam frame → 128-d signature</span>
              </span>
              <span className="ln">
                <span className="kw">async def</span>{" "}
                <span className="fn">check_in</span>(frame: <span className="kw">str</span>,
                event_id: UUID):
              </span>
              <span className="ln">
                {"    "}sig = <span className="fn">encode_face</span>(frame){"  "}
                <span className="cm"># discard image</span>
              </span>
              <span className="ln">
                {"    "}
                <span className="kw">if</span> sig <span className="kw">is None</span>:
              </span>
              <span className="ln">
                {"        "}
                <span className="kw">return</span>
                {"  "}
                <span className="cm"># empty frame, skip silently</span>
              </span>
              <span className="ln"> </span>
              <span className="ln">{"    "}stmt = (</span>
              <span className="ln">
                {"        "}
                <span className="fn">select</span>(Guest)
              </span>
              <span className="ln">
                {"        "}.<span className="fn">where</span>(Guest.event_id == event_id)
              </span>
              <span className="ln">
                {"        "}.<span className="fn">where</span>(Guest.arrived_at.is_(
                <span className="kw">None</span>))
              </span>
              <span className="ln">
                {"        "}.<span className="fn">order_by</span>(Guest.embedding.
                <span className="fn">l2_distance</span>(sig))
              </span>
              <span className="ln">
                {"        "}.<span className="fn">limit</span>(<span className="nm">1</span>)
              </span>
              <span className="ln">{"    "})</span>
              <span className="ln">
                {"    "}match = (<span className="kw">await</span> db.
                <span className="fn">execute</span>(stmt)).
                <span className="fn">scalar</span>()
              </span>
              <span className="ln">
                {"    "}
                <span className="kw">return</span>{" "}
                <span className="fn">welcome</span>(match){"  "}
                <span className="cm">{"# <1ms, db-side"}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
