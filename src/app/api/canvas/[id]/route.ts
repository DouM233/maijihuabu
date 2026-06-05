import { NextRequest, NextResponse } from 'next/server';
import { deleteCanvas, getCanvas, saveCanvas } from '@/lib/canvas/persistence';

type CanvasRouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, context: CanvasRouteContext) {
  const { id } = await context.params;
  const canvas = await getCanvas(id);
  if (!canvas) {
    return NextResponse.json({ error: 'Canvas not found' }, { status: 404 });
  }
  return NextResponse.json({ data: canvas });
}

export async function PUT(request: NextRequest, context: CanvasRouteContext) {
  const { id } = await context.params;
  const body = await request.json().catch(() => ({}));
  const canvas = await saveCanvas(id, body);
  if (!canvas) {
    return NextResponse.json({ error: 'Canvas not found' }, { status: 404 });
  }
  return NextResponse.json({ data: canvas });
}

export async function DELETE(_request: NextRequest, context: CanvasRouteContext) {
  const { id } = await context.params;
  const deleted = await deleteCanvas(id);
  if (!deleted) {
    return NextResponse.json({ error: 'Canvas not found' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
