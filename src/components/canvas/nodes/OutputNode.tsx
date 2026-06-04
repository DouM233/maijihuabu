'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Box, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { OutputNodeData } from '@/lib/canvas/types';

function OutputNode({ data, selected }: NodeProps) {
  const nodeData = data as OutputNodeData;
  const items = nodeData.items || [];

  return (
    <div
      className={cn(
        'rounded-xl border overflow-hidden shadow-sm transition-all min-w-[200px] max-w-[320px]',
        selected
          ? 'border-primary/60 shadow-[0_0_0_2px_rgba(139,111,246,0.15)]'
          : 'border-border hover:border-border/80'
      )}
    >
      {/* 标题栏 */}
      <div className="flex items-center gap-2 px-3 py-2 bg-card border-b border-border">
        <span className="flex items-center justify-center w-5 h-5 rounded bg-slate-500/10 text-slate-500">
          <Box className="w-3 h-3" />
        </span>
        <span className="text-xs font-semibold text-foreground">输出</span>
        <span className="ml-auto text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
          {items.length} 项
        </span>
      </div>

      {/* 内容区 */}
      <div className="px-3 py-2.5 bg-card/60 space-y-1.5 max-h-48 overflow-y-auto">
        {items.length === 0 ? (
          <div className="text-center py-4 text-[10px] text-muted-foreground">
            等待上游输入...
          </div>
        ) : (
          items.map((url: string, i: number) => (
            <div key={i} className="relative group rounded-lg border border-border overflow-hidden">
              <img src={url} alt={`output-${i}`} className="w-full h-24 object-cover" />
              <button
                onClick={() => {
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `output-${i + 1}.png`;
                  a.click();
                }}
                className="absolute top-1 right-1 w-6 h-6 rounded bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Download className="w-3 h-3" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* 输入端口 */}
      <Handle
        type="target"
        position={Position.Left}
        id="output-in"
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
        type="target"
        position={Position.Top}
        id="output-in-top"
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

export default memo(OutputNode);
