'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps, useReactFlow } from '@xyflow/react';
import { AudioLines, Loader2 } from 'lucide-react';

interface AudioNodeData {
  label?: string;
  prompt?: string;
  duration?: string;
  status?: 'idle' | 'generating' | 'success' | 'error';
  audioUrl?: string;
  error?: string;
}

function AudioNode(props: NodeProps) {
  const { data, selected, id } = props;
  const nodeData = data as AudioNodeData;
  const status = nodeData.status || 'idle';
  const prompt = nodeData.prompt || '';
  const duration = nodeData.duration || '5s';
  const audioUrl = nodeData.audioUrl;
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
        <div className="w-6 h-6 rounded-md bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400 flex items-center justify-center">
          <AudioLines className="w-3.5 h-3.5" />
        </div>
        <span className="text-sm font-medium text-foreground">音频</span>
        {status === 'generating' && <Loader2 className="ml-auto w-4 h-4 text-primary animate-spin" />}
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        <textarea
          defaultValue={prompt}
          placeholder="输入音乐描述..."
          className="w-full h-16 resize-none bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
          onChange={(e) => updateNodeData(id, { prompt: e.target.value })}
        />

        <div>
          <label className="text-[11px] text-muted-foreground">时长</label>
          <select
            defaultValue={duration}
            className="w-full mt-0.5 text-xs rounded-md bg-muted border border-border px-2 py-1 text-foreground focus:outline-none"
            onChange={(e) => updateNodeData(id, { duration: e.target.value })}
          >
            <option value="5s">5秒</option>
            <option value="10s">10秒</option>
            <option value="30s">30秒</option>
          </select>
        </div>

        {audioUrl && (
          <audio src={audioUrl} controls className="w-full" />
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

export default memo(AudioNode);
