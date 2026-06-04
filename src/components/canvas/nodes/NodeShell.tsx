'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { cn } from '@/lib/utils';
import type { PortConfig } from '@/lib/canvas/portTypes';

export interface NodeShellProps {
  title: string;
  icon: React.ReactNode;
  badge?: string;
  selected?: boolean;
  inputs?: PortConfig[];
  outputs?: PortConfig[];
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

function NodeShell({
  title,
  icon,
  badge,
  selected,
  inputs,
  outputs,
  children,
  className,
  style,
}: NodeShellProps) {
  return (
    <div
      className={cn(
        'rounded-xl border overflow-hidden shadow-sm transition-all',
        selected
          ? 'border-primary/60 shadow-[0_0_0_2px_rgba(139,111,246,0.15)]'
          : 'border-border hover:border-border/80',
        className
      )}
      style={style}
    >
      {/* ── 标题栏 ── */}
      <div className="flex items-center gap-2 px-3 py-2 bg-card border-b border-border">
        <span className="flex items-center justify-center w-5 h-5 rounded bg-primary/10 text-primary">
          {icon}
        </span>
        <span className="text-xs font-semibold text-foreground">{title}</span>
        {badge && (
          <span className="ml-auto text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
            {badge}
          </span>
        )}
      </div>

      {/* ── 内容区 ── */}
      <div className="px-3 py-2.5 bg-card/60">{children}</div>

      {/* ── 输入端口 ── */}
      {inputs?.map((port, i) => {
        const total = inputs.length;
        const offset = total === 1 ? 50 : ((i + 1) / (total + 1)) * 100;
        return (
          <Handle
            key={port.name}
            type="target"
            position={Position.Left}
            id={port.name}
            style={{
              top: `${offset}%`,
              width: 10,
              height: 10,
              background: '#06b6d4',
              border: '2px solid #fff',
              boxShadow: '0 0 4px rgba(6,182,212,0.4)',
            }}
          />
        );
      })}

      {/* ── 输出端口 ── */}
      {outputs?.map((port, i) => {
        const total = outputs.length;
        const offset = total === 1 ? 50 : ((i + 1) / (total + 1)) * 100;
        return (
          <Handle
            key={port.name}
            type="source"
            position={Position.Right}
            id={port.name}
            style={{
              top: `${offset}%`,
              width: 10,
              height: 10,
              background: '#06b6d4',
              border: '2px solid #fff',
              boxShadow: '0 0 4px rgba(6,182,212,0.4)',
            }}
          />
        );
      })}
    </div>
  );
}

export default memo(NodeShell);
