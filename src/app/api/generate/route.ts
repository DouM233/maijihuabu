import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.CHAT_API_URL || 'https://yunwu.ai/v1/chat/completions';
const IMAGE_API_URL = API_URL.replace('/chat/completions', '/images/generations');
const API_KEY = process.env.CHAT_API_KEY || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, size, quality, model } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'prompt 参数必填' }, { status: 400 });
    }

    // 尺寸映射：前端尺寸ID → API 尺寸值
    const sizeMap: Record<string, string> = {
      'auto': 'auto',
      '1080x1920': '1088x1936',
      '1088x1936': '1088x1936',
      '1200x1600': '1200x1600',
      '1024x1024': '1024x1024',
      '1536x1024': '1536x1024',
      '1024x1536': '1024x1536',
    };

    const apiSize = sizeMap[size] || size || '1024x1024';
    const apiModel = model || 'gpt-image-2';

    const requestBody: Record<string, unknown> = {
      model: apiModel,
      prompt,
      size: apiSize,
      n: 1,
      response_format: 'b64_json',
    };

    if (quality && quality !== 'default') {
      requestBody.quality = quality;
    }

    console.log('[generate] request:', {
      url: IMAGE_API_URL,
      model: apiModel,
      size: apiSize,
      quality: requestBody.quality || 'default',
      promptLength: prompt.length,
    });

    const response = await fetch(IMAGE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[generate] API error:', response.status, errorText);
      return NextResponse.json(
        { error: `生图接口错误: ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }

    const result = await response.json();

    if (!result.data || result.data.length === 0) {
      return NextResponse.json({ error: '未返回图片数据' }, { status: 500 });
    }

    const b64Data = result.data[0].b64_json;
    const imageDataUrl = `data:image/png;base64,${b64Data}`;

    return NextResponse.json({
      imageUrl: imageDataUrl,
      size: result.size || apiSize,
      usage: result.usage || null,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '未知错误';
    console.error('[generate] error:', message);
    return NextResponse.json({ error: `生图请求异常: ${message}` }, { status: 500 });
  }
}
