# LeakGuard AI

LeakGuard AI is an AI-powered subscription leak detection platform that turns bank statements into explainable savings recommendations. It detects recurring payments, price increases, duplicate subscriptions, and low-value services, then gives users a practical action plan to reduce monthly waste.

## Problem Statement

People routinely lose money to subscriptions they forgot, duplicate tools, price hikes, and services they barely use. Bank apps show transactions, but they rarely explain which recurring costs are wasteful or what to do next.

## Solution

LeakGuard AI analyzes uploaded statements and produces a clear financial intelligence report:

- Recurring payment detection across CSV, text, Excel, email, and PDF uploads
- Leak Score from 0 to 100 with explainable risk drivers
- Price hike and duplicate subscription detection
- AI recommendations to cancel, pause, downgrade, bundle, or negotiate
- AI advisor chat for savings plans and cancellation emails
- Demo-ready dashboard with realistic 12-month financial data

## Architecture

```text
User upload or demo data
        |
        v
Next.js App Router UI and route handlers
        |
        v
FastAPI backend
        |
        v
Extraction -> normalization -> recurring detection -> leak scoring
        |
        v
Gemini-assisted categorization and advisor responses
        |
        v
Dashboard, analytics, recommendations, export-ready actions
```

## Tech Stack

Frontend:

- Next.js 16 App Router, React 19, TypeScript
- Tailwind CSS v4
- Radix-style UI primitives
- Framer Motion
- Recharts
- Supabase client integration for optional OAuth

Backend:

- FastAPI
- Pydantic v2
- Google Gemini API
- SQLAlchemy-ready persistence layer
- Local parsers for CSV, TXT, JSON, EML, XLSX, XLS, and PDF

## AI Pipeline

1. Extract candidate transactions from uploaded content.
2. Normalize merchant names, amounts, dates, categories, and currencies.
3. Detect recurring subscriptions from cadence and merchant knowledge.
4. Identify price hikes from merchant timelines.
5. Detect duplicate services by category and use case.
6. Estimate unused subscription risk from overlap, recency, and cost.
7. Calculate Leak Score and ranked savings recommendations.
8. Answer user questions through the AI advisor with report-grounded context.

## Installation

```bash
npm install
python -m pip install -r backend/requirements.txt
```

## Environment Variables

Copy `.env.example` to `.env.local` for the frontend. When running FastAPI directly, copy the backend values into `backend/.env` or export them in your shell.

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

GOOGLE_GEMINI_API_KEY=
DATABASE_URL=
CORS_ORIGINS=http://localhost:3000
JWT_SECRET_KEY=replace-with-a-secure-random-secret
```

## Running Locally

Start the frontend:

```bash
npm run dev
```

Start the backend:

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

Open `http://localhost:3000/dashboard`.

## Demo Mode

The app is intentionally demo-ready without API keys. If the backend or Gemini API is unavailable, the UI falls back to realistic preloaded data so judges can see the full product story immediately.

Recommended demo route:

1. `/dashboard` for the savings headline and Leak Score
2. `/advisor` for AI-guided financial recommendations
3. `/analytics` for spending patterns and category insights
4. `/recommendations` for business value and action prioritization
5. `/export` for cancellation and negotiation outputs

## Security And Production Readiness

- Frontend route handlers validate upload size, type, and file name before proxying.
- Backend endpoints enforce request size limits, rate limits, request IDs, and structured errors.
- CORS is restricted to configured origins and Vercel preview domains.
- Production startup fails if the default JWT secret is still configured.
- Security headers include CSP, frame blocking, content type protection, referrer policy, and permissions policy.
- Uploaded documents are processed in memory and are not persisted by default.

## Testing

```bash
npm run lint
npm run build
python -m pytest
```

Current validation status:

- ESLint: passing
- Next.js production build: passing
- Backend AI pipeline tests: passing

## Deployment

Frontend:

- Deploy to Vercel.
- Set `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_API_URL`, and optional Supabase public keys.

Backend:

- Deploy FastAPI to Render, Railway, Fly.io, or similar.
- Set `GOOGLE_GEMINI_API_KEY`, `CORS_ORIGINS`, `JWT_SECRET_KEY`, and database variables.

## Screenshots

Add final screenshots before submission:

- Dashboard and Leak Score
- AI Advisor conversation
- Subscription recommendations
- Analytics charts
- Upload center

## Future Scope

- Bank account aggregation with user consent
- Persistent user workspaces and team dashboards
- Subscription cancellation integrations
- Calendar-based renewal reminders
- Multi-currency support and regional merchant packs
- OCR hardening for scanned statements
- Fine-tuned recommendation ranking from user outcomes

## Contributors

Built by the LeakGuard AI hackathon team.
