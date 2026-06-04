# DESIGN.md

## 项目与用户画像
- 面向电商部门的 AI 生图测试前端
- 核心用户：电商运营、产品经理等非专业设计人员

## 品牌与视觉方向
- 品牌名：麦吉AI
- 品牌标语：商业视觉资产闭环生产系统
- 品牌图标：BrainCircuit（Lucide）
- 主色调：柔和紫 `#8B6FF6`（科技感与温和并存）
- 强调色：柔和浅绿 `#DDEBC2`（鼠尾草绿/奶油绿）
- 辅助色：深暖灰文字 `#24221F`、暖灰边框 `#E6DCCB`
- 整体风格：暖米色奶油色低饱和暖灰、柔和护眼、精致工具感
- 默认主题：亮色模式（支持亮/暗切换，next-themes）

## Design Tokens

### 色彩
- 主色 (Primary)：柔和紫 `#8B6FF6`
- 主色浅底：`primary/10`
- 主色悬停：`primary/80`
- 强调色 (Accent)：柔和浅绿 `#DDEBC2`
- 强调色浅底：`accent/30`
- 背景 (Background)：亮色 `#F8F4EC`（暖米白），暗色 `#1C1917`（深暖棕灰）
- 卡片/次背景 (Card)：亮色 `#FFFDF8`（奶油色），暗色 `#292524`
- 次级背景 (Secondary)：亮色 `#F2EADF`，暗色 `#3E3A36`
- 边框 (Border)：亮色 `#E6DCCB`，暗色 `#44403C`
- 文字主色 (Foreground)：亮色 `#24221F`（深暖灰），暗色 `#FAF7F0`
- 文字次要 (Muted Foreground)：亮色 `#7A746B`，暗色 `#A8A29E`
- 文字弱化：亮色 `#A59B8B`，暗色 `#78716C`
- 危险色 (Destructive)：红 `#ff4d4f`

### 字体
- 字体族：系统无衬线字体（PingFang SC / Microsoft YaHei / sans-serif）
- 页面标题：text-2xl font-bold
- 模块标题：text-sm font-semibold uppercase tracking-wider
- 正文：text-sm / text-xs

### 圆角
- 卡片：12px (rounded-xl)
- 按钮：8px (rounded-lg)
- 标签：20px (rounded-full pill)
- 输入框：8px (rounded-lg)
- 全局半径：0.5rem

### 动画
- pulse-dot：导航呼吸点（opacity 脉冲）
- shimmer：进度条流动光效（柔和紫）
- gradient-flow：进度条渐变流动（柔和紫）
- 页面入场：Framer Motion（Header y:-20→0，卡片 y:20→0 延迟递增）
- 交互过渡：transition-all duration-200

## 布局与响应式
- 亮色主题为默认（light mode default）
- 支持亮色/暗色切换（next-themes，attribute="class"）
- 单页五栏布局：左侧边栏 + Skill矩阵/生图画布 + 右侧对话 + 底栏
- 三个核心标签页：智能生图创意舱 / 视觉 Skill 矩阵库 / 团队创意资产墙
- Skill 矩阵库：左侧树状类目导航 + 右侧九宫格大图卡片墙
- 选择模板后自动跳转回创意舱

## 组件风格备注
- 模板卡片使用暖色系浅色渐变占位封面，hover 时显示"选择此风格"浮层
- 树状类目节点支持展开/折叠，选中高亮 primary（柔和紫）
- 对话框助手消息支持复制按钮（hover 显现）
- 拖拽分隔杆：hover 时 primary 色高亮
- 全局网格背景：暗色下 `grid-pattern`，亮色下 `grid-pattern-light`
