# 🚀 Quick Start – AI Multi-Blog Generator

Launch the Next.js dashboard locally, configure your AI keys, and generate full campaigns in minutes.

---

## 1. Clone & Install

```bash
git clone https://github.com/YOUR_ORG/multi-blog-generator.git
cd multi-blog-generator

cp .env.local.example .env.local
# Fill in GEMINI_API_KEY and OPENAI_API_KEY

npm install
```

> Need keys? Gemini: https://aistudio.google.com — OpenAI: https://platform.openai.com/account/api-keys

---

## 2. Run the App

```bash
npm run dev
```

Visit **http://localhost:3000** to open the dashboard.

---

## 3. Generate Blogs

1. Enter the primary keyword, optional secondary keywords, outline, tone, and backlink URL.
2. Choose a target word count (1000 / 1500 / 2000 words).
3. Set the number of blogs (1–10) **or** upload a CSV with per-blog details.
4. Click **Generate**. Jobs run in parallel; track progress live.
5. Review the HTML preview, image prompts, and metadata for each blog.
6. Export everything to a `.docx` file when you’re ready.

CSV headers: `primaryKeyword,secondaryKeywords,blogTitle,outline,wordCount,tone,backlinkUrl`

---

## 4. Essential Commands

```bash
npm run lint    # ESLint + Next.js config
npm run build   # Production build with type-checking
npm run start   # Run production server
```

---

## 5. Deploy in Minutes

- **Vercel** – import repo, set environment variables, deploy.
- **Render / Railway / Fly.io** – build with `npm run build`, start with `npm run start`.
- Ensure `GEMINI_API_KEY` and `OPENAI_API_KEY` are defined in the hosting platform.

See `WEBAPP_DEPLOYMENT.md` for a detailed walkthrough.

---

## Project Layout

```
📁 multi-blog-generator
├── app/                     # Next.js app router + pages
├── components/              # Client components (forms, previews, export)
├── lib/                     # AI clients, rate limiting, docx helpers
├── store/                   # Zustand state containers
├── types/                   # Shared TypeScript types
├── public/                  # Static assets (if needed)
├── package.json             # Scripts & dependencies
└── .env.local.example       # Environment variable template
```

---

Need more detail? Dive into `README.md` for architecture + feature deep dive.

Happy publishing! ✍️🖼️

