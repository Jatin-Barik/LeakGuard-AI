# LeakGuard AI

**Stop Losing Money You Didn't Know You Were Spending.**

AI-powered subscription leak detection platform that analyzes bank statements, detects recurring payments, identifies unnecessary subscriptions, and recommends actions to save money.

## Tech Stack

### Frontend
- **Next.js 15+** (App Router, TypeScript)
- **Tailwind CSS v4** with custom dark fintech theme
- **Shadcn UI** components (Radix primitives)
- **Framer Motion** for animations
- **Recharts** for analytics
- **Lucide React** icons

### Backend
- **FastAPI** (Python)
- **Google Gemini API** for AI analysis
- **Supabase** (PostgreSQL + Storage) — ready to integrate

## Features

- 🔐 Authentication (Google Login ready)
- 📤 Upload Center (PDF, CSV, Excel, SMS, Email)
- 🤖 AI Transaction Parser & Categorization
- 🔄 Recurring Payment Detection
- 📊 Leak Score (0-100) with reasoning
- 💬 AI Financial Advisor Chat
- 📈 Price Hike Detection
- 🔁 Duplicate Subscription Detection
- 💰 Annual Savings Prediction
- ✨ AI Recommendations (Cancel, Downgrade, Negotiate)
- 📉 Analytics Dashboard with Charts
- 🔍 Smart Search
- 📄 Export (PDF, CSV, Share)

## Quick Start

### Frontend

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Set `GOOGLE_GEMINI_API_KEY` for live AI features.

## Demo Mode

The app works out of the box with rich demo data — no API keys required for the hackathon demo. Navigate to `/dashboard` to explore all features.

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── dashboard/        # Main dashboard
│   ├── upload/           # Upload center
│   ├── subscriptions/    # Subscription management
│   ├── analytics/        # Charts & analytics
│   ├── advisor/          # AI chat advisor
│   ├── recommendations/  # AI recommendations
│   ├── export/           # Report export
│   └── api/              # Next.js API routes
├── components/
│   ├── ui/               # Shadcn UI components
│   ├── dashboard/        # Dashboard widgets
│   ├── charts/           # Recharts components
│   ├── layout/           # Shell, sidebar, header
│   ├── upload/           # Upload components
│   └── advisor/          # AI chat components
├── config/               # Site configuration
├── hooks/                # Custom React hooks
├── lib/                  # Utils & demo data
├── services/             # API client
└── types/                # TypeScript types

backend/
├── app/
│   ├── api/routes/       # FastAPI endpoints
│   ├── services/         # AI & parser services
│   ├── prompts/          # AI prompt templates
│   └── core/             # Configuration
└── requirements.txt
```

## Deployment

- **Frontend**: Vercel
- **Backend**: Railway or Render

## License

MIT — Built for National Level Hackathon 2026
