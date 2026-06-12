import Link from "next/link";
import { Icon } from "./icons";
import { HeroScanner } from "./HeroScanner";

export function Hero() {
  return (
    <header className="hero" id="top">
      <div className="wrap hero-grid">
        <div>
          <span className="eyebrow reveal in">
            Open-source biometric access control
          </span>
          <h1 className="h-display reveal in">
            Your face
            <br />
            is your <span className="grad-text">ticket.</span>
          </h1>
          <p className="lede reveal in">
            SmartPass turns any standard webcam into a zero-friction entrance.
            No lines, no QR codes, no lost badges — just real-time facial
            recognition that checks guests in the instant they arrive.
          </p>
          <div className="hero-cta reveal in">
            <Link href="/dashboard" className="btn btn-primary btn-lg">
              Create an Event Free <Icon name="arrow" size={18} />
            </Link>
            <a href="#views" className="btn btn-ghost btn-lg">
              <Icon name="scan" size={18} /> View Live Demo
            </a>
          </div>
          <div className="hero-meta reveal in">
            <div className="stat">
              <b className="grad-text">&lt;1ms</b>
              <span>db-side matching</span>
            </div>
            <div className="stat">
              <b>128-d</b>
              <span>biometric vector</span>
            </div>
            <div className="stat">
              <b>0</b>
              <span>raw images stored</span>
            </div>
          </div>
        </div>
        <HeroScanner />
      </div>
    </header>
  );
}
