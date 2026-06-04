'use client';

import { memo, useState } from 'react';
import { Handle, Position, type NodeProps, useReactFlow } from '@xyflow/react';
import { Scissors } from 'lucide-react';

interface FramePairNodeData {
  label?: string;
  startFrame?: number;
  endFrame?: number;
  status?: 'idle' | 'running' | 'success' | 'error';
  outputUrl?: string;
  error?: string;
}

function FramePairNode(props: NodeProps) {
  const { data, selected, id } = props;
  const nodeData = data as FramePairNodeData;
  const [start, setStart] = useState(nodeData.startFrame || 0);
  const [end, setEnd] = useState(nodeData.endFrame || 1);
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
        <div className="w-6 h-6 rounded-md bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 flex items-center justify-center">
          <Scissors className="w-3.5 h-3.5" />
        </div>
        <span className="text-sm font-medium text-foreground">帧对</span>
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-[11px] text-muted-foreground">起始</label>
            <input
              type="number"
              min={0}
              value={start}
              onChange={(e) => {
                const v = Number(e.target.value);
                setStart(v);
                updateNodeData(id, { startFrame: v });
              }}
              className="flex-1 text-xs rounded-md bg-muted border border-border px-2 py-1 text-foreground focus:outline-none"
            />
          </div>
          <div className="flex-1">
            <label className="text-[11px] text-muted-foreground">结束</label>
            <input
              type="number"
              min={0}
              value={end}
              onChange={(e) => {
                const v = Number(e.target.value);
                setEnd(v);
                updateNodeData(id, { endFrame: v });
              }}
              className="flex-1 text-xs rounded-md bg-muted border border-border px-2 py-1 text-foreground focus:outline-none"
            />
          </div>
        </div>

        {outputUrl && (
          <div className="rounded-lg overflow-hidden border border-border">
            <img src={outputUrl} alt="pair" className="w-full h-32 object-cover" />
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

export default memo(FramePairNode);
