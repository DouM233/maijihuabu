'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { GitCommitHorizontal } from 'lucide-react';

interface RelayNodeData {
  label?: string;
}

function RelayNode(props: NodeProps) {
  const { selected } = props;

  return (
    <div
      className={`w-12 h-12 rounded-full border bg-card shadow-sm transition-all flex items-center justify-center ${
        selected ? 'border-primary ring-2 ring-primary/20' : 'border-border'
      }`}
    >
      <Handle type="target" position={Position.Left} className="!w-2 !h-2 !bg-primary" />
      <Handle type="source" position={Position.Right} className="!w-2 !h-2 !bg-primary" />
      <GitCommitHorizontal className="w-4 h-4 text-muted-foreground" />
    </div>
  );
}

export default memo(RelayNode);
