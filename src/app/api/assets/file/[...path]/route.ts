import { NextRequest, NextResponse } from 'next/server';
import { readLocalAsset } from '@/lib/local-data/assets';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface AssetFileRouteContext {
  params: Promise<{
    path: string[];
  }>;
}

export async function GET(_request: NextRequest, context: AssetFileRouteContext) {
  try {
    const { path } = await context.params;
    const relativePath = path.join('/');
    const { buffer, mimeType } = await readLocalAsset(relativePath);

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Asset not found';
    return NextResponse.json({ error: message }, { status: 404 });
  }
}

