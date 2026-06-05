'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  ChevronDown, Sparkles, Tag, Search,
  Heart, Dumbbell, Home, UtensilsCrossed, Stethoscope,
} from 'lucide-react';
import { PROMPT_TEMPLATES, CATEGORY_TREE } from '@/lib/skillsData';
import type { PromptTemplate, CategoryNode } from '@/lib/skillsData';
import { cn } from '@/lib/utils';
import { SkillDetailDrawer } from './skill-detail-drawer';

interface SkillMatrixProps {
  onSelectTemplate: (
    template: PromptTemplate,
    scene?: { sceneName?: string; scenePrompt?: string }
  ) => void;
  mode?: 'full' | 'tree-only' | 'gallery-only';
  width?: number;
  treeWidth?: number;
  onTreeWidthChange?: (delta: number) => void;
}

/* ─── 分组图标映射 ─── */
function GroupIcon({ icon, className }: { icon?: string; className?: string }) {
  const props = { className: cn('h-3.5 w-3.5 shrink-0', className) };
  switch (icon) {
    case 'sparkles': return <Sparkles {...props} />;
    case 'heart': return <Heart {...props} />;
    case 'dumbbell': return <Dumbbell {...props} />;
    case 'home': return <Home {...props} />;
    case 'utensils': return <UtensilsCrossed {...props} />;
    case 'stethoscope': return <Stethoscope {...props} />;
    default: return <Sparkles {...props} />;
  }
}

/* ─── 树状类目节点 ─── */
function TreeNode({
  node,
  depth,
  selectedCategory,
  onSelect,
}: {
  node: CategoryNode;
  depth: number;
  selectedCategory: string | null;
  onSelect: (label: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedCategory === node.label;

  return (
    <div>
      <button
        onClick={() => {
          if (hasChildren) setExpanded(!expanded);
          onSelect(node.label);
        }}
        className={cn(
          'group flex w-full items-center gap-2 rounded-lg py-2 pr-2.5 text-left transition-all',
          depth === 0 ? 'pl-2.5' : 'pl-3',
          isSelected
            ? 'bg-primary/8 text-primary'
            : 'text-foreground/70 hover:bg-muted/50 hover:text-foreground',
        )}
      >
        {/* 左侧选中指示竖线 */}
        <div
          className={cn(
            'mr-0.5 h-4 w-[3px] shrink-0 rounded-full transition-all',
            isSelected ? 'bg-primary opacity-100' : 'bg-transparent opacity-0',
          )}
        />
        {hasChildren ? (
          <ChevronDown
            className={cn(
              'h-3 w-3 shrink-0 text-muted-foreground transition-transform duration-200',
              !expanded && '-rotate-90',
            )}
          />
        ) : (
          <span className="h-3 w-3 shrink-0" />
        )}
        {depth === 0 && node.icon && (
          <GroupIcon
            icon={node.icon}
            className={cn(isSelected ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground')}
          />
        )}
        <span className={cn('text-xs', depth === 0 ? 'font-semibold' : 'font-medium')}>
          {node.label}
        </span>
      </button>
      {expanded && hasChildren && (
        <div className="mt-0.5 flex flex-col gap-0.5 border-l border-border/60 ml-4 pl-2">
          {node.children!.map((child) => (
            <TreeNode
              key={child.label}
              node={child}
              depth={depth + 1}
              selectedCategory={selectedCategory}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// 大图卡片
function TemplateCard({
  template,
  onClick,
}: {
  template: PromptTemplate;
  onClick: () => void;
}) {
  const images = [
    '/skills/carousel-1.jpg',
    '/skills/carousel-2.jpg',
    '/skills/carousel-3.jpg',
    '/skills/carousel-4.jpg',
    '/skills/carousel-5.jpg',
    '/skills/carousel-6.jpg',
    '/skills/carousel-7.jpg',
    '/skills/carousel-8.jpg',
  ];
  const [current, setCurrent] = useState(0);
  const [hovered, setHovered] = useState(false);

  const next = useCallback(() => setCurrent((i) => (i + 1) % images.length), [images.length]);
  const prev = useCallback(() => setCurrent((i) => (i - 1 + images.length) % images.length), [images.length]);

  useEffect(() => {
    if (!hovered) {
      const timer = setInterval(next, 3000);
      return () => clearInterval(timer);
    }
  }, [hovered, next]);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5"
    >
      {/* 轮播图区域 */}
      <div className="relative h-44 w-full overflow-hidden bg-muted">
        {images.map((src, idx) => (
          <img
            key={src}
            src={src}
            alt={`示例 ${idx + 1}`}
            className={cn(
              'absolute inset-0 h-full w-full object-cover transition-opacity duration-500',
              idx === current ? 'opacity-100' : 'opacity-0',
            )}
          />
        ))}

        {/* 左右箭头 */}
        <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/50"
          >
            <ChevronDown className="h-4 w-4 -rotate-90" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/50"
          >
            <ChevronDown className="h-4 w-4 rotate-90" />
          </button>
        </div>

        {/* 底部指示器 */}
        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
          {images.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => { e.stopPropagation(); setCurrent(idx); }}
              className={cn(
                'h-1 rounded-full transition-all duration-300',
                idx === current ? 'w-4 bg-white shadow-sm' : 'w-1.5 bg-white/50 hover:bg-white/70',
              )}
            />
          ))}
        </div>

        {/* hover 遮罩 */}
        <div className="absolute inset-0 flex items-center justify-center bg-primary/0 group-hover:bg-primary/30 transition-colors">
          <span className="rounded-full bg-card px-3 py-1.5 text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
            选择此 Skill
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 p-3">
        <h4 className="text-sm font-semibold text-foreground text-left">{template.styleName}</h4>
        <div className="flex items-center gap-1.5">
          <Tag className="h-3 w-3 text-muted-foreground/60" />
          <div className="flex flex-wrap gap-1">
            {template.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-medium text-primary">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground text-left line-clamp-2">
          {template.prompt.slice(0, 80)}...
        </p>
      </div>
    </div>
  );
}

export function SkillMatrix({ onSelectTemplate, mode = 'full', width, treeWidth: externalTreeWidth, onTreeWidthChange }: SkillMatrixProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [internalTreeWidth, setInternalTreeWidth] = useState(224);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<PromptTemplate | null>(null);
  const [remoteTemplates, setRemoteTemplates] = useState<PromptTemplate[] | null>(null);
  const [remoteCategoryTree, setRemoteCategoryTree] = useState<CategoryNode[] | null>(null);
  const [skillsError, setSkillsError] = useState('');
  const [skillsReloadKey, setSkillsReloadKey] = useState(0);
  const treeWidth = externalTreeWidth ?? internalTreeWidth;
  const templates = remoteTemplates?.length ? remoteTemplates : PROMPT_TEMPLATES;
  const categoryTree = remoteCategoryTree?.length ? remoteCategoryTree : CATEGORY_TREE;

  useEffect(() => {
    let cancelled = false;

    async function loadSkills() {
      try {
        const response = await fetch('/api/skills', { cache: 'no-store' });
        const data = await response.json() as {
          templates?: PromptTemplate[];
          categoryTree?: CategoryNode[];
          error?: string;
        };

        if (cancelled) return;

        if (!response.ok || data.error) {
          setSkillsError(data.error || `Skill 加载失败：HTTP ${response.status}`);
          return;
        }

        setRemoteTemplates(data.templates ?? []);
        setRemoteCategoryTree(data.categoryTree ?? []);
        setSkillsError('');
      } catch (error) {
        if (!cancelled) {
          setSkillsError(error instanceof Error ? error.message : 'Skill 加载失败');
        }
      }
    }

    void loadSkills();
    return () => {
      cancelled = true;
    };
  }, [skillsReloadKey]);

  const filteredTemplates = useMemo(() => {
    let result = templates;
    if (selectedCategory) {
      const findTemplateIds = (nodes: CategoryNode[]): string[] => {
        let ids: string[] = [];
        for (const node of nodes) {
          if (node.label === selectedCategory && node.templateIds) {
            ids = ids.concat(node.templateIds);
          }
          if (node.children) {
            ids = ids.concat(findTemplateIds(node.children));
          }
        }
        return ids;
      };
      const ids = findTemplateIds(categoryTree);
      if (ids.length > 0) result = result.filter((t) => ids.includes(t.id));
      if (ids.length === 0) result = result.filter((t) => t.category === selectedCategory || t.subCategory === selectedCategory);
    }
    if (searchValue.trim()) {
      const keyword = searchValue.trim().toLowerCase();
      result = result.filter(
        (t) =>
          t.styleName.toLowerCase().includes(keyword) ||
          t.category.toLowerCase().includes(keyword) ||
          t.tags.some((tag) => tag.toLowerCase().includes(keyword)),
      );
    }
    return result;
  }, [categoryTree, selectedCategory, searchValue, templates]);

  /* ─── 类目搜索过滤 ─── */
  const [categorySearch, setCategorySearch] = useState('');
  const filteredCategoryTree = useMemo(() => {
    if (!categorySearch.trim()) return categoryTree;
    const keyword = categorySearch.trim().toLowerCase();
    return categoryTree.map((group) => {
      const matchedChildren = group.children?.filter((child) =>
        child.label.toLowerCase().includes(keyword)
      );
      if (group.label.toLowerCase().includes(keyword)) {
        return group;
      }
      if (matchedChildren && matchedChildren.length > 0) {
        return { ...group, children: matchedChildren };
      }
      return null;
    }).filter(Boolean) as CategoryNode[];
  }, [categorySearch, categoryTree]);

  /* ─── 树状导航（仅 tree-only 或 full） ─── */
  const treeContent = (
    <div className="flex h-full flex-col">
      <div className="border-b border-border/60 p-3">
        <h3 className="mb-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          产品类目
        </h3>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground/50" />
          <input
            value={categorySearch}
            onChange={(e) => setCategorySearch(e.target.value)}
            placeholder="搜索类目…"
            className="h-8 w-full rounded-lg border border-border bg-secondary pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <button
          onClick={() => { setSelectedCategory(null); setCategorySearch(''); }}
          className={cn(
            'group flex w-full items-center gap-2 rounded-lg py-2 pr-2.5 pl-2.5 text-left transition-all',
            !selectedCategory && !categorySearch
              ? 'bg-primary/8 text-primary'
              : 'text-foreground/70 hover:bg-muted/50 hover:text-foreground',
          )}
        >
          <div
            className={cn(
              'mr-0.5 h-4 w-[3px] shrink-0 rounded-full transition-all',
              !selectedCategory && !categorySearch ? 'bg-primary opacity-100' : 'bg-transparent opacity-0',
            )}
          />
          <Sparkles className={cn('h-3.5 w-3.5 shrink-0', !selectedCategory && !categorySearch ? 'text-primary' : 'text-muted-foreground')} />
          <span className="text-xs font-semibold">全部 Skill</span>
        </button>
        <div className="mt-1 flex flex-col gap-1">
          {filteredCategoryTree.map((node) => (
            <TreeNode
              key={node.label}
              node={node}
              depth={0}
              selectedCategory={selectedCategory}
              onSelect={setSelectedCategory}
            />
          ))}
        </div>
      </div>
    </div>
  );

  /* ─── 大图墙（仅 gallery-only 或 full） ─── */
  const galleryContent = (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold text-foreground">
            {selectedCategory ?? '全部 Skill'}
          </h3>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
            {filteredTemplates.length} 套
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-[10px] font-medium',
              remoteTemplates?.length
                ? 'bg-emerald-500/10 text-emerald-600'
                : 'bg-muted text-muted-foreground'
            )}
          >
            {remoteTemplates?.length ? '热拔插 Skill' : '本地默认'}
          </span>
          {skillsError && (
            <span className="max-w-[180px] truncate rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-medium text-destructive" title={skillsError}>
              {skillsError}
            </span>
          )}
          <button
            type="button"
            onClick={() => setSkillsReloadKey((key) => key + 1)}
            className="h-8 rounded-lg border border-border bg-card px-3 text-xs font-medium text-foreground/80 transition hover:bg-muted"
          >
            刷新 Skill
          </button>
        <input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="搜索风格..."
          className="h-8 w-48 rounded-lg border border-border bg-card pl-3 pr-3 text-xs text-foreground/80 placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
        />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-5">
        {filteredTemplates.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground/60">没有匹配的 Skill</div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredTemplates.map((tpl) => (
              <TemplateCard
                key={tpl.id}
                template={tpl}
                onClick={() => {
                  setActiveTemplate(tpl);
                  setDrawerOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  /* ─── 模式分发 ─── */
  if (mode === 'tree-only') {
    return (
      <div className="h-full overflow-y-auto" style={width ? { width } : undefined}>
        {treeContent}
      </div>
    );
  }

  if (mode === 'gallery-only') {
    return galleryContent;
  }

  /* full 模式：左侧树 + 滑块 + 右侧墙 */
  const tw = treeWidth ?? 224;

  return (
    <div className="flex h-full">
      <div
        className="shrink-0 border-r border-border bg-secondary/80 overflow-y-auto"
        style={{ width: `${tw}px` }}
      >
        {treeContent}
      </div>
      {/* 树与墙之间的拖拽滑块 */}
      <div
        className="group relative z-10 flex w-[5px] shrink-0 cursor-col-resize items-center justify-center bg-secondary hover:bg-primary active:bg-primary transition-colors"
        onMouseDown={(e: React.MouseEvent) => {
          e.preventDefault();
          const startX = e.clientX;
          const startW = tw;
          const onMove = (ev: MouseEvent) => {
            const newWidth = Math.max(140, Math.min(500, startW + (ev.clientX - startX)));
            if (onTreeWidthChange) {
              // External control: set absolute width
              onTreeWidthChange(newWidth);
            } else {
              setInternalTreeWidth(newWidth);
            }
          };
          const onUp = () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
            document.body.style.userSelect = '';
            document.body.style.cursor = '';
          };
          document.body.style.userSelect = 'none';
          document.body.style.cursor = 'col-resize';
          document.addEventListener('mousemove', onMove);
          document.addEventListener('mouseup', onUp);
        }}
      >
        <div className="h-8 w-[3px] rounded-full bg-border group-hover:bg-primary-foreground group-active:bg-primary-foreground" />
      </div>
      <div className="flex-1 min-w-0">{galleryContent}</div>
      <SkillDetailDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        template={activeTemplate}
        onApply={() => {
          setDrawerOpen(false);
          if (activeTemplate) onSelectTemplate(activeTemplate);
        }}
        onFillPrompt={(sceneName, scenePrompt) => {
          setDrawerOpen(false);
          if (activeTemplate) onSelectTemplate(activeTemplate, { sceneName, scenePrompt });
        }}
      />
    </div>
  );
}
