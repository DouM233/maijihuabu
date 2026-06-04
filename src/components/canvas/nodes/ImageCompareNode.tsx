'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { GitCompare } from 'lucide-react';

interface ImageCompareNodeData {
  label?: string;
  status?: 'idle' | 'running' | 'success' | 'error';
  image1Url?: string;
  image2Url?: string;
  error?: string;
}

function ImageCompareNode(props: NodeProps) {
  const { data, selected } = props;
  const nodeData = data as ImageCompareNodeData;
  const status = nodeData.status || 'idle';
  const image1Url = nodeData.image1Url;
  const image2Url = nodeData.image2Url;
  const error = nodeData.error;

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
        <div className="w-6 h-6 rounded-md bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400 flex items-center justify-center">
          <GitCompare className="w-3.5 h-3.5" />
        </div>
        <span className="text-sm font-medium text-foreground">图像对比</span>
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          {image1Url ? (
            <div className="rounded-lg overflow-hidden border border-border aspect-square">
              <img src={image1Url} alt="img1" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border aspect-square flex items-center justify-center text-[11px] text-muted-foreground">
              图像1
            </div>
          )}

          {image2Url ? (
            <div className="rounded-lg overflow-hidden border border-border aspect-square">
              <img src={image2Url} alt="img2" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border aspect-square flex items-center justify-center text-[11px] text-muted-foreground">
              图像2
            </div>
          )}
        </div>

        {error && (
          <div className="text-xs text-destructive bg-destructive/10 rounded-md px-2 py-1">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(ImageCompareNode);
