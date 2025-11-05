import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { GeneratedBlog, GenerationTask, GenerationStatus } from '@/types/blog';

interface BlogState {
  blogs: GeneratedBlog[];
  tasks: Record<string, GenerationTask>;
  isExporting: boolean;
  addTask: (task: GenerationTask) => void;
  updateTaskStatus: (id: string, status: GenerationStatus, error?: string) => void;
  addBlog: (blog: GeneratedBlog) => void;
  removeBlog: (id: string) => void;
  clearBlogs: () => void;
  setExporting: (value: boolean) => void;
}

export const useBlogStore = create<BlogState>()(
  devtools(
    (set) => ({
      blogs: [],
      tasks: {},
      isExporting: false,
      addTask: (task) =>
        set((state) => ({
          tasks: {
            ...state.tasks,
            [task.id]: task
          }
        })),
      updateTaskStatus: (id, status, error) =>
        set((state) => {
          const task = state.tasks[id];
          if (!task) return state;

          return {
            tasks: {
              ...state.tasks,
              [id]: {
                ...task,
                status,
                error,
                startedAt: task.startedAt ?? new Date().toISOString(),
                completedAt: status === 'completed' || status === 'failed' ? new Date().toISOString() : task.completedAt
              }
            }
          };
        }),
      addBlog: (blog) =>
        set((state) => ({
          blogs: [blog, ...state.blogs],
          tasks: {
            ...state.tasks,
            [blog.id]: {
              id: blog.id,
              label: blog.title,
              status: 'completed',
              startedAt: state.tasks[blog.id]?.startedAt ?? new Date().toISOString(),
              completedAt: new Date().toISOString()
            }
          }
        })),
      removeBlog: (id) =>
        set((state) => ({
          blogs: state.blogs.filter((blog) => blog.id !== id),
          tasks: Object.fromEntries(Object.entries(state.tasks).filter(([taskId]) => taskId !== id))
        })),
      clearBlogs: () => set({ blogs: [], tasks: {} }),
      setExporting: (value) => set({ isExporting: value })
    }),
    { name: 'blog-generator-store' }
  )
);
