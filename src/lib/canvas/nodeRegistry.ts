import type { NodeMeta } from './types';

/**
 * 节点元数据注册表（裁剪版）
 * 移除 RH 节点，保留 24 个核心节点
 */
export const NODE_REGISTRY: NodeMeta[] = [
  // Input/Output
  { type: 'upload', label: '上传素材', category: 'input', description: '图像 / 视频 / 音频 三合一上传', icon: 'Upload', color: 'emerald' },
  { type: 'output', label: '输出素材', category: 'input', description: '上游任意节点结果预览', icon: 'MonitorPlay', color: 'teal' },

  // Core (6)
  { type: 'text', label: '文本', category: 'core', description: '提示词文本节点', icon: 'Type', color: 'sky' },
  { type: 'image', label: '图像', category: 'core', description: 'GPT Image 2 / Nano Banana 2', icon: 'Image', color: 'amber' },
  { type: 'video', label: '视频', category: 'core', description: 'Veo 3.1 / Grok Video', icon: 'Video', color: 'rose' },
  { type: 'seedance', label: 'SD2.0', category: 'core', description: 'Seedance 2.0 视频分镜', icon: 'Film', color: 'fuchsia' },
  { type: 'audio', label: '音频', category: 'core', description: 'Suno V5.5 全模式', icon: 'Music', color: 'violet' },
  { type: 'llm', label: 'LLM', category: 'core', description: 'GPT-5.4', icon: 'Brain', color: 'emerald' },

  // Special (5)
  { type: 'multi-angle-3d', label: '多角度 3D', category: 'special', description: '3D 多视角生成', icon: 'Box', color: 'indigo' },
  { type: 'panorama-720', label: '720 全景', category: 'special', description: '720° 全景图', icon: 'Globe', color: 'indigo' },
  { type: 'penguin-portrait', label: '企鹅肖像', category: 'special', description: '肖像专用流程', icon: 'UserSquare2', color: 'indigo' },
  { type: 'portrait-metadata', label: '肖像元数据', category: 'special', description: '肖像参数管理', icon: 'FileText', color: 'indigo' },
  { type: 'storyboard-grid', label: '分镜网格', category: 'special', description: '分镜九宫格布局', icon: 'LayoutGrid', color: 'indigo' },

  // Utility (12)
  { type: 'drawing-board', label: '画板', category: 'utility', description: '手绘 / 涂抹', icon: 'Pencil', color: 'orange' },
  { type: 'browser', label: '浏览器', category: 'utility', description: '网页内嵌', icon: 'Globe2', color: 'orange' },
  { type: 'image-compare', label: '图像对比', category: 'utility', description: '双图滑杆对比', icon: 'GitCompare', color: 'orange' },
  { type: 'frame-extractor', label: '抽帧', category: 'utility', description: '视频抽帧', icon: 'Scissors', color: 'orange' },
  { type: 'frame-pair', label: '首尾帧获取', category: 'utility', description: '从视频抽取首帧与尾帧', icon: 'Film', color: 'orange' },
  { type: 'loop', label: '循环器', category: 'utility', description: '串联/并联驱动下游', icon: 'Repeat', color: 'orange' },
  { type: 'pick-from-set', label: '从合集获取', category: 'utility', description: '从多素材中取单个', icon: 'Filter', color: 'orange' },
  { type: 'resize', label: '尺寸调整', category: 'utility', description: '图像尺寸调整', icon: 'Maximize2', color: 'orange' },
  { type: 'combine', label: '合并', category: 'utility', description: '图像合并', icon: 'Combine', color: 'orange' },
  { type: 'remove-bg', label: '抠图', category: 'utility', description: '去除背景', icon: 'Eraser', color: 'orange' },
  { type: 'upscale', label: '放大', category: 'utility', description: '图像放大', icon: 'ZoomIn', color: 'orange' },
  { type: 'grid-crop', label: '宫格剪裁', category: 'utility', description: '网格切图', icon: 'Grid3x3', color: 'orange' },

  // Auxiliary (2)
  { type: 'idea', label: '灵感', category: 'auxiliary', description: '灵感记录', icon: 'Lightbulb', color: 'slate' },
  { type: 'relay', label: '中继', category: 'auxiliary', description: '数据中转', icon: 'ArrowRightLeft', color: 'slate' },

  // Toolbox (2)
  { type: 'cinematic', label: '电影感', category: 'toolbox', description: '15 类电影风格组合输出 prompt', icon: 'Clapperboard', color: 'pink' },
  { type: 'video-motion', label: '视频运镜', category: 'toolbox', description: '视频运镜组合器', icon: 'Camera', color: 'pink' },
];

export const NODE_GROUPS: Record<string, { label: string; nodes: NodeMeta[] }> = {
  input: { label: '素材资源', nodes: NODE_REGISTRY.filter((n) => n.category === 'input') },
  core: { label: '核心节点', nodes: NODE_REGISTRY.filter((n) => n.category === 'core') },
  special: { label: '特殊节点', nodes: NODE_REGISTRY.filter((n) => n.category === 'special') },
  utility: { label: '工具节点', nodes: NODE_REGISTRY.filter((n) => n.category === 'utility') },
  auxiliary: { label: '辅助节点', nodes: NODE_REGISTRY.filter((n) => n.category === 'auxiliary') },
  toolbox: { label: '工具箱', nodes: NODE_REGISTRY.filter((n) => n.category === 'toolbox') },
};

export function getNodeMeta(type: string): NodeMeta | undefined {
  return NODE_REGISTRY.find((n) => n.type === type);
}
