import Link from "next/link";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer-grid">
        <div>
          <span className="footer-title">Upkeep</span>
          <p className="footer-copy">
            Upload a machine PDF, ask a question in plain language, and save the answer for the next repair.
          </p>
        </div>
        <div className="footer-links" aria-label="Footer">
          <Link href="/">Home</Link>
          <Link href="/dashboard">Open App</Link>
          <a href="#demo-flow">How it works</a>
        </div>
      </div>
      <div className="footer-meta">
        <span>Source-backed machine support</span>
        <span>{year}</span>
      </div>
    </footer>
  );
}
