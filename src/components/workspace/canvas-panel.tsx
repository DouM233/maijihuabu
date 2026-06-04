'use client';

import { useCallback } from 'react';
import { Wand2, Download, Loader2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function CanvasPanel() {
  const allUploaded = useAppStore((s) => s.isAllViewsUploaded());
  const generateStatus = useAppStore((s) => s.generateStatus);
  const setGenerateStatus = useAppStore((s) => s.setGenerateStatus);
  const generatedImageUrl = useAppStore((s) => s.generatedImageUrl);
  const selectedModelId = useAppStore((s) => s.selectedModelId);
  const selectedSkillIds = useAppStore((s) => s.selectedSkillIds);
  const appliedPrompt = useAppStore((s) => s.appliedPrompt);

  const canGenerate = allUploaded && selectedModelId !== null;

  const handleGenerate = useCallback(() => {
    if (!canGenerate) return;
    setGenerateStatus('generating');

    // TODO: 对接后端图像生成 API，当前为占位模拟
    setTimeout(() => {
      setGenerateStatus('done');
    }, 3000);
  }, [canGenerate, setGenerateStatus]);

  return (
    <div className="flex h-full flex-col">
      {/* 画布区域 */}
      <div className="flex-1 flex items-center justify-center bg-muted/20 relative">
        {generateStatus === 'generating' ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-xs text-muted-foreground">正在生成 3D 效果图…</span>
          </div>
        ) : generatedImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={generatedImageUrl}
            alt="生成的3D效果图"
            className="max-h-full max-w-full object-contain p-4"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Wand2 className="h-10 w-10 opacity-30" />
            <span className="text-xs">上传三视图并点击生成，3D 效果图将在此展示</span>
          </div>
        )}
      </div>

      {/* 底部操作栏 */}
      <div className="flex items-center justify-between border-t px-4 py-2.5">
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span>模型: {selectedModelId ?? '未选择'}</span>
          <span>·</span>
          <span>Skill: {selectedSkillIds.length} 个</span>
          <span>·</span>
          <span className={cn(appliedPrompt ? 'text-emerald-600 dark:text-emerald-400' : '')}>
            Prompt: {appliedPrompt ? '已应用' : '未应用'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {generatedImageUrl && (
            <Button variant="outline" size="sm" className="h-7 text-xs">
              <Download className="mr-1 h-3 w-3" />
              下载
            </Button>
          )}
          <Button
            size="sm"
            className="h-7 text-xs"
            disabled={!canGenerate || generateStatus === 'generating'}
            onClick={handleGenerate}
          >
            {generateStatus === 'generating' ? (
              <>
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                生成中…
              </>
            ) : (
              <>
                <Wand2 className="mr-1 h-3 w-3" />
                生成 3D 效果图
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
