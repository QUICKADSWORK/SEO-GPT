export type ToneStyle = 'conversational' | 'professional' | 'technical' | 'casual';

export interface BlogFormValues {
  primaryKeyword: string;
  secondaryKeywords: string;
  blogTitle?: string;
  outline?: string;
  wordCount: number;
  tone: ToneStyle;
  backlinkUrl: string;
  numberOfBlogs: number;
  csvRows?: BlogCsvRow[];
}

export interface BlogCsvRow {
  primaryKeyword: string;
  secondaryKeywords?: string;
  blogTitle?: string;
  outline?: string;
  wordCount?: number | string;
  tone?: ToneStyle;
  backlinkUrl: string;
}

export interface BlogGenerationRequest {
  primaryKeyword: string;
  secondaryKeywords: string[];
  blogTitle?: string;
  outline?: string;
  wordCount: number;
  tone: ToneStyle;
  backlinkUrl: string;
}

export interface BlogMeta {
  title: string;
  description: string;
  keywords: string[];
}

export interface GeneratedImage {
  data: string; // base64 string with mime prefix
  prompt: string;
  alt: string;
}

export interface GeneratedBlog {
  id: string;
  title: string;
  html: string;
  meta: BlogMeta;
  images: {
    featured: GeneratedImage;
    body: GeneratedImage;
  };
  backlinkUrl: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  tone: ToneStyle;
  wordCount: number;
  createdAt: string;
}

export type GenerationStatus = 'queued' | 'generating' | 'completed' | 'failed';

export interface GenerationTask {
  id: string;
  label: string;
  status: GenerationStatus;
  error?: string;
  startedAt?: string;
  completedAt?: string;
}
