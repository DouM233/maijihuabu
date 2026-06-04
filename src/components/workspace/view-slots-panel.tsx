'use client';

import { useCallback, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { VIEW_ANGLE_LABELS } from '@/lib/types';
import type { ViewAngle, ViewSlot } from '@/lib/types';
import { cn } from '@/lib/utils';

function ViewSlotCard({ slot }: { slot: ViewSlot }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const setViewImage = useAppStore((s) => s.setViewImage);
  const removeViewImage = useAppStore((s) => s.removeViewImage);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      setViewImage(slot.angle, url, file.name);
    },
    [slot.angle, setViewImage],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      setViewImage(slot.angle, url, file.name);
    },
    [slot.angle, setViewImage],
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">
        {VIEW_ANGLE_LABELS[slot.angle]}
      </span>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'group relative flex h-28 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed transition-colors',
          slot.imageUrl
            ? 'border-primary/30 bg-primary/5'
            : 'border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50',
        )}
      >
        {slot.imageUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slot.imageUrl}
              alt={VIEW_ANGLE_LABELS[slot.angle]}
              className="h-full w-full rounded-lg object-contain p-1"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeViewImage(slot.angle);
              }}
              className="absolute right-1 top-1 rounded-full bg-background/80 p-0.5 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
            <Upload className="h-5 w-5" />
            <span className="text-[10px]">点击或拖拽上传</span>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}

export function ViewSlotsPanel() {
  const viewSlots = useAppStore((s) => s.viewSlots);
  const allUploaded = useAppStore((s) => s.isAllViewsUploaded());

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="flex items-center gap-2">
        <ImageIcon className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold">结构约束输入</h2>
      </div>

      <div className="flex flex-col gap-3">
        {viewSlots.map((slot) => (
          <ViewSlotCard key={slot.angle} slot={slot} />
        ))}
      </div>

      <div
        className={cn(
          'mt-auto rounded-md px-3 py-2 text-center text-xs',
          allUploaded
            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
        )}
      >
        {allUploaded
          ? '三视图已就绪，可进行生成'
          : '请上传全部三视图后再生成'}
      </div>
    </div>
  );
}
