# Vesper — AI Chatbot

A production-grade AI chat app powered by Claude. Dark, fast, direct.

## Stack

- **Frontend**: React + Vite (deploys as static site)
- **Backend**: Node.js + Express (proxies Anthropic API)
- **Hosting**: Render.com (free tier)

---

## Local Development

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/vesper.git
cd vesper
```

### 2. Set up the backend

```bash
cd server
cp ../.env.example .env
# Edit .env — add your ANTHROPIC_API_KEY
npm install
npm run dev
```

### 3. Set up the frontend

In a new terminal:

```bash
cd client
npm install
# Create a .env.local file:
echo "VITE_API_URL=http://localhost:3001" > .env.local
npm run dev
```

Open http://localhost:5173

---

## Deploy to Render

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "init"
git remote add origin https://github.com/YOUR_USERNAME/vesper.git
git push -u origin main
```

### Step 2 — Deploy the backend

1. Go to [render.com](https://render.com) → New → Web Service
2. Connect your GitHub repo
3. Settings:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Runtime**: Node
4. Add environment variables:
   - `ANTHROPIC_API_KEY` → your key from [console.anthropic.com](https://console.anthropic.com)
   - `NODE_ENV` → `production`
5. Deploy. Copy the service URL (e.g. `https://vesper-backend.onrender.com`)

### Step 3 — Deploy the frontend

1. New → Static Site
2. Connect the same repo
3. Settings:
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Add environment variable:
   - `VITE_API_URL` → your backend URL from Step 2 (no trailing slash)
5. Deploy.

### Step 4 — Set ALLOWED_ORIGINS on the backend

1. Go to your backend service → Environment
2. Add: `ALLOWED_ORIGINS` → your frontend URL (e.g. `https://vesper-frontend.onrender.com`)
3. Save — backend will redeploy automatically.

---

## Environment Variables Reference

| Variable | Service | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | Backend | Your Anthropic API key |
| `ALLOWED_ORIGINS` | Backend | Frontend URL for CORS (comma-separated for multiple) |
| `PORT` | Backend | Port (Render sets this automatically) |
| `VITE_API_URL` | Frontend | Full URL of your backend service |

---

## Notes

- Free tier Render services spin down after 15min of inactivity. First message after idle may take ~30s.
- The API key is **only** on the backend — never exposed to the browser.
- To change Vesper's personality, edit `SYSTEM_PROMPT` in `server/server.js`.
