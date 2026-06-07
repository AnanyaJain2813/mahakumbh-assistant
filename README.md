# Mahakumbh Assistant - Production Repository

This repository is a cleaned, fixed, and upgraded full-stack version of the pilgrim assistant project. It includes a FastAPI backend, a Next.js frontend, interactive UI improvements, and a live OpenStreetMap-based example focused on Ujjain pilgrimage landmarks.

## What was improved

- Fixed backend import path issue in `main.py`
- Fixed invalid Python typing/import issue in `emergency.py`
- Fixed invalid Pydantic boolean example usage
- Added missing `globals.css`
- Fixed Next.js page directive issue (`'use html'` removed)
- Added `autoprefixer` to frontend devDependencies
- Added live Leaflet map integration with OpenStreetMap tiles
- Added Ujjain landmark examples: Mahakaleshwar Temple, Ram Ghat, Dutt Akhada Ghat, Harsiddhi Temple
- Improved UI layout for desktop + mobile use
- Preserved multilingual chat + SOS interaction flow

## Directory tree

```text
mahakumbh-assistant/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   └── routers/
│   │       ├── __init__.py
│   │       ├── ai_assistant.py
│   │       └── emergency.py
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
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── next.config.mjs
└── README.md
```

## Backend setup

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

## Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`.

## Live map note

The map uses OpenStreetMap tiles through Leaflet and includes real-location examples for Ujjain. This is a demonstration-ready integration for a more realistic pilgrimage navigation experience.

## Suggested next upgrades

- Add real geolocation permission and live user position marker
- Connect backend to live crowd, weather, or event APIs
- Add route optimization from current location to selected ghat
- Add admin dashboard for incident monitoring
- Add offline tile caching/PWA worker for poor network conditions
