import { NextRequest, NextResponse } from 'next/server';
import { saveLocalAsset } from '@/lib/local-data/assets';
import { getUserContextFromRequest } from '@/lib/local-data/users';

const API_URL = process.env.CHAT_API_URL || 'https://yunwu.ai/v1/chat/completions';
const EDIT_API_URL = API_URL.replace('/chat/completions', '/images/edits');
const API_KEY = process.env.CHAT_API_KEY || '';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const user = getUserContextFromRequest(request);
    const formData = await request.formData();
    const prompt = formData.get('prompt') as string;
    const imageFiles = formData
      .getAll('image')
      .filter((value): value is File => value instanceof File && value.size > 0)
      .slice(0, 16);
    const size = (formData.get('size') as string) || '1024x1024';
    const quality = formData.get('quality') as string | null;
    const model = (formData.get('model') as string) || 'gpt-image-2';

    if (!prompt) {
      return NextResponse.json({ error: 'prompt is required' }, { status: 400 });
    }

    if (imageFiles.length === 0) {
      return NextResponse.json({ error: 'reference image is required for image editing' }, { status: 400 });
    }

    const sizeMap: Record<string, string> = {
      auto: 'auto',
      '1080x1920': '1088x1936',
      '1088x1936': '1088x1936',
      '1200x1600': '1200x1600',
      '1024x1024': '1024x1024',
      '1536x1024': '1536x1024',
      '1024x1536': '1024x1536',
    };

    const apiSize = sizeMap[size] || size || '1024x1024';
    const sendFormData = new FormData();
    sendFormData.append('model', model);
    sendFormData.append('prompt', prompt);
    for (const imageFile of imageFiles) {
      sendFormData.append('image', imageFile);
    }
    sendFormData.append('size', apiSize);
    sendFormData.append('n', '1');

    if (quality && quality !== 'default') {
      sendFormData.append('quality', quality);
    }

    console.log('[generate/edit] request:', {
      url: EDIT_API_URL,
      model,
      size: apiSize,
      quality: quality || 'default',
      promptLength: prompt.length,
      imageCount: imageFiles.length,
      imageFileNames: imageFiles.map((file) => file.name),
      totalImageSize: imageFiles.reduce((sum, file) => sum + file.size, 0),
    });

    const response = await fetch(EDIT_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
      body: sendFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[generate/edit] API error:', response.status, errorText);
      return NextResponse.json(
        { error: `image edit API error: ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }

    const result = await response.json();

    if (!result.data || result.data.length === 0) {
      return NextResponse.json({ error: 'image API returned no data' }, { status: 500 });
    }

    const firstItem = result.data[0];
    let imageBuffer: Buffer;
    let mimeType = 'image/png';

    if (firstItem.b64_json) {
      imageBuffer = Buffer.from(firstItem.b64_json, 'base64');
    } else if (firstItem.url) {
      const imgResp = await fetch(firstItem.url);
      imageBuffer = Buffer.from(await imgResp.arrayBuffer());
      mimeType = imgResp.headers.get('content-type') || 'image/png';
    } else {
      return NextResponse.json({ error: 'image API returned no image payload' }, { status: 500 });
    }

    const asset = await saveLocalAsset({
      buffer: imageBuffer,
      originalName: `generated-edit-${Date.now()}.png`,
      kind: 'generated/images',
      mimeType,
      owner: user,
      model,
      prompt,
    });

    return NextResponse.json({
      imageUrl: asset.url,
      asset,
      size: result.size || apiSize,
      usage: result.usage || null,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown image edit error';
    console.error('[generate/edit] error:', message);
    return NextResponse.json({ error: `image edit request failed: ${message}` }, { status: 500 });
  }
}
