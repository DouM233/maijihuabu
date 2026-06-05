'use client';

import { memo, useCallback } from 'react';
import { Handle, Position, type NodeProps, useReactFlow } from '@xyflow/react';
import { Upload, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UploadNodeData } from '@/lib/canvas/types';

function UploadNode({ id, data, selected }: NodeProps) {
  const nodeData = data as UploadNodeData;
  const { updateNodeData } = useReactFlow();
  const imageUrl = nodeData.imageUrl;

  const update = useCallback(
    (patch: Partial<UploadNodeData>) => {
      updateNodeData(id, { ...nodeData, ...patch } as Record<string, unknown>);
    },
    [id, nodeData, updateNodeData]
  );

  return (
    <div
      className={cn(
        'rounded-xl border overflow-hidden shadow-sm transition-all min-w-[200px]',
        selected
          ? 'border-primary/60 shadow-[0_0_0_2px_rgba(139,111,246,0.15)]'
          : 'border-border hover:border-border/80'
      )}
    >
      {/* 标题栏 */}
      <div className="flex items-center gap-2 px-3 py-2 bg-card border-b border-border">
        <span className="flex items-center justify-center w-5 h-5 rounded bg-slate-500/10 text-slate-500">
          <Upload className="w-3 h-3" />
        </span>
        <span className="text-xs font-semibold text-foreground">上传</span>
      </div>

      {/* 内容区 */}
      <div className="px-3 py-2.5 bg-card/60">
        {imageUrl ? (
          <div className="relative group">
            <img src={imageUrl} alt="upload" className="w-full h-32 object-cover rounded-lg border border-border" />
            <button
              onClick={() => update({ imageUrl: undefined, uploadType: undefined })}
              className="absolute top-1 right-1 w-5 h-5 rounded bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => update({ imageUrl: reader.result as string, uploadType: 'image' });
                reader.readAsDataURL(file);
              };
              input.click();
            }}
            className="w-full h-24 rounded-lg border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"
          >
            <Upload className="w-5 h-5" />
            <span className="text-[10px]">点击上传图片</span>
          </button>
        )}
      </div>

      {/* 输出端口 */}
      <Handle
        type="source"
        position={Position.Right}
        id="upload-out"
        style={{
          top: '50%',
          width: 10,
          height: 10,
          background: '#06b6d4',
          border: '2px solid #fff',
          boxShadow: '0 0 4px rgba(6,182,212,0.4)',
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="upload-out-bottom"
        style={{
          left: '50%',
          width: 10,
          height: 10,
          background: '#06b6d4',
          border: '2px solid #fff',
          boxShadow: '0 0 4px rgba(6,182,212,0.4)',
        }}
      />
    </div>
  );
}

export default memo(UploadNode);
