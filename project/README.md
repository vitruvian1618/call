# AI Call Center Test Platform

Minimal, production-ready demo for a call center interview flow with local file storage, Soniox STT, OpenAI TTS, and OpenAI function-calling NLU.

## Project layout
```
project/
  backend/    # Express + TypeScript API
  frontend/   # React 18 + Vite UI
  data/       # Local storage for interviews (gitignored)
```

## Backend

### Setup
1. Copy `backend/.env.example` to `backend/.env` and fill in values:
```
PORT=3001
OPENAI_API_KEY=your-openai-api-key
SONIOX_API_KEY=your-soniox-api-key
CLIENT_URL=http://localhost:5173
```

2. Install dependencies and run the API:
```bash
cd project/backend
npm install
npm run dev
```

> If you previously installed dependencies with the old `ts-node-dev` runner, delete `backend/node_modules` and reinstall so `npm run dev` uses the ESM loader (`node --watch --loader ts-node/esm src/index.ts`).

### API endpoints
- `POST /api/interviews/start` – begin an interview, returns interview ID and first question with pre-generated TTS audio URL (falls back gracefully with a warning if TTS is unavailable).
- `POST /api/interviews/:id/answer` – submit a single `audio` file (FormData) and `questionId`; returns transcript, mapped codes, and next question (with TTS) or completion status.
- `POST /api/tts` – synthesize arbitrary text to audio/mpeg.
- `POST /api/stt` – debug endpoint to transcribe a single `audio` upload.

Interviews are saved as JSON files under `data/interviews` when completed.

## Frontend

### Setup
```bash
cd project/frontend
npm install
npm run dev
```
The UI expects the backend at `http://localhost:3001/api` unless `VITE_API_URL` is set.

### Flow
- Click **Start Test Interview** to fetch the first question and auto-play its TTS.
- Record an answer; one WebM/Opus blob is uploaded per question under the `audio` form field.
- Transcripts and mapped codes display live; interview ends after the final question.

## Notes
- Node.js v20 LTS recommended.
- No database required; all state persists via local JSON files.
- Do not commit real API keys; `backend/.env` is ignored by git.
