import { NextRequest, NextResponse } from 'next/server';
import { renameCanvas, toListItem } from '@/lib/canvas/persistence';

type CanvasRouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, context: CanvasRouteContext) {
  const { id } = await context.params;
  const body = await request.json().catch(() => ({}));
  const name = typeof body.name === 'string' ? body.name : '';
  if (!name.trim()) {
    return NextResponse.json({ error: 'Canvas name is required' }, { status: 400 });
  }

  const canvas = await renameCanvas(id, name);
  if (!canvas) {
    return NextResponse.json({ error: 'Canvas not found' }, { status: 404 });
  }
  return NextResponse.json({ data: toListItem(canvas) });
}
