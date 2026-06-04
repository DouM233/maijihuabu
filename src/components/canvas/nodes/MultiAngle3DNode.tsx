'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps, useReactFlow } from '@xyflow/react';
import { Box, Loader2 } from 'lucide-react';

interface MultiAngle3DNodeData {
  label?: string;
  prompt?: string;
  status?: 'idle' | 'generating' | 'success' | 'error';
  outputs?: string[];
  error?: string;
}

function MultiAngle3DNode(props: NodeProps) {
  const { data, selected, id } = props;
  const nodeData = data as MultiAngle3DNodeData;
  const status = nodeData.status || 'idle';
  const prompt = nodeData.prompt || '';
  const outputs = nodeData.outputs;
  const error = nodeData.error;
  const { updateNodeData } = useReactFlow();

  return (
    <div
      className={`w-64 rounded-xl border bg-card shadow-sm transition-all ${
        selected ? 'border-primary ring-2 ring-primary/20' : 'border-border'
      } ${status === 'generating' ? 'opacity-80' : ''}`}
    >
      <Handle type="target" position={Position.Left} className="!w-2.5 !h-2.5 !bg-primary" />
      <Handle type="source" position={Position.Right} className="!w-2.5 !h-2.5 !bg-primary" />

      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
        <div className="w-6 h-6 rounded-md bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400 flex items-center justify-center">
          <Box className="w-3.5 h-3.5" />
        </div>
        <span className="text-sm font-medium text-foreground">多视角3D</span>
        {status === 'generating' && <Loader2 className="ml-auto w-4 h-4 text-primary animate-spin" />}
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        <textarea
          defaultValue={prompt}
          placeholder="输入3D模型描述..."
          className="w-full h-16 resize-none bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
          onChange={(e) => updateNodeData(id, { prompt: e.target.value })}
        />

        {outputs && outputs.length > 0 && (
          <div className="grid grid-cols-2 gap-1">
            {outputs.map((url, i) => (
              <div key={i} className="rounded-lg overflow-hidden border border-border aspect-square">
                <img src={url} alt={`3d-${i}`} className="w-full h-full object-cover" />
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

export default memo(MultiAngle3DNode);
