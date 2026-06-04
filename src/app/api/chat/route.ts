import { NextRequest } from 'next/server';

/**
 * AI 对话助手流式代理路由
 * 对接 taikuaila.cn OpenAI 兼容接口，支持 SSE 流式输出
 * 模型：gpt-5.4
 */

const CHAT_API_URL = process.env.CHAT_API_URL || 'https://yunwu.ai/v1/chat/completions';
const CHAT_API_KEY = process.env.CHAT_API_KEY || '';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatRequestBody {
  messages: ChatMessage[];
  model?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequestBody = await request.json();
    const { messages, model } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'messages 数组不能为空' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!CHAT_API_KEY) {
      return new Response(JSON.stringify({ error: '未配置 CHAT_API_KEY' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 构建请求体，开启 stream 模式
    const payload = {
      model: model || 'gpt-5.4',
      messages,
      temperature: 0.7,
      stream: true,
    };

    console.log('[Chat API] 流式请求:', {
      url: CHAT_API_URL,
      model: payload.model,
      messagesCount: messages.length,
    });

    // 请求上游 API（stream 模式）
    const upstream = await fetch(CHAT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CHAT_API_KEY}`,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(120000), // 120秒超时
    });

    if (!upstream.ok) {
      const errorText = await upstream.text().catch(() => 'Unknown error');
      console.error('[Chat API] 上游返回错误:', upstream.status, errorText);
      return new Response(
        JSON.stringify({ error: `大模型返回错误 (${upstream.status}): ${errorText.slice(0, 500)}` }),
        { status: upstream.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 透传上游 SSE 流
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = upstream.body?.getReader();
        if (!reader) {
          controller.enqueue(encoder.encode('data: {"error":"无法读取上游流"}\n\n'));
          controller.close();
          return;
        }

        const decoder = new TextDecoder();
        let buffer = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed) continue;

              if (trimmed === 'data: [DONE]') {
                controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                continue;
              }

              if (trimmed.startsWith('data: ')) {
                const jsonStr = trimmed.slice(6);
                try {
                  const parsed = JSON.parse(jsonStr);
                  const delta = parsed.choices?.[0]?.delta?.content;
                  if (delta) {
                    controller.enqueue(
                      encoder.encode(`data: ${JSON.stringify({ content: delta })}\n\n`)
                    );
                  }
                  // 跳过空 delta（role、finish_reason 等），不转发
                } catch {
                  // 解析失败的行直接透传
                  controller.enqueue(encoder.encode(`${trimmed}\n\n`));
                }
              }
            }
          }

          // 处理 buffer 中剩余数据
          if (buffer.trim()) {
            const trimmed = buffer.trim();
            if (trimmed.startsWith('data: ') && trimmed !== 'data: [DONE]') {
              try {
                const parsed = JSON.parse(trimmed.slice(6));
                const delta = parsed.choices?.[0]?.delta?.content;
                if (delta) {
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ content: delta })}\n\n`)
                  );
                }
              } catch {
                // 忽略
              }
            }
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (streamError: unknown) {
          const errMsg = streamError instanceof Error ? streamError.message : '流式输出异常';
          console.error('[Chat API] Stream error:', errMsg);
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: errMsg })}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    if (errorMessage.includes('timeout') || errorMessage.includes('abort')) {
      return new Response(
        JSON.stringify({ error: '大模型连接超时，请检查网络' }),
        { status: 504, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.error('[Chat API] 异常:', errorMessage);
    return new Response(
      JSON.stringify({ error: `大模型服务异常: ${errorMessage}` }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
