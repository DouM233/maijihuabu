'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Upload,
  Lightbulb,
  Sparkles,
  Download,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Trash2,
  Move,
  MessageSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore, type CanvasNode } from '@/lib/store';

const CREATIVE_TIPS = [
  '详细描述画面内容、风格和情绪',
  '指定图像比例，如"16:9"或"正方形"',
  '添加光线、色彩和构图要求',
  '可以参考艺术家风格，如"梵高风格"或"宫崎骏风格"',
];

let _nodeIdCounter = 0;
function nextNodeId(): string {
  _nodeIdCounter += 1;
  return `node_${Date.now()}_${_nodeIdCounter}`;
}

/* ─── 主画布组件 ─── */
interface GenCanvasProps {
  selectedTemplatePrompt?: string | null;
}

export function GenCanvas({ selectedTemplatePrompt }: GenCanvasProps) {
  /* ─── Store ─── */
  const canvasNodes = useAppStore((s) => s.canvasNodes) ?? [];
  const addCanvasNodes = useAppStore((s) => s.addCanvasNodes);
  const updateCanvasNode = useAppStore((s) => s.updateCanvasNode);
  const removeCanvasNode = useAppStore((s) => s.removeCanvasNode);
  const clearCanvasNodes = useAppStore((s) => s.clearCanvasNodes);
  const selectedNodeId = useAppStore((s) => s.selectedNodeId);
  const setSelectedNodeId = useAppStore((s) => s.setSelectedNodeId);
  const generatedImageUrl = useAppStore((s) => s.generatedImageUrl);
  const setGeneratedImageUrl = useAppStore((s) => s.setGeneratedImageUrl);
  const setReferencedImageNode = useAppStore((s) => s.setReferencedImageNode);

  /* ─── 画布视口状态 ─── */
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* ─── 拖拽/交互状态 ─── */
  const dragState = useRef<{
    type: 'pan' | 'move' | 'resize';
    startMouseX: number;
    startMouseY: number;
    startPanX: number;
    startPanY: number;
    startNodeX: number;
    startNodeY: number;
    startNodeW: number;
    startNodeH: number;
    nodeId: string;
    corner: string;
  } | null>(null);

  const spacePressed = useRef(false);

  /* ─── 键盘事件（Space 平移 / Delete 删除） ─── */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        spacePressed.current = true;
      }
      if ((e.code === 'Delete' || e.code === 'Backspace') && selectedNodeId && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        removeCanvasNode(selectedNodeId);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') spacePressed.current = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [selectedNodeId, removeCanvasNode]);

  /* ─── 全局鼠标松开 ─── */
  useEffect(() => {
    const handleUp = () => {
      if (dragState.current) {
        dragState.current = null;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };
    window.addEventListener('mouseup', handleUp);
    return () => window.removeEventListener('mouseup', handleUp);
  }, []);

  /* ─── 全局鼠标移动 ─── */
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const ds = dragState.current;
      if (!ds) return;

      const dx = e.clientX - ds.startMouseX;
      const dy = e.clientY - ds.startMouseY;

      if (ds.type === 'pan') {
        setPan({ x: ds.startPanX + dx, y: ds.startPanY + dy });
      } else if (ds.type === 'move') {
        const scaledDx = dx / zoom;
        const scaledDy = dy / zoom;
        updateCanvasNode(ds.nodeId, {
          x: ds.startNodeX + scaledDx,
          y: ds.startNodeY + scaledDy,
        });
      } else if (ds.type === 'resize') {
        const scaledDx = dx / zoom;
        const scaledDy = dy / zoom;
        const aspectRatio = ds.startNodeW / ds.startNodeH;
        let newW = ds.startNodeW;
        let newH = ds.startNodeH;
        let newX = ds.startNodeX;
        let newY = ds.startNodeY;

        const corner = ds.corner;
        // Determine which axes are affected
        const affectsRight = corner.includes('e');
        const affectsLeft = corner.includes('w');
        const affectsBottom = corner.includes('s');
        const affectsTop = corner.includes('n');

        if (affectsRight) {
          newW = Math.max(80, ds.startNodeW + scaledDx);
        }
        if (affectsLeft) {
          const proposedW = Math.max(80, ds.startNodeW - scaledDx);
          newX = ds.startNodeX + (ds.startNodeW - proposedW);
          newW = proposedW;
        }
        if (affectsBottom) {
          newH = Math.max(80, ds.startNodeH + scaledDy);
        }
        if (affectsTop) {
          const proposedH = Math.max(80, ds.startNodeH - scaledDy);
          newY = ds.startNodeY + (ds.startNodeH - proposedH);
          newH = proposedH;
        }

        // Hold shift for proportional resize (use diagonal corners)
        if (e.shiftKey || corner === 'ne' || corner === 'nw' || corner === 'se' || corner === 'sw') {
          newH = newW / aspectRatio;
          if (affectsTop) {
            newY = ds.startNodeY + ds.startNodeH - newH;
          }
        }

        updateCanvasNode(ds.nodeId, { x: newX, y: newY, width: newW, height: newH });
      }
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [zoom, updateCanvasNode]);

  /* ─── 滚轮缩放 ─── */
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.08 : 0.08;
    setZoom((z) => Math.min(3, Math.max(0.15, z + delta)));
  }, []);

  /* ─── 画布背景按下：开始平移 / 取消选中 ─── */
  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0 && e.button !== 1) return;
    // If clicking on the background (not a node)
    if ((e.target as HTMLElement).dataset.canvasBg) {
      setSelectedNodeId(null);
      if (spacePressed.current || e.button === 1) {
        // Start panning
        dragState.current = {
          type: 'pan',
          startMouseX: e.clientX,
          startMouseY: e.clientY,
          startPanX: pan.x,
          startPanY: pan.y,
          startNodeX: 0, startNodeY: 0, startNodeW: 0, startNodeH: 0,
          nodeId: '', corner: '',
        };
        document.body.style.cursor = 'grabbing';
        document.body.style.userSelect = 'none';
      }
    }
  }, [pan, setSelectedNodeId]);

  /* ─── 中键平移 ─── */
  const handleAuxClick = useCallback((e: React.MouseEvent) => {
    if (e.button === 1) {
      e.preventDefault();
    }
  }, []);

  const handleMouseDownMiddle = useCallback((e: React.MouseEvent) => {
    if (e.button === 1) {
      e.preventDefault();
      dragState.current = {
        type: 'pan',
        startMouseX: e.clientX,
        startMouseY: e.clientY,
        startPanX: pan.x,
        startPanY: pan.y,
        startNodeX: 0, startNodeY: 0, startNodeW: 0, startNodeH: 0,
        nodeId: '', corner: '',
      };
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    }
  }, [pan]);

  /* ─── 节点拖拽开始 ─── */
  const handleNodeMouseDown = useCallback((e: React.MouseEvent, node: CanvasNode) => {
    e.stopPropagation();
    if (e.button !== 0) return;
    setSelectedNodeId(node.id);
    dragState.current = {
      type: 'move',
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startPanX: 0, startPanY: 0,
      startNodeX: node.x,
      startNodeY: node.y,
      startNodeW: node.width,
      startNodeH: node.height,
      nodeId: node.id,
      corner: '',
    };
    document.body.style.userSelect = 'none';
  }, [setSelectedNodeId]);

  /* ─── 缩放角点拖拽开始 ─── */
  const handleResizeMouseDown = useCallback((e: React.MouseEvent, node: CanvasNode, corner: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (e.button !== 0) return;
    dragState.current = {
      type: 'resize',
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startPanX: 0, startPanY: 0,
      startNodeX: node.x,
      startNodeY: node.y,
      startNodeW: node.width,
      startNodeH: node.height,
      nodeId: node.id,
      corner,
    };
    document.body.style.userSelect = 'none';
  }, []);

  /* ─── 多图上传处理 ─── */
  const processFiles = useCallback((files: FileList | File[]) => {
    const fileArr = Array.from(files);
    let loadCount = 0;
    const total = fileArr.length;
    const newNodes: CanvasNode[] = [];

    for (const file of fileArr) {
      if (!file.type.startsWith('image/png') && !file.type.startsWith('image/jpeg')) {
        loadCount++;
        continue;
      }
      const url = URL.createObjectURL(file);
      const img = new window.Image();
      img.onload = () => {
        // Scale down if too large
        const maxDim = 400;
        let w = img.naturalWidth;
        let h = img.naturalHeight;
        if (w > maxDim || h > maxDim) {
          const scale = maxDim / Math.max(w, h);
          w = Math.round(w * scale);
          h = Math.round(h * scale);
        }
        const offsetX = (canvasNodes.length + newNodes.length) * 30;
        const offsetY = (canvasNodes.length + newNodes.length) * 30;
        newNodes.push({
          id: nextNodeId(),
          url,
          name: file.name,
          x: -pan.x / zoom + 100 + offsetX,
          y: -pan.y / zoom + 100 + offsetY,
          width: w,
          height: h,
          type: 'upload',
        });
        loadCount++;
        if (loadCount === total && newNodes.length > 0) {
          addCanvasNodes(newNodes);
        }
      };
      img.onerror = () => {
        loadCount++;
        if (loadCount === total && newNodes.length > 0) {
          addCanvasNodes(newNodes);
        }
      };
      img.src = url;
    }
  }, [addCanvasNodes, canvasNodes.length, pan, zoom]);

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    processFiles(files);
    e.target.value = '';
  }, [processFiles]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) processFiles(files);
  }, [processFiles]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  /* ─── 生成结果添加到画布 ─── */
  useEffect(() => {
    if (!generatedImageUrl) return;
    const img = new window.Image();
    img.onload = () => {
      const maxDim = 500;
      let w = img.naturalWidth;
      let h = img.naturalHeight;
      if (w > maxDim || h > maxDim) {
        const scale = maxDim / Math.max(w, h);
        w = Math.round(w * scale);
        h = Math.round(h * scale);
      }
      addCanvasNodes([{
        id: nextNodeId(),
        url: generatedImageUrl,
        name: `AI生成_${Date.now()}.png`,
        x: -pan.x / zoom + 200,
        y: -pan.y / zoom + 80,
        width: w,
        height: h,
        type: 'generated',
      }]);
      setGeneratedImageUrl(null); // consume it
    };
    img.src = generatedImageUrl;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generatedImageUrl]);

  /* ─── 下载选中图片 ─── */
  const handleDownload = useCallback(() => {
    const node = canvasNodes.find((n) => n.id === selectedNodeId);
    if (!node) return;
    const link = document.createElement('a');
    link.href = node.url;
    link.download = node.name || `麦吉AI_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [canvasNodes, selectedNodeId]);

  /* ─── 重置视口 ─── */
  const handleResetView = useCallback(() => {
    setPan({ x: 0, y: 0 });
    setZoom(1);
  }, []);

  /* ─── 适配全部 ─── */
  const handleFitAll = useCallback(() => {
    if (canvasNodes.length === 0) {
      handleResetView();
      return;
    }
    const container = containerRef.current;
    if (!container) return;

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const node of canvasNodes) {
      minX = Math.min(minX, node.x);
      minY = Math.min(minY, node.y);
      maxX = Math.max(maxX, node.x + node.width);
      maxY = Math.max(maxY, node.y + node.height);
    }

    const contentW = maxX - minX;
    const contentH = maxY - minY;
    const cW = container.clientWidth;
    const cH = container.clientHeight;
    const padding = 60;

    const newZoom = Math.min(
      (cW - padding * 2) / contentW,
      (cH - padding * 2) / contentH,
      2
    );
    const newPanX = (cW - contentW * newZoom) / 2 - minX * newZoom;
    const newPanY = (cH - contentH * newZoom) / 2 - minY * newZoom;

    setZoom(newZoom);
    setPan({ x: newPanX, y: newPanY });
  }, [canvasNodes, handleResetView]);

  const hasNodes = canvasNodes.length > 0;
  const selectedNode = canvasNodes.find((n) => n.id === selectedNodeId);

  /* ─── 缩放角点渲染 ─── */
  const corners = ['nw', 'ne', 'sw', 'se'] as const;
  const cornerCursorMap: Record<string, string> = {
    nw: 'nwse-resize', ne: 'nesw-resize', sw: 'nesw-resize', se: 'nwse-resize',
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      {/* 已选模板提示 */}
      {selectedTemplatePrompt && (
        <div className="flex items-center gap-2 border-b border-primary/20 bg-primary/10 px-4 py-2">
          <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
          <span className="text-xs text-primary truncate">
            已加载风格模板提示词，可直接生成或通过右侧对话微调
          </span>
        </div>
      )}

      {/* ─── 无限画布区域 ─── */}
      <div
        ref={containerRef}
        className="relative flex-1 overflow-hidden"
        style={{
          cursor: spacePressed.current ? 'grab' : 'default',
          background: '#f8fafc',
        }}
        onWheel={handleWheel}
        onMouseDown={handleCanvasMouseDown}
        onMouseDownCapture={handleMouseDownMiddle}
        onAuxClick={handleAuxClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {/* ─── 网格背景 ─── */}
        <div
          className="absolute inset-0 pointer-events-none"
          data-canvas-bg="true"
          style={{
            backgroundImage: `
              radial-gradient(circle, #cbd5e1 1px, transparent 1px)
            `,
            backgroundSize: `${24 * zoom}px ${24 * zoom}px`,
            backgroundPosition: `${pan.x}px ${pan.y}px`,
            opacity: 0.5,
          }}
        />

        {/* ─── 变换层 ─── */}
        <div
          data-canvas-bg="true"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
            position: 'absolute',
            inset: 0,
          }}
        >
          {/* ─── 画布节点 ─── */}
          {canvasNodes.map((node) => {
            const isSelected = node.id === selectedNodeId;
            return (
              <div
                key={node.id}
                className={cn(
                  'absolute group',
                  isSelected ? 'z-10' : 'z-0',
                )}
                style={{
                  left: node.x,
                  top: node.y,
                  width: node.width,
                  height: node.height,
                }}
                onMouseDown={(e) => handleNodeMouseDown(e, node)}
              >
                {/* 图片 */}
                <div
                  className={cn(
                    'w-full h-full overflow-hidden rounded-lg shadow-md transition-shadow',
                    isSelected
                      ? 'ring-2 ring-primary shadow-lg'
                      : 'hover:shadow-lg',
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={node.url}
                    alt={node.name}
                    className="w-full h-full object-cover pointer-events-none select-none"
                    draggable={false}
                  />
                </div>

                {/* 文件名标签 */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent px-2 py-1 rounded-b-lg pointer-events-none">
                  <span className="text-[10px] text-white truncate block">{node.name}</span>
                </div>

                {/* 类型标签 */}
                {node.type === 'generated' && (
                  <div className="absolute top-1.5 left-1.5 flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 pointer-events-none">
                    <Sparkles className="h-3 w-3 text-primary-foreground" />
                    <span className="text-[9px] font-medium text-primary-foreground">AI</span>
                  </div>
                )}

                {/* 选中态：引用 + 下载 + 删除按钮 */}
                {isSelected && (
                  <>
                    <div className="absolute -top-2 -right-2 flex gap-1">
                      <button
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => { e.stopPropagation(); setReferencedImageNode(node); }}
                        className="flex h-6 w-6 items-center justify-center rounded-full bg-card border border-border text-muted-foreground shadow-sm hover:text-amber-600 hover:border-amber-300 transition-colors"
                        title="引用到聊天窗口"
                      >
                        <MessageSquare className="h-3 w-3" />
                      </button>
                      <button
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => { e.stopPropagation(); handleDownload(); }}
                        className="flex h-6 w-6 items-center justify-center rounded-full bg-card border border-border text-muted-foreground shadow-sm hover:text-primary hover:border-primary/30 transition-colors"
                        title="下载"
                      >
                        <Download className="h-3 w-3" />
                      </button>
                      <button
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => { e.stopPropagation(); removeCanvasNode(node.id); }}
                        className="flex h-6 w-6 items-center justify-center rounded-full bg-card border border-border text-muted-foreground shadow-sm hover:text-destructive hover:border-destructive/40 transition-colors"
                        title="删除"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>

                    {/* 缩放角点 */}
                    {corners.map((corner) => (
                      <div
                        key={corner}
                        onMouseDown={(e) => handleResizeMouseDown(e, node, corner)}
                        className={cn(
                          'absolute w-3 h-3 bg-card border-2 border-primary rounded-sm shadow-sm z-20',
                          corner === 'nw' && '-top-1.5 -left-1.5',
                          corner === 'ne' && '-top-1.5 -right-1.5',
                          corner === 'sw' && '-bottom-1.5 -left-1.5',
                          corner === 'se' && '-bottom-1.5 -right-1.5',
                        )}
                        style={{ cursor: cornerCursorMap[corner] }}
                      />
                    ))}

                    {/* 尺寸标注 */}
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 rounded bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground whitespace-nowrap shadow-sm pointer-events-none">
                      {Math.round(node.width)} × {Math.round(node.height)}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* ─── 空白态：引导卡片 ─── */}
        {!hasNodes && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="flex max-w-sm flex-col items-center rounded-2xl border border-border bg-card p-8 shadow-sm pointer-events-auto">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-1 text-base font-bold text-foreground">自由创作模式</h3>
              <p className="mb-4 text-center text-xs text-muted-foreground">
                上传参考图或直接描述您想要生成的图像，发挥创意！
              </p>
              <button
                onClick={() => inputRef.current?.click()}
                className="flex items-center gap-2 rounded-xl border-2 border-dashed border-border bg-secondary px-6 py-4 text-sm font-medium text-muted-foreground hover:border-primary hover:bg-primary/10 hover:text-primary transition-all"
              >
                <Upload className="h-5 w-5" />
                上传 PNG / JPG 图片（支持多张）
              </button>
              <div className="mt-5 w-full rounded-xl border border-border bg-secondary p-4">
                <div className="mb-2 flex items-center gap-1.5">
                  <Lightbulb className="h-4 w-4 text-primary" />
                  <span className="text-xs font-semibold text-foreground/80">创作提示：</span>
                </div>
                <ul className="flex flex-col gap-1.5">
                  {CREATIVE_TIPS.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="mt-4 text-[10px] text-muted-foreground/60">
                Space + 拖拽平移 · 滚轮缩放 · 拖拽图片移动 · 角点调整大小
              </p>
            </div>
          </div>
        )}

        {/* ─── 底部工具栏 ─── */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-xl border border-border bg-card/90 px-2.5 py-1.5 shadow-lg backdrop-blur-sm">
          <button
            onClick={() => inputRef.current?.click()}
            className="flex h-7 items-center gap-1 rounded-lg px-2 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors text-xs font-medium"
            title="上传图片"
          >
            <Upload className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">上传</span>
          </button>
          <div className="mx-0.5 h-4 w-px bg-border" />
          <button
            onClick={() => setZoom((z) => Math.max(0.15, z - 0.15))}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary"
            title="缩小"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="min-w-[3rem] text-center text-xs text-muted-foreground select-none">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(3, z + 0.15))}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary"
            title="放大"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <div className="mx-0.5 h-4 w-px bg-border" />
          <button
            onClick={handleResetView}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary"
            title="重置视口"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={handleFitAll}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary"
            title="适配全部"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
          {hasNodes && (
            <>
              <div className="mx-0.5 h-4 w-px bg-border" />
              <button
                onClick={() => { clearCanvasNodes(); handleResetView(); }}
                className="flex h-7 items-center gap-1 rounded-lg px-2 text-muted-foreground/60 hover:bg-destructive/10 hover:text-destructive transition-colors text-xs"
                title="清空画布"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </>
          )}
          {hasNodes && (
            <>
              <div className="mx-0.5 h-4 w-px bg-border" />
              <span className="text-[10px] text-muted-foreground/60 select-none">
                {canvasNodes.length} 张
              </span>
            </>
          )}
        </div>

        {/* ─── 右下角选中信息 ─── */}
        {selectedNode && (
          <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-xl border border-border bg-card/90 px-3 py-1.5 shadow-lg backdrop-blur-sm">
            <Move className="h-3.5 w-3.5 text-muted-foreground/60" />
            <span className="text-[10px] text-muted-foreground truncate max-w-[120px]">{selectedNode.name}</span>
            <span className="text-[10px] text-primary font-medium">
              {Math.round(selectedNode.width)}×{Math.round(selectedNode.height)}
            </span>
          </div>
        )}
      </div>

      {/* 隐藏的文件输入：多图上传 */}
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg"
        multiple
        className="hidden"
        onChange={handleUpload}
      />
    </div>
  );
}
