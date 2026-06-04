'use client';

import { memo, useState } from 'react';
import { Handle, Position, type NodeProps, useReactFlow } from '@xyflow/react';
import { Repeat } from 'lucide-react';

interface LoopNodeData {
  label?: string;
  iterations?: number;
  status?: 'idle' | 'running' | 'success' | 'error';
  outputs?: string[];
  error?: string;
}

function LoopNode(props: NodeProps) {
  const { data, selected, id } = props;
  const nodeData = data as LoopNodeData;
  const [iterations, setIterations] = useState(nodeData.iterations || 3);
  const status = nodeData.status || 'idle';
  const outputs = nodeData.outputs;
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
        <div className="w-6 h-6 rounded-md bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 flex items-center justify-center">
          <Repeat className="w-3.5 h-3.5" />
        </div>
        <span className="text-sm font-medium text-foreground">循环</span>
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        <div>
          <label className="text-[11px] text-muted-foreground">迭代次数</label>
          <input
            type="number"
            min={1}
            max={20}
            value={iterations}
            onChange={(e) => {
              const v = Number(e.target.value);
              setIterations(v);
              updateNodeData(id, { iterations: v });
            }}
            className="w-full mt-0.5 text-xs rounded-md bg-muted border border-border px-2 py-1 text-foreground focus:outline-none"
          />
        </div>

        {outputs && outputs.length > 0 && (
          <div className="text-xs text-muted-foreground">
            已生成 {outputs.length} 个结果
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

export default memo(LoopNode);
