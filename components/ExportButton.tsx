'use client';

import { useCallback } from 'react';
import clsx from 'clsx';
import { useBlogStore } from '@/store/blogStore';
import { exportBlogsToDocx } from '@/lib/export/docx';

export const ExportButton = () => {
  const blogs = useBlogStore((state) => state.blogs);
  const isExporting = useBlogStore((state) => state.isExporting);
  const setExporting = useBlogStore((state) => state.setExporting);

  const handleExport = useCallback(async () => {
    if (!blogs.length) return;
    try {
      setExporting(true);
      const blob = await exportBlogsToDocx(blogs);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ai-multi-blogs-${new Date().toISOString()}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export blogs', error);
      alert('Export failed. Check console for details.');
    } finally {
      setExporting(false);
    }
  }, [blogs, setExporting]);

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={!blogs.length || isExporting}
      className={clsx(
        'flex items-center gap-2 rounded-full border border-brand-200 bg-white px-6 py-3 text-sm font-semibold text-brand-600 shadow-sm transition hover:border-brand-400 hover:text-brand-700',
        (isExporting || !blogs.length) && 'cursor-not-allowed opacity-70'
      )}
    >
      {isExporting ? 'Preparing Word document…' : 'Export all blogs to Word'}
    </button>
  );
};
