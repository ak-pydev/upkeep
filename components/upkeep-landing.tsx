import Link from "next/link";
import { SiteNav } from "./site-nav";

const features = [
  {
    title: "Ask in plain language",
    text: "Type the problem the way a real person would ask it and get a clear answer with the exact source that supports it."
  },
  {
    title: "See what to check next",
    text: "Upkeep turns dense manuals into a short set of next steps, likely causes, and parts worth checking first."
  },
  {
    title: "Keep the fix for next time",
    text: "Save what worked so the next person can solve the same issue faster without starting from zero."
  }
];

const workflow = [
  "Choose the machine or product you need help with.",
  "Add the manual or support text once so Upkeep can search it.",
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
            <h1>Get clear answers from confusing manuals in seconds.</h1>
            <p className="hero-lead">
              Upkeep turns equipment manuals into a simple help experience:
              ask a question, see the source, find the likely part, and save the
              answer for next time.
            </p>
            <div className="hero-actions">
              <Link href="/dashboard" className="button button-primary">
                Try the product
              </Link>
              <Link href="/dashboard#demo-flow" className="button button-secondary">
                See how it works
              </Link>
            </div>
            <div className="hero-note">
              Demo example: Haas VF-2, alarm E32, spindle encoder cable.
            </div>
          </div>
          <div className="hero-aside">
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
          <span className="eyebrow">Demo Flow</span>
          <h2>One simple flow from question to answer to saved fix.</h2>
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
          <h2>Built to feel easy to trust on the first try.</h2>
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
