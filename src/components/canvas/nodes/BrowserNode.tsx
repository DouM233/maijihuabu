'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps, useReactFlow } from '@xyflow/react';
import { Globe } from 'lucide-react';

interface BrowserNodeData {
  label?: string;
  url?: string;
  status?: 'idle' | 'running' | 'success' | 'error';
  result?: string;
  error?: string;
}

function BrowserNode(props: NodeProps) {
  const { data, selected, id } = props;
  const nodeData = data as BrowserNodeData;
  const url = nodeData.url || '';
  const status = nodeData.status || 'idle';
  const result = nodeData.result;
  const error = nodeData.error;
  const { updateNodeData } = useReactFlow();

  return (
    <div
      className={`w-64 rounded-xl border bg-card shadow-sm transition-all ${
        selected ? 'border-primary ring-2 ring-primary/20' : 'border-border'
      }`}
    >
      <Handle type="target" position={Position.Left} className="!w-2.5 !h-2.5 !bg-primary" />
      <Handle type="source" position={Position.Right} className="!w-2.5 !h-2.5 !bg-primary" />

      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
        <div className="w-6 h-6 rounded-md bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400 flex items-center justify-center">
          <Globe className="w-3.5 h-3.5" />
        </div>
        <span className="text-sm font-medium text-foreground">浏览器</span>
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        <input
          defaultValue={url}
          placeholder="https://..."
          className="w-full text-xs rounded-md bg-muted border border-border px-2 py-1.5 text-foreground placeholder:text-muted-foreground focus:outline-none"
          onChange={(e) => updateNodeData(id, { url: e.target.value })}
        />

        {result && (
          <div className="max-h-32 overflow-y-auto text-xs text-foreground bg-muted rounded-md p-2">
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

export default memo(BrowserNode);
