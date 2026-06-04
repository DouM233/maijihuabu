# AGENTS.md - 麦吉AI 项目交接文档

## 1. 项目概述

**麦吉AI** 是一个面向电商部门的 AI 商业视觉资产闭环生产系统。核心功能是节点式 AI 生图画布，允许非专业设计人员通过拖拽节点、连接工作流来批量生成商业图片。

### 核心页面
- **生图创意舱** (`creative`)：节点式画布，支持 24 种节点拖拽组合工作流
- **Skills 矩阵库** (`skills`)：28 个电商产品类目的 Prompt 模板库
- **历史记录** (`history`)：用户历史生成记录浏览
- **画廊** (`gallery`)：团队创意资产墙

## 2. 技术栈

| 层级 | 技术 |
|------|------|
| Framework | Next.js 16 (App Router) |
| Core | React 19 |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS 4 |
| UI 组件 | shadcn/ui (基于 Radix UI) |
| 状态管理 | Zustand |
| 画布引擎 | @xyflow/react 12.10.0 (React Flow) |
| 主题 | next-themes (attribute="class") |
| 包管理 | pnpm（**严禁 npm/yarn**） |

## 3. 目录结构

```
src/
├── app/
│   ├── layout.tsx              # 根布局（引入 @xyflow/react CSS + 主题 Provider）
│   ├── page.tsx                # 主页：左侧边栏 + 条件渲染四个标签页
│   ├── globals.css             # 暖米色 Design Tokens + @xyflow/react 样式覆盖
│   ├── robots.ts               # robots 配置
│   └── api/
│       ├── chat/route.ts       # AI 对话流式代理（SSE，对接 yunwu.ai）
│       ├── generate/route.ts   # 生图 API 代理（3 模型支持）
│       ├── generate/edit/      # 图生图/编辑接口
│       └── canvas/             # ⚠️ 画布持久化 API（目录存在但为空，待实现）
│
├── components/
│   ├── ui/                     # shadcn/ui 组件库（~45 个组件）
│   ├── theme-provider.tsx      # next-themes Provider
│   ├── theme-toggle.tsx        # 亮/暗主题切换按钮
│   └── workspace/              # 旧版工作区组件（大部分已弃用）
│       ├── sidebar-nav.tsx     # ✅ 左侧窄边栏导航（56px，4 个 Tab）
│       ├── skill-matrix.tsx    # ✅ Skills 页面（树状类目 + 卡片轮播）
│       ├── asset-wall.tsx      # ✅ 资产墙页面
│       └── ...（其他旧组件）   # ⚠️ 已弃用：chat-panel, gen-canvas, canvas-panel 等
│   └── canvas/                 # 🆕 节点画布系统（核心）
│       ├── Canvas.tsx          # 画布主组件（ReactFlow + 批量执行引擎）
│       ├── CanvasSidebar.tsx   # 左侧节点面板（24 节点平铺 + 搜索）
│       ├── CanvasToolbar.tsx   # 顶部工具栏（运行/清空/撤销/终端）
│       ├── NodeActionBar.tsx   # 节点悬浮操作栏（删除/复制）
│       ├── TerminalPanel.tsx   # 底部终端日志面板
│       ├── edges/
│       │   └── DeletableEdge.tsx
│       └── nodes/              # 24 个节点组件
│           ├── NodeShell.tsx         # 统一节点外壳（标题栏 + 端口 + 内容区）
│           ├── ResizableTextNode.tsx # 可拖拽缩放的文本节点
│           ├── ImageNode.tsx         # 图像生成节点（3 模型选择）
│           ├── LLMNode.tsx           # 大语言模型节点
│           ├── UploadNode.tsx        # 上传素材节点
│           ├── OutputNode.tsx        # 输出预览节点
│           └── ...（19 个其他节点）  # 见下方节点清单
│
├── lib/
│   ├── utils.ts                # cn() 工具 + 通用函数
│   ├── types.ts                # 全局类型定义（ViewSlot, GenModelId, 等）
│   ├── store.ts                # Zustand 全局状态（Skill 绑定、生成参数、三视图等）
│   ├── skillsData.ts           # ⚠️ 写死的 Skill 数据（CATEGORY_TREE + PROMPT_TEMPLATES）
│   └── canvas/                 # 画布引擎核心库
│       ├── types.ts            # 画布类型定义（NodeType, NodeData, CanvasData）
│       ├── portTypes.ts        # 端口类型定义 + 连接校验规则
│       ├── nodeRegistry.ts     # 24 节点注册表（元数据 + 分组）
│       ├── topologicalSort.ts  # Kahn 拓扑排序（批量执行引擎）
│       └── store.ts            # 画布列表 Zustand Store（CRUD → /api/canvas）
│
├── hooks/
│   └── use-mobile.ts           # 移动端检测 Hook
│
└── server.ts                   # 自定义服务端入口（如需要）
```

## 4. 核心功能详解

### 4.1 节点式画布 (Canvas)

基于 `@xyflow/react` 的节点工作流画布，是项目的核心交互区域。

**节点列表（24 个）**：

| 分类 | 节点 | 说明 |
|------|------|------|
| **Input/Output** | upload | 上传素材（图像/视频/音频） |
| | output | 上游结果预览 |
| **Core (6)** | text | 提示词文本节点（支持拖拽 resize） |
| | image | 图像生成（GPT-Image2 / Nano Banana2 / Nano Banana Pro） |
| | video | 视频生成（Veo 3.1 / Grok Video） |
| | seedance | Seedance 2.0 视频分镜 |
| | audio | Suno V5.5 音频生成 |
| | llm | 大语言模型（GPT-5 / Claude 4.5 / Gemini 2.5） |
| **Special (5)** | multi-angle-3d | 3D 多视角生成 |
| | panorama-720 | 720° 全景图 |
| | penguin-portrait | 企鹅肖像专用流程 |
| | portrait-metadata | 肖像参数管理 |
| | storyboard-grid | 分镜九宫格布局 |
| **Utility (12)** | drawing-board | 手绘/涂抹画板 |
| | browser | 网页内嵌 |
| | image-compare | 双图滑杆对比 |
| | frame-extractor | 视频抽帧 |
| | frame-pair | 首尾帧获取 |
| | loop | 循环器（串联/并联驱动下游） |
| | pick-from-set | 从合集获取单个素材 |
| | resize | 图像尺寸调整 |
| | combine | 图像合并 |
| | remove-bg | 抠图 |
| | upscale | 图像放大 |
| | grid-crop | 宫格剪裁 |
| **Auxiliary (2)** | idea | 灵感记录 |
| | relay | 数据中转 |
| **Toolbox (2)** | cinematic | 15 类电影风格组合输出 prompt |
| | video-motion | 视频运镜组合器 |

**交互方式**：
1. **拖拽添加**：从 CanvasSidebar 拖拽节点到画布
2. **双击添加**：双击 Sidebar 中的节点，在画布中心创建
3. **连线**：拖拽端口连接节点（紫色=输入，青色=输出）
4. **批量执行**：点击顶部「运行」按钮，按拓扑排序顺序执行节点
5. **文件拖拽**：直接拖拽文件到画布自动创建 Upload 节点

**节点 UI 设计**：
- 使用 `NodeShell` 统一外壳：标题栏（图标+名称+标签）+ 内容区 + 左右端口
- 选中态：柔和紫边框 + 发光阴影 `shadow-[0_0_0_2px_rgba(139,111,246,0.15)]`
- 文本节点使用 `ResizableTextNode`，支持右下角拖拽缩放

### 4.2 Skills 矩阵库

- **数据来源**：`src/lib/skillsData.ts`（**完全写死**）
- **类目树**：28 个电商产品类目，分 6 大分组
- **模板数据**：1 套暖调生活方式 Prompt 模板
- **交互**：选择模板后自动跳转「生图创意舱」，在画布上创建一个 Text 节点并填入 Prompt

### 4.3 生图 API

- **路由**：`POST /api/generate`
- **支持模型**：
  - `gpt-image-2`（GPT Image 2，默认）
  - `gemini-3.1-flash-image-preview`（Nano Banana2）
  - `gemini-3-pro-image-preview`（Nano Banana Pro）
- **上游地址**：从 `CHAT_API_URL` 派生，将 `/chat/completions` 替换为 `/images/generations`
- **返回格式**：`b64_json`

### 4.4 聊天 API（当前未在 UI 中使用）

- **路由**：`POST /api/chat`
- **协议**：SSE 流式输出
- **上游**：`https://yunwu.ai/v1/chat/completions`
- **默认模型**：`gpt-5.4-mini`

## 5. 关键设计规范

### 5.1 暖米色 Design Tokens

| Token | 亮色值 | 暗色值 |
|-------|--------|--------|
| Primary | `#8B6FF6`（柔和紫） | - |
| Accent | `#DDEBC2`（鼠尾草绿） | - |
| Background | `#F8F4EC`（暖米白） | `#1C1917` |
| Card | `#FFFDF8`（奶油色） | `#292524` |
| Border | `#E6DCCB`（暖灰边框） | `#44403C` |
| Foreground | `#24221F`（深暖灰） | `#FAF7F0` |

### 5.2 React Flow 主题覆盖

在 `globals.css` 中覆盖了 `@xyflow/react` 默认样式：
- 画布背景：`#F8F4EC`
- 节点默认背景：奶油色
- 选中边框：柔和紫
- 输入端口：紫色
- 输出端口：青色

### 5.3 节点组件编写规范

由于 React Flow 12 的 `NodeProps` 中 `data` 类型为 `unknown`，所有节点组件必须：

```typescript
// 1. 使用类型断言读取 data
const nodeData = data as ImageNodeData;

// 2. 用 useReactFlow().updateNodeData 更新
const { updateNodeData } = useReactFlow();
updateNodeData(id, { ...nodeData, prompt: 'new' } as Record<string, unknown>);

// 3. 严禁直接修改 props.data（会导致 ESLint react-hooks/immutability 报错）
```

### 5.4 端口连接规则

定义在 `src/lib/canvas/portTypes.ts`：
- 文本输出 → 图像/视频/音频/LLM 的 prompt 输入
- 图像输出 → 图像对比/抽帧/放大/抠图/合并等工具节点
- 视频输出 → 抽帧/首尾帧节点
- 同类型端口才能相连

## 6. 环境变量

| 变量名 | 必填 | 说明 |
|--------|------|------|
| `CHAT_API_URL` | 是 | AI 接口基础地址，如 `https://yunwu.ai/v1/chat/completions` |
| `CHAT_API_KEY` | 是 | API Key，用于 `/api/chat` 和 `/api/generate` |

## 7. 已知问题与待办事项

### 🔴 高优先级（功能缺失）

1. **画布数据持久化后端**
   - `src/app/api/canvas/` 目录下只有空文件夹，没有实际 API 路由
   - CanvasStore (`src/lib/canvas/store.ts`) 期望调用 `/api/canvas`、`/api/canvas/${id}`、`/api/canvas/${id}/name`、`/api/canvas/${id}/auto-save`
   - **当前行为**：所有画布数据仅在内存中，刷新页面丢失
   - **建议实现**：Next.js API Routes + 文件系统存储（`/tmp/canvases/*.json`）或数据库

2. **节点实际执行逻辑**
   - 目前批量执行 (`topologicalSort.ts`) 只是模拟执行，打印日志
   - **ImageNode**：已有 UI 和参数配置，但批量执行时未真正调用 `/api/generate`
   - **LLMNode**：同理，未接入 `/api/chat`
   - **工具节点**（resize/remove-bg/upscale 等）：全部为空壳，需要接入真实 API 或图像处理库

3. **节点间数据流**
   - 上游节点的输出没有传递给下游节点的输入
   - 例如：TextNode 的 prompt 应该自动流入连接的 ImageNode
   - ImageNode 中有一段读取上游 TextNode 的代码（`upstreamText`），但未通过 Edge 数据流传递

### 🟡 中优先级（体验优化）

4. **Skills 动态管理**
   - 当前 28 个类目 + Prompt 模板全部写死在 `skillsData.ts`
   - 用户曾提到「上传 Skill 包自动解析」的需求

5. **T8 主题模板系统**
   - T8 原项目有 3 套主题模板（科技风/像素糖果/OP风格）
   - 当前只迁移了暖米色一套主题

6. **右侧 ChatPanel 已删除**
   - 旧版右侧 AI 对话框已移除，但 `chatMessages`、`appliedPrompt` 等状态仍保留在 `store.ts`
   - 如不需要可清理

### 🟢 低优先级（代码债务）

7. **旧组件残留**
   - `src/components/workspace/` 下有大量旧版组件（`chat-panel.tsx`, `gen-canvas.tsx`, `canvas-panel.tsx`, `agent-chat-panel.tsx` 等）
   - 当前只有 `sidebar-nav.tsx`、`skill-matrix.tsx`、`asset-wall.tsx` 仍在使用

8. **类型问题**
   - `NodeProps<CustomData>` 在 React Flow 12 中不兼容，所有节点都用 `NodeProps` + 类型断言
   - `useNodes()` 返回的 edges 类型可能需要修正

## 8. 常用命令

```bash
# 安装依赖
pnpm install

# 开发（热更新）
pnpm dev

# 类型检查
pnpm ts-check

# 代码检查
pnpm lint

# 同时检查类型 + lint
pnpm validate

# 构建
pnpm build

# 生产启动
pnpm start
```

## 9. 接手建议

如果是新 Agent 接手本项目，建议按以下顺序处理：

1. **先跑通现有功能**：`pnpm dev` 启动，确认画布拖拽、节点创建、Skill 模板应用是否正常
2. **实现画布持久化**（最高优先级）：在 `src/app/api/canvas/route.ts` 实现 CRUD，让画布数据可保存/加载
3. **接入真实执行逻辑**：让 ImageNode 在批量执行时真正调用 `/api/generate`，返回结果写入节点 data
4. **实现节点间数据流**：上游节点执行完成后，将输出通过 Edge 传递给下游节点的输入端口
5. **按需清理旧代码**：删除废弃的旧版工作区组件，减少维护负担
