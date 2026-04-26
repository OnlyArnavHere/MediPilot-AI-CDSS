# AI-CDSS Run Guide

This project is a local-first AI-powered Clinical Decision Support System built with:
- React + Vite
- Tailwind CSS
- Framer Motion
- Google Gemini API via Netlify Function

## 1. Prerequisites

Install these first:

1. Node.js 18+ (Node 20+ recommended)
2. npm (comes with Node)
3. Netlify CLI for local function testing

Check versions:

```powershell
node -v
npm -v
ollama --version
```

## 2. Install Dependencies

From project root (`BM_CDSS`):

```powershell
npm install
```

## 3. Configure Gemini

1. Create a local `.env` file from `.env.example`.
2. Add your Gemini API key:

```powershell
GEMINI_API_KEY=your_google_gemini_api_key_here
```

3. Ensure the key is available to Netlify Functions when you deploy.

## 4. Run the Web App

For local frontend-only development:

```powershell
npm run dev
```

Vite will print a local URL (usually):
- `http://localhost:5173`

Open it in your browser.

For local Netlify testing with the function:

```powershell
npx netlify dev
```

## 5. How to Use the App

1. Step 1: Enter patient demographics.
2. Step 2: Select symptoms, duration, and severity.
3. Click **Generate AI Assessment**.
4. Step 3: Review triage/report output.

## 6. Build for Production

Create production build:

```powershell
npm run build
```

Preview production build locally:

```powershell
npm run preview
```

## 7. Troubleshooting

### A. `Failed to fetch` / API error

Cause: Gemini API key is missing, invalid, or the function cannot reach the API.

Fix:
1. Check `GEMINI_API_KEY`.
2. Redeploy after changing Netlify environment variables.
3. Retry assessment.

### B. Empty AI report

Cause: Gemini returned an empty or unexpected response.

Fix:
1. Retry generation.
2. Check Netlify function logs.
3. Confirm the model name is valid.

### C. Port conflict on `5173`

Vite may auto-switch ports. Use displayed URL in terminal.

### D. Build issues

Try clean reinstall:

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
npm run build
```

## 8. Deployment Notes (Frontend)

You can deploy the frontend free on:
- Netlify
- GitHub Pages

Important:
1. Netlify is the better fit because the Gemini API call now runs in a Netlify Function.
2. GitHub Pages is static-only and would not keep the Gemini key private.
3. Set `GEMINI_API_KEY` in Netlify environment variables before deploy.

## 9. Quick Command Summary

```powershell
npm install
npx netlify dev
npm run dev
```

