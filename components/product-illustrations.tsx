export function LandingHeroIllustration() {
  return (
    <div className="svg-hero-frame" aria-hidden="true">
      <svg
        viewBox="0 0 520 420"
        className="svg-hero"
        role="img"
        aria-label="Illustration of a machine manual becoming an actionable answer"
      >
        <defs>
          <linearGradient id="paperGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fffdf8" />
            <stop offset="100%" stopColor="#efe5d5" />
          </linearGradient>
          <linearGradient id="signalGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#13202d" />
          </linearGradient>
        </defs>

        <rect x="38" y="42" width="194" height="256" rx="24" fill="url(#paperGlow)" stroke="rgba(19,32,45,0.12)" />
        <rect x="68" y="88" width="134" height="10" rx="5" fill="#c96d1d" opacity="0.8" />
        <rect x="68" y="118" width="118" height="8" rx="4" fill="#c8c1b6" />
        <rect x="68" y="140" width="136" height="8" rx="4" fill="#d5cec3" />
        <rect x="68" y="162" width="102" height="8" rx="4" fill="#d5cec3" />
        <rect x="68" y="206" width="96" height="54" rx="14" fill="#f4ead9" stroke="rgba(19,32,45,0.08)" />
        <path d="M260 172C296 164 326 170 356 188" fill="none" stroke="url(#signalGlow)" strokeWidth="5" strokeLinecap="round" />
        <path d="M260 196C302 194 340 210 376 244" fill="none" stroke="#c96d1d" strokeWidth="3.5" strokeLinecap="round" opacity="0.35" />

        <rect x="300" y="84" width="172" height="112" rx="26" fill="#13202d" />
        <circle cx="334" cy="118" r="10" fill="#d97706" />
        <rect x="356" y="111" width="86" height="12" rx="6" fill="#fffdf8" opacity="0.94" />
        <rect x="334" y="144" width="108" height="10" rx="5" fill="#90a0ad" opacity="0.9" />
        <rect x="334" y="165" width="88" height="10" rx="5" fill="#667988" opacity="0.8" />

        <rect x="276" y="236" width="196" height="116" rx="28" fill="#fffaf2" stroke="rgba(19,32,45,0.12)" />
        <rect x="308" y="272" width="88" height="12" rx="6" fill="#13202d" />
        <rect x="308" y="296" width="132" height="10" rx="5" fill="#c96d1d" opacity="0.7" />
        <rect x="308" y="321" width="108" height="10" rx="5" fill="#c2b8aa" />
        <circle cx="430" cy="300" r="22" fill="#eff6f0" />
        <path d="M418 300l8 8 16-18" fill="none" stroke="#1f8f5f" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />

        <circle cx="230" cy="326" r="12" fill="#13202d" opacity="0.06" />
        <circle cx="458" cy="58" r="9" fill="#c96d1d" opacity="0.18" />
      </svg>
    </div>
  );
}

export function DashboardFlowIllustration() {
  return (
    <div className="app-graphic" aria-hidden="true">
      <svg viewBox="0 0 780 180" className="svg-flow" role="img" aria-label="Illustration of PDF upload, answer, and saved fix">
        <defs>
          <linearGradient id="flowTone" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fffdf8" />
            <stop offset="100%" stopColor="#efe5d5" />
          </linearGradient>
        </defs>

        <rect x="12" y="26" width="180" height="124" rx="24" fill="url(#flowTone)" stroke="rgba(19,32,45,0.12)" />
        <rect x="42" y="58" width="96" height="12" rx="6" fill="#c96d1d" />
        <rect x="42" y="84" width="122" height="10" rx="5" fill="#cfc6b8" />
        <rect x="42" y="106" width="82" height="10" rx="5" fill="#dcd4c8" />

        <path d="M214 88h104" stroke="#c96d1d" strokeWidth="4" strokeLinecap="round" />
        <path d="M300 72l24 16-24 16" fill="none" stroke="#c96d1d" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

        <rect x="334" y="14" width="196" height="148" rx="30" fill="#13202d" />
        <rect x="368" y="48" width="108" height="12" rx="6" fill="#fffdf8" />
        <rect x="368" y="76" width="126" height="10" rx="5" fill="#91a0ad" />
        <rect x="368" y="98" width="104" height="10" rx="5" fill="#6a7b88" />
        <circle cx="476" cy="120" r="16" fill="#d97706" opacity="0.22" />

        <path d="M550 88h104" stroke="#13202d" strokeWidth="4" strokeLinecap="round" opacity="0.22" />
        <path d="M636 72l24 16-24 16" fill="none" stroke="#13202d" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.22" />

        <rect x="574" y="26" width="194" height="124" rx="24" fill="#fffaf2" stroke="rgba(19,32,45,0.12)" />
        <circle cx="620" cy="71" r="18" fill="#eff6f0" />
        <path d="M610 71l6 6 12-14" fill="none" stroke="#1f8f5f" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="650" y="60" width="78" height="10" rx="5" fill="#13202d" />
        <rect x="650" y="85" width="92" height="10" rx="5" fill="#c96d1d" opacity="0.7" />
        <rect x="650" y="108" width="68" height="10" rx="5" fill="#cfc6b8" />
      </svg>
    </div>
  );
}
