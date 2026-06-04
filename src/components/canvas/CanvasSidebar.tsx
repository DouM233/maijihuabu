'use client';

import { memo, useRef, useState, useCallback } from 'react';
import {
  Type, Image, Bot, Video, Music, Upload, Box, Lightbulb, Repeat,
  Film, Move, Frame, Pencil, Layers,
  Maximize, Copy, Trash2, Grid3X3, Palette, X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NodeType } from '@/lib/canvas/types';

const NODE_ITEMS: { type: NodeType; label: string; icon: React.ReactNode; color: string }[] = [
  // Core
  { type: 'text', label: '文本', icon: <Type className="w-4 h-4" />, color: 'bg-primary/10 text-primary' },
  { type: 'image', label: '图像', icon: <Image className="w-4 h-4" />, color: 'bg-amber-500/10 text-amber-500' },
  { type: 'llm', label: 'LLM', icon: <Bot className="w-4 h-4" />, color: 'bg-emerald-500/10 text-emerald-500' },
  { type: 'video', label: '视频', icon: <Video className="w-4 h-4" />, color: 'bg-rose-500/10 text-rose-500' },
  { type: 'audio', label: '音频', icon: <Music className="w-4 h-4" />, color: 'bg-cyan-500/10 text-cyan-500' },
  // Input/Output
  { type: 'upload', label: '上传', icon: <Upload className="w-4 h-4" />, color: 'bg-slate-500/10 text-slate-500' },
  { type: 'output', label: '输出', icon: <Box className="w-4 h-4" />, color: 'bg-slate-500/10 text-slate-500' },
  // Auxiliary
  { type: 'idea', label: '灵感', icon: <Lightbulb className="w-4 h-4" />, color: 'bg-yellow-500/10 text-yellow-500' },
  { type: 'relay', label: '中继', icon: <Repeat className="w-4 h-4" />, color: 'bg-orange-500/10 text-orange-500' },
  // Toolbox
  { type: 'cinematic', label: '电影感', icon: <Film className="w-4 h-4" />, color: 'bg-indigo-500/10 text-indigo-500' },
  { type: 'video-motion', label: '视频运镜', icon: <Move className="w-4 h-4" />, color: 'bg-violet-500/10 text-violet-500' },
  // Utility
  { type: 'resize', label: '调整尺寸', icon: <Maximize className="w-4 h-4" />, color: 'bg-teal-500/10 text-teal-500' },
  { type: 'combine', label: '合并', icon: <Layers className="w-4 h-4" />, color: 'bg-teal-500/10 text-teal-500' },
  { type: 'remove-bg', label: '去背景', icon: <Trash2 className="w-4 h-4" />, color: 'bg-teal-500/10 text-teal-500' },
  { type: 'upscale', label: '超分', icon: <Maximize className="w-4 h-4" />, color: 'bg-teal-500/10 text-teal-500' },
  { type: 'grid-crop', label: '网格裁切', icon: <Grid3X3 className="w-4 h-4" />, color: 'bg-teal-500/10 text-teal-500' },
  { type: 'loop', label: '循环', icon: <Copy className="w-4 h-4" />, color: 'bg-teal-500/10 text-teal-500' },
  { type: 'frame-extractor', label: '帧提取', icon: <Frame className="w-4 h-4" />, color: 'bg-teal-500/10 text-teal-500' },
  { type: 'drawing-board', label: '画板', icon: <Pencil className="w-4 h-4" />, color: 'bg-teal-500/10 text-teal-500' },
  { type: 'storyboard-grid', label: '分镜网格', icon: <Grid3X3 className="w-4 h-4" />, color: 'bg-sky-500/10 text-sky-500' },
];

interface CanvasSidebarProps {
  onAddNode: (type: string, clientPosition?: { x: number; y: number }) => void;
}

function CanvasSidebar({ onAddNode }: CanvasSidebarProps) {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const dragStateRef = useRef<{
    type: string;
    label: string;
    startX: number;
    startY: number;
    x: number;
    y: number;
    moved: boolean;
  } | null>(null);
  const [draggingNode, setDraggingNode] = useState<{
    type: string;
    label: string;
    x: number;
    y: number;
    moved: boolean;
  } | null>(null);

  const filtered = NODE_ITEMS.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>, item: { type: NodeType; label: string }) => {
      if (e.button !== 0) return;
      e.preventDefault();

      const dragState = {
        type: item.type,
        label: item.label,
        startX: e.clientX,
        startY: e.clientY,
        x: e.clientX,
        y: e.clientY,
        moved: false,
      };
      dragStateRef.current = dragState;
      setDraggingNode(dragState);

      const cleanup = () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
      };

      const handlePointerMove = (event: PointerEvent) => {
        const current = dragStateRef.current;
        if (!current) return;
        const moved = current.moved
          || Math.abs(event.clientX - current.startX) > 4
          || Math.abs(event.clientY - current.startY) > 4;
        const next = {
          ...current,
          x: event.clientX,
          y: event.clientY,
          moved,
        };
        dragStateRef.current = next;
        setDraggingNode(next);
      };

      const handlePointerUp = (event: PointerEvent) => {
        cleanup();
        const current = dragStateRef.current;
        dragStateRef.current = null;
        setDraggingNode(null);
        if (!current?.moved) return;

        const flow = document.querySelector('.react-flow');
        const flowRect = flow?.getBoundingClientRect();
        const isOverCanvas = !!flowRect
          && event.clientX >= flowRect.left
          && event.clientX <= flowRect.right
          && event.clientY >= flowRect.top
          && event.clientY <= flowRect.bottom;

        if (isOverCanvas) {
          onAddNode(current.type, { x: event.clientX, y: event.clientY });
        }
      };

      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    },
    [onAddNode]
  );

  const handleDoubleClick = useCallback(
    (type: string) => {
      onAddNode(type);
    },
    [onAddNode]
  );

  return (
    <>
      {/* Toggle button when closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="absolute left-3 top-3 z-20 w-8 h-8 rounded-lg bg-card border border-border shadow-sm flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <Palette className="w-4 h-4" />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'absolute left-3 top-3 bottom-3 z-20 flex flex-col rounded-xl border border-border bg-card shadow-lg overflow-hidden transition-all duration-200',
          isOpen ? 'w-52 opacity-100' : 'w-0 opacity-0 pointer-events-none'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2.5 border-b border-border">
          <span className="text-xs font-semibold text-foreground">节点面板</span>
          <button
            onClick={() => setIsOpen(false)}
            className="w-5 h-5 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>

        {/* Search */}
        <div className="px-3 py-2 border-b border-border">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索节点..."
            className="w-full text-xs rounded-md bg-muted border border-border px-2.5 py-1.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
          />
        </div>

        {/* Node Grid */}
        <div className="flex-1 overflow-y-auto p-2">
          <div className="grid grid-cols-2 gap-1.5">
            {filtered.map((item) => (
              <div
                key={item.type}
                onPointerDown={(e) => handlePointerDown(e, item)}
                onDoubleClick={() => handleDoubleClick(item.type)}
                className="flex flex-col items-center gap-1 p-2 rounded-lg border border-border bg-card/50 cursor-grab hover:border-primary/40 hover:bg-primary/5 transition-colors active:cursor-grabbing select-none"
              >
                <span className={cn('flex items-center justify-center w-7 h-7 rounded-md pointer-events-none', item.color)}>
                  {item.icon}
                </span>
                <span className="text-[10px] text-foreground text-center leading-tight pointer-events-none">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer hint */}
        <div className="px-3 py-2 border-t border-border text-[10px] text-muted-foreground text-center">
          拖动或双击创建节点
        </div>
      </div>

      {draggingNode && (
        <div
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 rounded-lg border border-primary/40 bg-card px-3 py-2 text-xs font-medium text-foreground shadow-lg"
          style={{ left: draggingNode.x, top: draggingNode.y }}
        >
          {draggingNode.label}
        </div>
      )}
    </>
  );
}

export default memo(CanvasSidebar);
