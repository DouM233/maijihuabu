'use client';

import { memo, useState } from 'react';
import { Handle, Position, type NodeProps, useReactFlow } from '@xyflow/react';
import { ListFilter } from 'lucide-react';

interface PickFromSetNodeData {
  label?: string;
  count?: number;
  status?: 'idle' | 'running' | 'success' | 'error';
  selectedUrls?: string[];
  error?: string;
}

function PickFromSetNode(props: NodeProps) {
  const { data, selected, id } = props;
  const nodeData = data as PickFromSetNodeData;
  const [count, setCount] = useState(nodeData.count || 1);
  const status = nodeData.status || 'idle';
  const selectedUrls = nodeData.selectedUrls;
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
        <div className="w-6 h-6 rounded-md bg-slate-100 text-slate-600 dark:bg-slate-900/30 dark:text-slate-400 flex items-center justify-center">
          <ListFilter className="w-3.5 h-3.5" />
        </div>
        <span className="text-sm font-medium text-foreground">选取</span>
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        <div>
          <label className="text-[11px] text-muted-foreground">选取数量</label>
          <input
            type="number"
            min={1}
            max={20}
            value={count}
            onChange={(e) => {
              const v = Number(e.target.value);
              setCount(v);
              updateNodeData(id, { count: v });
            }}
            className="w-full mt-0.5 text-xs rounded-md bg-muted border border-border px-2 py-1 text-foreground focus:outline-none"
          />
        </div>

        {selectedUrls && selectedUrls.length > 0 && (
          <div className="grid grid-cols-2 gap-1">
            {selectedUrls.map((url, i) => (
              <div key={i} className="rounded-lg overflow-hidden border border-border aspect-square">
                <img src={url} alt={`pick-${i}`} className="w-full h-full object-cover" />
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

export default memo(PickFromSetNode);
