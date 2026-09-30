# Prompt Lab

Chat-first AI prompt generator. Describe your vision, pick a model (Midjourney, Flux, SDXL, Veo, Kling, Sora, …), optionally attach a reference image/video, and get a copy-ready prompt engineered for that model.

Built for **Derek Yigo** ([@Derick-UX-rbg](https://github.com/Derick-UX-rbg)).

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS 4
- Google Gemini (`@google/generative-ai`) for chat + vision
- Deployable on Render as a Node web service

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing — hero, how it works, model chips, CTA |
| `/lab` | Main app — model selector, chat agent, attachments, copy prompt |
| `POST /api/chat` | Chat API (messages, modelId, optional image base64) |
| `GET /api/status` | Whether `GEMINI_API_KEY` is configured |

## Setup

```bash
npm install
cp .env.example .env.local
# Edit .env.local and set GEMINI_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Without a key, the Lab still runs in **demo mode** with mock prompts and a clear setup banner.

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | For live AI | Google AI Studio / Gemini API key. Kept server-side only. |

## Scripts

```bash
npm run dev      # local development
npm run build    # production build
npm start        # start production server (Render uses this)
```

## Deploy on Render

1. Connect the GitHub repo to Render.
2. Create a **Web Service**:
   - **Runtime:** Node
   - **Build command:** `npm install && npm run build`
   - **Start command:** `npm start`
   - **Plan:** Free or Starter
3. Add env var `GEMINI_API_KEY` in the Render dashboard.
4. Deploy. URL will be `https://<service-name>.onrender.com`.

Or use the Render MCP / Blueprint with the same build & start commands.

## How chat + models + refs work

1. **Model selector** (sidebar) — Image vs Video groups. Switching after a final prompt offers a one-click **Rewrite** for the new model’s syntax.
2. **Chat** — Agent asks clarifying questions when the brief is vague, then emits a ` ```prompt` ` block with a Copy button.
3. **Reference image** — Sent as base64 to Gemini vision.
4. **Reference video** — Client extracts a first-frame still (when possible) plus filename/notes for the agent.

## License

Private / proprietary unless otherwise stated by the owner.
