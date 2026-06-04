'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Sparkles, RotateCcw, Copy, Check, Send, Loader2, Wand2, ChevronDown, SlidersHorizontal, Zap, X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  GEN_MODEL_OPTIONS,
  RESOLUTION_OPTIONS,
  ASPECT_RATIO_OPTIONS,
  type GenModelId,
  type GenSizeId,
  type ResolutionId,
  type AspectRatioId,
} from '@/lib/types';
import { type CanvasNode } from '@/lib/store';
import { useAppStore } from '@/lib/store';

/* ─── 模型选择器 ─── */
function ModelSelect({ value, onChange }: { value: GenModelId; onChange: (val: GenModelId) => void }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const selected = GEN_MODEL_OPTIONS.find((o) => o.id === value) ?? GEN_MODEL_OPTIONS[0];

  const modelIcon = (id: GenModelId, cls: string) => {
    if (id === 'gpt-image-2') return <Sparkles className={cls} />;
    if (id === 'gemini-3.1-flash-image-preview') return <Zap className={cls} />;
    return <Sparkles className={cls} />;
  };
  const modelIconColor = (id: GenModelId) => {
    if (id === 'gpt-image-2') return 'text-emerald-500';
    if (id === 'gemini-3.1-flash-image-preview') return 'text-amber-500';
    return 'text-primary';
  };

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-8 items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 text-[11px] font-medium text-foreground shadow-sm transition-all hover:border-primary/40 hover:bg-primary/5"
      >
        {modelIcon(selected.id, 'h-3.5 w-3.5 ' + modelIconColor(selected.id))}
        <span className="max-w-[80px] truncate">{selected.label}</span>
        <ChevronDown className={cn('h-3 w-3 text-muted-foreground transition-transform', open && 'rotate-180')} />
      </button>
      <div
        className={cn(
          'absolute bottom-full left-0 z-50 mb-1 min-w-[180px] origin-bottom-left rounded-xl border border-border bg-card p-1 shadow-lg transition-all',
          open ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2 pointer-events-none'
        )}
        style={{ transitionDuration: open ? '250ms' : '200ms', transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        {GEN_MODEL_OPTIONS.map((opt) => {
          const isSel = opt.id === value;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => { onChange(opt.id); setOpen(false); }}
              className={cn(
                'flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs transition-colors',
                isSel ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted/50'
              )}
            >
              {modelIcon(opt.id, cn('h-3.5 w-3.5', modelIconColor(opt.id)))}
              <span className="flex-1">{opt.label}</span>
              {isSel && <Check className="h-3 w-3 text-primary" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── 比例图标绘制 ─── */
function AspectIcon({ ratio, className }: { ratio: string; className?: string }) {
  const [w, h] = ratio.split(':').map(Number);
  const isLandscape = w >= h;
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div
        className="border-2 border-current rounded-sm"
        style={{
          width: isLandscape ? 18 : Math.max(18 * (w / h), 6),
          height: isLandscape ? Math.max(18 * (h / w), 6) : 18,
          maxWidth: 18,
          maxHeight: 18,
        }}
      />
    </div>
  );
}

/* ─── 尺寸/比例选择器 ─── */
function SizePicker({
  resolution,
  aspectRatio,
  onResolutionChange,
  onAspectRatioChange,
}: {
  resolution: string;
  aspectRatio: string;
  onResolutionChange: (r: string) => void;
  onAspectRatioChange: (a: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const selectedRes = RESOLUTION_OPTIONS.find((r) => r.id === resolution) ?? RESOLUTION_OPTIONS[1];
  const selectedAr = ASPECT_RATIO_OPTIONS.find((a) => a.id === aspectRatio) ?? ASPECT_RATIO_OPTIONS[7];

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-8 items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 text-[11px] font-medium text-foreground shadow-sm transition-all hover:border-primary/40 hover:bg-primary/5"
      >
        <SlidersHorizontal className="h-3 w-3 text-muted-foreground" />
        <span className="tabular-nums">{selectedRes.label}·{selectedAr.label}</span>
        <ChevronDown className={cn('h-3 w-3 text-muted-foreground transition-transform', open && 'rotate-180')} />
      </button>
      <div
        className={cn(
          'absolute left-0 bottom-full z-50 mb-1 w-[260px] rounded-xl border border-border bg-card p-3 shadow-lg transition-all',
          open ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2 pointer-events-none'
        )}
        style={{ transitionDuration: open ? '250ms' : '200ms', transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        <div className="mb-3">
          <div className="mb-2 text-xs font-medium text-muted-foreground">分辨率</div>
          <div className="flex gap-1.5">
            {RESOLUTION_OPTIONS.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => onResolutionChange(r.id)}
                className={cn(
                  'flex-1 rounded-lg px-2 py-1.5 text-xs font-medium transition-all',
                  r.id === resolution ? 'bg-foreground text-background' : 'bg-secondary text-foreground hover:bg-muted'
                )}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-2 text-xs font-medium text-muted-foreground">宽高比</div>
          <div className="grid grid-cols-4 gap-1.5">
            {ASPECT_RATIO_OPTIONS.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => onAspectRatioChange(a.id)}
                className={cn(
                  'flex flex-col items-center gap-0.5 rounded-lg py-2 text-[10px] transition-all',
                  a.id === aspectRatio ? 'bg-foreground text-background' : 'bg-secondary text-foreground hover:bg-muted'
                )}
              >
                <AspectIcon ratio={a.id} className={cn('mb-0.5', a.id === aspectRatio ? 'text-background' : 'text-foreground')} />
                {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── 消息类型 ─── */
interface Message {
  id: string;
  role: 'user' | 'assistant' | 'skill-ref';
  content: string;
  skillName?: string;
  timestamp: number;
  streaming?: boolean;
}

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content:
    '你好！我是你的 AI 绘图助手。你可以用自然语言描述你想要的效果，比如"产品放在大理石台面上，暖色调影棚光，高端质感"，我会帮你优化为专业的生成提示词。',
  timestamp: 0,
};

/* ─── ChatPanel ─── */
export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [promptInput, setPromptInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  /* 全局状态 */
  const genModel = useAppStore((s) => s.genModel);
  const setGenModel = useAppStore((s) => s.setGenModel);
  const genSize = useAppStore((s) => s.genSize);
  const setGenSize = useAppStore((s) => s.setGenSize);
  const genQuality = useAppStore((s) => s.genQuality);
  const setGenQuality = useAppStore((s) => s.setGenQuality);

  /* 分辨率与宽高比状态 */
  const [resolution, setResolution] = useState<ResolutionId>('1K');
  const [aspectRatio, setAspectRatio] = useState<AspectRatioId>('1:1');
  const updateGenSize = useCallback((res: ResolutionId, ratio: AspectRatioId) => {
    let size: GenSizeId = 'auto';
    if (ratio === '1:1') {
      size = '1024x1024';
    } else if (['8:1', '4:1', '21:9', '16:9', '3:2', '4:3', '5:4'].includes(ratio)) {
      size = '1536x1024';
    } else if (['4:5', '3:4', '2:3', '9:16', '1:4', '1:8'].includes(ratio)) {
      size = '1024x1536';
    }
    setGenSize(size);
  }, [setGenSize]);

  const canvasNodes = useAppStore((s) => s.canvasNodes) ?? [];
  const generating = useAppStore((s) => s.generateStatus === 'generating');
  const appliedPrompt = useAppStore((s) => s.appliedPrompt);
  const currentLoadedSkillName = useAppStore((s) => s.currentLoadedSkillName);
  const currentLoadedSkillPrompt = useAppStore((s) => s.currentLoadedSkillPrompt);
  const currentLoadedSkillSceneName = useAppStore((s) => s.currentLoadedSkillSceneName);
  const clearLoadedSkill = useAppStore((s) => s.clearLoadedSkill);
  const referencedImageNode = useAppStore((s) => s.referencedImageNode);
  const setReferencedImageNode = useAppStore((s) => s.setReferencedImageNode);

  /* 监听 Skill 加载 → 弹出精美引用标签 */
  const prevSkillNameRef = useRef<string>('');
  useEffect(() => {
    if (currentLoadedSkillName && currentLoadedSkillName !== prevSkillNameRef.current) {
      prevSkillNameRef.current = currentLoadedSkillName;
      const refMsg: Message = {
        id: crypto.randomUUID(),
        role: 'skill-ref',
        content: `📌 已成功引入风格资产：【${currentLoadedSkillName}】\n\n👉 你现在可以直接在下方输入框描述想要的画面，然后点击「生图」按钮生成图片。`,
        skillName: currentLoadedSkillName,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, refMsg]);
    }
  }, [currentLoadedSkillName]);

  /* 取消引用 */
  const handleUnlinkSkill = useCallback(() => {
    prevSkillNameRef.current = '';
    clearLoadedSkill();
    const cancelMsg: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '已取消风格资产引用，后续生成将不再包含该风格 Prompt。',
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, cancelMsg]);
  }, [clearLoadedSkill]);

  /* 自动滚动 */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleCopy = useCallback((id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }, []);

  const handleClear = useCallback(() => {
    setMessages([WELCOME_MESSAGE]);
  }, []);

  /* ── 核心：SSE 流式调用 AI 接口 ── */
  const streamChatAPI = useCallback(async (userContent: string) => {
    // 1. 组装 messages
    const apiMessages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [];

    // 【Skill 隐式注入】如果加载了风格 Skill，作为 system 角色压入
    if (currentLoadedSkillPrompt) {
      apiMessages.push({
        role: 'system',
        content: currentLoadedSkillPrompt,
      });
    }

    // 压入历史聊天记录（仅 user / assistant）
    const historyMsgs = messages.filter(
      (m: Message) => m.role === 'user' || m.role === 'assistant'
    );
    for (const msg of historyMsgs) {
      apiMessages.push({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      });
    }

    // 压入最新用户消息
    apiMessages.push({ role: 'user', content: userContent });

    // 2. 创建 assistant 消息占位（streaming 状态）
    const assistantMsgId = crypto.randomUUID();
    const assistantMsg: Message = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      streaming: true,
    };
    setMessages((prev) => [...prev, assistantMsg]);
    setIsStreaming(true);

    // 3. 创建 AbortController 用于取消请求
    const abortController = new AbortController();
    abortRef.current = abortController;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages, model: 'gpt-5.4' }),
        signal: abortController.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: '请求失败' }));
        throw new Error(errorData.error || `API 请求失败: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('无法读取流式响应');

      const decoder = new TextDecoder();
      let accumulated = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // 解析 SSE 数据
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // 保留最后一个不完整的行

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data: ')) continue;

          const data = trimmed.slice(6); // 去掉 'data: '

          if (data === '[DONE]') {
            // 流结束
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMsgId ? { ...m, streaming: false } : m
              )
            );
            break;
          }

          try {
            const parsed = JSON.parse(data);
            if (parsed.error) {
              throw new Error(parsed.error);
            }
            if (parsed.content) {
              accumulated += parsed.content;
              const currentContent = accumulated;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMsgId ? { ...m, content: currentContent } : m
                )
              );
            }
          } catch {
            // 解析失败的 SSE 数据行，跳过
          }
        }
      }

      // 确保最终标记 streaming 为 false
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId ? { ...m, streaming: false } : m
        )
      );
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '未知错误';

      // 如果是用户主动取消，不显示错误
      if (errorMessage.includes('abort') || errorMessage.includes('cancel')) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? { ...m, content: m.content || '(已取消)', streaming: false }
              : m
          )
        );
      } else {
        console.error('[ChatPanel] Stream API Error:', errorMessage);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? { ...m, content: '❌ 大模型连接异常，请稍后重试。', streaming: false }
              : m
          )
        );
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }, [currentLoadedSkillPrompt, messages]);

  /* ── 发送消息（流式对话模式） ── */
  const handleSend = useCallback(async () => {
    const text = promptInput.trim();
    if (!text || isStreaming || generating) return;

    // 1. 追加用户消息到聊天流
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setPromptInput('');

    // 2. 调用流式 API
    await streamChatAPI(text);
  }, [promptInput, isStreaming, generating, streamChatAPI]);

  /* ── 尺寸 / 画质 → API 参数映射 ── */
  const mapSizeToApi = useCallback((sizeId: string): string => {
    // genSize 已经是 API 格式 ('1024x1024' 等)，或 'auto'
    if (sizeId === 'auto') return 'auto';
    return sizeId; // 直接透传
  }, []);

  const mapQualityToApi = useCallback((qualityId: string): 'low' | 'high' => {
    // genQuality 已经是 'low' | 'high'，直接透传
    return qualityId === 'high' ? 'high' : 'low';
  }, []);

  /* ── 生成图像 ── */
  const handleGenerate = useCallback(async () => {
    const finalPrompt = promptInput.trim() || appliedPrompt;
    if (!finalPrompt) return;

    // 添加用户消息
    if (promptInput.trim()) {
      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content: promptInput,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setPromptInput('');
    }

    const setGenerateStatus = useAppStore.getState().setGenerateStatus;
    setGenerateStatus('generating');

    // 添加正在生成提示
    const generatingMsg: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '🎨 正在生成图像，请稍候...',
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, generatingMsg]);

    try {
      const uploadNodes = canvasNodes.filter((n: CanvasNode) => n.type === 'upload');
      const effectivePrompt = currentLoadedSkillPrompt
        ? `${currentLoadedSkillPrompt}\n\n${finalPrompt}`
        : finalPrompt;

      let result: { imageUrl?: string; error?: string } | null = null;

      // 优先使用显式引用的图片节点，其次使用画布上的 upload 节点
      const refNode = referencedImageNode;
      const hasRefImages = !!refNode || uploadNodes.length > 0;

      if (hasRefImages) {
        // 图生图：multipart/form-data
        const formData = new FormData();
        formData.append('prompt', effectivePrompt);
        formData.append('size', mapSizeToApi(genSize));
        formData.append('quality', mapQualityToApi(genQuality));
        formData.append('model', genModel);

        // 优先使用显式引用的图片
        const targetNode = refNode || uploadNodes[0];
        const imageResp = await fetch(targetNode.url);
        const imageBlob = await imageResp.blob();
        formData.append('image', imageBlob, targetNode.name || 'reference.png');

        const resp = await fetch('/api/generate/edit', { method: 'POST', body: formData });
        if (!resp.ok) {
          const errData = await resp.json().catch(() => ({ error: '图生图请求失败' }));
          throw new Error(errData.error || '图生图请求失败');
        }
        result = await resp.json();
      } else {
        // 文生图：JSON
        const resp = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: effectivePrompt,
            size: mapSizeToApi(genSize),
            quality: mapQualityToApi(genQuality),
            model: genModel,
          }),
        });
        if (!resp.ok) {
          const errData = await resp.json().catch(() => ({ error: '文生图请求失败' }));
          throw new Error(errData.error || '文生图请求失败');
        }
        result = await resp.json();
      }

      if (result?.imageUrl) {
        const imageUrl = result.imageUrl;
        const addCanvasNode = useAppStore.getState().addCanvasNode;
        addCanvasNode({
          id: crypto.randomUUID(),
          type: 'generated',
          x: 80 + Math.random() * 200,
          y: 60 + Math.random() * 150,
          width: 400,
          height: 400,
          url: imageUrl,
          name: `generated-${Date.now()}.png`,
        });

        // 替换生成中提示为完成提示
        setMessages((prev) =>
          prev.map((m) =>
            m.id === generatingMsg.id
              ? { ...m, content: '✅ 图像已生成完毕！你可以在中央画布查看结果。如需微调，请继续描述你的需求。' }
              : m
          )
        );
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : '生成失败，请重试';
      setMessages((prev) =>
        prev.map((m) =>
          m.id === generatingMsg.id
            ? { ...m, content: `❌ 图像生成失败：${errorMsg}` }
            : m
        )
      );
    } finally {
      setGenerateStatus('idle');
    }
  }, [genModel, genSize, genQuality, canvasNodes, promptInput, appliedPrompt, currentLoadedSkillPrompt, referencedImageNode, mapSizeToApi, mapQualityToApi]);

  const isDisabled = isStreaming || generating;

  return (
    <div className="flex h-full flex-col bg-card">
      {/* ── 标题栏 ── */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">AI 对话助手</h3>
        </div>
        <button
          onClick={handleClear}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground/60 hover:bg-secondary hover:text-muted-foreground transition-colors"
          title="清空对话"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* ── 消息列表 ── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'flex',
                msg.role === 'user' ? 'justify-end' : 'justify-start',
              )}
            >
              {msg.role === 'skill-ref' ? (
                /* ── 精美蓝色引用标签气泡 ── */
                <div className="max-w-[90%] rounded-xl border border-primary/20 bg-primary/10 px-3.5 py-2.5 text-xs">
                  <div className="flex items-start gap-2">
                    <Sparkles className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
                    <span className="font-medium text-primary whitespace-pre-wrap">{msg.content}</span>
                  </div>
                  <div className="mt-1.5 flex items-center justify-end">
                    <button
                      onClick={handleUnlinkSkill}
                      className="rounded-md px-2 py-0.5 text-[10px] font-medium text-primary hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      取消引用
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className={cn(
                    'group relative max-w-[90%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed',
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-sm'
                      : 'bg-secondary text-foreground rounded-bl-sm',
                  )}
                >
                  <div className="whitespace-pre-wrap">
                    {msg.streaming && !msg.content ? (
                      <span className="inline-flex items-center gap-1 text-muted-foreground/60">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span>思考中...</span>
                      </span>
                    ) : (
                      msg.content
                    )}
                    {msg.streaming && msg.content && (
                      <span className="inline-block ml-0.5 h-3.5 w-0.5 animate-pulse bg-primary align-text-bottom" />
                    )}
                  </div>

                  {msg.role === 'assistant' && !msg.streaming && msg.id !== 'welcome' && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="absolute -bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-card border border-border text-muted-foreground/60 opacity-0 group-hover:opacity-100 hover:text-primary transition-all shadow-sm"
                      title="复制"
                    >
                      {copiedId === msg.id ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

      {/* ── 输入框 + 参数控制 ── */}
      <div className="shrink-0 flex flex-col justify-end bg-card">
        <div className="shrink-0 bg-card px-3 pt-3 pb-3 space-y-2">
          {/* ── 当前已激活模板状态栏 ── */}
          {currentLoadedSkillName && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 space-y-1">
              <div className="flex items-center gap-2 min-w-0">
                <Sparkles className="h-3.5 w-3.5 shrink-0 text-primary" />
                <span className="min-w-0 flex-1 text-xs font-medium text-primary truncate">
                  {currentLoadedSkillName}
                  {currentLoadedSkillSceneName && (
                    <span className="text-primary/70"> · {currentLoadedSkillSceneName}</span>
                  )}
                </span>
                <button
                  onClick={() => { clearLoadedSkill(); setPromptInput(''); }}
                  className="ml-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                  title="清除模板"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              <p className="text-[10px] text-primary/60 leading-relaxed pl-5">
                模板已激活，在下方输入你的创意描述，点击「生图」即可基于该风格生成
              </p>
            </div>
          )}

          {/* ── 已引用画板图片 ── */}
          {referencedImageNode && (
            <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50/50 dark:border-amber-900/30 dark:bg-amber-900/10 px-3 py-2">
              <div className="h-8 w-8 shrink-0 rounded-md overflow-hidden border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={referencedImageNode.url} alt="引用" className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-medium text-amber-700 dark:text-amber-400 truncate">
                  已引用画板图片：{referencedImageNode.name}
                </p>
                <p className="text-[10px] text-amber-600/70 dark:text-amber-500/60">
                  生图时将以此图为参考进行图生图
                </p>
              </div>
              <button
                onClick={() => setReferencedImageNode(null)}
                className="ml-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-amber-100 hover:text-amber-700 dark:hover:bg-amber-900/30 transition-colors"
                title="取消引用"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          {/* 输入框 */}
          <textarea
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); handleSend(); } }}
            placeholder="描述你想要的效果…"
            disabled={isStreaming}
            rows={3}
            className={cn(
              'w-full resize-none rounded-xl border border-border bg-secondary px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30',
              isStreaming && 'opacity-60',
            )}
          />
          {/* 底部工具栏：模型 + 尺寸 + 聊天 + 生图 */}
          <div className="flex items-center gap-2">
            <ModelSelect value={genModel} onChange={setGenModel} />
            <SizePicker
              resolution={resolution}
              aspectRatio={aspectRatio}
              onResolutionChange={setResolution}
              onAspectRatioChange={setAspectRatio}
            />
            <div className="ml-auto flex items-center gap-1 rounded-xl bg-secondary p-1">
              {/* 发送消息按钮 */}
              <button
                onClick={handleSend}
                disabled={isDisabled}
                className={cn(
                  'flex h-8 items-center gap-1 rounded-lg px-2.5 text-primary-foreground shadow-sm transition-all shrink-0 text-[11px] font-medium',
                  isDisabled
                    ? 'bg-muted-foreground/30 cursor-not-allowed'
                    : 'bg-primary hover:bg-primary/90 active:scale-95',
                )}
                title="发送消息"
              >
                {isStreaming ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
                {isStreaming ? '发送中' : '聊天'}
              </button>
              {/* 生成图片按钮 */}
              <button
                onClick={handleGenerate}
                disabled={generating || !promptInput.trim()}
                className={cn(
                  'flex h-8 items-center gap-1 rounded-lg px-2.5 text-primary-foreground shadow-sm transition-all shrink-0 text-[11px] font-medium',
                  generating || !promptInput.trim()
                    ? 'bg-muted-foreground/30 cursor-not-allowed'
                    : 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 active:scale-95',
                )}
                title="生成图片"
              >
                {generating ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Wand2 className="h-3.5 w-3.5" />
                )}
                {generating ? '生成中' : '生图'}
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
