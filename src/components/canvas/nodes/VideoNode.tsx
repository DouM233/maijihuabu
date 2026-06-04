'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps, useReactFlow } from '@xyflow/react';
import { Video, Loader2 } from 'lucide-react';

interface VideoNodeData {
  label?: string;
  prompt?: string;
  model?: string;
  duration?: string;
  status?: 'idle' | 'generating' | 'success' | 'error';
  videoUrl?: string;
  error?: string;
}

const MODEL_OPTIONS = [
  { value: 'seedance', label: 'Seedance' },
  { value: 'wan', label: 'Wan 2.1' },
];

function VideoNode(props: NodeProps) {
  const { data, selected, id } = props;
  const nodeData = data as VideoNodeData;
  const status = nodeData.status || 'idle';
  const model = nodeData.model || 'seedance';
  const duration = nodeData.duration || '5s';
  const prompt = nodeData.prompt || '';
  const videoUrl = nodeData.videoUrl;
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
        <div className="w-6 h-6 rounded-md bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400 flex items-center justify-center">
          <Video className="w-3.5 h-3.5" />
        </div>
        <span className="text-sm font-medium text-foreground">视频</span>
        <span className="ml-auto text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
          {model}
        </span>
        {status === 'generating' && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
      </div>

      {/* Settings */}
      <div className="px-3 py-2 border-b border-border space-y-2">
        <div>
          <label className="text-[11px] text-muted-foreground">模型</label>
          <select
            defaultValue={model}
            className="w-full mt-0.5 text-xs rounded-md bg-muted border border-border px-2 py-1 text-foreground focus:outline-none"
            onChange={(e) => updateNodeData(id, { model: e.target.value })}
          >
            {MODEL_OPTIONS.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[11px] text-muted-foreground">时长</label>
          <select
            defaultValue={duration}
            className="w-full mt-0.5 text-xs rounded-md bg-muted border border-border px-2 py-1 text-foreground focus:outline-none"
            onChange={(e) => updateNodeData(id, { duration: e.target.value })}
          >
            <option value="5s">5秒</option>
            <option value="10s">10秒</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        <textarea
          defaultValue={prompt}
          placeholder="输入视频描述..."
          className="w-full h-16 resize-none bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
          onChange={(e) => updateNodeData(id, { prompt: e.target.value })}
        />

        {videoUrl && (
          <video src={videoUrl} controls className="w-full rounded-lg" />
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

export default memo(VideoNode);
