'use client';

import { Trash2, CopyPlus } from 'lucide-react';

interface NodeActionBarProps {
  selectedCount: number;
  onDelete: () => void;
  onDuplicate: () => void;
}

export default function NodeActionBar({ selectedCount, onDelete, onDuplicate }: NodeActionBarProps) {
  return (
    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-2 rounded-xl bg-card/90 backdrop-blur-sm border border-border shadow-sm z-10">
      <span className="text-xs text-muted-foreground px-1">
        已选 {selectedCount} 个节点
      </span>
      <div className="w-px h-4 bg-border" />
      <button
        onClick={onDuplicate}
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm text-foreground hover:bg-muted transition-colors"
        title="复制选中节点 (Ctrl+D)"
      >
        <CopyPlus className="w-4 h-4" />
        复制
      </button>
      <button
        onClick={onDelete}
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
        title="删除选中节点 (Delete)"
      >
        <Trash2 className="w-4 h-4" />
        删除
      </button>
    </div>
  );
}
