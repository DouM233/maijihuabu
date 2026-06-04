'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps, useReactFlow } from '@xyflow/react';
import { Type } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TextNodeData } from '@/lib/canvas/types';

function ResizableTextNode({ id, data, selected }: NodeProps) {
  const nodeData = data as TextNodeData;
  const { updateNodeData } = useReactFlow();

  const prompt = nodeData.prompt || '';
  const title = nodeData.label || '文本';
  const width = ((nodeData as Record<string, unknown>)?.nodeWidth as number | undefined)
    || ((nodeData as Record<string, unknown>)?.width as number | undefined);
  const height = ((nodeData as Record<string, unknown>)?.nodeHeight as number | undefined)
    || ((nodeData as Record<string, unknown>)?.height as number | undefined);

  return (
    <div
      className={cn(
        'rounded-xl border overflow-hidden shadow-sm transition-all',
        selected
          ? 'border-primary/60 shadow-[0_0_0_2px_rgba(139,111,246,0.15)]'
          : 'border-border hover:border-border/80'
      )}
      style={{
        width: width ?? 240,
        height: height ?? 160,
        minWidth: 200,
        minHeight: 120,
      }}
    >
      {/* 标题栏 */}
      <div className="flex items-center gap-2 px-3 py-2 bg-card border-b border-border">
        <span className="flex items-center justify-center w-5 h-5 rounded bg-primary/10 text-primary">
          <Type className="w-3 h-3" />
        </span>
        <span className="text-xs font-semibold text-foreground">{title}</span>
        <span className="ml-auto text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
          prompt
        </span>
      </div>

      {/* 内容区 */}
      <div className="relative px-3 py-2.5 bg-card/60" style={{ height: 'calc(100% - 36px)' }}>
        <textarea
          defaultValue={prompt}
          onChange={(e) => {
            updateNodeData(id, {
              ...nodeData,
              prompt: e.target.value,
            } as Record<string, unknown>);
          }}
          placeholder="输入提示词..."
          className="w-full h-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        <div className="absolute bottom-1 right-3 text-[10px] text-muted-foreground">
          {prompt.length} 字
        </div>
      </div>

      {/* 输入端口 */}
      <Handle
        type="target"
        position={Position.Left}
        id="text-in"
        style={{
          top: '50%',
          width: 10,
          height: 10,
          background: '#06b6d4',
          border: '2px solid #fff',
          boxShadow: '0 0 4px rgba(6,182,212,0.4)',
        }}
      />

      {/* 输出端口 */}
      <Handle
        type="source"
        position={Position.Right}
        id="text-out"
        style={{
          top: '50%',
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

export default memo(ResizableTextNode);
