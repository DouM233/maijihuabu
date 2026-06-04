'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps, useReactFlow } from '@xyflow/react';
import { Music, Loader2 } from 'lucide-react';

interface SeedanceNodeData {
  label?: string;
  prompt?: string;
  status?: 'idle' | 'generating' | 'success' | 'error';
  videoUrl?: string;
  progress?: number;
  error?: string;
}

function SeedanceNode(props: NodeProps) {
  const { data, selected, id } = props;
  const nodeData = data as SeedanceNodeData;
  const status = nodeData.status || 'idle';
  const prompt = nodeData.prompt || '';
  const videoUrl = nodeData.videoUrl;
  const error = nodeData.error;
  const progress = typeof nodeData.progress === 'number' ? nodeData.progress : null;
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
        <div className="w-6 h-6 rounded-md bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-900/30 dark:text-fuchsia-400 flex items-center justify-center">
          <Music className="w-3.5 h-3.5" />
        </div>
        <span className="text-sm font-medium text-foreground">Seedance</span>
        {status === 'generating' && <Loader2 className="ml-auto w-4 h-4 text-primary animate-spin" />}
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        <textarea
          defaultValue={prompt}
          placeholder="输入舞蹈/动作描述..."
          className="w-full h-16 resize-none bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
          onChange={(e) => updateNodeData(id, { prompt: e.target.value })}
        />

        {status === 'generating' && typeof progress === 'number' && (
          <div className="w-full bg-muted rounded-full h-1.5">
            <div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        )}

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

export default memo(SeedanceNode);
