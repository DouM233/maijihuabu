'use client';

import { BrainCircuit, Paintbrush, LayoutGrid, History, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';

export type TabId = 'creative' | 'skills' | 'history' | 'gallery';

interface NavTab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

const NAV_TABS: NavTab[] = [
  { id: 'creative', label: '生图', icon: <Paintbrush className="h-[18px] w-[18px]" /> },
  { id: 'skills', label: 'Skills', icon: <LayoutGrid className="h-[18px] w-[18px]" /> },
  { id: 'history', label: '历史记录', icon: <History className="h-[18px] w-[18px]" /> },
  { id: 'gallery', label: '画廊', icon: <ImageIcon className="h-[18px] w-[18px]" /> },
];

interface SidebarNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function SidebarNav({ activeTab, onTabChange }: SidebarNavProps) {
  return (
    <aside className="flex h-full w-14 shrink-0 flex-col items-center border-r border-border bg-sidebar">
      {/* 品牌 Logo */}
      <div className="flex w-full items-center justify-center border-b border-border py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/20">
          <BrainCircuit className="h-5 w-5" />
        </div>
      </div>

      {/* 导航 */}
      <nav className="flex w-full flex-1 flex-col items-center gap-3 py-4">
        {NAV_TABS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              title={tab.label}
              className={cn(
                'flex w-12 flex-col items-center justify-center gap-1 rounded-xl py-2 transition-all',
                active
                  ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
              )}
            >
              {tab.icon}
              <span className="text-[9px] leading-none font-medium">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* 底部主题切换 */}
      <div className="flex w-full flex-col items-center gap-2 border-t border-border py-3">
        <ThemeToggle />
      </div>
    </aside>
  );
}
