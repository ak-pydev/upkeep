# Upkeep Feature Roadmap

## Purpose

This document turns the research brief into a build-oriented roadmap for the next set of high-ROI product improvements. The goal is to move Upkeep from a strong demo into a product that activates users faster, feels more trustworthy, and supports repeat usage.

## Product Goal

Make Upkeep feel like the fastest and easiest way to go from:

1. problem on a machine
2. grounded answer
3. likely next action
4. saved fix for the next person

## Current Baseline

The product already supports:

- machine selection
- manual text ingestion
- grounded question answering
- source display
- parts lookup links
- maintenance log creation
- Claude-backed responses when available
- graceful fallback when external dependencies fail

The next roadmap should improve activation, usability, trust, and retention.

## Priority 1: Make The Core Loop Feel Real

### 1. File-First Manual Upload

Why now:

- This is the biggest gap between the current product and the expected user workflow.
- It removes the “paste text” friction that still makes the app feel like a prototype.

Scope:

- Upload PDF files directly
- Extract text automatically
- Show indexing progress and completion states
- Preserve manual title, machine association, page count, and upload timestamp

Acceptance criteria:

- A user can upload a PDF without preparing text manually
- The product shows indexing states clearly: uploading, extracting, indexing, ready
- Uploaded manuals become searchable in the same session
- Error states are understandable and recoverable

### 2. Guided First-Run Onboarding

Why now:

- The product still assumes the user understands the flow
- Consumer-facing UX needs a short, obvious path to first value

Scope:

- First-run checklist
- Sample flow entry point
- “Try sample” to “use your own machine” progression
- Simple instructional copy around the four main steps

Acceptance criteria:

- A first-time user can reach a successful answer without guessing what to do next
- The UI clearly shows the current step and next step
- A user can switch from sample mode to real usage in one flow

### 3. Photo-Based Diagnosis

Why now:

- This is a high-utility feature for mobile and shop-floor usage
- It makes the product feel more intuitive and differentiated

Scope:

- Upload photo of machine screen, alarm display, or part label
- Extract relevant text or clues from the image
- Use image-derived context to improve the answer

Acceptance criteria:

- A user can upload a photo instead of typing the error manually
- The product confirms what it detected from the image
- The resulting answer still includes source-backed guidance when possible

## Priority 2: Turn Usage Into Retention

### 4. Machine Profile Pages

Why now:

- Repeat usage will be anchored to machines, not chats
- This makes the product feel like an operational home for each asset

Scope:

- Dedicated machine detail page
- Attached manuals
- repair history
- latest issues
- last successful fix summary

Acceptance criteria:

- Each machine has a page with its history and supporting docs
- Users can see previous fixes without starting a new search
- Users can navigate from answer to machine history naturally

### 5. Shareable Repair Summaries

Why now:

- The answer often needs to be shared with a coworker, manager, or technician
- Shareability helps internal adoption

Scope:

- Clean summary view
- Copy/share/export actions
- Exportable maintenance note or printable version

Acceptance criteria:

- A user can turn an answer into a clean summary
- A summary can be copied or exported without extra cleanup
- Shared output includes the key answer, parts, and source reference

### 6. Usage Analytics For Value Visibility

Why now:

- Buyers need proof that the product saves time
- Early analytics help both retention and sales

Scope:

- top issues
- repeat faults
- manual usage
- answer volume
- time-to-answer

Acceptance criteria:

- Account owners can see which machines and issues drive usage
- The product exposes at least one clear value metric tied to time saved or repeated resolution

## Priority 3: Prepare For Team Usage

### 7. Roles And Lightweight Approvals

Why now:

- Multi-user workflows will matter as soon as a shop adopts the product
- Trust and accountability improve when saved fixes have clear ownership

Scope:

- owner
- supervisor
- technician roles
- optional approval flag for published fixes

Acceptance criteria:

- Saved repairs show who created them
- Access to admin actions can be limited by role
- Teams can distinguish between draft notes and accepted fixes

### 8. Fleet-Level Manual Management

Why now:

- Expansion inside one account depends on supporting more than one machine cleanly

Scope:

- multi-machine manual library
- machine-to-manual linking
- filters by manufacturer, model, and status

Acceptance criteria:

- A team can manage multiple machines and manuals without confusion
- Search and filtering work at the fleet level

## Suggested Delivery Sequence

### Wave 1

- File-first manual upload
- Guided onboarding
- consumer-friendly copy cleanup across the app

### Wave 2

- Photo-based diagnosis
- machine profile pages
- shareable repair summaries

### Wave 3

- usage analytics
- roles and approvals
- fleet-level manual management

## Recommended Build Order

1. Replace text-first ingest with real PDF upload and extraction
2. Add onboarding that moves users from sample mode to real usage
3. Build machine profile pages to anchor repeat use
4. Add shareable answer outputs
5. Add photo-based diagnosis
6. Add account-level analytics
7. Add roles and fleet management

## Notes For Engineering

- Keep Claude and Supabase optional at runtime where possible
- Favor graceful degradation over hard failure for external services
- Maintain source visibility and confidence cues in every answer flow
- Optimize for mobile interaction as early as possible, especially for upload and question entry

## Recommendation

The highest-ROI next build is still file-first manual upload plus onboarding. That pair closes the biggest activation gap and makes the existing product intelligence feel real to new users immediately.
