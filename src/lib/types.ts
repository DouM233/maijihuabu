export type ViewAngle = 'front' | 'top' | 'side';

export type ViewAngleLabel = Record<ViewAngle, string>;

export const VIEW_ANGLE_LABELS: ViewAngleLabel = {
  front: '主视图',
  top: '俯视图',
  side: '侧视图',
};

export interface ViewSlot {
  angle: ViewAngle;
  imageUrl: string | null;
  fileName: string | null;
}

export type BaseModelId = 'jimeng-gpt' | 'yimai-92' | 'banana-2' | 'banana-pro';

export interface BaseModel {
  id: BaseModelId;
  name: string;
}

export const BASE_MODELS: BaseModel[] = [
  { id: 'jimeng-gpt', name: '即梦GPT' },
  { id: 'yimai-92', name: '一麦92' },
  { id: 'banana-2', name: 'Banana 2' },
  { id: 'banana-pro', name: 'Banana Pro' },
];

/** 画布底栏模型选项（与生成请求 payload 对应） */
export type GenModelId = 'gpt-image-2' | 'gemini-3.1-flash-image-preview';

export interface GenModelOption {
  id: GenModelId;
  label: string;
  recommended?: boolean;
  icon: 'sparkles' | 'zap' | 'crown';
}

export const GEN_MODEL_OPTIONS: GenModelOption[] = [
  { id: 'gpt-image-2', label: 'GPT-Image2', recommended: true, icon: 'sparkles' },
  { id: 'gemini-3.1-flash-image-preview', label: 'Nano Banana2', icon: 'zap' },
];

/** 分辨率选项 */
export interface ResolutionOption {
  id: string;
  label: string;
  value: number;
}

export const RESOLUTION_OPTIONS: ResolutionOption[] = [
  { id: '512', label: '512', value: 512 },
  { id: '1k', label: '1K', value: 1024 },
  { id: '2k', label: '2K', value: 1536 },
  { id: '4k', label: '4K', value: 2048 },
];

/** 宽高比选项 */
export interface AspectRatioOption {
  id: string;
  label: string;
  ratio: number;
  orientation: 'landscape' | 'portrait' | 'square';
}

export const ASPECT_RATIO_OPTIONS: AspectRatioOption[] = [
  { id: '8:1', label: '8:1', ratio: 8, orientation: 'landscape' },
  { id: '4:1', label: '4:1', ratio: 4, orientation: 'landscape' },
  { id: '21:9', label: '21:9', ratio: 21 / 9, orientation: 'landscape' },
  { id: '16:9', label: '16:9', ratio: 16 / 9, orientation: 'landscape' },
  { id: '3:2', label: '3:2', ratio: 3 / 2, orientation: 'landscape' },
  { id: '4:3', label: '4:3', ratio: 4 / 3, orientation: 'landscape' },
  { id: '5:4', label: '5:4', ratio: 5 / 4, orientation: 'landscape' },
  { id: '1:1', label: '1:1', ratio: 1, orientation: 'square' },
  { id: '4:5', label: '4:5', ratio: 4 / 5, orientation: 'portrait' },
  { id: '3:4', label: '3:4', ratio: 3 / 4, orientation: 'portrait' },
  { id: '2:3', label: '2:3', ratio: 2 / 3, orientation: 'portrait' },
  { id: '9:16', label: '9:16', ratio: 9 / 16, orientation: 'portrait' },
  { id: '1:4', label: '1:4', ratio: 1 / 4, orientation: 'portrait' },
  { id: '1:8', label: '1:8', ratio: 1 / 8, orientation: 'portrait' },
];

export type ResolutionId = typeof RESOLUTION_OPTIONS[number]['id'];
export type AspectRatioId = typeof ASPECT_RATIO_OPTIONS[number]['id'];

/** 尺寸选项（API 映射层） */
export type GenSizeId = 'auto' | '1024x1024' | '1536x1024' | '1024x1536';

export interface GenSizeOption {
  id: GenSizeId;
  label: string;
  detail?: string;
}

export const GEN_SIZE_OPTIONS: GenSizeOption[] = [
  { id: 'auto', label: '默认尺寸', detail: '自动' },
  { id: '1024x1024', label: '正方形', detail: '1:1' },
  { id: '1536x1024', label: '横屏', detail: '3:2' },
  { id: '1024x1536', label: '竖屏', detail: '2:3' },
];

/** 画质选项 */
export type GenQualityId = 'low' | 'high';

export interface GenQualityOption {
  id: GenQualityId;
  label: string;
  desc: string;
}

export const GEN_QUALITY_OPTIONS: GenQualityOption[] = [
  { id: 'low', label: '标准', desc: '快速生成' },
  { id: 'high', label: '高清', desc: '高质量输出' },
];

export type SkillVisibility = 'public' | 'department' | 'personal';

export interface Skill {
  id: string;
  name: string;
  previewUrl: string | null;
  visibility: SkillVisibility;
  tags: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export type GenerateStatus = 'idle' | 'generating' | 'done' | 'error';
