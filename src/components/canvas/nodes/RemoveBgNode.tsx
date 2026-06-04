'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Eraser } from 'lucide-react';

interface RemoveBgNodeData {
  label?: string;
  status?: 'idle' | 'running' | 'success' | 'error';
  outputUrl?: string;
  error?: string;
}

function RemoveBgNode(props: NodeProps) {
  const { data, selected } = props;
  const nodeData = data as RemoveBgNodeData;
  const status = nodeData.status || 'idle';
  const outputUrl = nodeData.outputUrl;
  const error = nodeData.error;

  return (
    <div
      className={`w-56 rounded-xl border bg-card shadow-sm transition-all ${
        selected ? 'border-primary ring-2 ring-primary/20' : 'border-border'
      }`}
    >
      <Handle type="target" position={Position.Left} className="!w-2.5 !h-2.5 !bg-primary" />
      <Handle type="source" position={Position.Right} className="!w-2.5 !h-2.5 !bg-primary" />

      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
        <div className="w-6 h-6 rounded-md bg-lime-100 text-lime-600 dark:bg-lime-900/30 dark:text-lime-400 flex items-center justify-center">
          <Eraser className="w-3.5 h-3.5" />
        </div>
        <span className="text-sm font-medium text-foreground">去背景</span>
      </div>

      {/* Content */}
      <div className="p-3">
        {outputUrl ? (
          <div className="rounded-lg overflow-hidden border border-border">
            <img src={outputUrl} alt="removed" className="w-full h-32 object-cover" />
          </div>
        ) : (
          <div className="text-xs text-muted-foreground text-center py-6">
            {status === 'running' ? '处理中...' : '连接输入图像'}
          </div>
        )}

        {error && (
          <div className="text-xs text-destructive bg-destructive/10 rounded-md px-2 py-1 mt-2">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(RemoveBgNode);
