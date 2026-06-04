'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps, useReactFlow } from '@xyflow/react';
import { Film, Loader2 } from 'lucide-react';

interface CinematicNodeData {
  label?: string;
  prompt?: string;
  lang?: 'zh' | 'en';
  status?: 'idle' | 'generating' | 'success' | 'error';
  result?: string;
  error?: string;
}

function CinematicNode(props: NodeProps) {
  const { data, selected, id } = props;
  const nodeData = data as CinematicNodeData;
  const status = nodeData.status || 'idle';
  const lang = nodeData.lang || 'zh';
  const prompt = nodeData.prompt || '';
  const result = nodeData.result;
  const error = nodeData.error;
  const { updateNodeData } = useReactFlow();

  return (
    <div
      className={`w-64 rounded-xl border bg-card shadow-sm transition-all ${
        selected ? 'border-primary ring-2 ring-primary/20' : 'border-border'
      } ${status === 'generating' ? 'opacity-80' : ''}`}
    >
      <Handle type="target" position={Position.Left} className="!w-2.5 !h-2.5 !bg-primary" />
      <Handle type="source" position={Position.Right} className="!w-2.5 !h-2.5 !bg-primary" />

      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
        <div className="w-6 h-6 rounded-md bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 flex items-center justify-center">
          <Film className="w-3.5 h-3.5" />
        </div>
        <span className="text-sm font-medium text-foreground">电影感</span>
        <span className="ml-auto text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
          {lang === 'zh' ? '中文' : 'English'}
        </span>
        {status === 'generating' && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
      </div>

      {/* Settings */}
      <div className="px-3 py-2 border-b border-border">
        <label className="text-[11px] text-muted-foreground">语言</label>
        <select
          defaultValue={lang}
          className="w-full mt-0.5 text-xs rounded-md bg-muted border border-border px-2 py-1 text-foreground focus:outline-none"
          onChange={(e) => updateNodeData(id, { lang: e.target.value as 'zh' | 'en' })}
        >
          <option value="zh">中文</option>
          <option value="en">English</option>
        </select>
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        <textarea
          defaultValue={prompt}
          placeholder="输入电影感描述..."
          className="w-full h-16 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          onChange={(e) => updateNodeData(id, { prompt: e.target.value })}
        />

        {result && (
          <div className="text-xs text-foreground bg-muted rounded-md p-2 max-h-24 overflow-y-auto">
            {result}
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

export default memo(CinematicNode);
