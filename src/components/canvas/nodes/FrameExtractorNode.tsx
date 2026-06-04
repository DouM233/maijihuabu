'use client';

import { memo, useState } from 'react';
import { Handle, Position, type NodeProps, useReactFlow } from '@xyflow/react';
import { Film } from 'lucide-react';

interface FrameExtractorNodeData {
  label?: string;
  frameIndex?: number;
  status?: 'idle' | 'running' | 'success' | 'error';
  frameUrl?: string;
  error?: string;
}

function FrameExtractorNode(props: NodeProps) {
  const { data, selected, id } = props;
  const nodeData = data as FrameExtractorNodeData;
  const [index, setIndex] = useState(nodeData.frameIndex || 0);
  const status = nodeData.status || 'idle';
  const frameUrl = nodeData.frameUrl;
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
        <div className="w-6 h-6 rounded-md bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 flex items-center justify-center">
          <Film className="w-3.5 h-3.5" />
        </div>
        <span className="text-sm font-medium text-foreground">抽帧</span>
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        <div>
          <label className="text-[11px] text-muted-foreground">帧序号</label>
          <input
            type="number"
            min={0}
            value={index}
            onChange={(e) => {
              const v = Number(e.target.value);
              setIndex(v);
              updateNodeData(id, { frameIndex: v });
            }}
            className="w-full mt-0.5 text-xs rounded-md bg-muted border border-border px-2 py-1 text-foreground focus:outline-none"
          />
        </div>

        {frameUrl && (
          <div className="rounded-lg overflow-hidden border border-border">
            <img src={frameUrl} alt="frame" className="w-full h-32 object-cover" />
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

export default memo(FrameExtractorNode);
