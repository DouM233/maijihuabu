'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps, useReactFlow } from '@xyflow/react';
import { Type } from 'lucide-react';

interface TextNodeData {
  label?: string;
  prompt?: string;
  status?: 'idle' | 'generating' | 'success' | 'error';
}

function TextNode(props: NodeProps) {
  const { data, selected, id } = props;
  const nodeData = data as TextNodeData;
  const prompt = nodeData.prompt || '';
  const status = nodeData.status || 'idle';
  const { updateNodeData } = useReactFlow();

  return (
    <div
      className={`w-56 rounded-xl border bg-card shadow-sm transition-all ${
        selected ? 'border-primary ring-2 ring-primary/20' : 'border-border'
      } ${status === 'generating' ? 'opacity-80' : ''}`}
    >
      <Handle type="target" position={Position.Left} className="!w-2.5 !h-2.5 !bg-primary" />
      <Handle type="source" position={Position.Right} className="!w-2.5 !h-2.5 !bg-primary" />

      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
        <div className="w-6 h-6 rounded-md bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400 flex items-center justify-center">
          <Type className="w-3.5 h-3.5" />
        </div>
        <span className="text-sm font-medium text-foreground">文本</span>
        {status === 'generating' && (
          <div className="ml-auto w-2 h-2 rounded-full bg-primary animate-pulse" />
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <textarea
          defaultValue={prompt}
          placeholder="输入提示词..."
          className="w-full h-20 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          onChange={(e) => updateNodeData(id, { prompt: e.target.value })}
        />
      </div>
    </div>
  );
}

export default memo(TextNode);
