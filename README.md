# KumbhMantra Pro

KumbhMantra Pro is a full-stack Mahakumbh command OS demo for pilgrim assistance, route guidance, emergency dispatch, multilingual chat, live map visualization, and operational telemetry.

It is built to be easy to run locally and easy to publish on GitHub: a Next.js frontend, a FastAPI backend, deterministic assistant logic, OpenStreetMap/Leaflet map rendering, and documented API routes.

## Features

- Multilingual assistant for snan dates, routes, medical help, lost-and-found, and SOS guidance
- Real-time command dashboard with crowd, route, health, and mesh telemetry
- Leaflet map with Sangam demo points, inbound route, outbound route, and emergency radius
- One-tap SOS workflow with a structured response ticket
- FastAPI docs at `/docs`
- GitHub-ready folder structure, `.gitignore`, env examples, and Docker Compose

## Project Structure

```text
kumbhmantra-pro/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   └── routers/
│   │       ├── ai_assistant.py
│   │       ├── emergency.py
│   │       └── intelligence.py
│   ├── .env.example
│   └── requirements.txt
├── frontend/
│   ├── public/
│   │   └── manifest.json
│   ├── src/
│   │   ├── app/
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   └── components/
│   │       └── LiveMap.tsx
│   ├── .env.example
│   ├── next.config.mjs
│   └── package.json
├── docker-compose.yml
├── .gitignore
└── README.md
```

## Run Locally

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Backend health check:

```bash
curl http://127.0.0.1:8000/
```

API docs:

```text
http://127.0.0.1:8000/docs
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

The frontend proxies `/api/v1/*` calls to `http://127.0.0.1:8000/api/v1/*` through `frontend/next.config.mjs`.

## Docker Compose

```bash
docker compose up
```

Then open `http://localhost:3000`.

## API Overview

- `GET /` - API health and version metadata
- `POST /api/v1/assistant/chat` - deterministic assistant response and action cards
- `POST /api/v1/emergency/sos` - create a simulated emergency dispatch ticket
- `GET /api/v1/intelligence/snapshot` - telemetry snapshot for dashboards

## Notes

This is a production-style demo, not a real emergency system. For real deployment, connect verified GIS feeds, official mela schedules, authenticated emergency dispatch systems, monitoring, audit logs, rate limits, and secure user identity flows.
