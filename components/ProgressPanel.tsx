'use client';

import { useMemo } from 'react';
import clsx from 'clsx';
import { useBlogStore } from '@/store/blogStore';

const StatusChip = ({ status }: { status: string }) => {
  const config: Record<string, { label: string; className: string }> = {
    queued: { label: 'Queued', className: 'bg-slate-200 text-slate-700' },
    generating: { label: 'Generating', className: 'bg-amber-100 text-amber-700' },
    completed: { label: 'Ready', className: 'bg-emerald-100 text-emerald-700' },
    failed: { label: 'Failed', className: 'bg-rose-100 text-rose-700' }
  };

  const { label, className } = config[status] ?? config.queued;
  return <span className={clsx('rounded-full px-3 py-1 text-xs font-semibold', className)}>{label}</span>;
};

const getProgressPercent = (status: string) => {
  switch (status) {
    case 'queued':
      return 5;
    case 'generating':
      return 60;
    case 'completed':
      return 100;
    case 'failed':
      return 100;
    default:
      return 0;
  }
};

export const ProgressPanel = () => {
  const tasks = useBlogStore((state) => state.tasks);

  const taskList = useMemo(() => Object.values(tasks).sort((a, b) => (a.startedAt ?? '').localeCompare(b.startedAt ?? '')), [tasks]);

  if (!taskList.length) {
    return (
      <div className="glass rounded-3xl p-6 text-center text-sm text-slate-500">
        <p>No active jobs yet. Configure your batch to begin generating blogs.</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-3xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-800">Generation Progress</h3>
          <p className="text-xs text-slate-500">Each blog runs in parallel. Failed items can be retried individually.</p>
        </div>
        <span className="text-xs font-medium text-slate-400">{taskList.length} total</span>
      </div>

      <div className="mt-6 space-y-4">
        {taskList.map((task) => {
          const progress = getProgressPercent(task.status);
          return (
            <div key={task.id} className="rounded-2xl border border-slate-200/70 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-800">{task.label}</p>
                  {task.error && <p className="text-xs text-rose-500">{task.error}</p>}
                </div>
                <StatusChip status={task.status} />
              </div>
              <div className="mt-3 h-2 rounded-full bg-slate-100">
                <div
                  className={clsx('h-2 rounded-full transition-all', {
                    'bg-brand-500': task.status !== 'failed',
                    'bg-rose-400': task.status === 'failed'
                  })}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
