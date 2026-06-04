'use client';

import { Palette, Layers } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { BASE_MODELS } from '@/lib/types';
import type { BaseModelId, Skill, SkillVisibility } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// 示例 Skill 数据，后续对接后端
const MOCK_SKILLS: Skill[] = [
  { id: 'skill-metal', name: '拉丝金属', previewUrl: null, visibility: 'public', tags: ['材质'] },
  { id: 'skill-ceramic', name: '陶瓷质感', previewUrl: null, visibility: 'public', tags: ['材质'] },
  { id: 'skill-studio', name: '影棚光效', previewUrl: null, visibility: 'public', tags: ['光影'] },
  { id: 'skill-outdoor', name: '户外自然光', previewUrl: null, visibility: 'department', tags: ['光影'] },
  { id: 'skill-vi-blue', name: 'VI蓝调', previewUrl: null, visibility: 'department', tags: ['色调'] },
  { id: 'skill-minimal', name: '极简白底', previewUrl: null, visibility: 'personal', tags: ['风格'] },
  { id: 'skill-neon', name: '赛博霓虹', previewUrl: null, visibility: 'public', tags: ['风格'] },
  { id: 'skill-wood', name: '木纹材质', previewUrl: null, visibility: 'public', tags: ['材质'] },
];

const VISIBILITY_LABEL: Record<SkillVisibility, string> = {
  public: '公共',
  department: '部门',
  personal: '个人',
};

const VISIBILITY_COLOR: Record<SkillVisibility, string> = {
  public: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  department: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  personal: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
};

export function ModelSkillPanel() {
  const selectedModelId = useAppStore((s) => s.selectedModelId);
  const setSelectedModelId = useAppStore((s) => s.setSelectedModelId);
  const selectedSkillIds = useAppStore((s) => s.selectedSkillIds);
  const toggleSkill = useAppStore((s) => s.toggleSkill);
  const setSkillPanelOpen = useAppStore((s) => s.setSkillPanelOpen);

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* 基础模型选择 */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">基础模型</h3>
        </div>
        <Select
          value={selectedModelId ?? undefined}
          onValueChange={(v) => setSelectedModelId(v as BaseModelId)}
        >
          <SelectTrigger className="h-9 text-xs">
            <SelectValue placeholder="选择基础模型" />
          </SelectTrigger>
          <SelectContent>
            {BASE_MODELS.map((m) => (
              <SelectItem key={m.id} value={m.id} className="text-xs">
                {m.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Skill 选择区 */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">风格技能 (Skill)</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-[10px]"
            onClick={() => setSkillPanelOpen(true)}
          >
            管理技能仓
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {MOCK_SKILLS.map((skill) => {
            const isSelected = selectedSkillIds.includes(skill.id);
            return (
              <button
                key={skill.id}
                onClick={() => toggleSkill(skill.id)}
                className={cn(
                  'group flex flex-col items-center gap-1.5 rounded-lg border p-2 transition-all',
                  isSelected
                    ? 'border-primary bg-primary/10 ring-1 ring-primary/30'
                    : 'border-border bg-card hover:border-primary/40 hover:bg-muted/50',
                )}
              >
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-md text-[10px] font-medium',
                    isSelected
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground',
                  )}
                >
                  {skill.name.slice(0, 2)}
                </div>
                <span className="text-[10px] leading-tight text-foreground">
                  {skill.name}
                </span>
                <Badge
                  variant="secondary"
                  className={cn(
                    'h-4 px-1 text-[8px]',
                    VISIBILITY_COLOR[skill.visibility],
                  )}
                >
                  {VISIBILITY_LABEL[skill.visibility]}
                </Badge>
              </button>
            );
          })}
        </div>

        {selectedSkillIds.length > 0 && (
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <span>已选 {selectedSkillIds.length} 个 Skill</span>
            <span className="text-primary/60">·</span>
            <span>Skill 将作为参数挂载，不转化为可见文本</span>
          </div>
        )}
      </div>
    </div>
  );
}
