# Upkeep Platform Research

## Current Platform Summary

Upkeep is a maintenance assistant for small manufacturers and machine shops. The current product already covers the core Phase 0 loop:

- A landing page that explains the product in plain language.
- A dashboard that lets a user select a machine, add manual text, ask a troubleshooting question, review sources, inspect likely parts, and save a repair log.
- A seeded demo path centered on a Haas VF-2 E32 spindle encoder issue.
- Live chat answers grounded in manual chunks, with parts lookup links and a repair draft.
- API routes for machines, manuals, chat, and maintenance logs.
- Demo-first persistence that now degrades gracefully when Supabase is not fully configured.
- Claude support that is live when credits and model access are available, with fallback behavior if the live AI path fails.

This is a credible MVP for a technical audience, but it still reads and behaves like a power-user tool in several places.

## Vision Summary

The roadmap points to a bigger platform, not just a troubleshooting app:

- A trusted industrial knowledge layer that turns manuals, repair history, and machine-specific context into immediate answers.
- A workflow product that helps a floor worker go from alarm to diagnosis to action to logged fix in a single session.
- A data flywheel where every repair improves future answers across the network.
- A distribution surface that can scale from small shops to dealers, associations, and eventually enterprise manufacturers.
- A platform moat built on indexed manuals, machine context, logged fixes, integrations, and trust in safety-critical environments.

The long-term product is not only "chat with a manual." It is a system of record and decision support for maintenance operations.

## Key Gaps

### Product Gaps

- Manual intake is still text-first. The roadmap calls for PDF upload and indexing, but the real user flow should be file-first with OCR or extraction behind the scenes.
- The experience is still a bit operator-oriented. A consumer-facing or broad B2B user should not need to understand manual chunks, source IDs, or log drafts.
- There is no obvious guided onboarding beyond the sample flow. The first-run path should teach the product in under a minute.
- The product does not yet create a strong machine profile or maintenance home for each asset.
- There is no visible confidence/safety policy beyond the answer format itself. For industrial use, that should be explicit.

### Platform Gaps

- Supabase is recognized, but live persistence still depends on the project having the correct schema deployed.
- The app can fall back to local state, which is good for resilience, but the cloud layer is not yet the default source of truth.
- There is no real vector search pipeline in the deployed backend path yet; the current demo indexing is still lightweight.
- The product has no team model, roles, or permissions yet.
- There is no audit trail or operational analytics layer for usage, resolution speed, or repeat issue frequency.

### Distribution Gaps

- The roadmap depends on getting into actual shops, but the product lacks the frictionless shareable artifacts that help users spread it internally.
- There is no dealer-facing or partner-facing surface yet.
- There is no low-friction top-of-funnel entry point like a public manual parser, repair summary page, or error-code lookup landing page.

## High-ROI Feature Opportunities

### 1. File-first manual upload with OCR and progress states

Why it matters:

- This removes the biggest product friction in Phase 0.
- It turns the app from "paste text into a demo" into a real manual workflow.
- It makes the product understandable to non-technical buyers immediately.

ROI:

- High conversion lift for demos and early trials.
- Lowers onboarding friction.
- Enables the strongest core promise: "upload a manual, ask a question, get an answer."

### 2. Photo-based diagnosis for machine screens and labels

Why it matters:

- A photo of an alarm screen is often faster than typing the code.
- This creates a very intuitive mobile-first workflow.
- It expands the product beyond manuals into live troubleshooting.

ROI:

- Strong differentiator versus generic AI chat.
- High utility for floor workers.
- Likely improves daily usage frequency.

### 3. Machine profile pages with repair history and last-fix recall

Why it matters:

- Shops think in assets, not just conversations.
- A machine profile makes the product feel like a system of record.
- It anchors repeated usage around specific machines and recurring faults.

ROI:

- Encourages repeat use.
- Supports fleet expansion inside an account.
- Makes the data flywheel visible to the user.

### 4. Guided first-run onboarding and sample-to-real conversion

Why it matters:

- The current demo flow is clear, but the first real user still needs handholding.
- A guided checklist can lead users from "try sample" to "upload real manual" to "ask first real question."

ROI:

- Improves activation.
- Low implementation complexity.
- Reduces drop-off in early trials.

### 5. Shareable repair summaries and exportable logs

Why it matters:

- People need to send the answer to a manager, technician, or coworker.
- A clean summary link or export makes the product useful outside the app itself.

ROI:

- Improves virality inside a shop.
- Increases perceived polish.
- Supports customer success and training.

### 6. Team roles and simple approvals

Why it matters:

- The roadmap assumes owner, supervisor, and technician behavior eventually.
- Even a lightweight role model helps shops with accountability and trust.

ROI:

- Moves the product toward paid team usage.
- Supports multi-seat pricing.
- Creates a clearer enterprise path later.

### 7. Usage analytics focused on downtime value

Why it matters:

- Buyers want to know if the product saves time.
- Basic metrics like top issues, repeat alarms, and time-to-answer are enough early on.

ROI:

- Strengthens sales conversations.
- Helps retain accounts by making value visible.
- Sets up future reporting tiers.

## Suggested Sequencing

### Sequence 1: Make the core loop feel real

1. File-first manual upload with OCR/extraction.
2. Guided onboarding that gets a user to their first successful answer quickly.
3. Photo-based diagnosis for alarm screens and labels.

### Sequence 2: Turn usage into retention

1. Machine profile pages with maintenance history.
2. Shareable repair summaries and exportable logs.
3. Usage analytics for repeat issues and resolution speed.

### Sequence 3: Prepare for paid accounts and expansion

1. Team roles and lightweight approvals.
2. Fleet-level manual management.
3. Dealer or partner-facing distribution surfaces.

## Recommendation

The highest-ROI next move is not more generic AI capability. It is a tighter product wrapper around the existing intelligence: file upload, photo capture, machine history, and shareable outcomes. That combination makes Upkeep feel like a real operational tool instead of a chat demo, and it supports the roadmap's long-term data flywheel.
