'use client';

import { useMemo } from 'react';
import DOMPurify from 'dompurify';
import { GeneratedBlog } from '@/types/blog';
import { useBlogStore } from '@/store/blogStore';

interface BlogPreviewListProps {
  onRetry: (blog: GeneratedBlog) => void;
}

const BlogPreviewCard = ({ blog, onRetry }: { blog: GeneratedBlog; onRetry: (blog: GeneratedBlog) => void }) => {
  const removeBlog = useBlogStore((state) => state.removeBlog);

  const sanitizedHtml = useMemo(() => ({ __html: DOMPurify.sanitize(blog.html) }), [blog.html]);

  return (
    <article className="glass rounded-3xl p-6">
      <div className="flex flex-col gap-3 border-b border-slate-200/60 pb-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-slate-800">{blog.title}</h3>
          <p className="text-sm text-slate-500">Primary backlink: {blog.backlinkUrl}</p>
        </div>
        <div className="flex gap-2 text-xs">
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(blog.html);
              } catch (error) {
                console.error('Clipboard copy failed', error);
                alert('Unable to copy to clipboard in this browser.');
              }
            }}
            className="rounded-full border border-slate-200 px-4 py-2 font-semibold text-slate-600 hover:border-brand-300 hover:text-brand-600"
          >
            Copy HTML
          </button>
          <button
            type="button"
            onClick={() => onRetry(blog)}
            className="rounded-full border border-indigo-200 px-4 py-2 font-semibold text-indigo-600 hover:bg-indigo-50"
          >
            Retry
          </button>
          <button
            type="button"
            onClick={() => removeBlog(blog.id)}
            className="rounded-full border border-rose-200 px-4 py-2 font-semibold text-rose-600 hover:bg-rose-50"
          >
            Remove
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={sanitizedHtml} />
        <aside className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
            <img src={blog.images.featured.data} alt={blog.images.featured.alt} className="h-44 w-full object-cover" />
            <div className="p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Featured Prompt</p>
              <p className="mt-1 text-sm text-slate-600">{blog.images.featured.prompt}</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
            <img src={blog.images.body.data} alt={blog.images.body.alt} className="h-44 w-full object-cover" />
            <div className="p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Body Prompt</p>
              <p className="mt-1 text-sm text-slate-600">{blog.images.body.prompt}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-xs text-slate-600">
            <p className="font-semibold text-slate-700">Meta Data</p>
            <p className="mt-2 text-sm">{blog.meta.description}</p>
            <p className="mt-2 text-xs uppercase tracking-wide text-slate-400">Keywords</p>
            <p className="text-sm text-slate-600">{blog.meta.keywords.join(', ')}</p>
          </div>
        </aside>
      </div>
    </article>
  );
};

export const BlogPreviewList = ({ onRetry }: BlogPreviewListProps) => {
  const blogs = useBlogStore((state) => state.blogs);

  if (!blogs.length) {
    return (
      <div className="glass rounded-3xl p-12 text-center text-slate-500">
        <p className="text-sm">No blogs generated yet. Submit the form to preview AI-generated content.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {blogs.map((blog) => (
        <BlogPreviewCard key={blog.id} blog={blog} onRetry={onRetry} />
      ))}
    </div>
  );
};
