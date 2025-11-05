# AI Multi-Blog Generator – Deployment Guide 🚀

This guide walks through deploying the Next.js + AI workload to popular platforms. The app ships a Node/React frontend, server-side API routes, and integration with Google Gemini + OpenAI DALL·E 3.

---

## ✅ Pre-Deployment Checklist

- [ ] Acquire API keys for **Google Gemini** and **OpenAI**
- [ ] Populate `.env.local` (or provider-specific secret store)
- [ ] Verify local build `npm run build`
- [ ] Confirm linting passes `npm run lint`

---

## 🌐 Environment Variables

| Key | Required | Description |
|-----|----------|-------------|
| `GEMINI_API_KEY` | ✅ | Used on the server to call Gemini for blog generation |
| `OPENAI_API_KEY` | ✅ | Used on the server to call DALL·E 3 / `gpt-image-1` |
| `OPENAI_IMAGE_MODEL` | ⛔ optional | Override image model (default `gpt-image-1`) |
| `GEMINI_MODEL` | ⛔ optional | Override content model (default `gemini-1.5-pro-latest`) |
| `RATE_LIMIT_REQUESTS` | ⛔ optional | Requests per minute per IP (default 8) |
| `RATE_LIMIT_WINDOW_MS` | ⛔ optional | Rate-limit window in milliseconds (default 60000) |
| `NEXT_PUBLIC_MAX_PARALLEL` | ⛔ optional | Client-side concurrent jobs (default 3) |

> Store API keys in the hosting platform’s secret manager. Never commit them.

---

## 🚀 Option 1 — Vercel (Recommended)

1. **Import Project**
   - Go to [vercel.com/import](https://vercel.com/import) and connect your GitHub/GitLab repo.

2. **Configure Build**
   - Framework preset: **Next.js**
   - Build command: `npm run build`
   - Output directory: `.next`

3. **Set Environment Variables**
   - Add `GEMINI_API_KEY`, `OPENAI_API_KEY`, plus any optional overrides.

4. **Deploy**
   - Press deploy. Vercel handles automatic builds on subsequent pushes.

5. **Image Domains (Optional)**
   - DALL·E returns base64 strings, so no extra configuration is required. If you change to remote URLs, configure `next.config.mjs` `images.remotePatterns` accordingly.

---

## ☁️ Option 2 — Render.com

Render configuration file `render.yaml` is included:

```yaml
services:
  - type: web
    name: ai-multi-blog-generator
    env: node
    plan: free
    buildCommand: "npm install && npm run build"
    startCommand: "npm run start"
    envVars:
      - key: GEMINI_API_KEY
        sync: false
      - key: OPENAI_API_KEY
        sync: false
      - key: NEXT_PUBLIC_MAX_PARALLEL
        value: "3"
```

Steps:

1. Push the repository to GitHub/GitLab.
2. In Render, choose **New → Web Service** and import the repo.
3. Render reads `render.yaml`, provisions the service, and prompts for environment variables.
4. Click deploy. Render runs `npm run build`, then `npm run start` on a Node runtime.

> Update `plan` if you need more resources than the free tier.

---

## ☁️ Option 3 — Railway

1. Create a new Railway project and select “Deploy from GitHub”.
2. Set the following in **Variables**:
   - `GEMINI_API_KEY`
   - `OPENAI_API_KEY`
   - Optionally `NEXT_PUBLIC_MAX_PARALLEL`
3. In the **Service Settings**, override build/start commands if needed:
   - Build: `npm install && npm run build`
   - Start: `npm run start`
4. Deploy. Railway provisions a Node environment automatically.

---

## 🧰 Option 4 — Docker + Any Cloud

Create a `Dockerfile` (not included by default) similar to:

```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY package.json package-lock.json* ./
RUN npm install --omit=dev
EXPOSE 3000
CMD ["npm", "run", "start"]
```

This image can be deployed to AWS ECS/Fargate, Google Cloud Run, Azure Container Apps, Fly.io, etc. Remember to inject environment variables via each platform’s secrets system.

---

## 💻 Option 5 — Self-Hosted (PM2 or systemd)

1. Provision a Node 18+ server.
2. Copy the repository to the server.
3. Run:

   ```bash
   npm install
   npm run build
   npm install -g pm2
   pm2 start npm --name blog-generator -- run start
   pm2 save
   ```

4. Configure a reverse proxy (NGINX/Caddy) to forward traffic to `localhost:3000`.
5. Place secrets in `/etc/environment` or a systemd unit file:

   ```ini
   [Service]
   Environment="GEMINI_API_KEY=..."
   Environment="OPENAI_API_KEY=..."
   ```

---

## 🔐 Security & Compliance

- Rotate API keys regularly.
- Enforce HTTPS in production via your hosting provider.
- Monitor AI usage quotas and costs.
- Consider adding authentication or request quotas before exposing to end users.
- Update dependencies periodically (`npm audit fix --force` may be required to clear transient vulnerabilities).

---

## 🧪 Post-Deployment Smoke Test

1. Load the dashboard in production.
2. Generate a single blog with a small word count to verify Gemini + DALL·E connectivity.
3. Confirm progress tracking transitions `Queued → Generating → Ready`.
4. Export to Word and ensure the `.docx` contains text, meta, and both images.

---

## 🛠 Troubleshooting

| Issue | Fix |
|-------|-----|
| Build fails (`Module not found: docx` etc.) | Ensure `npm install` ran successfully and lockfile is present |
| 500 errors from `/api/generate` | Check rate limits, verify API keys, inspect server logs |
| DALL·E image failures | Confirm the OpenAI key has image API access; fallback SVGs appear if key is missing |
| Gemini quota exceeded | Reduce batch size, add retries, or upgrade quota |
| Exports missing images | Verify image data URI size is within docx limits (default transformation uses 512×320) |

---

## 📦 Rolling Updates

1. Merge changes into your main branch.
2. Hosting platform rebuilds automatically (or trigger manually).
3. Monitor logs for AI API errors after rollout.

---

Happy launching! 🌍✍️🖼️

