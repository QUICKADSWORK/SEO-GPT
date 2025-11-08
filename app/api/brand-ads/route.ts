import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getInstagramBrandName, getBrandAdCounts } from '@/lib/ai/gemini-brand';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const requestSchema = z.object({
  websiteUrl: z.string().url('Please provide a valid website URL')
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = requestSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors.websiteUrl?.[0] || 'Invalid request' },
        { status: 422 }
      );
    }

    const { websiteUrl } = parsed.data;

    // Step 1: Use Gemini to identify the Instagram brand name (with regional specificity)
    console.log(`🔍 Identifying brand name for: ${websiteUrl}`);
    const brandName = await getInstagramBrandName(websiteUrl);
    console.log(`✅ Identified brand name: "${brandName}"`);

    // Step 2: Get ad counts from BrandBooster API using the identified brand name
    console.log(`📊 Fetching ad counts for: "${brandName}"`);
    const adCounts = await getBrandAdCounts(brandName);
    console.log(`✅ Ad counts retrieved:`, adCounts);

    return NextResponse.json({
      websiteUrl,
      brandName,
      totalAdCount: adCounts.totalAdCount,
      activeAdCount: adCounts.activeAdCount,
      inactiveAdCount: adCounts.inactiveAdCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[Brand Ads API] error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to process brand ad count request'
      },
      { status: 500 }
    );
  }
}
