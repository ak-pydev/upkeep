# Upkeep

Upkeep is an AI-powered troubleshooting, parts lookup, and maintenance logging platform designed for machine shops and local manufacturing businesses.

## Use Case

Machine shops often face significant downtime when equipment breaks or requires maintenance. Technicians spend valuable time searching through massive catalogs for replacement parts, diagnosing recurring issues without historical context, and manually logging maintenance actions. 

Upkeep streamlines this process by providing a unified interface where technicians can:
* Diagnose issues using an AI-powered assistant that understands the context of their specific machinery.
* Look up replacement parts instantly through integrated semantic search and catalogs.
* Log maintenance activities with automated, structured reporting.

## Business Impact

For local manufacturing businesses, equipment downtime directly translates to lost revenue. Upkeep provides several key benefits:

* **Reduced Mean Time to Repair (MTTR)**: By centralizing knowledge and parts lookup, technicians can diagnose and fix issues much faster.
* **Knowledge Retention**: As senior technicians retire or leave, their troubleshooting knowledge is often lost. Upkeep acts as a central repository, allowing newer staff to benefit from historical maintenance logs.
* **Operational Efficiency**: Automated logging and AI assistance reduce the administrative burden on technicians, allowing them to focus on actual repair work instead of manual data entry.

## Tech Stack

* **Cloud Infrastructure**: Google Cloud Platform, Firebase
* **Database & Storage**: Cloud Firestore (Vector Backend)
* **AI & Machine Learning**: Google Gemini API, Document AI, Vertex AI Vector Search
* **Authentication**: Firebase Authentication
* **Hosting**: Firebase Hosting / Cloud Run
