# MediPilot AI-CDSS

AI-Based Clinical Decision Support System (AI-CDSS) web app.

## Stack

- React + Vite
- Tailwind CSS
- Framer Motion
- Google Gemini API via Netlify Function

## Run Locally

1. Install dependencies:
   - `npm install`
2. Add your Gemini API key for local Netlify functions:
   - copy `.env.example` to `.env`
   - set `GEMINI_API_KEY=...`
3. Start the app with Netlify locally:
   - `npx netlify dev`
4. Or start the frontend only:
   - `npm run dev`

Detailed setup and troubleshooting:
- See `RUN_STEPS.md`
