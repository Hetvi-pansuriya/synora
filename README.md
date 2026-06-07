# Synora — Matchmaker Dashboard

An internal matchmaking tool for TDC matchmakers to manage client profiles, track journeys, and suggest AI-scored matches.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 (Create React App) |
| Backend | FastAPI + Uvicorn |
| Database | SQLite via SQLAlchemy |
| AI | Google Gemini 2.5 Flash |
| Seed Data | Faker (en_IN locale) |

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- A Google Gemini API key ([get one free here](https://aistudio.google.com/app/apikey))

---

### Backend Setup

```bash
cd backend
```

Create a `.env` file:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the server:

```bash
uvicorn main:app --reload
```

The backend runs at `http://localhost:8000`.

On first run, the database is automatically seeded with **100 dummy profiles** (50 male, 50 female) and a matchmaker account.

---

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

The frontend runs at `http://localhost:3000`.

---

## Login Credentials

```
Username: matchmaker
Password: tdc123
```

---

## Features

- **Login** — Authenticated matchmaker session with protected routes
- **Dashboard** — Customer list with search, filter by status/gender/city, and summary stats
- **Customer Detail** — Full biodata across 3 tabs (Personal & Family, Career & Education, Lifestyle)
- **Status Tracking** — 7-stage pipeline: New Lead → Profile Verification → Active Matching → Meeting Scheduled → Follow Up → Matched → Closed
- **Notes** — Add, view, and delete timestamped notes per customer
- **Match Engine** — Gender-specific compatibility scoring (0–100) with strengths and concerns
- **AI Match Explanations** — Gemini generates a personalised 2-3 sentence rationale per match
- **AI Intro Emails** — Gemini drafts a personalised introduction email per match
- **Send Match Modal** — Review AI email, copy to clipboard, trigger mock send with confirmation toast
- **Analytics** — Profile stats and distribution charts
- **Reports** — Summary report view

---

## Project Structure

```
synora/
├── backend/
│   ├── main.py          # FastAPI routes (auth, customers, notes, matches, stats)
│   ├── matching.py      # Gender-specific scoring algorithm
│   ├── gemini.py        # AI explanation + intro email generation
│   ├── models.py        # SQLAlchemy models (Profile, Matchmaker, Note)
│   ├── seed.py          # 100-profile seeder using Faker
│   ├── database.py      # DB engine and session
│   ├── schemas.py       # Pydantic schemas
│   └── requirements.txt
└── frontend/
    └── src/
        ├── App.jsx
        ├── components/
        │   ├── LoginPage.jsx
        │   ├── Dashboard.jsx
        │   ├── CustomerDetail.jsx
        │   ├── MatchesView.jsx
        │   ├── MatchCard.jsx
        │   ├── SendMatchModal.jsx
        │   ├── NoteSection.jsx
        │   ├── FilterBar.jsx
        │   ├── Analytics.jsx
        │   ├── Reports.jsx
        │   └── ...
        └── config.js    # API base URL
```

---

## Matching Logic Summary

**Male customers** — scored on: Religion/Caste (25 pts), Life Goals (20 pts), Lifestyle (15 pts), Career/Income (15 pts — candidate earns ≤ customer scores highest), Family Values (15 pts), Location (10 pts).

**Female customers** — scored on: Life Goals & Emotional Alignment (25 pts), Religion/Caste (20 pts), Career & Financial Stability (20 pts — candidate earns ≥ customer scores highest), Lifestyle (15 pts), Family Values (10 pts), Location (10 pts).

Hard filters run first: opposite gender, age preference range, marital status. Top 10 results returned sorted by score.

---

## Environment Variables

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Google Gemini API key (required for AI features) |

> The backend falls back to a static template if the Gemini API is unavailable, so the app works without AI too.
