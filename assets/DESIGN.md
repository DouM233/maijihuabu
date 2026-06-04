# DESIGN.md — 麦吉AI 设计风格与布局规范

## 1. 整体定位

- **产品名**：麦吉AI — 商业视觉资产闭环生产系统
- **风格关键词**：深色工业控制台风格，精密工具感，暗调荧光点缀，数据驱动的视觉基因语言
- **默认主题**：暗色模式（`defaultTheme="dark"`），支持亮色/暗色切换（`next-themes`）

---

## 2. 色彩体系

### 2.1 CSS 变量（`/src/app/globals.css`）

**暗色模式（`.dark`，默认）**

| Token | Hex | 用途 |
|-------|-----|------|
| `--background` | `#0a0a0a` | 主背景 |
| `--foreground` | `#e8e8e8` | 主文字 |
| `--card` | `#111111` | 卡片背景 |
| `--popover` | `#141414` | 弹窗/浮层 |
| `--muted` | `#141414` |  muted 区域 |
| `--muted-foreground` | `#666666` | 辅助文字/标签 |
| `--border` | `#2a2a2a` | 边框/分割线 |
| `--secondary` | `#1a1a1a` | 次级背景（输入框、hover 底色） |
| `--primary` | `#f5a623` | 琥珀主色：按钮、高亮、进度条、基因浓度 |
| `--accent` | `#00d4aa` | 青绿强调：成功状态、核心基因标签、系统正常指示灯 |
| `--destructive` | `#ff4d4f` | 红色警示：错误、风险警告、删除 |
| `--sidebar` | `#0a0a0a` | 侧边栏背景 |

**亮色模式（`:root`）**

| Token | Hex | 用途 |
|-------|-----|------|
| `--background` | `#fafafa` | 主背景 |
| `--foreground` | `#171717` | 主文字 |
| `--card` | `#ffffff` | 卡片背景 |
| `--muted` | `#f5f5f5` | muted 区域 |
| `--muted-foreground` | `#737373` | 辅助文字 |
| `--border` | `#e5e5e5` | 边框 |
| `--secondary` | `#f5f5f5` | 次级背景 |
| `--sidebar` | `#fafafa` | 侧边栏背景 |
| `--primary` | `#f5a623` | 琥珀主色（保持不变） |
| `--accent` | `#00d4aa` | 青绿强调（保持不变） |
| `--destructive` | `#ff4d4f` | 红色警示（保持不变） |

### 2.2 语义化色板（页内硬编码颜色）

以下颜色在代码中直接硬编码使用，用于状态区分和情感表达，非 CSS 变量：

- **琥珀 / 金**：`#f5a623`（品牌主色，用于主按钮、进度条、基因浓度数值、维度编号）
- **青绿**：`#00d4aa`（成功/核心基因，用于 `text-emerald-400`、`bg-emerald-500/10` 等）
- **琥珀浅**：`#fbbf24`（进度条渐变中端色）
- **红色**：`#ff4d4f`（危险/错误/盲区，`text-red-400`、`bg-red-500/10`）
- **天蓝**：`#3b82f6`（数据图表辅助色）
- **紫色**：`#a855f7`（数据图表辅助色）
- **青色**：`#06b6d4`（高潜变异维度，`text-cyan-400`、`bg-cyan-500/10`）

---

## 3. 字体排版

### 3.1 字体栈（`--font-sans`）

```css
'Noto Sans SC', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei',
ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif
```

- 中文优先，无衬线，追求清晰可读的工具体验。
- 数据/分数/百分比：`font-mono`（`JetBrains Mono` 为首）。

### 3.2 字号层级

| 层级 | 用途 | Tailwind 类 | 实际尺寸 |
|------|------|-------------|---------|
| 页面主标题 | 模块名称 | `text-3xl font-bold` | 30px |
| 模块标题 | Section 标题 | `text-xl font-bold` | 20px |
| 卡片标题 | 面板/卡片名称 | `text-sm font-semibold` | 14px |
| 正文 | 描述、分析结果 | `text-sm` / `text-[15px]` | 14-15px |
| 标签 | badge、标签、元信息 | `text-[10px]` / `text-[11px]` | 10-11px |
| 极小 | 辅助说明、版本号 | `text-[9px]` | 9px |

---

## 4. 页面骨架布局

### 4.1 全局布局：`AppShell`（`/src/components/app-shell.tsx`）

```
┌─────────────────────────────────────────────────────────────┐
│  Sidebar (w-64)  │  Main Content (flex-1, overflow-y-auto)  │
│                  │                                           │
│  · Logo          │                                           │
│  · Navigation    │                                           │
│  · User Info     │                                           │
│  · Theme Toggle  │                                           │
│  · Logout        │                                           │
└──────────────────┴───────────────────────────────────────────┘
```

- **侧边栏**：固定宽度 `w-64`（256px），`border-r border-border`，`bg-sidebar`。
- **主内容区**：`flex-1`，`overflow-y-auto`，使用 `.grid-pattern` 背景（40px 网格线，`rgba(255,255,255,0.03)`）。
- **滚动条**：自定义 6px 宽度，`#333` 滑块，`border-radius: 3px`。

### 4.2 导航菜单样式

- 每个导航项：图标 + 主标题（`text-sm font-medium`）+ 副标题（`text-[10px] opacity-60`）。
- **激活态**：`bg-primary/10 text-primary border border-primary/20`，右上角有 `pulse-dot`（琥珀色呼吸点）。
- **非激活态**：`text-muted-foreground hover:bg-secondary hover:text-foreground`。
- **过渡**：`transition-all duration-200`。

---

## 5. 组件规范

### 5.1 Card（卡片）

- 基础样式：`bg-card border-border rounded-lg`（默认 `border-radius: 0.5rem`）。
- 带左侧色条的卡片（如生图引擎参数面板）：`border-l-4 border-l-primary`。
- 透明/毛玻璃卡片（上传区）：`bg-card/40 backdrop-blur-sm border-dashed border-border/60`。
- 渐变卡片（战略摘要）：`bg-gradient-to-br from-amber-500/5 to-transparent border-amber-500/20`。
- 状态色卡片：
  - 核心基因：`border-emerald-500/20 bg-emerald-500/5`
  - 辅助基因：`border-amber-500/20 bg-amber-500/5`
  - 高潜变异：`border-cyan-500/20 bg-cyan-500/5`
  - 战略盲区：`border-red-500/15 bg-red-500/5`

### 5.2 Button（按钮）

- **主按钮**：`bg-primary text-primary-foreground hover:bg-primary/90`，`h-12`，粗体，`tracking-wide`。
- **次要按钮**：`variant="outline"`，`border-border hover:bg-secondary`。
- **幽灵按钮**：`variant="ghost"`，用于工具栏小图标。
- **危险操作**：`hover:text-red-400 hover:border-red-400/40`。

### 5.3 Badge / Tag（标签）

- 状态标签（如必填）：`bg-destructive/10 text-destructive rounded px-1.5 py-0.5 text-[10px]`
- 品类标签：`bg-muted text-foreground/80 rounded-md px-2.5 py-1 text-xs`
- 关键元素标签：`bg-amber-500/10 text-amber-500/90 border border-amber-500/20`
- 优势标签：`bg-emerald-500/10 text-emerald-500 rounded-full text-[10px]`
- 转化阻碍标签：`bg-red-500/10 text-red-500 rounded-full text-[10px]`

### 5.4 Icon Box（图标容器）

- 通用模式：`h-9 w-9 rounded-md border` + `bg-accent/10` + `border-accent/20`（accent 为对应语义色）
- 大图标框：`w-10 h-10 rounded-lg`
- 超大图标框：`w-16 h-16 rounded-2xl`（上传区）

### 5.5 Input / Textarea

- 输入框：`bg-secondary border-border text-sm h-9`
- 文本域：`bg-secondary border-border text-sm min-h-[100px] resize-none`

---

## 6. 各页面布局详情

### 6.1 总控台（`/` — Dashboard）

- **Header**：居中标题 + 两侧渐变线 `h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent`
- **Stats Grid**：`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`，4 个 StatCard
- **Pipeline**：`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`，4 个阶段卡片（带编号圆圈 + 状态点）
- **Recent Activity + Charts**：`grid-cols-1 lg:grid-cols-2`

### 6.2 情报解构（`/intelligence`）

- **Header**：IconBox（琥珀）+ `text-3xl` 标题 + 英文副标题 + 渐变分割线
- **Upload Zone**：全宽虚线边框卡片，`border-dashed`，中央大图标框 + 说明文字 + 脉冲计数器
- **Thumbnail Grid**：`grid-cols-5 sm:cols-8 md:cols-10 lg:cols-12 xl:cols-14 2xl:cols-16`，极小间距 `gap-2`
- **Progress Card**（分析中）：
  - 渐变背景：`bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent`
  - 顶部 shimmer 线：`bg-gradient-to-r from-transparent via-amber-500 to-transparent`
  - 进度条：线性渐变流动动画（`gradient-flow`）+ 琥珀光晕
  - 4 步状态指示器：`grid-cols-4`，每步含圆形编号 + 标签
- **Results**（分析完成）：
  - **战略摘要**：全宽渐变卡片
  - **视觉基因测序**：`grid lg:grid-cols-3 xl:cols-4 2xl:cols-5`，三列基因卡片（核心/辅助/高潜）
  - **动态维度矩阵**：每个维度一个 Card，内部 `grid lg:grid-cols-12` 分信息区（7）和 Prompt 区（5）
    - 信息区：`grid-cols-3` 横排三模块（适用品类 / 心理引擎 / 关键视觉元素）
    - Prompt 区：深色代码块（`bg-black/40`）+ 复制/应用按钮 + 2×2 场景建议卡片网格
  - **Prompt 进化建议**：纵向列表，每项含动作标签 + 目标 + 置信度
  - **盲区 & 采集计划**：`grid md:cols-2 lg:cols-3`

### 6.3 生图引擎（`/production`）

- **整体**：`grid grid-cols-1 lg:grid-cols-12`，左侧输入（`lg:col-span-4 xl:col-span-3`）+ 右侧结果（`lg:col-span-8 xl:col-span-9`）
- **左面板堆叠卡片**（从上到下）：
  1. 生图提示词（`border-l-primary`）
  2. 排版文案（`border-l-chart-2` / 青绿，含必填 badge）
  3. 产品参考图（`grid-cols-3` 缩略图 + 虚线添加按钮）
  4. 图片比例（`grid-cols-3`，图标化比例选择器）
  5. 图片质量 + 生成数量（`grid-cols-2` 并排）
  6. 错误提示条（`bg-destructive/10 border-destructive/30`）
  7. 立即生图主按钮
- **右面板**：
  - 空态：居中大图标 + 说明
  - 有结果：`grid-cols-1 sm:cols-2 xl:cols-3 2xl:cols-4`，图片卡片 + 序号角标 + hover 复制/下载按钮
  - 渲染中：`border-dashed border-primary/30 bg-secondary/30`，SVG 环形进度 + 百分比文字

### 6.4 筛选评估（`/evaluation`）

- **Header**：标题 + 右侧上传/批量评估按钮组
- **整体**：`grid-cols-1 lg:grid-cols-12`，左侧列表（`lg:col-span-3`）+ 右侧详情（`lg:col-span-9`）
- **左侧面板**：图片列表，`max-h-[calc(100vh-280px)] overflow-y-auto`
  - 每项：`flex gap-2.5`，缩略图（56×56）+ 状态点 + 标题 + 评分/等级 Badge + hover 删除
- **右侧面板**：`grid-cols-1 xl:grid-cols-2`
  - 左侧：大图 + 状态标签 + 评估/删除按钮
  - 右侧：综合评定卡片（Score + GradeBadge + 优劣势标签）+ 技术质量卡片（ScoreBar 网格）

### 6.5 数据进化（`/evolution`）

- **Tabs**：底部边框 tab，`border-b-2`，激活态 `border-primary text-primary`
- **反馈 Tab**：`grid-cols-1 lg:cols-2 xl:cols-3`，左侧表单 + 中间记录卡片
- **经验库 Tab**：`grid-cols-1 sm:cols-2 lg:cols-3 xl:cols-4`，卡片展示各品类库

### 6.6 登录页（`/login`）

- 全屏居中：`flex min-h-screen items-center justify-center bg-background px-4`
- 最大宽度：`max-w-sm`
- 顶部：Logo 视频框（64×64）+ 产品名 + 副标题
- 主体：圆角卡片 `rounded-xl border bg-card p-6 shadow-sm`
- 内部：Tabs（登录/注册）+ 表单字段

---

## 7. 动效与交互

### 7.1 入场动画（Framer Motion）

- **Header**：`initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}`
- **内容卡片**：`initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}`，延迟 `0.1s` 递增
- **结果列表**：`initial={{ opacity: 0 }} animate={{ opacity: 1 }}`
- **维度项**：`initial={{ opacity: 0, x: -20 }}`，延迟 `i * 0.1`
- **进化建议**：`initial={{ opacity: 0, x: 20 }}`，延迟 `i * 0.08`

### 7.2 自定义 CSS 动画（`/src/app/globals.css`）

| 动画名 | 效果 | 用途 |
|--------|------|------|
| `pulse-dot` | 缩放 + 透明度呼吸 | 导航激活态指示器 |
| `shimmer` | 背景位移动画 | 进度条顶部流动线、骨架屏 |
| `gradient-flow` | 渐变背景水平流动 | 进度条填充 |
| `score-fill` | SVG stroke-dashoffset 递减 | 评分圆环动画 |
| `animate-pulse` | 透明度脉冲 | 状态指示灯、数据流点 |
| `animate-spin` | 旋转 | Loader 图标 |
| `animate-bounce` | 弹跳 | 当前步骤编号 |

### 7.3 Hover 效果

- 导航项：`hover:bg-secondary hover:text-foreground transition-all duration-200`
- 图片缩略图：`group-hover:opacity-100` 覆盖删除按钮
- 比例选择器：`hover:border-primary/30 transition-all`
- 卡片：`hover:border-primary/30`（部分卡片）

### 7.4 过渡

- 主题切换：`disableTransitionOnChange={false}`（启用 CSS 过渡）
- 按钮/边框：统一 `transition-all duration-200`

---

## 8. 特殊视觉效果

### 8.1 网格背景（`.grid-pattern`）

```css
background-image:
  linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
  linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
background-size: 40px 40px;
```

### 8.2 光晕效果

- `.glow-amber`：`box-shadow: 0 0 20px rgba(245, 166, 35, 0.15)`
- `.glow-teal`：`box-shadow: 0 0 20px rgba(0, 212, 170, 0.15)`

### 8.3 毛玻璃（`.glass`）

```css
background: rgba(17, 17, 17, 0.8);
backdrop-filter: blur(12px);
border: 1px solid rgba(255, 255, 255, 0.06);
```

### 8.4 渐变分割线

- Header 下：`bg-gradient-to-r from-amber-500/40 via-border to-transparent`
- Dashboard 标题两侧：`bg-gradient-to-r from-transparent via-border to-transparent`

### 8.5 进度条特效

```css
background: linear-gradient(90deg, #f59e0b, #fbbf24, #f59e0b);
background-size: 200% 100%;
animation: gradient-flow 1.5s linear infinite;
box-shadow: 0 0 20px rgba(245, 158, 11, 0.5), 0 0 40px rgba(245, 158, 11, 0.2);
```

---

## 9. 主题切换

- **库**：`next-themes`，`attribute="class"`
- **切换组件**：`/src/components/theme-toggle.tsx`
- **暗色图标**：`Sun`（琥珀色 `text-amber-400`）
- **亮色图标**：`Moon`（灰色 `text-slate-600`）
- **Provider**：`/src/components/theme-provider.tsx`

---

## 10. 设计禁忌（DO NOT）

1. **不要**使用蓝紫色 AI 味渐变色（如 `from-blue-600 to-purple-600`）。
2. **不要**使用圆角过大（`rounded-2xl` 以上仅用于特殊装饰元素）。
3. **不要**在亮色模式下改变 `--primary` 和 `--accent` 的色相，仅调整背景/文字对比度。
4. **不要**使用纯白色（`#ffffff`）作为暗色模式的主文字，应使用 `#e8e8e8`。
5. **不要**在代码块/展示区域使用高饱和背景，保持 `bg-black/40` 或 `bg-secondary`。
6. **不要**在主按钮外使用黑色文字（仅主按钮因琥珀底色使用 `text-black`）。

---

## 11. 关键技术约束

- **Framework**：Next.js 16 App Router + React 19 + TypeScript 5 + Tailwind CSS 4
- **UI 库**：shadcn/ui（基于 Radix UI）
- **动画**：Framer Motion（页面入场）+ 自定义 CSS Keyframes（持续动画）
- **主题**：`next-themes` + CSS 变量双模式
- **图标**：Lucide React
- **圆角基准**：`--radius: 0.5rem`，卡片/按钮统一基于此
