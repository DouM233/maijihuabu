'use client';

import { useState } from 'react';
import {
  BrainCircuit,
  Bell,
  ChevronDown,
  LogOut,
  User,
  Wallet,
} from 'lucide-react';

export function TopNavBar() {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-5">
      {/* 左侧品牌 */}
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <BrainCircuit className="h-5 w-5" />
        </div>
        <span className="text-base font-bold text-foreground">
          麦吉AI
        </span>
      </div>

      {/* 右侧用户区 */}
      <div className="flex items-center gap-4">
        {/* 积分 */}
        <div className="flex items-center gap-1.5">
          <div className="flex h-7 items-center rounded-full bg-primary px-2.5 text-xs font-bold text-primary-foreground">
            99
          </div>
        </div>

        {/* 用户信息 */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 rounded-lg px-2 py-1 text-sm text-muted-foreground hover:bg-secondary transition-colors"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-primary">
              <User className="h-4 w-4" />
            </div>
            <span className="text-xs text-muted-foreground">wx_user_olbHL2LR_J</span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground/60" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-1 w-40 rounded-lg border border-border bg-popover py-1 shadow-lg z-50">
              <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-popover-foreground hover:bg-secondary">
                <User className="h-3.5 w-3.5" />
                个人中心
              </button>
              <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-popover-foreground hover:bg-secondary">
                <Wallet className="h-3.5 w-3.5" />
                充值记录
              </button>
              <div className="my-1 border-t border-border" />
              <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10">
                <LogOut className="h-3.5 w-3.5" />
                登出
              </button>
            </div>
          )}
        </div>

        {/* 通知 */}
        <button className="relative flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary transition-colors">
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
        </button>
      </div>
    </header>
  );
}
