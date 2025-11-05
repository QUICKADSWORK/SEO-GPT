'use client';

import { useCallback, useState } from 'react';
import { GeneratorForm } from '@/components/GeneratorForm';
import { ProgressPanel } from '@/components/ProgressPanel';
import { BlogPreviewList } from '@/components/BlogPreviewList';
import { ExportButton } from '@/components/ExportButton';
import { useBlogStore } from '@/store/blogStore';
import { BlogGenerationRequest, GeneratedBlog } from '@/types/blog';

const MAX_CONCURRENT = Number(process.env.NEXT_PUBLIC_MAX_PARALLEL || 3);

type ApiGeneratedBlog = Omit<GeneratedBlog, 'id'> & { id: string };

const createTaskLabel = (payload: BlogGenerationRequest, index: number) =>
  payload.blogTitle ?? `${payload.primaryKeyword} #${index + 1}`;

const mapApiBlog = (taskId: string, apiBlog: ApiGeneratedBlog): GeneratedBlog => ({
  ...apiBlog,
  id: taskId
});

export default function DashboardPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const addTask = useBlogStore((state) => state.addTask);
  const updateTaskStatus = useBlogStore((state) => state.updateTaskStatus);
  const addBlog = useBlogStore((state) => state.addBlog);

  const handleGenerate = useCallback(
    async (payloads: BlogGenerationRequest[]) => {
      if (!payloads.length) return;

        setIsGenerating(true);
        try {
          const jobs = payloads.map((payload, index) => {
            const taskId = crypto.randomUUID();
            addTask({ id: taskId, label: createTaskLabel(payload, index), status: 'queued' });

            return async () => {
              try {
                updateTaskStatus(taskId, 'generating');
                const response = await fetch('/api/generate', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload)
                });

                if (!response.ok) {
                  const errorPayload = await response.json().catch(() => null);
                  const message = errorPayload?.error ?? 'Generation failed';
                  throw new Error(message);
                }

                const apiBlog: ApiGeneratedBlog = await response.json();
                const blog = mapApiBlog(taskId, apiBlog);
                addBlog(blog);
              } catch (error) {
                updateTaskStatus(taskId, 'failed', (error as Error).message);
              }
            };
          });

          let cursor = 0;
          const concurrency = Math.max(1, Math.min(MAX_CONCURRENT, jobs.length));

          const runWorker = async () => {
            while (cursor < jobs.length) {
              const current = cursor;
              cursor += 1;
              await jobs[current]!();
            }
          };

          await Promise.all(Array.from({ length: concurrency }, runWorker));
        } finally {
          setIsGenerating(false);
        }
    },
    [addBlog, addTask, updateTaskStatus]
  );

  const handleRetry = useCallback(
    async (blog: GeneratedBlog) => {
      const retryPayload: BlogGenerationRequest = {
        primaryKeyword: blog.primaryKeyword,
        secondaryKeywords: blog.secondaryKeywords,
        blogTitle: blog.title,
        outline: undefined,
        wordCount: blog.wordCount,
        tone: blog.tone,
        backlinkUrl: blog.backlinkUrl
      };

      await handleGenerate([retryPayload]);
    },
    [handleGenerate]
  );

  return (
    <main className="gradient-bg pb-24">
      <section className="mx-auto max-w-6xl px-6 pb-12 pt-20">
        <header className="max-w-3xl space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-brand-600 shadow-subtle">
            AI Content Ops
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Generate production-ready blog campaigns with AI content and imagery in a single click.
          </h1>
          <p className="text-lg text-slate-600">
            Upload a CSV or tailor a single brief, run Gemini + DALL·E in parallel, preview rich HTML output, and export a polished Word document with embedded assets.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
            <span>• Google Gemini content engine</span>
            <span>• DALL·E 3 image pair per blog</span>
            <span>• Automated backlink placement</span>
            <span>• Batch docx export with TOC</span>
          </div>
          <div className="pt-4">
            <ExportButton />
          </div>
        </header>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
          <GeneratorForm onGenerate={handleGenerate} isGenerating={isGenerating} />
          <ProgressPanel />
        </div>

        <section className="mt-16 space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Generated blogs</h2>
              <p className="text-sm text-slate-500">Review AI content, imagery prompts, and metadata before exporting.</p>
            </div>
          </div>

          <BlogPreviewList onRetry={handleRetry} />
        </section>
      </section>
    </main>
  );
}
