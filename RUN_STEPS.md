# AI-CDSS Run Guide

This project is a local-first AI-powered Clinical Decision Support System built with:
- React + Vite
- Tailwind CSS
- Framer Motion
- Ollama local API (`http://localhost:11434/api/generate`)

## 1. Prerequisites

Install these first:

1. Node.js 18+ (Node 20+ recommended)
2. npm (comes with Node)
3. Ollama

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

## 3. Start Ollama

1. Start the Ollama service/app.
2. Pull the required model:

```powershell
ollama pull llama3
```

3. (Optional test) confirm generation works:

```powershell
ollama run llama3
```

4. Ensure the API is reachable at:
- `http://localhost:11434`

## 4. Run the Web App

Start development server:

```powershell
npm run dev
```

Vite will print a local URL (usually):
- `http://localhost:5173`

Open it in your browser.

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

Cause: Ollama is not running or model not available.

Fix:
1. Start Ollama.
2. Run:
   ```powershell
   ollama pull llama3
   ```
3. Retry assessment.

### B. Empty AI report

Cause: model returned empty response.

Fix:
1. Retry generation.
2. Check Ollama terminal logs.
3. Confirm enough system memory is available.

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
- Vercel
- Netlify

Important:
1. Hosted frontend cannot directly call your local Ollama on `localhost`.
2. For deployed usage, host a backend/API bridge where Ollama is reachable from that backend.
3. For purely local usage, no backend changes are needed.

## 9. Quick Command Summary

```powershell
npm install
ollama pull llama3
npm run dev
```

