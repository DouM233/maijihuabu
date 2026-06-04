'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps, useReactFlow } from '@xyflow/react';
import { Scan, Loader2 } from 'lucide-react';

interface Panorama720NodeData {
  label?: string;
  prompt?: string;
  status?: 'idle' | 'generating' | 'success' | 'error';
  panoramaUrl?: string;
  error?: string;
}

function Panorama720Node(props: NodeProps) {
  const { data, selected, id } = props;
  const nodeData = data as Panorama720NodeData;
  const status = nodeData.status || 'idle';
  const prompt = nodeData.prompt || '';
  const panoramaUrl = nodeData.panoramaUrl;
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
        <div className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 flex items-center justify-center">
          <Scan className="w-3.5 h-3.5" />
        </div>
        <span className="text-sm font-medium text-foreground">720全景</span>
        {status === 'generating' && <Loader2 className="ml-auto w-4 h-4 text-primary animate-spin" />}
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        <textarea
          defaultValue={prompt}
          placeholder="输入全景场景描述..."
          className="w-full h-16 resize-none bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
          onChange={(e) => updateNodeData(id, { prompt: e.target.value })}
        />

        {panoramaUrl && (
          <div className="rounded-lg overflow-hidden border border-border">
            <img src={panoramaUrl} alt="panorama" className="w-full h-32 object-cover" />
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

export default memo(Panorama720Node);
