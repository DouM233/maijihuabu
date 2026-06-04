'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps, useReactFlow } from '@xyflow/react';
import { Lightbulb } from 'lucide-react';

interface IdeaNodeData {
  label?: string;
  content?: string;
}

function IdeaNode(props: NodeProps) {
  const { data, selected, id } = props;
  const nodeData = data as IdeaNodeData;
  const content = nodeData.content || '';
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
        <div className="w-6 h-6 rounded-md bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400 flex items-center justify-center">
          <Lightbulb className="w-3.5 h-3.5" />
        </div>
        <span className="text-sm font-medium text-foreground">灵感</span>
      </div>

      {/* Content */}
      <div className="p-3">
        <textarea
          defaultValue={content}
          placeholder="记录灵感..."
          className="w-full h-20 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          onChange={(e) => updateNodeData(id, { content: e.target.value })}
        />
      </div>
    </div>
  );
}

export default memo(IdeaNode);
