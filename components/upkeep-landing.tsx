import Link from "next/link";
import { SiteNav } from "./site-nav";

const features = [
  {
    title: "Manual-grounded chat",
    text: "Ask about alarm codes, error states, and maintenance steps with citations from the indexed manual chunks."
  },
  {
    title: "Parts lookup",
    text: "Extract likely replacement parts and jump straight to McMaster-Carr or Grainger search pages."
  },
  {
    title: "One-click log",
    text: "Save the issue, fix, and source manuals to the maintenance history before the machine goes back online."
  }
];

const workflow = [
  "Pick the machine that is down.",
  "Index manual text for the exact model on the floor.",
  "Ask about the alarm code and review sourced evidence.",
  "Jump to likely replacement parts and log the repair."
];

export function UpkeepLanding() {
  return (
    <main className="page-shell page-shell-landing">
      <SiteNav />
      <section className="hero">
        <div className="hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Phase 0 MVP</span>
            <h1>Answer machine alarms from the manual, not from memory.</h1>
            <p className="hero-lead">
              Upkeep gives machinists a fast path from alarm code to grounded answer,
              likely parts, and a durable maintenance log.
            </p>
            <div className="hero-actions">
              <Link href="/dashboard" className="button button-primary">
                Open live dashboard
              </Link>
              <Link href="/dashboard#demo-flow" className="button button-secondary">
                See demo flow
              </Link>
            </div>
            <div className="hero-note">
              Seeded demo path: Haas VF-2, alarm E32, spindle encoder cable.
            </div>
          </div>
          <div className="hero-aside">
            <div className="stat-strip">
              <div>
                <span className="stat-value">8s</span>
                <span className="stat-label">target answer time</span>
              </div>
              <div>
                <span className="stat-value">1</span>
                <span className="stat-label">seeded demo machine</span>
              </div>
              <div>
                <span className="stat-value">0</span>
                <span className="stat-label">required external credentials</span>
              </div>
            </div>
            <div className="hero-prompt">
              <span className="hero-code-label">Demo prompt</span>
              <p>
                Error code E32 on a Haas VF-2. What does it mean, what should I check,
                and which parts do I need?
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section" id="demo-flow">
        <div className="section-intro">
          <span className="eyebrow">Demo Flow</span>
          <h2>One continuous operator workflow, not five separate tools.</h2>
        </div>
        <ol className="workflow-list">
          {workflow.map((step, index) => (
            <li key={step} className="workflow-row">
              <span className="workflow-step">0{index + 1}</span>
              <p>{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="landing-section capability-section">
        <div className="section-intro">
          <span className="eyebrow">Capabilities</span>
          <h2>Built to feel calm, credible, and immediate during downtime.</h2>
        </div>
        {features.map((feature) => (
          <article key={feature.title} className="feature-row">
            <span className="feature-kicker">Workflow</span>
            <h2>{feature.title}</h2>
            <p>{feature.text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
