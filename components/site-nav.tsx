import Link from "next/link";

export function SiteNav() {
  return (
    <header className="site-nav">
      <div className="site-brand">
        <div className="brand-mark" aria-hidden="true" />
        <div>
          <span className="brand-name">Upkeep</span>
          <span className="brand-tag">Maintenance intelligence for machine shops</span>
        </div>
      </div>
      <nav className="site-nav-links" aria-label="Primary">
        <Link href="/" className="nav-link">
          Overview
        </Link>
        <Link href="/dashboard" className="nav-link nav-link-accent">
          Open Dashboard
        </Link>
      </nav>
    </header>
  );
}
