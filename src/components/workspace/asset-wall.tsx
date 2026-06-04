'use client';

import { useState } from 'react';
import { FolderOpen, Clock, Heart, Share2, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Asset {
  id: string;
  title: string;
  author: string;
  date: string;
  likes: number;
  gradient: string;
}

const MOCK_ASSETS: Asset[] = [
  { id: '1', title: '腰靠日落场景', author: '张三', date: '2 小时前', likes: 12, gradient: 'from-orange-200 to-amber-100' },
  { id: '2', title: '居家办公氛围', author: '李四', date: '5 小时前', likes: 8, gradient: 'from-primary/20 to-primary/10' },
  { id: '3', title: '颈部按摩特写', author: '王五', date: '1 天前', likes: 15, gradient: 'from-rose-200 to-pink-100' },
  { id: '4', title: '亲子夜晚陪伴', author: '赵六', date: '1 天前', likes: 6, gradient: 'from-purple-200 to-violet-100' },
  { id: '5', title: '材质特写对比', author: '陈七', date: '2 天前', likes: 4, gradient: 'from-teal-200 to-cyan-100' },
  { id: '6', title: '追剧放松时刻', author: '周八', date: '3 天前', likes: 10, gradient: 'from-orange-200 to-red-100' },
  { id: '7', title: '腹部热敷场景', author: '吴九', date: '3 天前', likes: 3, gradient: 'from-emerald-200 to-green-100' },
  { id: '8', title: '快试模板合集', author: '郑十', date: '4 天前', likes: 7, gradient: 'from-stone-200 to-gray-100' },
  { id: '9', title: '对比说明拼图', author: '冯一', date: '5 天前', likes: 9, gradient: 'from-yellow-200 to-amber-100' },
];

type FilterKey = 'all' | 'recent' | 'liked';

interface AssetWallProps {
  title?: string;
  defaultFilter?: FilterKey;
}

export function AssetWall({ title, defaultFilter }: AssetWallProps) {
  const [filter, setFilter] = useState<FilterKey>(defaultFilter ?? 'all');

  return (
    <div className="flex h-full flex-col">
      {/* 筛选栏 */}
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-2">
          <FolderOpen className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">{title ?? '团队创意资产墙'}</h3>
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-secondary p-0.5">
          {([
            { key: 'all', label: '全部', icon: <FolderOpen className="h-3 w-3" /> },
            { key: 'recent', label: '最近', icon: <Clock className="h-3 w-3" /> },
            { key: 'liked', label: '收藏', icon: <Heart className="h-3 w-3" /> },
          ] as const).map((item) => (
            <button
              key={item.key}
              onClick={() => setFilter(item.key)}
              className={cn(
                'flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all',
                filter === item.key
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 资产网格 */}
      <div className="flex-1 overflow-y-auto p-5">
        <div className="grid grid-cols-4 gap-4">
          {MOCK_ASSETS.map((asset) => (
            <div
              key={asset.id}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-lg hover:border-primary/30"
            >
              {/* 占位封面 */}
              <div className={cn('relative h-36 w-full bg-gradient-to-br', asset.gradient)}>
                <div className="absolute inset-0 flex items-center justify-center text-foreground/20">
                  <FolderOpen className="h-8 w-8" />
                </div>
                {/* 操作按钮 */}
                <div className="absolute right-2 top-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="flex h-6 w-6 items-center justify-center rounded-full bg-card/90 text-muted-foreground hover:text-primary shadow-sm">
                    <Heart className="h-3 w-3" />
                  </button>
                  <button className="flex h-6 w-6 items-center justify-center rounded-full bg-card/90 text-muted-foreground hover:text-primary shadow-sm">
                    <Share2 className="h-3 w-3" />
                  </button>
                  <button className="flex h-6 w-6 items-center justify-center rounded-full bg-card/90 text-muted-foreground hover:text-primary shadow-sm">
                    <MoreHorizontal className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* 信息 */}
              <div className="p-3">
                <h4 className="text-xs font-semibold text-foreground truncate">{asset.title}</h4>
                <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>{asset.author}</span>
                  <span>{asset.date}</span>
                </div>
                <div className="mt-1.5 flex items-center gap-1 text-[10px] text-muted-foreground/60">
                  <Heart className="h-2.5 w-2.5" />
                  <span>{asset.likes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
