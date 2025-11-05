'use client';

import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import Papa from 'papaparse';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { BlogGenerationRequest, BlogCsvRow } from '@/types/blog';
import { blogFormSchema, toneOptions, wordCountOptions } from '@/lib/validation';

type FormValues = {
  primaryKeyword: string;
  secondaryKeywords?: string;
  blogTitle?: string;
  outline?: string;
  wordCount: string;
  tone: (typeof toneOptions)[number];
  backlinkUrl: string;
  numberOfBlogs: number;
};

interface GeneratorFormProps {
  onGenerate: (payloads: BlogGenerationRequest[]) => Promise<void>;
  isGenerating: boolean;
}

const parseCsvRow = (row: BlogCsvRow): BlogGenerationRequest | null => {
  if (!row.primaryKeyword || !row.backlinkUrl) {
    return null;
  }

  const parsedWordCount =
    typeof row.wordCount === 'number' ? row.wordCount : parseInt(String(row.wordCount ?? ''), 10);
  const isValidWordCount = wordCountOptions.includes(parsedWordCount as (typeof wordCountOptions)[number]);
  const normalizedWordCount = (isValidWordCount ? parsedWordCount : 1500) as BlogGenerationRequest['wordCount'];

  const tone = toneOptions.includes((row.tone as any) ?? '') ? (row.tone as any) : 'professional';

  return {
    primaryKeyword: row.primaryKeyword.trim(),
    secondaryKeywords: row.secondaryKeywords?.split(',').map((item) => item.trim()).filter(Boolean) ?? [],
    blogTitle: row.blogTitle?.trim() || undefined,
    outline: row.outline?.trim() || undefined,
    wordCount: normalizedWordCount,
    tone,
    backlinkUrl: row.backlinkUrl.trim()
  };
};

const csvConfig: Papa.ParseConfig<BlogCsvRow> = {
  header: true,
  skipEmptyLines: true,
  transformHeader: (header) => header.trim(),
  dynamicTyping: true
};

export const GeneratorForm = ({ onGenerate, isGenerating }: GeneratorFormProps) => {
  const [csvPayloads, setCsvPayloads] = useState<BlogGenerationRequest[]>([]);
  const [csvError, setCsvError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      primaryKeyword: '',
      secondaryKeywords: '',
      blogTitle: '',
      outline: '',
      wordCount: String(wordCountOptions[1]),
      tone: 'professional',
      backlinkUrl: '',
      numberOfBlogs: 1
    }
  });

  const numberOfBlogsValue = watch('numberOfBlogs');

  const handleCsvUpload = useCallback((file: File) => {
    setCsvError(null);
    Papa.parse<BlogCsvRow>(file, {
      ...csvConfig,
      complete: (result) => {
        const mapped = result.data
          .map(parseCsvRow)
          .filter((item): item is BlogGenerationRequest => Boolean(item));
        if (!mapped.length) {
          setCsvError('No valid rows detected. Ensure the CSV headers match the documentation.');
          return;
        }
        setCsvPayloads(mapped);
      },
      error: (err) => {
        setCsvError(err.message);
      }
    });
  }, []);

  const onSubmit = useCallback(
    async (values: FormValues) => {
      try {
        if (csvPayloads.length) {
          await onGenerate(csvPayloads);
          setCsvPayloads([]);
          setCsvError(null);
          return;
        }

        const secondary = values.secondaryKeywords
          ?.split(',')
          .map((item) => item.trim())
          .filter(Boolean) ?? [];

        const basePayload: BlogGenerationRequest = {
          primaryKeyword: values.primaryKeyword.trim(),
          secondaryKeywords: secondary,
          blogTitle: values.blogTitle?.trim() || undefined,
          outline: values.outline?.trim() || undefined,
          wordCount: parseInt(values.wordCount, 10) as BlogGenerationRequest['wordCount'],
          tone: values.tone,
          backlinkUrl: values.backlinkUrl.trim()
        };

        const payloads: BlogGenerationRequest[] = Array.from({ length: values.numberOfBlogs }).map((_, index) => ({
          ...basePayload,
          blogTitle:
            basePayload.blogTitle && values.numberOfBlogs > 1
              ? `${basePayload.blogTitle} (Edition ${index + 1})`
              : basePayload.blogTitle
        }));

        await onGenerate(payloads);
        reset();
        setCsvError(null);
      } catch (error) {
        console.error('Generation request failed', error);
        setCsvError((error as Error).message ?? 'Generation failed');
      }
    },
    [csvPayloads, onGenerate, reset]
  );

  const csvSummary = useMemo(() => {
    if (!csvPayloads.length) return null;
    return {
      count: csvPayloads.length,
      primaryKeywords: csvPayloads.map((item) => item.primaryKeyword)
    };
  }, [csvPayloads]);

  return (
    <div className="glass rounded-3xl p-8 shadow-subtle">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Generation Dashboard</h2>
          <p className="text-sm text-slate-500">
            Configure your blog batch, preview CSV imports, and trigger AI-powered generation.
          </p>
        </div>
        <span
          className={clsx(
            'rounded-full px-3 py-1 text-xs font-semibold',
            csvPayloads.length ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'
          )}
        >
          {csvPayloads.length ? `${csvPayloads.length} CSV blogs queued` : 'Manual mode' }
        </span>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6 md:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-700">
              Primary Keyword <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              placeholder="AI content marketing"
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
              {...register('primaryKeyword')}
            />
            {errors.primaryKeyword && <span className="text-xs text-red-500">{errors.primaryKeyword.message}</span>}
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-700">Secondary Keywords</span>
            <input
              type="text"
              placeholder="automation, content strategy, backlinking"
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
              {...register('secondaryKeywords')}
            />
            <span className="text-xs text-slate-400">Comma-separated to generate semantic clusters.</span>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-700">Blog Title</span>
            <input
              type="text"
              placeholder="The AI Playbook for Modern Marketing Teams"
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
              {...register('blogTitle')}
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-700">Word Count Target</span>
            <select
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
              {...register('wordCount')}
            >
              {wordCountOptions.map((option) => (
                <option key={option} value={option}>
                  {option.toLocaleString()} words
                </option>
              ))}
            </select>
          </label>

          <div className="flex flex-col gap-2 md:col-span-2">
            <span className="text-sm font-medium text-slate-700">Blog Outline / H2 Headings</span>
            <textarea
              rows={4}
              placeholder={`Introduction\nH2: ...\nH2: ...`}
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
              {...register('outline')}
            />
            <span className="text-xs text-slate-400">
              Optional: supply specific headings to enforce LLM structure.
            </span>
          </div>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-700">Tone & Style</span>
            <select
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
              {...register('tone')}
            >
              {toneOptions.map((tone) => (
                <option key={tone} value={tone}>
                  {tone.charAt(0).toUpperCase() + tone.slice(1)}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-700">
              Backlink URL <span className="text-red-500">*</span>
            </span>
            <input
              type="url"
              placeholder="https://yourdomain.com"
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
              {...register('backlinkUrl')}
            />
            {errors.backlinkUrl && <span className="text-xs text-red-500">{errors.backlinkUrl.message}</span>}
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-700">Number of Blogs</span>
            <input
              type="number"
              min={1}
              max={10}
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
              {...register('numberOfBlogs', { valueAsNumber: true })}
            />
            {errors.numberOfBlogs && <span className="text-xs text-red-500">{errors.numberOfBlogs.message}</span>}
          </label>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-700">Bulk Import CSV</span>
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500 hover:border-brand-400">
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    handleCsvUpload(file);
                  }
                }}
              />
              <span className="font-semibold text-brand-600">Upload CSV</span>
              <span className="text-xs text-slate-400">Headers: primaryKeyword, secondaryKeywords, blogTitle, outline, wordCount, tone, backlinkUrl</span>
            </label>
            {csvError && <span className="text-xs text-red-500">{csvError}</span>}
          </div>
        </div>

        {csvSummary && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-sm text-emerald-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">CSV batch configured</p>
                <p className="text-xs text-emerald-600">
                  {csvSummary.count} blogs detected. Primary keywords include {csvSummary.primaryKeywords.slice(0, 3).join(', ')}
                  {csvSummary.primaryKeywords.length > 3 ? '…' : ''}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCsvPayloads([])}
                className="text-xs font-semibold text-emerald-700 underline"
              >
                Clear CSV
              </button>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isGenerating}
          className={clsx(
            'w-full rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-brand-700 hover:to-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-200',
            isGenerating && 'cursor-not-allowed opacity-70'
          )}
        >
          {isGenerating ? 'Generating blogs…' : csvPayloads.length ? 'Generate from CSV' : `Generate ${numberOfBlogsValue} ${numberOfBlogsValue === 1 ? 'blog' : 'blogs'}`}
        </button>
      </form>
    </div>
  );
};
