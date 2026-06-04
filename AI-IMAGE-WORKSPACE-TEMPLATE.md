# AI 生图工作台 — 项目复制模板

> 给 AI 助手的指引：请完整阅读本文档后，按照各章节的顺序和规范复刻项目。遇到占位符 `{{...}}` 请要求用户提供实际值。

---

## 1. 项目定位

**产品名称**：灵感工坊 AI（可替换）

**核心功能**：
- 左侧导航 + 三 Tab 内容面板（创意舱 / Skill 矩阵 / 资产墙）
- 中央无限画布（支持上传图片、AI 生成图片、拖拽移动、缩放）
- 右侧 AI 对话助手（SSE 流式对话 + 一键生成图片）
- 所有面板之间可拖拽调宽、折叠/展开
- 对接 OpenAI 兼容 API（对话 + 文生图 + 图生图）

**目标用户**：电商运营、产品经理等非专业设计人员

---

## 2. 技术栈

| 层 | 选型 |
|---|---|
| 框架 | Next.js 16 (App Router) |
| 核心 | React 19 |
| 语言 | TypeScript 5 (strict) |
| UI 组件 | shadcn/ui (Radix UI) |
| 样式 | Tailwind CSS 4 |
| 状态管理 | Zustand |
| 图标 | lucide-react |
| 包管理 | pnpm（严禁 npm/yarn） |

---

## 3. 初始化

```bash
coze init ${COZE_WORKSPACE_PATH} --template nextjs
```

初始化后项目文件在 `src/` 目录下，`.coze` 配置已预置，无需修改。

---

## 4. 环境变量

创建 `.env.local`：

```env
# 对话 + 生图共用同一个 OpenAI 兼容接口
CHAT_API_URL={{你的API地址}}/v1/chat/completions
CHAT_API_KEY={{你的API密钥}}
```

**关键说明**：
- `CHAT_API_URL` 以 `/chat/completions` 结尾
- 生图接口 URL 由代码自动推导：`/chat/completions` → `/images/generations`（文生图）、`/images/edits`（图生图）
- 部署时只需配置这两个变量，其余由平台自动注入

---

## 5. 目录结构

```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts              # SSE 流式对话代理
│   │   └── generate/
│   │       ├── route.ts               # 文生图 API
│   │       └── edit/route.ts          # 图生图 API
│   ├── layout.tsx                     # 根布局
│   ├── page.tsx                       # 主页面（五栏 Flex 布局编排）
│   └── globals.css                    # 全局样式
├── components/
│   ├── ui/                            # shadcn/ui 组件库
│   └── workspace/
│       ├── sidebar-nav.tsx            # 左侧导航栏
│       ├── style-tag-bar.tsx          # 风格模板标签栏
│       ├── gen-canvas.tsx             # 无限画布
│       ├── chat-panel.tsx             # AI 对话助手（含生图）
│       ├── skill-matrix.tsx           # Skill 矩阵库
│       └── asset-wall.tsx             # 创意资产墙
├── lib/
│   ├── utils.ts                       # cn() 工具函数
│   ├── types.ts                       # 全局类型定义
│   ├── store.ts                       # Zustand 状态管理
│   └── skillsData.ts                  # Prompt 模板数据
```

---

## 6. 核心架构模式

### 6.1 五栏 Flex 可拖拽布局

```
┌────────┬──┬──────────────┬──┬──────────┐
│ 左侧栏 │◀▶│  内容面板    │◀▶│  对话面板 │
│(可折叠) │  │ (Skill矩阵/ │  │ (可折叠)  │
│        │  │  资产墙/空)  │  │          │
│        │  │              │  │          │
│        │  ├──────────────┤  │          │
│        │  │  无限画布    │  │          │
└────────┴──┴──────────────┴──┴──────────┘
```

**page.tsx 状态管理**：

```tsx
const [sidebarWidth, setSidebarWidth] = useState(256);   // 左侧栏宽度
const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
const [leftPanelWidth, setLeftPanelWidth] = useState(500); // 内容面板宽度
const [chatWidth, setChatWidth] = useState(380);          // 对话面板宽度
const [chatCollapsed, setChatCollapsed] = useState(false);
const [categoryTreeWidth, setCategoryTreeWidth] = useState(224); // Skill矩阵内部类目树宽度
```

**核心布局 JSX**：

```tsx
<div className="flex h-screen w-screen overflow-hidden bg-white">
  <SidebarNav width={sidebarCollapsed ? 56 : sidebarWidth} collapsed={sidebarCollapsed} ... />
  <CollapsibleHandleLeft onResize={delta => setSidebarWidth(w => clamp(w + delta))} ... />
  {showLeftPanel && <div style={{ width: leftPanelWidth }}><SkillMatrix /></div>}
  {showLeftPanel && <ResizeHandle onResize={delta => setLeftPanelWidth(w => clamp(w + delta))} />}
  <div className="min-w-0 flex-1"><GenCanvas /></div>
  <CollapsibleHandleRight onResize={delta => setChatWidth(w => clamp(w - delta))} ... />
  <div style={{ width: chatCollapsed ? 0 : chatWidth }}><ChatPanel /></div>
</div>
```

### 6.2 拖拽方向黄金法则（重要！）

**这是最容易出 BUG 的地方，必须严格遵守**：

- 左侧面板滑块：`w + delta`（向右拖 → 面板变宽）
- 右侧面板滑块：`w - delta`（向右拖 → 面板变窄）
- **禁止给 ResizeHandle 加 `side`/`direction` 属性**，每个回调自行处理方向
- 拖拽时禁用 CSS transition，松手后恢复：
  ```tsx
  <div className={chatDragging ? '' : 'transition-[width] duration-300'}>
  ```

### 6.3 两种滑块组件

**ResizeHandle** — 纯拖拽调宽度：

```tsx
function ResizeHandle({ onResize }: { onResize: (deltaX: number) => void }) {
  // mousedown → 记录 lastX
  // mousemove → 计算 delta = clientX - lastX，调用 onResize(delta)
  // mouseup → 清理
}
```

**CollapsibleHandle** — 拖拽调宽度 + 点击折叠/展开：

```tsx
function CollapsibleHandleRight({ onResize, collapsed, onToggle, onDragStart, onDragEnd }) {
  // 3px 死区：拖动超过 3px 才算拖拽，否则视为点击
  // 拖拽 → onResize(delta) + onDragStart/onDragEnd
  // 点击 → onToggle()
}
```

---

## 7. 后端 API 路由

### 7.1 对话流式代理 `/api/chat`

**职责**：接收前端 messages，代理到上游 OpenAI 兼容接口，透传 SSE 流

**请求格式**：
```json
{ "messages": [{ "role": "user", "content": "..." }], "model": "gpt-5.4-mini" }
```

**SSE 输出格式**：
```
data: {"content":"Hello"}
data: {"content":"!"}
data: [DONE]
```

**核心实现**：
- 向上游发送 `stream: true`
- 用 `ReadableStream` 读取上游 SSE
- 解析 `choices[0].delta.content`，转换为统一的 `{"content":"..."}` 格式
- 前端用 `fetch` + `body.getReader()` 消费，实现打字机效果

### 7.2 文生图 `/api/generate`

**请求**：JSON `{ prompt, size, quality }`

**size 取值**：`'auto'` | `'1024x1024'` | `'1536x1024'` | `'1024x1536'`

**quality 取值**：`'low'` | `'high'`

**响应**：`{ imageUrl: 'data:image/png;base64,...' }`

**上游请求**：
```json
{
  "model": "gpt-image-2",
  "prompt": "...",
  "size": "1024x1024",
  "n": 1,
  "response_format": "b64_json"
}
```

### 7.3 图生图 `/api/generate/edit`

**请求**：`multipart/form-data`（prompt + image file + size + quality）

**注意**：edits 端点不支持 `response_format` 参数，需兼容 URL 和 b64_json 两种返回格式

**响应格式同文生图**：`{ imageUrl: 'data:image/png;base64,...' }`

---

## 8. 前端核心组件

### 8.1 ChatPanel（对话 + 生图一体化）

**布局**：
```
┌─────────────────┐
│  标题栏          │
├─────────────────┤
│                 │
│  消息列表        │  ← 高度可拖拽调节
│  （流式打字机）   │
│                 │
├─ ⋮ 可拖拽分隔 ──┤
│  输入框 [发送][生图] │
│  参数：模型|尺寸|画质 │
└─────────────────┘
```

**两个核心操作**：
1. **发送消息**（Send 按钮）：调用 `/api/chat` SSE 流式
2. **生成图片**（Wand2 按钮）：检测是否有上传图 → 走 `/api/generate` 或 `/api/generate/edit`，结果添加到画布

**DropdownSelect 防崩溃**：
```tsx
// 错误写法：value 不匹配时 selected 为 undefined
const selected = options.find((o) => o.id === value)!;

// 正确写法：兜底取第一个选项
const selected = options.find((o) => o.id === value) ?? options[0];
```

### 8.2 GenCanvas（无限画布）

- Zustand 管理 `canvasNodes: CanvasNode[]`
- CanvasNode 接口：`{ id, url, name, x, y, width, height, type: 'upload'|'generated' }`
- 支持拖拽移动节点、缩放、上传图片、下载

### 8.3 SidebarNav（左侧导航）

- 接受 `width` 和 `collapsed` props，用 `style={{ width }}` 动态宽度
- 折叠时 56px（仅图标），展开时宽度由父组件拖拽控制
- **禁止使用固定 CSS class（w-64/w-14）**，否则拖拽无效

### 8.4 SkillMatrix（Skill 矩阵库）

- 左侧类目树 + 右侧模板卡片墙
- 内部有 ResizeHandle 调节类目树宽度
- 选择模板后自动注入 Prompt 到 ChatPanel

---

## 9. Zustand Store 设计

```typescript
// 核心状态
interface AppState {
  // 画布生成参数
  genModel: GenModelId;        // 'gpt-image-2' | 'gemini-3.1-flash-image' | ...
  genSize: GenSizeId;          // 'auto' | '1024x1024' | '1536x1024' | '1024x1536'
  genQuality: GenQualityId;    // 'low' | 'high'

  // 无限画布
  canvasNodes: CanvasNode[];
  addCanvasNode: (node: CanvasNode) => void;
  updateCanvasNode: (id: string, updates: Partial<CanvasNode>) => void;

  // Skill Prompt 隐式注入
  currentLoadedSkillPrompt: string;
  currentLoadedSkillName: string;

  // 生成状态
  generateStatus: 'idle' | 'generating' | 'done' | 'error';
  generatedImageUrl: string | null;
}
```

---

## 10. 类型定义规范

```typescript
// types.ts - 前端选项 ID 直接使用 API 格式，不要用比例格式

// 正确
type GenSizeId = 'auto' | '1024x1024' | '1536x1024' | '1024x1536';
type GenQualityId = 'low' | 'high';

// 错误（会导致映射混乱）
type GenSizeId = '1:1' | '3:2' | '2:3';    // ❌
type GenQualityId = '1k' | '2k' | '4k';     // ❌
```

**教训**：前后端统一使用 API 格式作为 ID，避免额外的映射层造成不一致。

---

## 11. 踩坑经验汇总

### 11.1 拖拽方向反了
**根因**：给 ResizeHandle 加了 `side` 属性会取反 delta，但调用方又做了正负处理，导致双重反转
**解法**：ResizeHandle 只传原始 delta，每个回调自行决定 `w + delta` 还是 `w - delta`

### 11.2 左侧栏拖拽无效
**根因**：侧边栏使用固定 CSS class `w-64`/`w-14`，无法动态调整
**解法**：改为接受 `width` prop + `style={{ width }}`

### 11.3 DropdownSelect 崩溃
**根因**：`options.find(o => o.id === value)!` 在 value 不匹配时返回 undefined
**解法**：`?? options[0]` 兜底

### 11.4 生图结果不显示
**根因**：API 返回 `imageUrl`，但前端检查 `result?.base64`（字段名不匹配）
**解法**：统一使用 `result?.imageUrl`

### 11.5 图生图 edits 端点报错
**根因**：edits 端点不支持 `response_format` 参数
**解法**：移除该参数，兼容 URL 和 b64_json 两种返回格式

### 11.6 Hydration 问题
**根因**：JSX 中直接使用 `typeof window`/`Date.now()`/`Math.random()`
**解法**：用 `'use client'` + `useEffect` + `useState` 确保动态内容仅客户端渲染

---

## 12. 部署环境变量清单

| 变量名 | 必填 | 说明 | 示例 |
|---|---|---|---|
| `CHAT_API_URL` | 是 | OpenAI 兼容接口地址（含 `/chat/completions`） | `https://xxx.com/v1/chat/completions` |
| `CHAT_API_KEY` | 是 | API 密钥 | `YOUR_API_KEY` |
| `DEPLOY_RUN_PORT` | 否 | 平台自动注入 | `5000` |
| `COZE_PROJECT_ENV` | 否 | 平台自动注入（DEV/PROD） | `PROD` |

---

## 13. 验证清单

部署前必须通过以下验证：

- [ ] `pnpm lint --quiet` 无错误
- [ ] `pnpm ts-check` 无类型错误
- [ ] 服务 5000 端口正常响应
- [ ] `/api/chat` SSE 流式输出正常
- [ ] `/api/generate` 返回 base64 图片
- [ ] `/api/generate/edit` 图生图接口可调通
- [ ] 页面所有滑块拖拽方向正确（左面板 w+delta，右面板 w-delta）
- [ ] DropdownSelect 无崩溃（value 不匹配时有兜底）
- [ ] 生图结果正确显示到画布（检查 imageUrl 字段名一致）
