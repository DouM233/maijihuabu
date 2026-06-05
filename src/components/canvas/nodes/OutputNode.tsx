'use client';

import { memo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { OutputNodeData } from '@/lib/canvas/types';

function OutputNode({ data, selected }: NodeProps) {
  const nodeData = data as OutputNodeData;
  const items = nodeData.items || [];
  const imageUrl = (nodeData.imageUrl as string | undefined) || items[0];
  const prompt = typeof nodeData.prompt === 'string' ? nodeData.prompt : '';
  const cleanOutput = (nodeData as Record<string, unknown>)?.cleanOutput === true;
  const width = ((nodeData as Record<string, unknown>)?.nodeWidth as number | undefined) || 300;
  const height = ((nodeData as Record<string, unknown>)?.nodeHeight as number | undefined) || 420;
  const [showPrompt, setShowPrompt] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  if (cleanOutput && imageUrl) {
    return (
      <>
        <div
          className="group relative h-full w-full overflow-visible bg-transparent"
          style={{ width, height, minWidth: 180, minHeight: 180 }}
        >
          <img
            src={imageUrl}
            alt="generated output"
            onDoubleClick={(event) => {
              event.stopPropagation();
              setFullscreen(true);
            }}
            className="h-full w-full cursor-zoom-in object-cover"
          />
          {prompt && (
            <button
              type="button"
              aria-label="查看生成提示词"
              onClick={(event) => {
                event.stopPropagation();
                setShowPrompt((value) => !value);
              }}
              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/35 text-white opacity-70 backdrop-blur transition hover:bg-black/55 hover:opacity-100"
            >
              <Info className="h-3.5 w-3.5" />
            </button>
          )}
          {showPrompt && prompt && (
            <div className="absolute right-2 top-11 z-10 max-h-48 w-72 overflow-y-auto rounded-xl bg-black/70 p-3 text-[11px] leading-relaxed text-white shadow-xl backdrop-blur">
              {prompt}
            </div>
          )}
          <Handle type="target" position={Position.Left} id="output-in" className="!h-2.5 !w-2.5 !border-2 !border-white !bg-cyan-500" />
        </div>

        {fullscreen && createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-6"
            onDoubleClick={() => setFullscreen(false)}
          >
            <button
              type="button"
              aria-label="关闭全屏"
              onClick={() => setFullscreen(false)}
              className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>
            {prompt && (
              <button
                type="button"
                aria-label="查看生成提示词"
                onClick={(event) => {
                  event.stopPropagation();
                  setShowPrompt((value) => !value);
                }}
                className="absolute right-20 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
              >
                <Info className="h-5 w-5" />
              </button>
            )}
            <img src={imageUrl} alt="generated fullscreen" className="max-h-full max-w-full object-contain" />
            {showPrompt && prompt && (
              <div className="absolute right-6 top-20 max-h-[70vh] w-[360px] overflow-y-auto rounded-xl bg-white/10 p-4 text-xs leading-relaxed text-white shadow-2xl backdrop-blur">
                {prompt}
              </div>
            )}
          </div>,
          document.body
        )}
      </>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all min-w-[220px]',
        selected
          ? 'border-primary/60 shadow-[0_0_0_2px_rgba(139,111,246,0.15)]'
          : 'border-border hover:border-border/80'
      )}
      style={{ width, height, minWidth: 220, minHeight: 260 }}
    >
      <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-border p-3 text-center text-[11px] text-muted-foreground">
        {imageUrl ? <img src={imageUrl} alt="output" className="max-h-full max-w-full object-contain" /> : '等待图像生成结果...'}
      </div>
      <Handle type="target" position={Position.Left} id="output-in" className="!h-2.5 !w-2.5 !border-2 !border-white !bg-cyan-500" />
      <Handle type="target" position={Position.Top} id="output-in-top" className="!h-2.5 !w-2.5 !border-2 !border-white !bg-cyan-500" />
    </div>
  );
}

export default memo(OutputNode);
