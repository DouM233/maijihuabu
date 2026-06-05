/**
 * 节点端口语义注册表（连接类型校验核心）
 * 裁剪版：移除 RH 节点
 */
import type { Node } from '@xyflow/react';

export interface PortConfig {
  type: PortType;
  name?: string;
  label?: string;
  required?: boolean;
}

export type PortType =
  | 'text'
  | 'image'
  | 'video'
  | 'audio'
  | 'metadata'
  | 'any';

export interface NodePorts {
  inputs: PortType[];
  outputs: PortType[];
}

export const NODE_PORTS: Record<string, NodePorts> = {
  // Core
  text: { inputs: [], outputs: ['text'] },
  image: { inputs: ['text', 'image'], outputs: ['image'] },
  video: { inputs: ['text', 'image'], outputs: ['video'] },
  seedance: { inputs: ['text', 'image', 'video', 'audio'], outputs: ['video'] },
  audio: { inputs: ['text', 'audio'], outputs: ['audio'] },
  llm: { inputs: ['text', 'image'], outputs: ['text'] },

  // Special
  'multi-angle-3d': { inputs: ['text', 'image'], outputs: ['image'] },
  'panorama-720': { inputs: ['text'], outputs: ['image'] },
  'penguin-portrait': { inputs: ['text', 'image', 'metadata'], outputs: ['image'] },
  'portrait-metadata': { inputs: ['image'], outputs: ['metadata'] },
  'storyboard-grid': { inputs: ['image'], outputs: ['image'] },

  // Utility
  'drawing-board': { inputs: ['image'], outputs: ['image'] },
  browser: { inputs: [], outputs: ['text', 'image'] },
  'image-compare': { inputs: ['image'], outputs: ['image'] },
  'frame-extractor': { inputs: ['video'], outputs: ['image'] },
  'frame-pair': { inputs: ['video'], outputs: ['image'] },
  loop: { inputs: ['text', 'image', 'video', 'audio'], outputs: ['text', 'image', 'video', 'audio'] },
  'pick-from-set': { inputs: ['text', 'image', 'video', 'audio'], outputs: ['text', 'image', 'video', 'audio'] },
  resize: { inputs: ['image'], outputs: ['image'] },
  combine: { inputs: ['image'], outputs: ['image'] },
  'remove-bg': { inputs: ['image'], outputs: ['image'] },
  upscale: { inputs: ['image'], outputs: ['image'] },
  'grid-crop': { inputs: ['image'], outputs: ['image'] },

  // Auxiliary
  idea: { inputs: [], outputs: ['text'] },
  relay: { inputs: ['any'], outputs: ['any'] },

  // Toolbox
  cinematic: { inputs: [], outputs: ['text'] },
  'video-motion': { inputs: [], outputs: ['text'] },

  // Input/Output
  upload: { inputs: [], outputs: [] },
  output: { inputs: ['text', 'image', 'video', 'audio', 'any'], outputs: ['any'] },
};

export function getNodeInputs(node: Node | null | undefined): PortType[] {
  if (!node || !node.type) return [];
  const ports = NODE_PORTS[node.type];
  return ports?.inputs ?? [];
}

export function getNodeOutputs(node: Node | null | undefined): PortType[] {
  if (!node || !node.type) return [];
  if (node.type === 'upload') {
    const uploadType = (node.data as Record<string, unknown>)?.uploadType as 'image' | 'video' | 'audio' | undefined;
    const data = node.data as Record<string, unknown>;
    if (uploadType === 'image') return ['image'];
    if (uploadType === 'video') return ['video'];
    if (uploadType === 'audio') return ['audio'];
    if (data.imageUrl) return ['image'];
    if (data.videoUrl) return ['video'];
    if (data.audioUrl) return ['audio'];
    return [];
  }
  const ports = NODE_PORTS[node.type];
  return ports?.outputs ?? [];
}

export function arePortsCompatible(sourceOutputs: PortType[], targetInputs: PortType[]): boolean {
  if (sourceOutputs.length === 0 || targetInputs.length === 0) return false;
  if (sourceOutputs.includes('any') || targetInputs.includes('any')) return true;
  return sourceOutputs.some((t) => targetInputs.includes(t));
}

export function isConnectionValid(source: Node | null | undefined, target: Node | null | undefined): boolean {
  if (!source || !target) return false;
  if (source.id === target.id) return false;
  if ((source as Node).type === 'loop' && (target as Node).type === 'output') return false;
  const sOut = getNodeOutputs(source);
  const tIn = getNodeInputs(target);
  return arePortsCompatible(sOut, tIn);
}

export const PORT_COLOR: Record<PortType, string> = {
  text: '#7dd3fc',
  image: '#fcd34d',
  video: '#fda4af',
  audio: '#c4b5fd',
  metadata: '#67e8f9',
  any: '#cbd5e1',
};

export const PORT_LABEL: Record<PortType, string> = {
  text: '文本',
  image: '图像',
  video: '视频',
  audio: '音频',
  metadata: '元数据',
  any: '任意',
};
