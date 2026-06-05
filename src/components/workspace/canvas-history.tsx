'use client';

import { useEffect } from 'react';
import { Clock, FilePlus2, FolderOpen, Trash2 } from 'lucide-react';
import { useCanvasStore } from '@/lib/canvas/store';

interface CanvasHistoryProps {
  onOpenCanvas?: () => void;
}

function formatTime(value: number) {
  return new Date(value).toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function CanvasHistory({ onOpenCanvas }: CanvasHistoryProps) {
  const canvases = useCanvasStore((state) => state.canvases);
  const activeId = useCanvasStore((state) => state.activeId);
  const loading = useCanvasStore((state) => state.loading);
  const error = useCanvasStore((state) => state.error);
  const loadCanvases = useCanvasStore((state) => state.loadCanvases);
  const createCanvas = useCanvasStore((state) => state.createCanvas);
  const loadCanvas = useCanvasStore((state) => state.loadCanvas);
  const deleteCanvas = useCanvasStore((state) => state.deleteCanvas);

  useEffect(() => {
    void loadCanvases();
  }, [loadCanvases]);

  const handleCreate = async () => {
    const name = window.prompt('请输入新画板名称', `画板 ${new Date().toLocaleString('zh-CN')}`);
    if (name === null) return;
    const created = await createCanvas(name.trim() || '未命名画板');
    if (created) {
      onOpenCanvas?.();
    }
  };

  const handleOpen = async (id: string) => {
    const canvas = await loadCanvas(id);
    if (canvas) {
      onOpenCanvas?.();
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`删除画板「${name}」？这个操作不能撤销。`)) return;
    await deleteCanvas(id);
  };

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <div className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4 text-primary" />
            <h2 className="text-base font-semibold text-foreground">画板历史记录</h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">保存后的画板会在这里出现，点击即可回到画布继续工作。</p>
        </div>
        <button
          type="button"
          onClick={handleCreate}
          className="inline-flex h-9 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
        >
          <FilePlus2 className="h-4 w-4" />
          新建画板
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading && canvases.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            正在加载画板...
          </div>
        ) : canvases.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card/60 p-10 text-center">
            <FolderOpen className="mx-auto h-10 w-10 text-muted-foreground/50" />
            <h3 className="mt-4 text-sm font-semibold text-foreground">还没有保存过的画板</h3>
            <p className="mt-2 text-xs text-muted-foreground">在画布顶部点击“保存”，或者从这里新建一个画板。</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3">
            {canvases.map((canvas) => (
              <div
                key={canvas.id}
                className="group rounded-2xl border border-border bg-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              >
                <button
                  type="button"
                  onClick={() => void handleOpen(canvas.id)}
                  className="block w-full text-left"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-foreground">{canvas.name}</h3>
                      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span>更新于 {formatTime(canvas.updatedAt)}</span>
                      </div>
                    </div>
                    {activeId === canvas.id && (
                      <span className="rounded-full bg-primary/10 px-2 py-1 text-[11px] font-medium text-primary">
                        当前
                      </span>
                    )}
                  </div>
                  <div className="mt-4 rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                    {canvas.nodeCount} 个节点
                  </div>
                </button>
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => void handleDelete(canvas.id, canvas.name)}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs text-muted-foreground transition hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
