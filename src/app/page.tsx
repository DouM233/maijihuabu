'use client';

import { useCallback, useState } from 'react';
import Canvas from '@/components/canvas/Canvas';
import { AssetWall } from '@/components/workspace/asset-wall';
import { SidebarNav, type TabId } from '@/components/workspace/sidebar-nav';
import { SkillMatrix } from '@/components/workspace/skill-matrix';
import type { PromptTemplate } from '@/lib/skillsData';
import { useAppStore } from '@/lib/store';

interface SelectedSkillTemplate {
  template: PromptTemplate;
  sceneName?: string;
  scenePrompt?: string;
  requestId: number;
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabId>('creative');
  const [selectedTemplate, setSelectedTemplate] = useState<SelectedSkillTemplate | null>(null);

  const setCurrentLoadedSkillPrompt = useAppStore((s) => s.setCurrentLoadedSkillPrompt);
  const setCurrentLoadedSkillName = useAppStore((s) => s.setCurrentLoadedSkillName);
  const setCurrentLoadedSkillSceneName = useAppStore((s) => s.setCurrentLoadedSkillSceneName);
  const setCurrentLoadedSkillScenePrompt = useAppStore((s) => s.setCurrentLoadedSkillScenePrompt);

  const handleSelectTemplate = useCallback((
    template: PromptTemplate,
    scene?: { sceneName?: string; scenePrompt?: string }
  ) => {
    setSelectedTemplate({
      template,
      sceneName: scene?.sceneName ?? '',
      scenePrompt: scene?.scenePrompt ?? '',
      requestId: Date.now(),
    });
    setCurrentLoadedSkillPrompt(template.prompt);
    setCurrentLoadedSkillName(template.styleName);
    setCurrentLoadedSkillSceneName(scene?.sceneName ?? '');
    setCurrentLoadedSkillScenePrompt(scene?.scenePrompt ?? '');
    setActiveTab('creative');
  }, [
    setCurrentLoadedSkillPrompt,
    setCurrentLoadedSkillName,
    setCurrentLoadedSkillSceneName,
    setCurrentLoadedSkillScenePrompt,
  ]);

  const handleTabChange = useCallback((tab: TabId) => {
    setActiveTab(tab);
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <SidebarNav activeTab={activeTab} onTabChange={handleTabChange} />

      <main className="min-w-0 flex-1 overflow-hidden">
        <div className={activeTab === 'creative' ? 'h-full' : 'hidden h-full'}>
          <Canvas selectedSkillTemplate={selectedTemplate} />
        </div>

        <div className={activeTab === 'skills' ? 'h-full' : 'hidden h-full'}>
          <SkillMatrix onSelectTemplate={handleSelectTemplate} mode="full" />
        </div>

        <div className={activeTab === 'history' ? 'h-full' : 'hidden h-full'}>
          <AssetWall title="历史记录" defaultFilter="recent" />
        </div>

        <div className={activeTab === 'gallery' ? 'h-full' : 'hidden h-full'}>
          <AssetWall title="画廊" defaultFilter="all" />
        </div>
      </main>
    </div>
  );
}
