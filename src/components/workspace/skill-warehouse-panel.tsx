'use client';

import { X, Plus, Upload, Shield, Building2, User } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { SkillVisibility } from '@/lib/types';

const MOCK_PUBLIC_SKILLS = [
  { id: 'skill-metal', name: '拉丝金属', tags: ['材质'], visibility: 'public' as SkillVisibility },
  { id: 'skill-ceramic', name: '陶瓷质感', tags: ['材质'], visibility: 'public' as SkillVisibility },
  { id: 'skill-studio', name: '影棚光效', tags: ['光影'], visibility: 'public' as SkillVisibility },
  { id: 'skill-neon', name: '赛博霓虹', tags: ['风格'], visibility: 'public' as SkillVisibility },
  { id: 'skill-wood', name: '木纹材质', tags: ['材质'], visibility: 'public' as SkillVisibility },
];

const MOCK_DEPT_SKILLS = [
  { id: 'skill-outdoor', name: '户外自然光', tags: ['光影'], visibility: 'department' as SkillVisibility },
  { id: 'skill-vi-blue', name: 'VI蓝调', tags: ['色调'], visibility: 'department' as SkillVisibility },
];

const MOCK_PERSONAL_SKILLS = [
  { id: 'skill-minimal', name: '极简白底', tags: ['风格'], visibility: 'personal' as SkillVisibility },
];

const SECTION_CONFIG = [
  {
    title: '公共 / 官方 Skill',
    icon: Shield,
    skills: MOCK_PUBLIC_SKILLS,
    empty: '暂无公共技能',
  },
  {
    title: '部门 Skill',
    icon: Building2,
    skills: MOCK_DEPT_SKILLS,
    empty: '暂无部门技能',
  },
  {
    title: '个人 Skill',
    icon: User,
    skills: MOCK_PERSONAL_SKILLS,
    empty: '暂无个人技能',
  },
];

export function SkillWarehousePanel() {
  const skillPanelOpen = useAppStore((s) => s.skillPanelOpen);
  const setSkillPanelOpen = useAppStore((s) => s.setSkillPanelOpen);

  if (!skillPanelOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* 遮罩 */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={() => setSkillPanelOpen(false)}
      />

      {/* 面板 */}
      <div className="relative ml-auto flex h-full w-full max-w-md flex-col bg-background shadow-xl">
        {/* 标题栏 */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-sm font-semibold">风格资产协同仓</h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setSkillPanelOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* 上传入口 */}
        <div className="border-b px-4 py-3">
          <Button variant="outline" size="sm" className="h-8 w-full text-xs">
            <Upload className="mr-1.5 h-3.5 w-3.5" />
            上传训练集 / 创建新 Skill
          </Button>
        </div>

        {/* Skill 列表 */}
        <ScrollArea className="flex-1 px-4 py-3">
          <div className="flex flex-col gap-5">
            {SECTION_CONFIG.map((section) => {
              const Icon = section.icon;
              return (
                <div key={section.title} className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs font-medium">{section.title}</span>
                  </div>
                  {section.skills.length === 0 ? (
                    <span className="text-[10px] text-muted-foreground pl-5">
                      {section.empty}
                    </span>
                  ) : (
                    <div className="flex flex-col gap-1.5 pl-5">
                      {section.skills.map((skill) => (
                        <div
                          key={skill.id}
                          className="flex items-center justify-between rounded-md border px-3 py-2"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium">{skill.name}</span>
                            <div className="flex gap-1">
                              {skill.tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="h-4 px-1 text-[8px]"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="h-6 text-[10px]">
                            <Plus className="mr-0.5 h-3 w-3" />
                            引用
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  <Separator className="mt-1" />
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* 底部提示 */}
        <div className="border-t px-4 py-2">
          <p className="text-[10px] text-muted-foreground">
            公共 Skill 需管理员审核上架；部门/个人 Skill 部门内审后可见
          </p>
        </div>
      </div>
    </div>
  );
}
