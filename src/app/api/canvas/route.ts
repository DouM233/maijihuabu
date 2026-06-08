import { NextRequest, NextResponse } from 'next/server';
import { createCanvas, listCanvases, toListItem } from '@/lib/canvas/persistence';
import { getUserContextFromRequest } from '@/lib/local-data/users';

export async function GET(request: NextRequest) {
  try {
    const user = getUserContextFromRequest(request);
    return NextResponse.json({ data: await listCanvases(user.id) });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to load canvases';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserContextFromRequest(request);
    const body = await request.json().catch(() => ({}));
    const canvas = await createCanvas(typeof body.name === 'string' ? body.name : undefined, user);
    return NextResponse.json({ data: toListItem(canvas) });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create canvas';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
