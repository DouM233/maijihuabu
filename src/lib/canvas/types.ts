/**
 * T8-penguin-canvas 节点类型定义（裁剪版）
 * 移除 RH 节点，保留 24 个核心节点
 */

// 节点类型（24 种保留）
export type NodeType =
  // Core (6)
  | 'text'
  | 'image'
  | 'video'
  | 'seedance'
  | 'audio'
  | 'llm'
  // Special (5)
  | 'multi-angle-3d'
  | 'panorama-720'
  | 'penguin-portrait'
  | 'portrait-metadata'
  | 'storyboard-grid'
  // Utility (12)
  | 'drawing-board'
  | 'browser'
  | 'image-compare'
  | 'frame-extractor'
  | 'frame-pair'
  | 'loop'
  | 'pick-from-set'
  | 'resize'
  | 'combine'
  | 'remove-bg'
  | 'upscale'
  | 'grid-crop'
  // Auxiliary (2)
  | 'idea'
  | 'relay'
  // Toolbox (2)
  | 'cinematic'
  | 'video-motion'
  // Input/Output (2)
  | 'upload'
  | 'output';

// 节点分类
export type NodeCategory =
  | 'core'
  | 'special'
  | 'utility'
  | 'auxiliary'
  | 'toolbox'
  | 'input';

// 节点元数据（用于 Sidebar 展示）
export interface NodeMeta {
  type: NodeType;
  label: string;
  category: NodeCategory;
  description: string;
  icon: string; // lucide-react 图标名
  color: string; // tailwind 色阶
  hidden?: boolean;
}

// 画布节点数据（xyflow Node.data）
export interface CanvasNodeData {
  label?: string;
  prompt?: string;
  imageUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
  model?: string;
  status?: 'idle' | 'generating' | 'success' | 'error';
  error?: string;
  // 通用扩展字段
  [key: string]: unknown;
}

// 画布列表项
export interface CanvasListItem {
  id: string;
  name: string;
  nodeCount: number;
  createdAt: number;
  updatedAt: number;
}

// 画布完整数据
export interface CanvasData {
  id: string;
  name: string;
  nodes: Array<{
    id: string;
    type: string;
    position: { x: number; y: number };
    data: Record<string, unknown>;
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    sourceHandle?: string;
    targetHandle?: string;
  }>;
  viewport?: {
    x: number;
    y: number;
    zoom: number;
  };
  createdAt: number;
  updatedAt: number;
}

// 各节点具体数据类型（别名，基于 CanvasNodeData）
export type TextNodeData = CanvasNodeData;
export type ImageNodeData = CanvasNodeData;
export type UploadNodeData = CanvasNodeData;
export interface OutputNodeData extends CanvasNodeData {
  items?: string[];
}
export type VideoNodeData = CanvasNodeData;
export type SeedanceNodeData = CanvasNodeData;
export type AudioNodeData = CanvasNodeData;
export type LLMNodeData = CanvasNodeData;

// API 设置
export interface ApiSettings {
  openaiKey?: string;
  openaiBase?: string;
  geminiKey?: string;
  geminiBase?: string;
  claudeKey?: string;
  claudeBase?: string;
}
