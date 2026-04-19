# Upkeep — Product Roadmap

> AI-powered troubleshooting, parts lookup & maintenance logging for small manufacturers and machine shops. From hackathon MVP to scalable B2B SaaS.

---

## Phase 0 — Solutions Challenge MVP
**Timeline: Day 0–2**

### Goal
Win the room in 3 minutes. Demo a live chat interface where a machinist uploads a PDF manual and asks "Error code E32 on my Haas VF-2 — what does it mean and what parts do I need?" — and gets a sourced, actionable answer in seconds.

### What to Build
- PDF manual upload + Document AI parsing (chunk → embed → store in Firestore / vector backend)
- Chat UI — natural language Q&A grounded in the uploaded manual
- Parts lookup: parse the answer for part numbers, link to McMaster-Carr / Grainger via URL template
- Maintenance log: one-click "Log this fix" button saves issue + resolution + date to Firestore
- Machine selector: dropdown to tag which machine is being queried

### Tech Stack
`Angular` · `Gemini API (gemini-2.5-pro)` · `Firestore` · `Cloud Run` · `Firebase Hosting` · `Document AI` · `Firebase Auth` · `Angular Material`

### The Winning Demo Moment

| | Before Upkeep | After Upkeep |
|---|---|---|
| **Experience** | Machinist flips through a 400-page manual for 20 min, calls the rep, waits on hold. $1,800/hr downtime. Machine sits cold. | Types "E32 error" → gets the root cause, fix steps, and parts list in 8 seconds. Logs the fix for next time. Machine running in 30 min. |

### Success Metrics
- **8 seconds** — time to answer
- **1 live demo** on stage
- **$0** cost to build

---

## Phase 1 — Validation & Early Access
**Timeline: Month 1–2**

### Goal
Get 10 machine shops to use it daily. Free beta. Talk to every user. Find the 3 workflows they can't live without. Don't build anything new — just make the MVP indispensable.

### Who to Target First

**CNC machine shops** — 2–20 employees, high downtime cost, complex manuals. Easy to find via local manufacturing associations.

**Injection molding shops** — Highly specialized errors, expensive machines ($200K+), strong word-of-mouth networks.

**Industrial bakeries / food manufacturing** — High volume, shift workers who need instant answers. Different vertical, good for signal diversity.

### How to Reach Them
- Post in r/manufacturing, r/machinists, r/CNC with a "built this at a hackathon" story
- Cold email local machine shops with a 60-second Loom showing the E32 demo
- Partner with 1–2 equipment dealers (they talk to shops daily) for warm intros
- Post on LinkedIn targeting "plant manager" and "maintenance supervisor" titles

### Improvements to Ship
- Multi-manual support per account (index entire equipment fleet)
- Maintenance history search — "when did we last fix this error?"
- Mobile-first UI — machinists are on the floor, not at a desk
- Image upload — photo of the error display → visual diagnosis

### Key Questions to Answer
- Do they use it during actual downtime events or just for learning?
- Who pays — the owner, the plant manager, or IT?
- Is the bottleneck finding the answer or getting the parts ordered?

### Exit Criteria
- **10** active beta shops
- **3× per week** average query frequency
- **1** shop willing to pay

---

## Phase 2 — Product–Market Fit
**Timeline: Month 3–6**

### Goal
$5K MRR, zero churn. Charge for the first time. Find the pricing model that maps to their value (per machine seat makes the most sense — they understand per-machine costs). Grow to 50 paying accounts.

### Pricing Model

| Plan | Price | Includes |
|---|---|---|
| **Starter** | $49/mo | 1–3 machines, 5 manual uploads, chat Q&A, basic maintenance log |
| **Pro** | $149/mo | Up to 15 machines, unlimited manuals, image diagnosis, parts order tracking, team access |
| **Shop** | $399/mo | Unlimited machines, API access, custom integrations, priority support, usage analytics |

### Core Product Features to Build
- Parts ordering integration — connect McMaster-Carr, Grainger, Fastenal APIs for 1-click ordering
- Predictive alerts — "Machine X is due for its 500-hour service in 3 days"
- Repair ticket system — assign fixes to technicians, track status, close the loop
- Downtime reporting — dashboard showing MTTR (mean time to repair) improvement over time
- Team roles — owner, floor supervisor, technician permissions
- Offline mode — PWA with cached manuals for shops with poor connectivity

### The Data Flywheel (Starts Here)
When shop A logs "E32 on Haas VF-2 — fixed by replacing spindle encoder cable," that anonymized resolution enriches answers for every other shop with the same machine. Over time Upkeep knows fixes that aren't even in the manual.

Every fix logged by every shop makes answers better for everyone.

### Exit Criteria
- **$5K MRR**
- **<5%** monthly churn
- **50** paying shops
- **NPS > 40**

---

## Phase 3 — Growth & Distribution
**Timeline: Month 6–12**

### Goal
$50K MRR — go beyond direct sales. You can't cold email your way to $50K. Build distribution channels that compound. The fastest one: equipment dealers who already talk to 1,000 shops.

### Distribution Channels

**Equipment dealer partnerships** — Haas, Mazak, Okuma dealers bundle Upkeep with new machine purchases. Rev-share on first year. They close deals with shops you'd never reach.

**Industrial insurance brokers** — Upkeep data reduces claims (faster MTTR = less damage). Brokers offer premium discounts for Upkeep users. Mutual incentive, zero CAC.

**Manufacturing associations** — AME, NTMA, PMPA have thousands of member shops. Endorsed partnership = instant credibility and warm inbound leads.

**PLC / SCADA integrations** — Integrate with Ignition, Wonderware. Upkeep auto-triggers when a machine throws an alarm — zero manual input required.

### Product-Led Growth Levers
- Technician referral — "Invite your shop to Upkeep, get 1 free machine seat for a month"
- Public repair library — shops opt-in to share anonymized fixes, driving SEO for error codes
- Free manual parser — upload any manual, get a machine summary card, no account required. Converts to paid.

### Team to Hire (in order)
1. **Founding AE** — someone who has sold B2B SaaS to manufacturers or industrial companies
2. **Full-stack engineer #2** — owns integrations and the data pipeline
3. **Customer success** — ensures onboarding completes within 7 days and manual library is populated

### Exit Criteria
- **$50K MRR**
- **3** channel partners
- **500+** machines indexed

---

## Phase 4 — Scale & Enterprise
**Timeline: Month 12–24**

### Goal
$500K ARR — move upmarket to mid-size manufacturers. Small shops prove the concept. Mid-size manufacturers (50–500 employees) are the real prize — 10–50 machine seats per account, procurement budgets, multi-year contracts.

### Enterprise Product Additions
- ERP integration — sync with SAP, Oracle, Epicor for work orders and inventory
- Predictive maintenance ML model — trained on your proprietary fix log data (the moat compounds here)
- Custom knowledge base — upload proprietary SOPs, internal repair guides, company-specific procedures
- SSO / SAML — required for enterprise IT security approval, planned on top of Identity Platform
- Audit logs, role-based access, compliance exports (ISO 9001 documentation)
- On-prem / private cloud deployment option for sensitive manufacturing environments

### Vertical Expansion Opportunities

**Commercial kitchens** — Restaurants, ghost kitchens. Same pain: complex equipment, high downtime cost, staff turnover means knowledge is lost.

**HVAC / facilities** — Maintenance teams managing buildings. Chiller, AHU, BMS systems — same document-heavy troubleshooting problem.

**Marine / offshore** — Ships have enormous equipment complexity, zero internet access, and critical uptime requirements. Premium pricing justified.

### Fundraising Trigger
At $2M ARR you have channel proof, retention data, and a predictive model trained on real fixes. That's a fundable story. Raising earlier means diluting for discovery work you can bootstrap.

**Target:** $3–5M Seed from industrial-focused funds (Piva Capital, Autotech Ventures, Trucks VC).

### Exit Criteria
- **$500K ARR**
- **3** enterprise accounts
- **120%** net revenue retention

---

## Phase 5 — The Defensible Moat
**Timeline: Month 24+**

### Why Upkeep Becomes Very Hard to Replace

**Data network effect** — Every fix logged by every shop makes answers better for every other shop. A competitor starting today gets none of that history. At 100K logged fixes, Upkeep knows repairs that aren't in any manual — that's proprietary institutional knowledge at scale.

**Switching cost** — After 2 years, a shop's entire maintenance history lives in Upkeep. Leaving means losing your repair records, your indexed manuals, your predictive baselines. That's not software lock-in — that's operational infrastructure.

**Manual library as proprietary asset** — Thousands of indexed, chunked, embedded equipment manuals — many out of print, many never digitized by the OEMs. Building this takes years of uploads and curation. Competitors can't buy it.

**Trust in safety-critical environments** — Machinists won't use a tool they don't trust for a machine that can hurt someone. Trust is earned over years of accurate answers and zero catastrophic misdiagnoses. Early movers in industrial AI win this by default.

### Risks to Watch

| Risk | Level | Mitigation |
|---|---|---|
| OEM competition (Haas or Mazak builds this themselves) | 🔴 High | Be machine-agnostic (they never will be), and sign up their dealers first |
| AI hallucination in safety-critical context | 🔴 High | Always cite source, always show confidence, never prescribe — suggest |
| Slow enterprise sales cycle (3–6 months) | 🟡 Medium | Land with small shops, expand to enterprise later when you have proof |
| OpenAI builds a generic version | 🟢 Low | A general assistant doesn't have the indexed manuals, the repair log network, or the industrial trust. Workflow + data beats raw capability here |

---

## Full Journey at a Glance

| Phase | Timeline | Key Milestone |
|---|---|---|
| Hackathon MVP | Day 0–2 | Working demo |
| Validation | Month 1–2 | 10 beta users |
| Product–Market Fit | Month 3–6 | $5K MRR |
| Growth | Month 6–12 | $50K MRR |
| Scale | Month 12–24 | $500K ARR |
| Moat | Month 24+ | Data flywheel locked |

---

*"The best industrial software companies are built on data that took years to collect — not features that took months to build."*
