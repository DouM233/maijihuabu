'use client';

import { memo, useCallback } from 'react';
import { Handle, Position, type NodeProps, useReactFlow, useNodes, useEdges } from '@xyflow/react';
import { Image as ImageIcon, Loader2, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ImageNodeData } from '@/lib/canvas/types';

const MODEL_OPTIONS = [
  { value: 'gpt-image-2', label: 'GPT Image 2' },
  { value: 'gemini-3.1-flash-image-preview', label: 'Nano Banana2' },
];

const SIZE_OPTIONS = [
  { value: '1024x1024', label: '1:1' },
  { value: '1024x1536', label: '2:3' },
  { value: '1536x1024', label: '3:2' },
  { value: '1792x1024', label: '16:9' },
];

async function dataUrlToFile(dataUrl: string, fileName: string) {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  return new File([blob], fileName, { type: blob.type || 'image/png' });
}

function ImageNode({ id, data, selected }: NodeProps) {
  const nodeData = data as ImageNodeData;
  const { updateNodeData } = useReactFlow();
  const nodes = useNodes();
  const edges = useEdges();
  const isRunning = nodeData.status === 'generating' || !!(nodeData as Record<string, unknown>)?.isRunning;

  const update = useCallback(
    (patch: Partial<ImageNodeData>) => {
      updateNodeData(id, { ...nodeData, ...patch } as Record<string, unknown>);
    },
    [id, nodeData, updateNodeData]
  );

  const prompt = typeof nodeData.prompt === 'string' ? nodeData.prompt : '';
  const model = typeof nodeData.model === 'string' ? nodeData.model : 'gpt-image-2';
  const size = typeof nodeData.size === 'string' ? nodeData.size : '1024x1024';
  const imageUrl = nodeData.imageUrl;
  const error = nodeData.error;
  const referenceImage = (nodeData as Record<string, unknown>)?.referenceImage as string | undefined;
  const title = nodeData.label || '图像生成';
  const width = ((nodeData as Record<string, unknown>)?.nodeWidth as number | undefined) || 280;
  const height = ((nodeData as Record<string, unknown>)?.nodeHeight as number | undefined) || 420;
  const promptHeight = Math.max(64, Math.min(180, Math.floor((height - 330) * 0.35 + 64)));
  const previewHeight = Math.max(120, height - 365 - promptHeight);

  const upstreamPromptNode = nodes.find(
    (n) =>
      (n.type === 'text' || n.type === 'llm') &&
      edges.some((edge) => edge.source === n.id && edge.target === id)
  );

  const upstreamPromptData = upstreamPromptNode?.data as Record<string, unknown> | undefined;
  const upstreamTextValue = upstreamPromptNode?.type === 'llm'
    ? ((upstreamPromptData?.response as string) || '')
    : ((upstreamPromptData?.prompt as string) || '');
  const finalPrompt = prompt.trim() || upstreamTextValue.trim();

  const runGenerate = useCallback(async () => {
    if (isRunning) return;
    if (!finalPrompt) {
      update({ status: 'error', isRunning: false, error: '请先输入提示词，或连接上游提示词节点。' });
      return;
    }

    update({ status: 'generating', isRunning: true, error: undefined });

    try {
      let result: { imageUrl?: string; error?: string };

      if (referenceImage) {
        const formData = new FormData();
        formData.append('model', model);
        formData.append('prompt', finalPrompt);
        formData.append('size', size);
        formData.append('image', await dataUrlToFile(referenceImage, 'reference.png'));

        const response = await fetch('/api/generate/edit', {
          method: 'POST',
          body: formData,
        });
        result = await response.json();
        if (!response.ok) throw new Error(result.error || `图生图失败：HTTP ${response.status}`);
      } else {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model,
            prompt: finalPrompt,
            size,
          }),
        });
        result = await response.json();
        if (!response.ok) throw new Error(result.error || `文生图失败：HTTP ${response.status}`);
      }

      if (!result.imageUrl) throw new Error('生成接口没有返回图片。');

      update({
        imageUrl: result.imageUrl,
        prompt: finalPrompt,
        status: 'success',
        isRunning: false,
        error: undefined,
      });
    } catch (err) {
      update({
        status: 'error',
        isRunning: false,
        error: err instanceof Error ? err.message : '生成失败',
      });
    }
  }, [finalPrompt, isRunning, model, referenceImage, size, update]);

  return (
    <div
      className={cn(
        'rounded-xl border overflow-hidden shadow-sm transition-all min-w-[260px]',
        selected
          ? 'border-primary/60 shadow-[0_0_0_2px_rgba(139,111,246,0.15)]'
          : 'border-border hover:border-border/80'
      )}
      style={{
        width,
        height,
        minWidth: 260,
        minHeight: 360,
      }}
    >
      {/* 标题栏 */}
      <div className="flex items-center gap-2 px-3 py-2 bg-card border-b border-border">
        <span className="flex items-center justify-center w-5 h-5 rounded bg-amber-500/10 text-amber-500">
          <ImageIcon className="w-3 h-3" />
        </span>
        <span className="text-xs font-semibold text-foreground">{title}</span>
        <span className="ml-auto text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
          {MODEL_OPTIONS.find((m) => m.value === model)?.label}
        </span>
      </div>

      {/* 说明 */}
      <div className="px-3 pt-2 text-[10px] text-muted-foreground leading-tight">
        {upstreamPromptNode ? '已连接上游提示词节点' : '支持文生图/图生图/编辑'}
      </div>

      {/* 内容区 */}
      <div className="px-3 py-2.5 bg-card/60 space-y-2.5">
        {/* Prompt */}
        <div>
          <textarea
            value={prompt}
            onChange={(e) => update({ prompt: e.target.value })}
            placeholder={upstreamTextValue || '描述想要的图像...'}
            className="w-full h-16 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            style={{ height: promptHeight }}
          />
          {upstreamTextValue && (
            <div className="text-[10px] text-muted-foreground mt-0.5">
              本地 Prompt（可选，优先取上游补全结果）
            </div>
          )}
        </div>

        {/* 参考图 */}
        <div className="border rounded-lg border-border/60 bg-muted/30 p-2">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
            <span>参考图 · 上游+本地</span>
            <span className="bg-muted px-1 rounded">{referenceImage ? 1 : 0}</span>
          </div>
          <button
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => update({ referenceImage: reader.result as string });
                reader.readAsDataURL(file);
              };
              input.click();
            }}
            className="w-full text-[10px] py-1 rounded bg-card border border-border text-foreground hover:bg-muted transition-colors"
          >
            + 上传参考图
          </button>
        </div>

        {/* 模型选择 */}
        <div>
          <label className="text-[10px] text-muted-foreground">模型</label>
          <div className="flex gap-1 mt-1">
            {MODEL_OPTIONS.map((m) => (
              <button
                key={m.value}
                onClick={() => update({ model: m.value })}
                className={cn(
                  'flex-1 text-[10px] py-1 rounded-md border transition-colors',
                  model === m.value
                    ? 'bg-primary/10 border-primary/40 text-primary'
                    : 'bg-card border-border text-muted-foreground hover:bg-muted'
                )}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* 尺寸 */}
        <div>
          <label className="text-[10px] text-muted-foreground">尺寸</label>
          <div className="flex gap-1 mt-1">
            {SIZE_OPTIONS.map((s) => (
              <button
                key={s.value}
                onClick={() => update({ size: s.value })}
                className={cn(
                  'flex-1 text-[10px] py-1 rounded-md border transition-colors',
                  size === s.value
                    ? 'bg-primary/10 border-primary/40 text-primary'
                    : 'bg-card border-border text-muted-foreground hover:bg-muted'
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* 图片预览 */}
        {imageUrl && (
          <div className="rounded-lg overflow-hidden border border-border">
            <img
              src={imageUrl}
              alt="generated"
              className="w-full object-contain"
              style={{ maxHeight: previewHeight }}
            />
          </div>
        )}

        {/* 运行状态 */}
        {isRunning && (
          <div className="flex items-center gap-2 text-xs text-primary">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>正在生成...</span>
          </div>
        )}
      </div>

      {/* 底部生成按钮 */}
      {error && (
        <div className="px-3 pb-2 bg-card/60">
          <div className="rounded-md bg-destructive/10 px-2 py-1 text-xs text-destructive">
            {error}
          </div>
        </div>
      )}

      <div className="px-3 pb-3 bg-card/60">
        <button
          onClick={runGenerate}
          disabled={isRunning || !finalPrompt}
          className={cn(
            'w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors',
            isRunning
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : 'bg-primary/10 text-primary hover:bg-primary/20'
          )}
        >
          {isRunning ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              生成中...
            </>
          ) : (
            <>
              <Zap className="w-3.5 h-3.5" />
              生成
            </>
          )}
        </button>
      </div>

      {/* 输入端口 */}
      <Handle
        type="target"
        position={Position.Left}
        id="image-in"
        style={{
          top: '50%',
          width: 10,
          height: 10,
          background: '#06b6d4',
          border: '2px solid #fff',
          boxShadow: '0 0 4px rgba(6,182,212,0.4)',
        }}
      />
      <Handle
        type="target"
        position={Position.Top}
        id="image-in-top"
        style={{
          left: '50%',
          width: 10,
          height: 10,
          background: '#06b6d4',
          border: '2px solid #fff',
          boxShadow: '0 0 4px rgba(6,182,212,0.4)',
        }}
      />

      {/* 输出端口 */}
      <Handle
        type="source"
        position={Position.Right}
        id="image-out"
        style={{
          top: '50%',
          width: 10,
          height: 10,
          background: '#06b6d4',
          border: '2px solid #fff',
          boxShadow: '0 0 4px rgba(6,182,212,0.4)',
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="image-out-bottom"
        style={{
          left: '50%',
          width: 10,
          height: 10,
          background: '#06b6d4',
          border: '2px solid #fff',
          boxShadow: '0 0 4px rgba(6,182,212,0.4)',
        }}
      />
    </div>
  );
}

export default memo(ImageNode);
