'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps, useReactFlow } from '@xyflow/react';
import { IdCard } from 'lucide-react';

interface PortraitMetadataNodeData {
  label?: string;
  metadata?: string;
}

function PortraitMetadataNode(props: NodeProps) {
  const { data, selected, id } = props;
  const nodeData = data as PortraitMetadataNodeData;
  const metadata = nodeData.metadata || '';
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
        <div className="w-6 h-6 rounded-md bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 flex items-center justify-center">
          <IdCard className="w-3.5 h-3.5" />
        </div>
        <span className="text-sm font-medium text-foreground">肖像元数据</span>
      </div>

      {/* Content */}
      <div className="p-3">
        <textarea
          defaultValue={metadata}
          placeholder="人物元数据..."
          className="w-full h-16 resize-none bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
          onChange={(e) => updateNodeData(id, { metadata: e.target.value })}
        />
      </div>
    </div>
  );
}

export default memo(PortraitMetadataNode);
