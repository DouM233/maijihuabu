import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.CHAT_API_URL || 'https://yunwu.ai/v1/chat/completions';
const EDIT_API_URL = API_URL.replace('/chat/completions', '/images/edits');
const API_KEY = process.env.CHAT_API_KEY || '';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const prompt = formData.get('prompt') as string;
    const imageFile = formData.get('image') as File | null;
    const size = (formData.get('size') as string) || '1024x1024';
    const quality = formData.get('quality') as string | null;
    const model = (formData.get('model') as string) || 'gpt-image-2';

    if (!prompt) {
      return NextResponse.json({ error: 'prompt 参数必填' }, { status: 400 });
    }

    if (!imageFile) {
      return NextResponse.json({ error: '参考图必填（图生图模式）' }, { status: 400 });
    }

    // 尺寸映射
    const sizeMap: Record<string, string> = {
      'auto': 'auto',
      '1080x1920': '1080x1920',
      '1200x1600': '1200x1600',
      '1024x1024': '1024x1024',
      '1536x1024': '1536x1024',
      '1024x1536': '1024x1536',
    };

    const apiSize = sizeMap[size] || size || '1024x1024';

    // 构建 multipart/form-data
    const sendFormData = new FormData();
    sendFormData.append('model', model);
    sendFormData.append('prompt', prompt);
    sendFormData.append('image', imageFile);
    sendFormData.append('size', apiSize);
    sendFormData.append('n', '1');
    // 注意：edits 端点不支持 response_format 参数，默认返回 URL

    if (quality && quality !== 'default') {
      sendFormData.append('quality', quality);
    }

    console.log('[generate/edit] request:', {
      url: EDIT_API_URL,
      model,
      size: apiSize,
      quality: quality || 'default',
      promptLength: prompt.length,
      imageFileName: imageFile.name,
      imageSize: imageFile.size,
    });

    const response = await fetch(EDIT_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: sendFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[generate/edit] API error:', response.status, errorText);
      return NextResponse.json(
        { error: `图生图接口错误: ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }

    const result = await response.json();

    if (!result.data || result.data.length === 0) {
      return NextResponse.json({ error: '未返回图片数据' }, { status: 500 });
    }

    // edits 端点可能返回 URL 或 b64_json
    const firstItem = result.data[0];
    let imageUrl: string;

    if (firstItem.b64_json) {
      imageUrl = `data:image/png;base64,${firstItem.b64_json}`;
    } else if (firstItem.url) {
      // 如果返回的是 URL，需要下载并转为 base64 data URL
      const imgResp = await fetch(firstItem.url);
      const imgBuffer = await imgResp.arrayBuffer();
      const base64 = Buffer.from(imgBuffer).toString('base64');
      const contentType = imgResp.headers.get('content-type') || 'image/png';
      imageUrl = `data:${contentType};base64,${base64}`;
    } else {
      return NextResponse.json({ error: '未返回有效的图片数据' }, { status: 500 });
    }

    return NextResponse.json({
      imageUrl,
      size: result.size || apiSize,
      usage: result.usage || null,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '未知错误';
    console.error('[generate/edit] error:', message);
    return NextResponse.json({ error: `图生图请求异常: ${message}` }, { status: 500 });
  }
}
