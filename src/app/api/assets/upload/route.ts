import { NextRequest, NextResponse } from 'next/server';
import { saveLocalAsset } from '@/lib/local-data/assets';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function inferUploadKind(file: File) {
  if (file.type.startsWith('image/')) return 'uploads/images';
  if (file.type.startsWith('video/')) return 'uploads/videos';
  if (file.type.startsWith('audio/')) return 'uploads/audio';
  return 'uploads/files';
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: 'file is required' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const asset = await saveLocalAsset({
      buffer,
      originalName: file.name || 'upload',
      kind: inferUploadKind(file),
      mimeType: file.type || 'application/octet-stream',
      canvasId: formData.get('canvasId') as string | null,
    });

    return NextResponse.json({ data: asset });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown upload error';
    console.error('[assets/upload] error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

