'use client';

import { useState, useRef, useCallback } from 'react';
import { Search, X, Paintbrush, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ModelId = 'all' | 'nanobanana' | 'gpt-image-2';

interface ModelTab {
  id: ModelId;
  label: string;
}

const MODEL_TABS: ModelTab[] = [
  { id: 'all', label: '全部模型' },
  { id: 'nanobanana', label: 'Nanobanana' },
  { id: 'gpt-image-2', label: 'GPT-Image-2' },
];

interface TemplateItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const TEMPLATES: TemplateItem[] = [
  { id: 'none', label: '不使用模板', icon: <Paintbrush className="h-3.5 w-3.5" /> },
  { id: 'my', label: '我的模板', icon: <Paintbrush className="h-3.5 w-3.5" /> },
  { id: 'poster', label: 'GPT·海报插画', icon: <Paintbrush className="h-3.5 w-3.5" /> },
  { id: 'ui', label: 'GPT·UI 社媒', icon: <Paintbrush className="h-3.5 w-3.5" /> },
  { id: 'portrait', label: 'GPT·人像写真', icon: <Paintbrush className="h-3.5 w-3.5" /> },
  { id: 'character', label: 'GPT·角色设定', icon: <Paintbrush className="h-3.5 w-3.5" /> },
  { id: 'compare', label: 'GPT·对比实验', icon: <Paintbrush className="h-3.5 w-3.5" /> },
  { id: 'banana', label: 'Banana精选', icon: <Paintbrush className="h-3.5 w-3.5" /> },
];

export function StyleTagBar() {
  const [activeModel, setActiveModel] = useState<ModelId>('all');
  const [activeTemplate, setActiveTemplate] = useState('none');
  const [searchValue, setSearchValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = useCallback(() => {
    scrollRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
  }, []);

  const scrollRight = useCallback(() => {
    scrollRef.current?.scrollBy({ left: 200, behavior: 'smooth' });
  }, []);

  return (
    <div className="border-b border-border bg-card px-5 py-3">
      {/* 标题 + 搜索 + 模型切换 */}
      <div className="mb-3 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">麦吉AI · 商业视觉资产闭环生产系统</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            使用先进人工智能技术，轻松创作独特艺术作品
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* 搜索框 */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60" />
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="搜索模板..."
              className="h-8 w-48 rounded-lg border border-border bg-secondary pl-8 pr-7 text-xs text-foreground/80 placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
            {searchValue && (
              <button
                onClick={() => setSearchValue('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-muted-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* 模型切换 */}
          <div className="flex items-center gap-1 rounded-lg bg-secondary p-0.5">
            {MODEL_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveModel(tab.id)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-xs font-medium transition-all',
                  activeModel === tab.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 模板标签栏 */}
      <div className="relative flex items-center gap-1">
        <button
          onClick={scrollLeft}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm hover:bg-secondary transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div
          ref={scrollRef}
          className="hide-scrollbar flex items-center gap-2 overflow-x-auto py-1"
        >
          {TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => setActiveTemplate(tpl.id)}
              className={cn(
                'flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all',
                activeTemplate === tpl.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'border border-border bg-card text-muted-foreground hover:border-primary/40 hover:bg-primary/10',
              )}
            >
              {tpl.icon}
              <span>{tpl.label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={scrollRight}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm hover:bg-secondary transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
