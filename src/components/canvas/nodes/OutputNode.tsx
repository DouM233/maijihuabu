'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Box, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { OutputNodeData } from '@/lib/canvas/types';

function OutputNode({ data, selected }: NodeProps) {
  const nodeData = data as OutputNodeData;
  const items = nodeData.items || [];
  const imageUrl = (nodeData.imageUrl as string | undefined) || items[0];
  const prompt = typeof nodeData.prompt === 'string' ? nodeData.prompt : '';
  const title = nodeData.label || '输出';
  const width = ((nodeData as Record<string, unknown>)?.nodeWidth as number | undefined) || 300;
  const height = ((nodeData as Record<string, unknown>)?.nodeHeight as number | undefined) || 420;

  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all min-w-[220px]',
        selected
          ? 'border-primary/60 shadow-[0_0_0_2px_rgba(139,111,246,0.15)]'
          : 'border-border hover:border-border/80'
      )}
      style={{
        width,
        height,
        minWidth: 220,
        minHeight: 260,
      }}
    >
      <div className="flex shrink-0 items-center gap-2 border-b border-border bg-card px-3 py-2">
        <span className="flex h-5 w-5 items-center justify-center rounded bg-slate-500/10 text-slate-500">
          <Box className="h-3 w-3" />
        </span>
        <span className="text-xs font-semibold text-foreground">{title}</span>
        <span className="ml-auto rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
          {items.length || (imageUrl ? 1 : 0)} 张
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto bg-card/60 p-3">
        {!imageUrl ? (
          <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-border text-center text-[11px] text-muted-foreground">
            等待图像生成结果...
          </div>
        ) : (
          <div className="space-y-2">
            <div className="group relative overflow-hidden rounded-lg border border-border bg-muted">
              <img src={imageUrl} alt="generated output" className="h-full max-h-[420px] w-full object-contain" />
              <button
                type="button"
                onClick={() => {
                  const a = document.createElement('a');
                  a.href = imageUrl;
                  a.download = 'generated-output.png';
                  a.click();
                }}
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100"
              >
                <Download className="h-3.5 w-3.5" />
              </button>
            </div>
            {prompt && (
              <div className="max-h-24 overflow-y-auto rounded-lg bg-muted/50 p-2 text-[10px] leading-relaxed text-muted-foreground">
                {prompt}
              </div>
            )}
          </div>
        )}
      </div>

      <Handle type="target" position={Position.Left} id="output-in" className="!h-2.5 !w-2.5 !border-2 !border-white !bg-cyan-500" />
      <Handle type="target" position={Position.Top} id="output-in-top" className="!h-2.5 !w-2.5 !border-2 !border-white !bg-cyan-500" />
    </div>
  );
}

export default memo(OutputNode);
