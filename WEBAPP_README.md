# 🎯 AI Multi-Blog Generator – Product Guide

Modern dashboard for generating batches of SEO-optimized blog posts with AI-written content, DALL·E 3 imagery, automated backlinks, and `.docx` export.

![Status](https://img.shields.io/badge/status-production_ready-green)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![React](https://img.shields.io/badge/React-18-61dafb)

---

## ✨ Core Capabilities

- **Parallel blog generation** (1–10 items or CSV upload)
- **Google Gemini content orchestration** with enforced structure, meta tags, FAQs, and backlink rules
- **OpenAI DALL·E 3 imagery** (featured + inline) with prompts returned for transparency
- **Live job tracking** with retry, removal, and error handling
- **Rich preview** with sanitized HTML, meta blocks, and image cards
- **Export to Word** with TOC, page breaks, embedded images, and prompt references

---

## 🧠 Workflow Overview

1. **Brief Input**
   - Primary keyword (required)
   - Secondary keywords (comma separated)
   - Optional blog title + outline
   - Tone (conversational, professional, technical, casual)
   - Word count target (1000 / 1500 / 2000)
   - Backlink URL (required)
   - Number of blogs (1–10) or CSV import with column headers:

     ```csv
     primaryKeyword,secondaryKeywords,blogTitle,outline,wordCount,tone,backlinkUrl
     ```

2. **Generation Engine**
   - Client batches jobs using `p-limit`
   - Next.js API route validates payloads via `zod`
   - Gemini prompt enforces HTML article output and structured JSON
   - Post-processing (`enhanceBlogHtml`) guarantees keyword links + backlinks
   - DALL·E prompts fetched from Gemini output and executed in parallel
   - Responses merged into a single `GeneratedBlog` object per item

3. **Preview & Iteration**
   - Prose-styled preview (Tailwind typography)
   - Image prompt cards with base64 previews
   - Metadata panel (title, description, keywords)
   - Quick actions: copy HTML, retry, remove

4. **Export**
   - `docx` builder converts HTML to Word sections
   - Table of contents + timestamp
   - Embedded featured/body images with prompts beneath

---

## 🛠️ Tech Stack

| Layer | Library / Service | Notes |
|-------|-------------------|-------|
| UI | Next.js App Router, React 18, Tailwind CSS, Inter font | Client components for interactivity |
| State | Zustand | Tracks generated blogs, export status, task list |
| Validation | zod + `@hookform/resolvers` | Shared schema between frontend + backend |
| CSV | Papa Parse | Client-side CSV ingestion |
| AI – Content | `@google/generative-ai` | Gemini 1.5 Pro JSON responses |
| AI – Images | `openai` | `gpt-image-1` DALL·E 3 images, base64 encoded |
| Export | `docx`, `node-html-parser` | Converts sanitized HTML to Word sections |
| Rate limiting | Custom token bucket | 8 req/min per IP by default |

---

## 🧪 Local Development

```bash
npm install            # install dependencies
cp .env.local.example .env.local
# add GEMINI_API_KEY and OPENAI_API_KEY
npm run dev           # start Next.js dev server
```

Visit http://localhost:3000

Helpful scripts:

```bash
npm run lint          # ESLint via Next.js config
npm run build         # Production build + type check
npm run start         # Run production server (after build)
```

---

## 📁 Key Directories

```
app/                     # Next.js pages and layouts
├── page.tsx             # Dashboard entry point (client component)
├── api/generate/        # Blog generation API route

components/              # Client UI components
├── GeneratorForm.tsx
├── ProgressPanel.tsx
├── BlogPreviewList.tsx
├── ExportButton.tsx

lib/
├── ai/                  # Gemini + DALL·E helpers
├── html/                # HTML post-processing
├── export/docx.ts       # Word export builder
├── rateLimit.ts         # Token bucket implementation

store/                   # Zustand store definitions
types/                   # Shared TypeScript interfaces
```

---

## 🔐 Environment Variables

See `.env.local.example`.

- `GEMINI_API_KEY`
- `OPENAI_API_KEY`
- Optional overrides (`OPENAI_IMAGE_MODEL`, `GEMINI_MODEL`, `RATE_LIMIT_*`, `NEXT_PUBLIC_MAX_PARALLEL`)

If AI keys are omitted, image generation falls back to SVG placeholders; Gemini requests will fail with descriptive messaging.

---

## 🧭 User Experience

1. **Configure** keyword brief or import CSV.
2. **Generate** – observe progress tracker update per blog (`Queued → Generating → Ready`).
3. **Review** HTML output + meta + prompts; retry failures individually.
4. **Export** all finished blogs to `.docx` (table of contents + page breaks included).

---

## 📦 Deployment Cheatsheet

### Vercel
- Framework preset: Next.js
- Build: `npm run build`
- Start: (managed by Vercel)
- Add env vars via dashboard

### Render.com
- Provided `render.yaml` sets Node environment, build/start commands, and env var placeholders

### Heroku / Railway / Fly.io
- Build: `npm install && npm run build`
- Start: `npm run start`
- Use the included `Procfile` (`web: npm run start`)

Refer to `WEBAPP_DEPLOYMENT.md` for detailed steps and Docker option.

---

## 🛡️ Security & Limits

- Token bucket rate limiting (default 8 requests per minute per IP)
- HTML sanitization via DOMPurify before rendering
- Additional backlink enforcement ensures compliance with SEO requirements
- Consider protecting the `/api/generate` route with authentication if exposed publicly

---

## 🧩 Extensibility Ideas

- Persist generated blogs to a database (Supabase / Firebase)
- Upload exported Word docs to cloud storage
- Adjustable image sizes / styles per blog
- Role-based access controls and request quotas
- Streaming status updates via server-sent events or websockets

---

## 📝 License

MIT (see `LICENSE`).

---

For more details, see the main `README.md`, `QUICKSTART.md`, and `WEBAPP_DEPLOYMENT.md`.

