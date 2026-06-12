import Link from "next/link";
import { Icon } from "./icons";

export function FinalCTA() {
  return (
    <section className="section cta-final" id="start">
      <div className="wrap">
        <div className="cta-card reveal">
          <span className="eyebrow" style={{ justifyContent: "center" }}>
            Spin one up
          </span>
          <h2 style={{ marginTop: 18 }}>
            Your next event opens
            <br />
            its doors with a glance.
          </h2>
          <p className="lede">
            Create a free event in under a minute, or clone the repo and run
            the whole stack yourself. No card, no hardware, no lines.
          </p>
          <div className="hero-cta">
            <Link href="/dashboard" className="btn btn-primary btn-lg">
              Create an Event Free <Icon name="arrow" size={18} />
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-lg"
            >
              <Icon name="git" size={18} /> Read the docs
            </a>
          </div>
          <div className="mini-term">
            <div className="bar">
              <span
                className="tl"
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background: "var(--red)",
                  display: "inline-block",
                }}
              />
              <span
                className="tl"
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background: "var(--amber)",
                  display: "inline-block",
                }}
              />
              <span
                className="tl"
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background: "var(--green)",
                  display: "inline-block",
                }}
              />
              <span style={{ marginLeft: 8 }}>bash</span>
            </div>
            <div className="body">
              <span className="prompt">$</span> git clone smartpass/smartpass
              <br />
              <span className="prompt">$</span> docker compose up
              <br />
              <span style={{ color: "var(--text-faint)" }}>
                ✓ pgvector ready · api on :8000
              </span>{" "}
              <span className="cursor" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
