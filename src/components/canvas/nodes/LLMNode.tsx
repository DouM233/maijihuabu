'use client';

import { memo, useEffect, useState } from 'react';
import { Handle, Position, type NodeProps, useEdges, useReactFlow } from '@xyflow/react';
import { Bot, Loader2, Wand2 } from 'lucide-react';

interface LLMNodeData {
  label?: string;
  prompt?: string;
  systemPrompt?: string;
  model?: string;
  nodeWidth?: number;
  nodeHeight?: number;
  response?: string;
  status?: 'idle' | 'generating' | 'success' | 'error';
  error?: string;
}

const MODEL_OPTIONS = [
  { value: 'gpt-5.4', label: 'GPT-5.4' },
];

function LLMNode(props: NodeProps) {
  const { data, selected, id } = props;
  const nodeData = data as LLMNodeData;
  const status = nodeData.status || 'idle';
  const model = nodeData.model || 'gpt-5.4';
  const [systemPrompt, setSystemPrompt] = useState(nodeData.systemPrompt || '');
  const [prompt, setPrompt] = useState(nodeData.prompt || '');
  const title = nodeData.label || 'LLM';
  const response = nodeData.response;
  const error = nodeData.error;
  const width = nodeData.nodeWidth || 280;
  const height = nodeData.nodeHeight || 420;
  const isGenerating = status === 'generating';
  const fieldHeight = Math.max(72, Math.floor((height - 280 - (response ? 80 : 0) - (error ? 32 : 0)) / 2));
  const { updateNodeData } = useReactFlow();
  const edges = useEdges();

  useEffect(() => {
    setSystemPrompt(nodeData.systemPrompt || '');
    setPrompt(nodeData.prompt || '');
  }, [id, nodeData.systemPrompt, nodeData.prompt]);

  const runCompletion = async () => {
    if (isGenerating) return;

    updateNodeData(id, {
      status: 'generating',
      error: undefined,
      response: '',
    });

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt || '你是专业电商视觉提示词助手。' },
            { role: 'user', content: prompt },
          ],
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || `补全失败：HTTP ${res.status}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('无法读取补全结果');

      const decoder = new TextDecoder();
      let buffer = '';
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const chunks = buffer.split('\n\n');
        buffer = chunks.pop() || '';

        for (const chunk of chunks) {
          const line = chunk.trim();
          if (!line.startsWith('data: ')) continue;

          const payload = line.slice(6);
          if (payload === '[DONE]') continue;

          const parsed = JSON.parse(payload) as { content?: string; error?: string };
          if (parsed.error) throw new Error(parsed.error);
          if (parsed.content) {
            fullText += parsed.content;
            updateNodeData(id, { response: fullText });
          }
        }
      }

      const finalPrompt = fullText.trim();
      if (!finalPrompt) throw new Error('大模型没有返回可用提示词');

      updateNodeData(id, {
        response: finalPrompt,
        status: 'success',
        error: undefined,
      });

      for (const edge of edges.filter((edge) => edge.source === id)) {
        updateNodeData(edge.target, {
          prompt: finalPrompt,
          upstreamPromptSource: id,
        });
      }
    } catch (err) {
      updateNodeData(id, {
        status: 'error',
        error: err instanceof Error ? err.message : '补全失败',
      });
    }
  };

  return (
    <div
      className={`flex flex-col rounded-xl border bg-card shadow-sm transition-all ${
        selected ? 'border-primary ring-2 ring-primary/20' : 'border-border'
      } ${isGenerating ? 'opacity-80' : ''}`}
      style={{
        width,
        height,
        minWidth: 260,
        minHeight: 320,
      }}
    >
      <Handle type="target" position={Position.Left} id="llm-in" className="!w-2.5 !h-2.5 !bg-primary" />
      <Handle type="source" position={Position.Right} id="llm-out" className="!w-2.5 !h-2.5 !bg-primary" />

      {/* Header */}
      <div className="flex shrink-0 items-center gap-2 px-3 py-2 border-b border-border">
        <div className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 flex items-center justify-center">
          <Bot className="w-3.5 h-3.5" />
        </div>
        <span className="text-sm font-medium text-foreground">{title}</span>
        <span className="ml-auto text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
          {MODEL_OPTIONS.find((m) => m.value === model)?.label}
        </span>
        {isGenerating && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
      </div>

      {/* Settings */}
      <div className="shrink-0 px-3 py-2 border-b border-border">
        <label className="text-[11px] text-muted-foreground">模型</label>
        <select
          defaultValue={model}
          className="w-full mt-0.5 text-xs rounded-md bg-muted border border-border px-2 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
          onChange={(e) => updateNodeData(id, { model: e.target.value })}
        >
          {MODEL_OPTIONS.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
      </div>

      {/* Content */}
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3 pb-4">
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-muted-foreground">Skill 规则</label>
          <textarea
            value={systemPrompt}
            placeholder="系统提示词（可选）..."
            className="w-full h-24 resize-none rounded-lg border border-border bg-background px-2.5 py-2 text-xs text-foreground placeholder:text-muted-foreground shadow-inner focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
            style={{ height: fieldHeight }}
            onChange={(e) => {
              setSystemPrompt(e.target.value);
              updateNodeData(id, { systemPrompt: e.target.value });
            }}
          />
        </div>
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-muted-foreground">本次需求 / 修改意见</label>
          <textarea
            value={prompt}
            placeholder="输入这次要补齐或修改的产品、场景、人物、卖点..."
            className="w-full h-24 resize-none rounded-lg border border-border bg-background px-2.5 py-2 text-sm text-foreground placeholder:text-muted-foreground shadow-inner focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
            style={{ height: fieldHeight }}
            onChange={(e) => {
              setPrompt(e.target.value);
              updateNodeData(id, { prompt: e.target.value });
            }}
          />
        </div>

        <button
          type="button"
          onClick={runCompletion}
          disabled={isGenerating || !prompt.trim()}
          className="flex w-full shrink-0 items-center justify-center gap-1.5 rounded-lg bg-primary/10 px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isGenerating ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Wand2 className="h-3.5 w-3.5" />
          )}
          {isGenerating ? '补全中...' : '运行补全并传给生图'}
        </button>

        {response && (
          <div className="text-xs text-foreground bg-muted rounded-md p-2 max-h-24 overflow-y-auto">
            {response}
          </div>
        )}

        {error && (
          <div className="text-xs text-destructive bg-destructive/10 rounded-md px-2 py-1">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(LLMNode);
