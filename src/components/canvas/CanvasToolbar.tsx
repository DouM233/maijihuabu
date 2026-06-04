'use client';

import { Play, Square, Terminal } from 'lucide-react';

interface CanvasToolbarProps {
  onRun: () => void;
  isRunning: boolean;
  onToggleTerminal: () => void;
}

export default function CanvasToolbar({ onRun, isRunning, onToggleTerminal }: CanvasToolbarProps) {
  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-2 rounded-xl bg-card/90 backdrop-blur-sm border border-border shadow-sm z-10">
      <button
        onClick={onRun}
        disabled={isRunning}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isRunning ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        {isRunning ? '运行中' : '运行画布'}
      </button>

      <div className="w-px h-5 bg-border" />

      <button
        onClick={onToggleTerminal}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
      >
        <Terminal className="w-4 h-4" />
        终端
      </button>
    </div>
  );
}
