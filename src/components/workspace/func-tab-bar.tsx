'use client';

import { cn } from '@/lib/utils';
import { Paintbrush, LayoutGrid, Package } from 'lucide-react';

export type TabId = 'creative' | 'skill-matrix' | 'asset-wall';

interface TabItem {
  id: TabId;
  label: string;
  icon: React.ReactNode;
  primary?: boolean;
}

const TABS: TabItem[] = [
  { id: 'creative', label: '智能生图创意舱', icon: <Paintbrush className="h-4 w-4" />, primary: true },
  { id: 'skill-matrix', label: '视觉 Skill 矩阵库', icon: <LayoutGrid className="h-4 w-4" /> },
  { id: 'asset-wall', label: '团队创意资产墙', icon: <Package className="h-4 w-4" /> },
];

interface FuncTabBarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function FuncTabBar({ activeTab, onTabChange }: FuncTabBarProps) {
  return (
    <div className="flex items-center gap-2 border-b border-border bg-secondary/60 px-5 py-2.5">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all',
            tab.primary && activeTab === tab.id
              ? 'bg-primary text-primary-foreground shadow-sm'
              : activeTab === tab.id
                ? 'bg-card text-foreground shadow-sm border border-border'
                : 'bg-card text-muted-foreground border border-border hover:border-primary/30 hover:bg-primary/10',
          )}
        >
          {tab.icon}
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
