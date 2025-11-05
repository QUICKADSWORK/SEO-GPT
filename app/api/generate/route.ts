import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateBlogDraft } from '@/lib/ai/gemini';
import { generateImageSet } from '@/lib/ai/dalle';
import { enhanceBlogHtml } from '@/lib/html/enhanceBlogHtml';
import { checkRateLimit } from '@/lib/rateLimit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const requestSchema = z.object({
  primaryKeyword: z.string().min(3),
  secondaryKeywords: z.array(z.string()).default([]),
  blogTitle: z.string().optional(),
  outline: z.string().optional(),
  wordCount: z.union([z.literal(1000), z.literal(1500), z.literal(2000)]),
  tone: z.enum(['conversational', 'professional', 'technical', 'casual']),
  backlinkUrl: z.string().url()
});

const getClientIdentifier = (req: NextRequest) =>
  req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.ip || 'unknown';

export async function POST(req: NextRequest) {
  const identifier = getClientIdentifier(req);
  const rateResult = checkRateLimit(identifier);
  if (!rateResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait before retrying.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(rateResult.retryAfter ?? 60)
        }
      }
    );
  }

  const json = await req.json();
  const parsed = requestSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  try {
    const draft = await generateBlogDraft(parsed.data);
    const images = await generateImageSet(draft.imagePrompts);
    const html = enhanceBlogHtml(draft.html, parsed.data);

    return NextResponse.json({
      id: crypto.randomUUID(),
      title: draft.title,
      meta: draft.meta,
      html,
      images,
      backlinkUrl: parsed.data.backlinkUrl,
      primaryKeyword: parsed.data.primaryKeyword,
      secondaryKeywords: parsed.data.secondaryKeywords,
      tone: parsed.data.tone,
      wordCount: parsed.data.wordCount,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('[Generate API] error', error);
    return NextResponse.json(
      { error: (error as Error).message ?? 'Failed to generate blog content.' },
      { status: 500 }
    );
  }
}
