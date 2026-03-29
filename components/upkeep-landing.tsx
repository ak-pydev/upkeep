import Link from "next/link";
import { LandingHeroIllustration } from "./product-illustrations";
import { SiteNav } from "./site-nav";

const features = [
  {
    title: "Ask like a real person",
    text: "Describe the issue in normal language and get a clear answer with the exact source that supports it."
  },
  {
    title: "Know what to check next",
    text: "Upkeep turns a dense machine PDF into a short set of next steps, likely causes, and parts worth checking first."
  },
  {
    title: "Save what worked",
    text: "Save what worked so the next person can solve the same issue faster without starting from zero."
  }
];

const workflow = [
  "Choose the machine you want help with.",
  "Upload the machine PDF once so Upkeep can search it.",
  "Ask your question in everyday language and get a focused answer.",
  "Review the source, open part links, and save the fix."
];

export function UpkeepLanding() {
  return (
    <main className="page-shell page-shell-landing">
      <SiteNav />
      <section className="hero">
        <div className="hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Phase 0 MVP</span>
            <h1>Upload a machine PDF and get clear answers in seconds.</h1>
            <p className="hero-lead">
              Upkeep turns equipment PDFs into a simple help experience:
              ask a question, see the source, find the likely part, and save the
              answer for next time.
            </p>
            <div className="trust-strip">
              <span>No prompt engineering</span>
              <span>Source-backed answers</span>
              <span>Shared repair history</span>
            </div>
            <div className="hero-actions">
              <Link href="/dashboard" className="button button-primary">
                Open the app
              </Link>
              <Link href="/dashboard#demo-flow" className="button button-secondary">
                See the workflow
              </Link>
            </div>
            <div className="hero-note">
              Works best when you start with the actual machine PDF your team already uses.
            </div>
          </div>
          <div className="hero-aside">
            <LandingHeroIllustration />
            <div className="stat-strip">
              <div>
                <span className="stat-value">8s</span>
                <span className="stat-label">target time to first answer</span>
              </div>
              <div>
                <span className="stat-value">1</span>
                <span className="stat-label">guided demo machine</span>
              </div>
              <div>
                <span className="stat-value">0</span>
                <span className="stat-label">extra setup for the demo path</span>
              </div>
            </div>
            <div className="hero-prompt">
              <span className="hero-code-label">Demo prompt</span>
              <p>
                My Haas VF-2 shows error code E32. What does it mean, what should
                I check first, and what part might I need?
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section" id="demo-flow">
        <div className="section-intro">
          <span className="eyebrow">How It Works</span>
          <h2>One clean flow from uploaded PDF to saved fix.</h2>
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
          <h2>Built to feel simple on the first try.</h2>
        </div>
        {features.map((feature) => (
          <article key={feature.title} className="feature-row">
            <span className="feature-kicker">Product</span>
            <h2>{feature.title}</h2>
            <p>{feature.text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
