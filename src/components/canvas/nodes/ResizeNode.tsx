'use client';

import { memo, useState } from 'react';
import { Handle, Position, type NodeProps, useReactFlow } from '@xyflow/react';
import { Maximize } from 'lucide-react';

interface ResizeNodeData {
  label?: string;
  width?: number;
  height?: number;
  status?: 'idle' | 'running' | 'success' | 'error';
  outputUrl?: string;
  error?: string;
}

function ResizeNode(props: NodeProps) {
  const { data, selected, id } = props;
  const nodeData = data as ResizeNodeData;
  const [width, setWidth] = useState(nodeData.width || 512);
  const [height, setHeight] = useState(nodeData.height || 512);
  const status = nodeData.status || 'idle';
  const outputUrl = nodeData.outputUrl;
  const error = nodeData.error;
  const { updateNodeData } = useReactFlow();

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
        <div className="w-6 h-6 rounded-md bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400 flex items-center justify-center">
          <Maximize className="w-3.5 h-3.5" />
        </div>
        <span className="text-sm font-medium text-foreground">尺寸调整</span>
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        <div className="flex gap-2">
          <div className="min-w-0 flex-1">
            <label className="text-[11px] text-muted-foreground">宽</label>
            <input
              type="number"
              value={width}
              onChange={(e) => {
                const v = Number(e.target.value);
                setWidth(v);
                updateNodeData(id, { width: v });
              }}
              className="w-full text-xs rounded-md bg-muted border border-border px-2 py-1 text-foreground focus:outline-none"
            />
          </div>
          <div className="min-w-0 flex-1">
            <label className="text-[11px] text-muted-foreground">高</label>
            <input
              type="number"
              value={height}
              onChange={(e) => {
                const v = Number(e.target.value);
                setHeight(v);
                updateNodeData(id, { height: v });
              }}
              className="w-full text-xs rounded-md bg-muted border border-border px-2 py-1 text-foreground focus:outline-none"
            />
          </div>
        </div>

        {outputUrl && (
          <div className="rounded-lg overflow-hidden border border-border">
            <img src={outputUrl} alt="resized" className="w-full h-32 object-cover" />
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

export default memo(ResizeNode);
