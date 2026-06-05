import { NextRequest, NextResponse } from 'next/server';
import { createCanvas, listCanvases, toListItem } from '@/lib/canvas/persistence';

export async function GET() {
  try {
    return NextResponse.json({ data: await listCanvases() });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to load canvases';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const canvas = await createCanvas(typeof body.name === 'string' ? body.name : undefined);
    return NextResponse.json({ data: toListItem(canvas) });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create canvas';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
