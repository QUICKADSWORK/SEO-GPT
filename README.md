# ⚡️ AI Multi-Blog Generator

Generate SEO-ready blog campaigns in batches with AI-written content, DALL·E 3 imagery, backlinks, and Word document exports — all from a single dashboard.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![React](https://img.shields.io/badge/React-18-61dafb)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3-38bdf8)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## ✨ Feature Highlights

- **Batch blog generation** — create 1-10 blogs simultaneously or import a CSV for bulk briefs.
- **Gemini-powered copy** — structured HTML output with meta tags, FAQ, backlinks, and keyword linking rules.
- **DALL·E 3 image pairs** — hero + inline visuals generated in parallel for every blog.
- **Live progress tracking** — per-blog job state, retries, and error surfacing.
- **Rich preview** — sanitized HTML preview with prompts, metadata, and backlinks.
- **One-click Word export** — combine every blog into a `.docx` file with embedded imagery, TOC, and pagination.
- **Responsive dashboard** — modern Tailwind design with glassmorphism and mobile support.

---

## 🏗️ Architecture

| Layer      | Technology | Notes |
|------------|------------|-------|
| Frontend   | Next.js 14 (App Router), React 18, Tailwind CSS, Zustand | SPA-like client components with server-rendered shell |
| Backend    | Next.js API Routes | Node runtime with rate limiting + AI orchestration |
| AI Content | Google Gemini 1.5 Pro | Structured JSON prompts for consistent HTML |
| AI Images  | OpenAI DALL·E 3 (`gpt-image-1`) | Generates featured + body images in parallel |
| Export     | `docx` + `node-html-parser` | Converts sanitized HTML + embeds images |

---

## 🚀 Quick Start

### 1. Prerequisites

- Node.js 18.17+ (or the version provided by Next.js 14)
- npm 9+
- API keys: [Google Gemini](https://aistudio.google.com/) and [OpenAI](https://platform.openai.com/)

### 2. Install & Run

```bash
git clone https://github.com/YOUR_ORG/multi-blog-generator.git
cd multi-blog-generator

cp .env.local.example .env.local
# Fill in GEMINI_API_KEY and OPENAI_API_KEY

npm install
npm run dev
```

Open http://localhost:3000 to access the dashboard.

---

## 🔐 Environment Variables

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Server-side key for Google Generative AI (content generation) |
| `OPENAI_API_KEY` | Server-side key for OpenAI image generation |
| `OPENAI_IMAGE_MODEL` *(optional)* | Override image model (defaults to `gpt-image-1`) |
| `GEMINI_MODEL` *(optional)* | Override content model (defaults to `gemini-1.5-pro-latest`) |
| `RATE_LIMIT_REQUESTS` *(optional)* | Requests per window per IP (default: 8) |
| `RATE_LIMIT_WINDOW_MS` *(optional)* | Window size in ms (default: 60000) |
| `NEXT_PUBLIC_MAX_PARALLEL` *(optional)* | Client-side concurrency limit for blog jobs (default: 3) |

When API keys are missing the app continues to work in demo mode: Gemini calls will fail, while the image service returns branded SVG placeholders.

---

## 🧭 Using the Dashboard

1. **Configure the brief**
   - Primary keyword (required) and optional secondary keywords
   - Tone, approximate word count, outline, and backlink URL
   - Queue multiple copies (1–10) or upload a CSV with per-blog parameters

2. **Launch generation**
   - Each blog spins up its own concurrent job
   - Live status chips show `Queued → Generating → Ready`
   - Failures display error messages with an inline retry button

3. **Review & refine**
   - Preview sanitized HTML alongside featured/body image prompts
   - Copy raw HTML, remove entries, or retry specific blogs

4. **Export to Word**
   - Click **“Export all blogs to Word”** for a `.docx` with:
     - Table of contents
     - Per-blog sections (H1/H2 hierarchy)
     - Embedded AI imagery + prompts
     - Automatic page breaks and metadata

### CSV Headers

```
primaryKeyword,secondaryKeywords,blogTitle,outline,wordCount,tone,backlinkUrl
```

`wordCount` must be 1000, 1500, or 2000; `tone` must be conversational | professional | technical | casual.

---

## 🛡️ Rate Limiting & Error Handling

- In-memory token bucket per IP (defaults: 8 requests / 60s)
- Descriptive error messages bubble to the UI with retry affordances
- Frontend concurrency can be tuned via `NEXT_PUBLIC_MAX_PARALLEL`

---

## 🧪 Development Scripts

```bash
npm run dev    # Start the Next.js dev server
npm run lint   # Run ESLint with Next.js config
npm run build  # Production build (auto-enables TypeScript checks)
npm run start  # Start production server (after build)
```

Tailwind utilities live in `app/globals.css`. State management uses `store/blogStore.ts` (Zustand).

---

## ☁️ Deployment

- **Vercel** — zero-config deployment (select Next.js app, set env vars)
- **Render / Railway / Fly.io** — use `npm run build` ➜ `npm run start`
- Ensure `GEMINI_API_KEY` and `OPENAI_API_KEY` are set in production environment

### Example Render Build Command

```
Build Command: npm install && npm run build
Start Command: npm run start
```

---

## 📝 Notes & Limitations

- The Google Gemini and OpenAI calls are not mocked; network access and billing apply.
- HTML post-processing enforces:
  - Two keyword hyperlinks after the intro paragraph
  - At least two backlinks to the provided URL
- `docx` export supports common elements (`h1-h3`, `p`, `ul/ol`, `aside`, `img`, `a`, emphasis). Complex HTML may be flattened.
- `npm audit` currently reports a critical vulnerability in a transient dependency. Run `npm audit fix --force` if your policies require a clean report.

---

## 📄 License

MIT — see [LICENSE](LICENSE) for details.

---

## 🙋 Support

- Issues & feature requests: open a GitHub issue
- Questions: start a discussion or reach out to the maintainers

Happy shipping! ⚙️✍️🖼️

