// 电商 Prompt 模板结构化数据

export interface PromptTemplate {
  id: string;
  category: string;         // 一级类目
  subCategory: string;      // 二级子类
  visualStyle: string;      // 视觉流派
  styleName: string;        // 风格名称（卡片展示用）
  prompt: string;           // 核心长文本 Prompt
  coverUrl: string | null;  // 预留封面图 URL
  negativePrompt: string;   // 负面词
  tags: string[];           // 标签
}

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'tpl-universal-warm',
    category: '通用模板',
    subCategory: '暖调生活方式',
    visualStyle: '暗暖琥珀',
    styleName: '暖调生活方式通用模板',
    coverUrl: null,
    tags: ['生活方式', '暖调', '通用'],
    negativePrompt: '白天感、过曝、冷蓝光、产品太小、产品太扁、产品被遮挡太多、杂乱环境、动漫感、3D渲染感',
    prompt: `全局氛围锁定：
这张图必须像在[时间，例如傍晚7点/日落前后]拍摄的高端生活方式大片。整体为低照度、暖琥珀、私密放松氛围，阴影浓郁而有层次，绝对不能像白天、不能明亮通透、不能有冷色调。

画面定位：
高端电商生活方式主视觉，[产品名] 放在[场景]中，用于淘宝/JD详情页或主图延展。

人物设定：
[人种/性别]，[年龄]，[肤色/发型/表情描述]。
服装：[服装描述]，面料必须有明显质感。
动作：[人物动作描述]。

产品设定：
[产品名]，[颜色/材质/形状描述]。
产品位置：[放在哪里、露出多少]。
硬性要求：[产品展示要求]。

环境设定：
[场景环境描述]。

灯光设定：
[灯光方向和色温描述]，人物和产品受光面温暖，背光面进入深棕色暖阴影。

构图设定：
竖版[3:4/4:5]，眼平视角或轻微俯视，中广景生活方式构图，保留文案空间。

质量锁定：
8K RAW 写实商业摄影质感，真实皮肤通透感，织物纹理清楚，无AI塑料感。`,
  },
];

// 类目树结构 —— 用于树状导航
export interface CategoryNode {
  label: string;
  children?: CategoryNode[];
  templateIds?: string[];  // 叶子节点关联的模板 ID
  icon?: string;           // 分组图标标识
}

export const CATEGORY_TREE: CategoryNode[] = [
  {
    label: '个护电器',
    icon: 'sparkles',
    children: [
      { label: '剃须刀鼻毛修剪器' },
      { label: '脱毛仪' },
      { label: '电动牙刷' },
      { label: '吹风机' },
      { label: '卷发直发棒' },
      { label: '黑头仪小气泡' },
      { label: '美容仪注氧仪' },
      { label: '毛球修剪器' },
      { label: '磨脚器' },
      { label: '瘦脸仪' },
      { label: '家鑫脱毛器' },
    ],
  },
  {
    label: '健康按摩',
    icon: 'heart',
    children: [
      { label: '足浴桶' },
      { label: '按摩披肩' },
      { label: '按摩坐垫靠垫床垫' },
      { label: '筋膜枪' },
      { label: '护颈仪' },
      { label: '护眼润眼仪' },
      { label: '经络刷刮痧仪' },
      { label: '美腿器' },
    ],
  },
  {
    label: '运动健身',
    icon: 'dumbbell',
    children: [
      { label: '减肥产品（筋膜环/揉腹仪/甩脂机）' },
      { label: '羽毛球拍' },
      { label: '跳绳' },
    ],
  },
  {
    label: '居家生活',
    icon: 'home',
    children: [
      { label: '封口机' },
      { label: '居家小电器（烘干机）' },
    ],
  },
  {
    label: '厨房家电',
    icon: 'utensils',
    children: [
      { label: '厨房小电器' },
    ],
  },
  {
    label: '医疗保健',
    icon: 'stethoscope',
    children: [
      { label: '冲牙洗牙器' },
      { label: '医疗器械' },
      { label: '保健品' },
    ],
  },
];
