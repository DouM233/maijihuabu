'use client';

import { X } from 'lucide-react';

interface TerminalPanelProps {
  open: boolean;
  onClose: () => void;
  logs: string[];
}

export default function TerminalPanel({ open, onClose, logs }: TerminalPanelProps) {
  if (!open) return null;

  return (
    <div className="absolute bottom-3 right-3 w-96 h-64 bg-card/95 backdrop-blur-sm border border-border rounded-xl shadow-lg flex flex-col z-20">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <span className="text-sm font-medium text-foreground">执行日志</span>
        <button onClick={onClose} className="p-1 rounded hover:bg-muted transition-colors">
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-1 font-mono text-xs">
        {logs.length === 0 && (
          <div className="text-muted-foreground">暂无日志...</div>
        )}
        {logs.map((log, i) => (
          <div
            key={i}
            className={`${
              log.startsWith('[系统]')
                ? 'text-primary'
                : log.startsWith('[完成]')
                  ? 'text-green-600'
                  : log.startsWith('[错误]')
                    ? 'text-destructive'
                    : 'text-foreground'
            }`}
          >
            {log}
          </div>
        ))}
      </div>
    </div>
  );
}
