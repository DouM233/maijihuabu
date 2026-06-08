import { NextRequest, NextResponse } from 'next/server';
import { saveCanvas } from '@/lib/canvas/persistence';
import { getUserContextFromRequest } from '@/lib/local-data/users';

type CanvasRouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, context: CanvasRouteContext) {
  const { id } = await context.params;
  const user = getUserContextFromRequest(request);
  const body = await request.json().catch(() => ({}));
  const canvas = await saveCanvas(id, body, user.id);
  if (!canvas) {
    return NextResponse.json({ error: 'Canvas not found' }, { status: 404 });
  }
  return NextResponse.json({ data: canvas });
}
