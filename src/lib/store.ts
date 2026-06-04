import { create } from 'zustand';
import type {
  ViewSlot,
  ViewAngle,
  BaseModelId,
  Skill,
  ChatMessage,
  GenerateStatus,
  GenModelId,
  GenSizeId,
  GenQualityId,
} from '@/lib/types';

/* ─── 无限画布节点 ─── */
export interface CanvasNode {
  id: string;
  url: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'upload' | 'generated';
}

interface AppState {
  // --- 三视图 ---
  viewSlots: ViewSlot[];
  setViewImage: (angle: ViewAngle, imageUrl: string, fileName: string) => void;
  removeViewImage: (angle: ViewAngle) => void;
  isAllViewsUploaded: () => boolean;

  // --- 基础模型 ---
  selectedModelId: BaseModelId | null;
  setSelectedModelId: (id: BaseModelId) => void;

  // --- Skill ---
  selectedSkillIds: string[];
  toggleSkill: (skillId: string) => void;
  clearSkills: () => void;

  // --- 对话 ---
  chatMessages: ChatMessage[];
  addChatMessage: (msg: ChatMessage) => void;
  clearChat: () => void;
  appliedPrompt: string;
  setAppliedPrompt: (prompt: string) => void;

  // --- 生成状态 ---
  generateStatus: GenerateStatus;
  setGenerateStatus: (status: GenerateStatus) => void;
  generatedImageUrl: string | null;
  setGeneratedImageUrl: (url: string | null) => void;

  // --- 画布 / Mask ---
  maskActive: boolean;
  setMaskActive: (active: boolean) => void;

  // --- 画布生成参数 ---
  genModel: GenModelId;
  setGenModel: (model: GenModelId) => void;
  genSize: GenSizeId;
  setGenSize: (size: GenSizeId) => void;
  genQuality: GenQualityId;
  setGenQuality: (quality: GenQualityId) => void;

  // --- Skill 仓面板 ---
  skillPanelOpen: boolean;
  setSkillPanelOpen: (open: boolean) => void;

  // --- 当前加载的 Skill Prompt（后台静默绑定） ---
  currentLoadedSkillPrompt: string;
  setCurrentLoadedSkillPrompt: (prompt: string) => void;
  currentLoadedSkillName: string;
  setCurrentLoadedSkillName: (name: string) => void;
  currentLoadedSkillSceneName: string;
  setCurrentLoadedSkillSceneName: (name: string) => void;
  currentLoadedSkillScenePrompt: string;
  setCurrentLoadedSkillScenePrompt: (prompt: string) => void;
  clearLoadedSkill: () => void;

  // --- 引用到聊天的图片节点 ---
  referencedImageNode: CanvasNode | null;
  setReferencedImageNode: (node: CanvasNode | null) => void;

  // --- 无限画布节点 ---
  canvasNodes: CanvasNode[];
  addCanvasNode: (node: CanvasNode) => void;
  addCanvasNodes: (nodes: CanvasNode[]) => void;
  updateCanvasNode: (id: string, updates: Partial<Pick<CanvasNode, 'x' | 'y' | 'width' | 'height'>>) => void;
  removeCanvasNode: (id: string) => void;
  clearCanvasNodes: () => void;
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
}

const initialViewSlots: ViewSlot[] = [
  { angle: 'front', imageUrl: null, fileName: null },
  { angle: 'top', imageUrl: null, fileName: null },
  { angle: 'side', imageUrl: null, fileName: null },
];

export const useAppStore = create<AppState>((set, get) => ({
  // --- 三视图 ---
  viewSlots: initialViewSlots,
  setViewImage: (angle, imageUrl, fileName) =>
    set((s) => ({
      viewSlots: s.viewSlots.map((v) =>
        v.angle === angle ? { ...v, imageUrl, fileName } : v,
      ),
    })),
  removeViewImage: (angle) =>
    set((s) => ({
      viewSlots: s.viewSlots.map((v) =>
        v.angle === angle ? { ...v, imageUrl: null, fileName: null } : v,
      ),
    })),
  isAllViewsUploaded: () => get().viewSlots.every((v) => v.imageUrl !== null),

  // --- 基础模型 ---
  selectedModelId: null,
  setSelectedModelId: (id) => set({ selectedModelId: id }),

  // --- Skill ---
  selectedSkillIds: [],
  toggleSkill: (skillId) =>
    set((s) => ({
      selectedSkillIds: s.selectedSkillIds.includes(skillId)
        ? s.selectedSkillIds.filter((id) => id !== skillId)
        : [...s.selectedSkillIds, skillId],
    })),
  clearSkills: () => set({ selectedSkillIds: [] }),

  // --- 对话 ---
  chatMessages: [],
  addChatMessage: (msg) =>
    set((s) => ({ chatMessages: [...s.chatMessages, msg] })),
  clearChat: () => set({ chatMessages: [] }),
  appliedPrompt: '',
  setAppliedPrompt: (prompt) => set({ appliedPrompt: prompt }),

  // --- 生成状态 ---
  generateStatus: 'idle',
  setGenerateStatus: (status) => set({ generateStatus: status }),
  generatedImageUrl: null,
  setGeneratedImageUrl: (url) => set({ generatedImageUrl: url }),

  // --- 画布 / Mask ---
  maskActive: false,
  setMaskActive: (active) => set({ maskActive: active }),

  // --- 画布生成参数 ---
  genModel: 'gpt-image-2',
  setGenModel: (model) => set({ genModel: model }),
  genSize: 'auto',
  setGenSize: (size) => set({ genSize: size }),
  genQuality: 'low',
  setGenQuality: (quality) => set({ genQuality: quality }),

  // --- Skill 仓面板 ---
  skillPanelOpen: false,
  setSkillPanelOpen: (open) => set({ skillPanelOpen: open }),

  // --- 当前加载的 Skill Prompt ---
  currentLoadedSkillPrompt: '',
  setCurrentLoadedSkillPrompt: (prompt) => set({ currentLoadedSkillPrompt: prompt }),
  currentLoadedSkillName: '',
  setCurrentLoadedSkillName: (name) => set({ currentLoadedSkillName: name }),
  currentLoadedSkillSceneName: '',
  setCurrentLoadedSkillSceneName: (name) => set({ currentLoadedSkillSceneName: name }),
  currentLoadedSkillScenePrompt: '',
  setCurrentLoadedSkillScenePrompt: (prompt) => set({ currentLoadedSkillScenePrompt: prompt }),
  clearLoadedSkill: () => set({ currentLoadedSkillPrompt: '', currentLoadedSkillName: '', currentLoadedSkillSceneName: '', currentLoadedSkillScenePrompt: '' }),

  // --- 引用到聊天的图片节点 ---
  referencedImageNode: null,
  setReferencedImageNode: (node) => set({ referencedImageNode: node }),

  // --- 无限画布节点 ---
  canvasNodes: [],
  addCanvasNode: (node) =>
    set((s) => ({ canvasNodes: [...s.canvasNodes, node] })),
  addCanvasNodes: (nodes) =>
    set((s) => ({ canvasNodes: [...s.canvasNodes, ...nodes] })),
  updateCanvasNode: (id, updates) =>
    set((s) => ({
      canvasNodes: s.canvasNodes.map((n) =>
        n.id === id ? { ...n, ...updates } : n,
      ),
    })),
  removeCanvasNode: (id) =>
    set((s) => ({
      canvasNodes: s.canvasNodes.filter((n) => n.id !== id),
      selectedNodeId: s.selectedNodeId === id ? null : s.selectedNodeId,
    })),
  clearCanvasNodes: () => set({ canvasNodes: [], selectedNodeId: null }),
  selectedNodeId: null,
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
}));
