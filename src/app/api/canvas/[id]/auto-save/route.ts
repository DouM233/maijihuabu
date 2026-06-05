import { NextRequest, NextResponse } from 'next/server';
import { saveCanvas } from '@/lib/canvas/persistence';

type CanvasRouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, context: CanvasRouteContext) {
  const { id } = await context.params;
  const body = await request.json().catch(() => ({}));
  const canvas = await saveCanvas(id, body);
  if (!canvas) {
    return NextResponse.json({ error: 'Canvas not found' }, { status: 404 });
  }
  return NextResponse.json({ data: canvas });
}
