const steps = [
  {
    number: "01",
    title: "Create an Event",
    description:
      "One POST request. Get back a UUID that scopes all attendees and check-ins for this event. No global registration required.",
    code: "POST /api/v1/events/",
  },
  {
    number: "02",
    title: "Register Attendees",
    description:
      "Upload photos individually or drop a ZIP of labeled images. The API extracts facial embeddings and stores them — photos are discarded immediately.",
    code: "POST /events/{id}/attendants/bulk",
  },
  {
    number: "03",
    title: "Live Check-In",
    description:
      "Point a webcam at the door. Send base64 frames to the check-in endpoint. PostgreSQL finds the closest face match, marks attendance, returns the result.",
    code: "POST /events/{id}/check-in",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-7">
      <div className="max-w-[1160px] mx-auto">
        <div className="text-center mb-[60px]">
          <span className="section-label reveal">Workflow</span>
          <h2 className="reveal text-[clamp(30px,4vw,46px)] font-extrabold tracking-[-1.5px] leading-[1.1]" data-d="1">
            Three steps.
            <br />
            <span className="text-[var(--accent)]">One API.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-10 relative">
          {/* Dashed connecting line */}
          <div
            className="hidden md:block absolute top-[30px] left-[16.7%] right-[16.7%] h-px border-t border-dashed"
            style={{ borderColor: "rgba(0,229,200,0.2)" }}
            aria-hidden="true"
          />

          {steps.map((step, i) => (
            <div
              key={step.number}
              className="reveal flex flex-col items-start relative z-10"
              data-d={String(i + 1) as "1" | "2" | "3"}
            >
              <div className="font-mono text-[44px] font-bold text-[var(--accent)] leading-none mb-5">
                {step.number}
              </div>
              <div className="w-9 h-0.5 bg-[var(--accent)] rounded-sm opacity-50 mb-5" />
              <h3 className="text-[17px] font-bold mb-2.5 text-[var(--text)]">{step.title}</h3>
              <p className="text-sm text-[var(--text-muted)] leading-[1.65] mb-3.5">
                {step.description}
              </p>
              <code className="code-chip">{step.code}</code>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
