import { Icon } from "./icons";

const BAD: Array<[string, string]> = [
  ["Paper tickets get lost", "Reprints, disputes, and a desk full of will-call envelopes."],
  ["QR codes take time", "Guests dig through email threads while the line backs up."],
  ["RFID is expensive", "Cards cost money, get shared, and end up in a drawer at home."],
  ["No live visibility", "Organizers have no idea who's actually in the room."],
];

const GOOD: Array<[string, string]> = [
  ["Nothing to carry", "Guests just walk up to the camera. Their face is the credential."],
  ["Instant check-in", "A match resolves in under a millisecond, directly in the database."],
  ["Free to run", "Open-source, webcam-driven. No hardware to buy or distribute."],
  ["Live attendance feed", "Watch arrivals stream into your dashboard in real time."],
];

export function Problem() {
  return (
    <section className="section" id="problem">
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="eyebrow">The friction problem</span>
          <h2 className="h-section">
            Registration lines kill the first impression.
          </h2>
          <p className="lede">
            Every second a guest waits at the door is a second of your event
            spent on logistics instead of experience. The old toolkit is slow,
            costly, and easy to lose.
          </p>
        </div>
        <div className="compare reveal">
          <div className="compare-card old">
            <h3>
              <span style={{ color: "var(--red)" }}>
                <Icon name="clock" size={22} />
              </span>{" "}
              The old way
            </h3>
            {BAD.map(([t, b], i) => (
              <div className="friction-item bad" key={i}>
                <span className="ic">
                  <Icon name="x" size={15} stroke={2.2} />
                </span>
                <div className="t">
                  <b>{t}</b>
                  <span>{b}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="compare-card new">
            <h3>
              <span style={{ color: "var(--green)" }}>
                <Icon name="fingerprint" size={22} />
              </span>{" "}
              With SmartPass
            </h3>
            {GOOD.map(([t, b], i) => (
              <div className="friction-item good" key={i}>
                <span className="ic">
                  <Icon name="check" size={15} stroke={2.2} />
                </span>
                <div className="t">
                  <b>{t}</b>
                  <span>{b}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
