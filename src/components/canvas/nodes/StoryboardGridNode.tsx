'use client';

import { memo, useState } from 'react';
import { Handle, Position, type NodeProps, useReactFlow } from '@xyflow/react';
import { LayoutGrid } from 'lucide-react';

interface StoryboardGridNodeData {
  label?: string;
  rows?: number;
  cols?: number;
  status?: 'idle' | 'running' | 'success' | 'error';
  outputUrls?: string[];
  error?: string;
}

function StoryboardGridNode(props: NodeProps) {
  const { data, selected, id } = props;
  const nodeData = data as StoryboardGridNodeData;
  const [rows, setRows] = useState(nodeData.rows || 2);
  const [cols, setCols] = useState(nodeData.cols || 2);
  const status = nodeData.status || 'idle';
  const outputUrls = nodeData.outputUrls;
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
        <div className="w-6 h-6 rounded-md bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 flex items-center justify-center">
          <LayoutGrid className="w-3.5 h-3.5" />
        </div>
        <span className="text-sm font-medium text-foreground">故事板网格</span>
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        <div className="flex gap-2">
          <div className="min-w-0 flex-1">
            <label className="text-[11px] text-muted-foreground">行</label>
            <input
              type="number"
              min={1}
              max={10}
              value={rows}
              onChange={(e) => {
                const v = Number(e.target.value);
                setRows(v);
                updateNodeData(id, { rows: v });
              }}
              className="w-full text-xs rounded-md bg-muted border border-border px-2 py-1 text-foreground focus:outline-none"
            />
          </div>
          <div className="min-w-0 flex-1">
            <label className="text-[11px] text-muted-foreground">列</label>
            <input
              type="number"
              min={1}
              max={10}
              value={cols}
              onChange={(e) => {
                const v = Number(e.target.value);
                setCols(v);
                updateNodeData(id, { cols: v });
              }}
              className="w-full text-xs rounded-md bg-muted border border-border px-2 py-1 text-foreground focus:outline-none"
            />
          </div>
        </div>

        {outputUrls && outputUrls.length > 0 && (
          <div className="grid grid-cols-3 gap-1">
            {outputUrls.map((url, i) => (
              <div key={i} className="rounded-lg overflow-hidden border border-border aspect-square">
                <img src={url} alt={`story-${i}`} className="w-full h-full object-cover" />
              </div>
            ))}
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

export default memo(StoryboardGridNode);
