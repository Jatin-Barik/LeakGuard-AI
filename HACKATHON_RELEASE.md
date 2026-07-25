# LeakGuard AI Release Brief

## 6-7 Slide Pitch Outline

### 1. Problem
- Users lose money through forgotten subscriptions, price hikes, duplicate tools, and underused memberships.
- Bank statements expose transactions but not decisions.
- Suggested diagram: monthly income bucket leaking through subscription holes.
- Speaker notes: Open with the hidden-cost pain: "People do not need another transaction list; they need a financial co-pilot that tells them what to stop paying for."

### 2. Solution
- LeakGuard AI converts statements into savings actions.
- It detects recurring payments, duplicates, price hikes, and avoidable spend.
- Suggested diagram: upload -> AI analysis -> Leak Score -> savings plan.
- Speaker notes: Emphasize that the product is action-oriented, not just analytical.

### 3. Architecture
- Next.js App Router frontend with demo-ready dashboards and route handlers.
- FastAPI backend for parsing, scoring, and AI orchestration.
- Gemini integration for categorization and advisor responses, with deterministic fallbacks.
- Suggested diagram: UI, API proxy, FastAPI services, Gemini, optional Supabase.
- Speaker notes: Mention secure in-memory upload handling and no persistence by default.

### 4. AI Workflow
- Extract transactions from statements.
- Normalize merchants, dates, amounts, and categories.
- Detect recurrence, price hikes, duplicates, and unused risk.
- Generate explainable Leak Score and ranked recommendations.
- Suggested diagram: pipeline stages with confidence and reasoning outputs.
- Speaker notes: Judges should hear that outputs are explainable, bounded, and grounded in user data.

### 5. Features
- Leak Score health meter
- AI advisor chat
- Price hike timeline
- Duplicate subscription detection
- Savings simulator
- Exportable cancellation and negotiation emails
- Suggested diagram: dashboard screenshot collage.
- Speaker notes: Walk from "what happened" to "what to do next."

### 6. Demo Results
- Demo account finds $96.96/month in preventable leaks.
- Projected starter savings: $847/year.
- 12 subscriptions and 1,200+ transactions are preloaded for fast judging.
- Suggested diagram: before/after Leak Score and annual savings number.
- Speaker notes: Keep this business-focused: annualized savings and immediate user value.

### 7. Future Scope
- Consent-based bank integrations
- Renewal reminders and calendar workflows
- Cancellation partner integrations
- Personal finance coaching loops
- Suggested diagram: roadmap from hackathon MVP to consumer fintech product.
- Speaker notes: Close with scalability and why this can become a sticky personal finance product.

## 5-Minute Demo Script

Opening hook, 0:00-0:30:
"Most people do not know how much money silently leaks out of their account every month. LeakGuard AI finds those leaks and turns them into actions in under a minute."

Problem, 0:30-1:00:
"Bank apps show what you spent, but they do not tell you which charges are duplicated, which prices increased, or which subscriptions are no longer worth it."

Solution walkthrough, 1:00-2:00:
"This is the LeakGuard dashboard. The first screen already gives a verdict: $96.96 per month in potential savings, a Leak Score of 42, and the top AI insights from 12 months of financial activity."

AI demonstration, 2:00-3:20:
"Now I will open the AI Advisor. I can ask, 'Where am I wasting money?' The assistant responds with a prioritized plan: cancel the low-usage gym membership, remove duplicate music subscriptions, consolidate cloud storage, and protect essential expenses."

Business value, 3:20-4:20:
"The product does not stop at detection. It creates cancellation emails, negotiation templates, savings simulations, and annual projections. In this demo, the user can save hundreds of dollars a year without changing essential bills."

Closing, 4:20-5:00:
"LeakGuard AI is a practical fintech assistant: fast enough for consumers, explainable enough for trust, and extensible enough for bank integrations. It turns financial noise into savings decisions."

## Possible Judge Questions

- How do you reduce hallucinations?
  Answer: Core detection is deterministic and explainable. Gemini is used for enhancement and advisor language, while recommendations are grounded in structured report data.

- What happens without an API key?
  Answer: Demo mode keeps the full product flow available. The backend and UI have deterministic fallbacks for hackathon reliability.

- Is uploaded financial data stored?
  Answer: Not by default. Uploads are processed in memory, and persistence is an explicit future integration point.

- How would this scale?
  Answer: The parser, scoring pipeline, advisor, and persistence layers are separated. We can queue heavier document processing and cache report results per user.

- What is the business model?
  Answer: Freemium personal finance insights, premium cancellation automation, and optional bank or wallet partnerships.

## Hackathon Scoring

Innovation: 8.5/10
Strength: transforms passive transaction data into actionable financial decisions.
Weakness: stronger real bank integrations would raise defensibility.

Technical Complexity: 8/10
Strength: full-stack product with parsing, AI pipeline, charts, and secure API surface.
Weakness: persistence and background jobs are not fully productionized.

AI Integration: 8.5/10
Strength: explainable pipeline, confidence scores, advisor responses, and grounded fallbacks.
Weakness: needs live eval metrics for accuracy claims.

UI/UX: 8.5/10
Strength: polished fintech dashboard, clear navigation, loading states, and demo-first story.
Weakness: final screenshots and more mobile testing would help.

Scalability: 7/10
Strength: separated frontend/backend and service-oriented backend modules.
Weakness: in-memory rate limiting and sync file processing should become Redis/job queues.

Business Potential: 8.5/10
Strength: clear user value, recurring pain, and measurable savings.
Weakness: cancellation execution partnerships would improve monetization.

Presentation: 9/10
Strength: strong first 30 seconds, compelling numbers, and concrete demo flow.
Weakness: needs final visuals/screenshots in the deck.

## Prioritized Checklist

Critical before submission:
- Add final screenshots to README or slide deck.
- Verify deployed frontend can reach deployed backend through `NEXT_PUBLIC_API_URL`.
- Set a non-default `JWT_SECRET_KEY` for any production backend.
- Confirm Gemini key works on the demo machine, while keeping fallback demo mode ready.

High priority:
- Add a hosted demo URL and backend health URL to the README.
- Record a 60-90 second backup demo video.
- Add one sample CSV in `public` or docs for deterministic upload demos.
- Add rate limiting backed by Redis before public launch.

Medium priority:
- Add Playwright smoke tests for dashboard, advisor, upload, and navigation.
- Add screenshot placeholders to the pitch deck.
- Add database migrations and row-level authorization when persistence is enabled.
- Add OCR deployment notes for scanned PDFs.

Optional enhancements:
- "Today's Savings Tip" card on the dashboard.
- "Subscription Health Meter" by category.
- One-click before/after savings timeline.
- Calendar renewal reminders.
- Bank integration proof-of-concept.
