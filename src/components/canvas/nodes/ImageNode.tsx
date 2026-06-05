'use client';

import { memo, useCallback } from 'react';
import {
  Handle,
  Position,
  type Edge,
  type Node,
  type NodeProps,
  useEdges,
  useNodes,
  useReactFlow,
} from '@xyflow/react';
import { Image as ImageIcon, Loader2, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ImageNodeData } from '@/lib/canvas/types';

const MODEL_OPTIONS = [
  { value: 'gpt-image-2', label: 'GPT Image 2' },
  { value: 'gemini-3.1-flash-image-preview', label: 'Nano Banana2' },
];

const SIZE_OPTIONS = [
  { value: '1080x1920', label: '9:16' },
  { value: '1200x1600', label: '3:4' },
  { value: '1024x1024', label: '1:1' },
];

async function dataUrlToFile(dataUrl: string, fileName: string) {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  return new File([blob], fileName, { type: blob.type || 'image/png' });
}

function getImageFromNode(node: Node) {
  const data = node.data as Record<string, unknown>;
  return (data.imageUrl as string | undefined) || (data.referenceImage as string | undefined);
}

function ImageNode({ id, data, selected }: NodeProps) {
  const nodeData = data as ImageNodeData;
  const { addEdges, addNodes, getNode, updateNodeData } = useReactFlow();
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
  const rawSize = typeof nodeData.size === 'string' ? nodeData.size : '1200x1600';
  const size = SIZE_OPTIONS.some((option) => option.value === rawSize) ? rawSize : '1200x1600';
  const imageUrl = nodeData.imageUrl;
  const error = nodeData.error;
  const localReferenceImage = (nodeData as Record<string, unknown>)?.referenceImage as string | undefined;
  const title = nodeData.label || '图像生成';
  const width = ((nodeData as Record<string, unknown>)?.nodeWidth as number | undefined) || 320;
  const height = ((nodeData as Record<string, unknown>)?.nodeHeight as number | undefined) || 520;
  const previewHeight = Math.max(120, Math.floor(height * 0.24));
  const promptHeight = Math.max(110, height - 310 - (imageUrl ? previewHeight : 0) - (error ? 44 : 0));

  const upstreamPromptNode = nodes.find(
    (node) =>
      (node.type === 'text' || node.type === 'llm') &&
      edges.some((edge) => edge.source === node.id && edge.target === id)
  );

  const upstreamImageNodes = nodes.filter(
    (node) =>
      (node.type === 'upload' || node.type === 'image') &&
      node.id !== id &&
      edges.some((edge) => edge.source === node.id && edge.target === id)
  );

  const upstreamPromptData = upstreamPromptNode?.data as Record<string, unknown> | undefined;
  const upstreamTextValue = upstreamPromptNode?.type === 'llm'
    ? ((upstreamPromptData?.response as string) || '')
    : ((upstreamPromptData?.prompt as string) || '');
  const finalPrompt = prompt.trim() || upstreamTextValue.trim();
  const upstreamReferenceImages = upstreamImageNodes.map(getImageFromNode).filter((url): url is string => Boolean(url));
  const effectiveReferenceImage = localReferenceImage || upstreamReferenceImages[0];

  const publishResultNode = useCallback((resultImageUrl: string) => {
    const existingOutputEdge = edges.find((edge) => {
      if (edge.source !== id) return false;
      const target = nodes.find((node) => node.id === edge.target);
      return target?.type === 'output' && (target.data as Record<string, unknown>)?.generatedFrom === id;
    });

    if (existingOutputEdge) {
      updateNodeData(existingOutputEdge.target, {
        label: '生成结果',
        items: [resultImageUrl],
        imageUrl: resultImageUrl,
        prompt: finalPrompt,
        sourceImageNodeId: id,
        generatedFrom: id,
        nodeWidth: 360,
        nodeHeight: 520,
      });
      return;
    }

    const sourceNode = getNode(id);
    const resultNodeId = `image_result_${Date.now()}`;
    const resultNode: Node = {
      id: resultNodeId,
      type: 'output',
      position: {
        x: (sourceNode?.position.x ?? 0) + width + 80,
        y: sourceNode?.position.y ?? 0,
      },
      data: {
        label: '生成结果',
        items: [resultImageUrl],
        imageUrl: resultImageUrl,
        prompt: finalPrompt,
        sourceImageNodeId: id,
        generatedFrom: id,
        nodeWidth: 360,
        nodeHeight: 520,
      },
    };
    const resultEdge: Edge = {
      id: `${id}-${resultNodeId}`,
      source: id,
      sourceHandle: 'image-out',
      target: resultNodeId,
      targetHandle: 'output-in',
      animated: true,
    };

    addNodes(resultNode);
    addEdges(resultEdge);
  }, [addEdges, addNodes, edges, finalPrompt, getNode, id, nodes, updateNodeData, width]);

  const runGenerate = useCallback(async () => {
    if (isRunning) return;
    if (!finalPrompt) {
      update({ status: 'error', isRunning: false, error: '请先输入提示词，或连接上游提示词节点。' });
      return;
    }

    update({ status: 'generating', isRunning: true, error: undefined });

    try {
      let result: { imageUrl?: string; error?: string };

      if (effectiveReferenceImage) {
        const formData = new FormData();
        formData.append('model', model);
        formData.append('prompt', finalPrompt);
        formData.append('size', size);
        formData.append('image', await dataUrlToFile(effectiveReferenceImage, 'reference.png'));

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
      publishResultNode(result.imageUrl);
    } catch (err) {
      update({
        status: 'error',
        isRunning: false,
        error: err instanceof Error ? err.message : '生成失败',
      });
    }
  }, [effectiveReferenceImage, finalPrompt, isRunning, model, publishResultNode, size, update]);

  return (
    <div
      className={cn(
        'flex flex-col rounded-xl border bg-card shadow-sm transition-all min-w-[280px]',
        selected
          ? 'border-primary/60 shadow-[0_0_0_2px_rgba(139,111,246,0.15)]'
          : 'border-border hover:border-border/80'
      )}
      style={{
        width,
        height,
        minWidth: 280,
        minHeight: 420,
      }}
    >
      <div className="flex shrink-0 items-center gap-2 border-b border-border bg-card px-3 py-2">
        <span className="flex h-5 w-5 items-center justify-center rounded bg-amber-500/10 text-amber-500">
          <ImageIcon className="h-3 w-3" />
        </span>
        <span className="text-xs font-semibold text-foreground">{title}</span>
        <span className="ml-auto rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
          {MODEL_OPTIONS.find((m) => m.value === model)?.label}
        </span>
      </div>

      <div className="shrink-0 px-3 pt-2 text-[10px] leading-tight text-muted-foreground">
        {upstreamPromptNode ? '已连接上游提示词节点' : '支持文生图 / 图生图 / 编辑'}
        {effectiveReferenceImage && (
          <span className="ml-1 rounded bg-primary/10 px-1 text-primary">
            参考图 {upstreamReferenceImages.length || 1}
          </span>
        )}
      </div>

      <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto bg-card/60 px-3 py-2.5">
        <div>
          <textarea
            value={prompt}
            onChange={(event) => update({ prompt: event.target.value })}
            placeholder={upstreamTextValue || '描述想要的图像...'}
            className="w-full resize-none rounded-lg border border-border bg-background px-2.5 py-2 text-sm text-foreground shadow-inner placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
            style={{ height: promptHeight }}
          />
          {upstreamTextValue && (
            <div className="mt-0.5 text-[10px] text-muted-foreground">
              已接收上游补全结果，本地填写会优先覆盖
            </div>
          )}
        </div>

        <div className="rounded-lg border border-border/60 bg-muted/30 p-2">
          <div className="mb-1 flex items-center justify-between text-[10px] text-muted-foreground">
            <span>参考图 · 上游 + 本地</span>
            <span className="rounded bg-muted px-1">{effectiveReferenceImage ? upstreamReferenceImages.length || 1 : 0}</span>
          </div>
          {upstreamReferenceImages.length > 0 && (
            <div className="mb-1 grid grid-cols-3 gap-1">
              {upstreamReferenceImages.slice(0, 3).map((url, index) => (
                <img
                  key={`${url}-${index}`}
                  src={url}
                  alt={`reference-${index + 1}`}
                  className="h-12 w-full rounded border border-border object-cover"
                />
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.onchange = (event) => {
                const file = (event.target as HTMLInputElement).files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => update({ referenceImage: reader.result as string });
                reader.readAsDataURL(file);
              };
              input.click();
            }}
            className="w-full rounded border border-border bg-card py-1 text-[10px] text-foreground transition-colors hover:bg-muted"
          >
            + 上传本地参考图
          </button>
        </div>

        <div>
          <label className="text-[10px] text-muted-foreground">模型</label>
          <div className="mt-1 flex gap-1">
            {MODEL_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => update({ model: option.value })}
                className={cn(
                  'flex-1 rounded-md border py-1 text-[10px] transition-colors',
                  model === option.value
                    ? 'border-primary/40 bg-primary/10 text-primary'
                    : 'border-border bg-card text-muted-foreground hover:bg-muted'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[10px] text-muted-foreground">尺寸</label>
          <div className="mt-1 flex gap-1">
            {SIZE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => update({ size: option.value })}
                className={cn(
                  'flex-1 rounded-md border py-1 text-[10px] transition-colors',
                  size === option.value
                    ? 'border-primary/40 bg-primary/10 text-primary'
                    : 'border-border bg-card text-muted-foreground hover:bg-muted'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {imageUrl && (
          <div className="overflow-hidden rounded-lg border border-border">
            <img src={imageUrl} alt="generated" className="w-full object-contain" style={{ maxHeight: previewHeight }} />
          </div>
        )}

        {isRunning && (
          <div className="flex items-center gap-2 text-xs text-primary">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>正在生成...</span>
          </div>
        )}

        {error && (
          <div className="rounded-md bg-destructive/10 px-2 py-1 text-xs text-destructive">
            {error}
          </div>
        )}
      </div>

      <div className="shrink-0 bg-card/60 px-3 pb-3">
        <button
          type="button"
          onClick={runGenerate}
          disabled={isRunning || !finalPrompt}
          className={cn(
            'flex w-full items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition-colors',
            isRunning || !finalPrompt
              ? 'cursor-not-allowed bg-muted text-muted-foreground'
              : 'bg-primary/10 text-primary hover:bg-primary/20'
          )}
        >
          {isRunning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Zap className="h-3.5 w-3.5" />}
          {isRunning ? '生成中...' : '生成'}
        </button>
      </div>

      <Handle type="target" position={Position.Left} id="image-in" className="!h-2.5 !w-2.5 !border-2 !border-white !bg-cyan-500" />
      <Handle type="target" position={Position.Top} id="image-in-top" className="!h-2.5 !w-2.5 !border-2 !border-white !bg-cyan-500" />
      <Handle type="source" position={Position.Right} id="image-out" className="!h-2.5 !w-2.5 !border-2 !border-white !bg-cyan-500" />
      <Handle type="source" position={Position.Bottom} id="image-out-bottom" className="!h-2.5 !w-2.5 !border-2 !border-white !bg-cyan-500" />
    </div>
  );
}

export default memo(ImageNode);
