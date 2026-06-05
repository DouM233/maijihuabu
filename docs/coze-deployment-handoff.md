# Coze deployment handoff

This document is written for the Coze Coding agent that will deploy the project and connect Coze database / object storage.

## 中文摘要

首轮部署建议使用 **Doubao Seed 2.0 Code** 作为扣子编程主模型。这个任务的核心不是写 prompt，而是读代码、改 API、接数据库、接对象存储、跑通部署，所以优先选择代码专用模型。

扣子智能体首轮要做三件事：

- 把 `src/lib/canvas/persistence.ts` 从本地 `.canvas-data/canvases.json` 文件存储，替换为扣子数据库。
- 把上传素材和生成图片从 `blob:` / `data:image;base64`，替换为扣子对象存储 URL。
- 保持现有前端 API 契约不变，让画板历史、保存、打开、生成结果节点继续可用。

先在扣子数据库执行建表脚本：

- `docs/coze-database-schema.sql`

最重要的数据原则：

- 数据库存画板结构和元数据。
- 对象存储存图片、视频、音频、skill 包等二进制文件。
- 画板节点里只保存永久 URL / assetId / storageKey，不要保存浏览器临时 `blob:`。
- 不要把大体积 base64 图片长期塞进数据库。

## Recommended Coze model

Use **Doubao Seed 2.0 Code** as the primary model for this deployment task.

Reason: this task is mostly full-stack code modification, API route replacement, persistence design, and deployment debugging. A code-specialized model is safer than a general chat or vision model here.

Fallback choices:

- **Kimi K2.6**: use for long-context architecture review or if the agent must reason across many files.
- **DeepSeek-v4-pro**: use for harder backend refactors or database logic.
- **Qwen-3.7-Max**: use as a general full-stack fallback.
- **GLM 5V Turbo**: use only when the agent needs to inspect screenshots/UI images, not as the main deployment coder.
- **DeepSeek-v4-flash / MiniMax-M2.7 / MiniMax-M3**: use only for small low-risk edits, not for first deployment integration.

## Current local architecture

The app is a Next.js 16 / React 19 / TypeScript / React Flow canvas app.

Current persistence is local-only:

- Canvas list and canvas snapshots are saved to `.canvas-data/canvases.json`.
- The implementation is in `src/lib/canvas/persistence.ts`.
- The API routes already exist and should keep the same frontend contract.

Frontend canvas save/load contract:

- `src/lib/canvas/store.ts` calls `/api/canvas`, `/api/canvas/:id`, `/api/canvas/:id/name`.
- `src/components/canvas/Canvas.tsx` saves the whole canvas snapshot through `useCanvasStore().saveCanvas`.
- `src/components/workspace/canvas-history.tsx` lists, opens, creates, and deletes canvases.

Important: the canvas save currently saves the whole canvas snapshot: nodes, edges, viewport, node data, node size, node position, and model/prompt fields.

## P0 deployment goal

Replace local file persistence with Coze database and object storage while preserving frontend behavior.

Keep these API routes stable:

- `GET /api/canvas`: list canvases.
- `POST /api/canvas`: create a blank canvas.
- `GET /api/canvas/[id]`: load one full canvas snapshot.
- `PUT /api/canvas/[id]`: save one full canvas snapshot.
- `DELETE /api/canvas/[id]`: delete one canvas.
- `PATCH /api/canvas/[id]/name`: rename one canvas.
- `PATCH /api/canvas/[id]/auto-save`: optional autosave route, currently same shape as save.

## Database integration points

Replace this module:

- `src/lib/canvas/persistence.ts`

Current local functions to reimplement against Coze database:

- `listCanvases()`
- `createCanvas(name)`
- `getCanvas(id)`
- `saveCanvas(id, data)`
- `renameCanvas(id, name)`
- `deleteCanvas(id)`
- `toListItem(canvas)`

The existing API routes import these functions, so the cleanest deployment refactor is to keep the function names and swap the implementation behind them.

Recommended P0 table: `canvases`

Suggested fields:

- `id`: string primary key.
- `owner_id`: string nullable for now, reserved for future user/team ownership.
- `name`: string.
- `nodes_json`: JSON, the React Flow nodes array.
- `edges_json`: JSON, the React Flow edges array.
- `viewport_json`: JSON, `{ x, y, zoom }`.
- `node_count`: number.
- `created_at`: timestamp or number.
- `updated_at`: timestamp or number.
- `deleted_at`: nullable timestamp, optional if soft delete is supported.

Frontend expects `CanvasListItem`:

```ts
{
  id: string;
  name: string;
  nodeCount: number;
  createdAt: number;
  updatedAt: number;
}
```

Frontend expects `CanvasData`:

```ts
{
  id: string;
  name: string;
  nodes: NodeLike[];
  edges: EdgeLike[];
  viewport?: { x: number; y: number; zoom: number };
  createdAt: number;
  updatedAt: number;
}
```

Do not break these response shapes unless `src/lib/canvas/store.ts` is updated at the same time.

## Object storage integration points

Do not store `blob:` URLs or large `data:image/...base64` strings in the database for production.

The database should store object storage URLs / keys. Object storage should store the actual files.

### 1. Local drag-and-drop uploads

Current code:

- `src/components/canvas/Canvas.tsx`
- In `onDrop`, files are converted with `URL.createObjectURL(file)`.
- Node data currently gets `imageUrl`, `videoUrl`, or `audioUrl` as a temporary browser blob URL.

Required production change:

- Add an upload API route, for example `POST /api/assets/upload`.
- Upload the dropped file to Coze object storage.
- Return `{ assetId, url, storageKey, mimeType, sizeBytes }`.
- Store the returned `url` in node data instead of `URL.createObjectURL(file)`.
- Optionally store `assetId` and `storageKey` in node data for future deletion/reference.

### 2. Upload node file picker

Current code:

- `src/components/canvas/nodes/UploadNode.tsx`
- File picker uses `FileReader.readAsDataURL(file)`.
- Node data currently stores base64 data URL in `imageUrl`.

Required production change:

- Replace `FileReader.readAsDataURL` with the same `POST /api/assets/upload` flow.
- Store object storage URL in `imageUrl`.
- Keep `uploadType: 'image' | 'video' | 'audio'`.

### 3. Generated images

Current code:

- `src/app/api/generate/route.ts`
- `src/app/api/generate/edit/route.ts`
- These routes return `imageUrl` as a data URL in many cases.
- `src/components/canvas/nodes/ImageNode.tsx` writes the returned URL to the image node and creates/updates an output node.

Required production change:

- After image generation returns base64 or remote URL, upload the final image bytes to object storage.
- Return the object storage URL as `imageUrl`.
- Also return optional `assetId` / `storageKey`.
- `ImageNode.tsx` can mostly stay unchanged if `imageUrl` remains a normal URL string.

### 4. Output nodes

Current code:

- `src/components/canvas/nodes/OutputNode.tsx`
- It reads `nodeData.imageUrl` or `items[0]`.

Required production change:

- No major UI change needed if generated images are object storage URLs.
- Ensure saved canvas nodes contain permanent URLs, not data URLs.

### 5. Legacy workspace components

There are older components using local object URLs:

- `src/components/workspace/view-slots-panel.tsx`
- `src/components/workspace/gen-canvas.tsx`
- `src/components/workspace/chat-panel.tsx`

These are not the main current canvas path, but if Coze deployment keeps them reachable, they should also use `/api/assets/upload`.

## Recommended asset table

Create `assets` to index files stored in object storage.

Suggested fields:

- `id`: string primary key.
- `owner_id`: string nullable for now.
- `canvas_id`: string nullable.
- `source_node_id`: string nullable.
- `kind`: `upload_image`, `upload_video`, `upload_audio`, `generated_image`, `skill_package`, `skill_asset`.
- `storage_key`: string.
- `url`: string.
- `mime_type`: string.
- `size_bytes`: number.
- `width`: number nullable.
- `height`: number nullable.
- `prompt`: text nullable, useful for generated images.
- `metadata_json`: JSON nullable.
- `created_at`: timestamp or number.

## Skill package integration points

Current code:

- `src/app/api/skills/route.ts`
- It reads local folders from `process.env.SKILLS_ROOT` first.
- If `SKILLS_ROOT` is missing or unreadable, it falls back to bundled repo folders under `skills/` and then `assets/skills/`.
- It parses skill folders such as `dark-massage-skill` and `schneider-shaver-skill`.

Current behavior is good for first Coze deployment smoke tests because the two trained skill packages are bundled in `skills/`.
It is still not the final production design because server local filesystem may not be durable for future uploaded packages.

Recommended P0 options:

Option A, simplest first deployment:

- Keep the current bundled `skills/` directory in GitHub.
- Optionally set `SKILLS_ROOT` only when Coze provides a reliable server path or mounted folder.
- This is acceptable only for first smoke test.

Option B, better production design:

- Store uploaded skill folders as zipped packages in object storage.
- Store parsed skill package metadata in database.
- Change `GET /api/skills` to read from database/index instead of scanning `SKILLS_ROOT`.
- Add a maintainer-only endpoint such as `POST /api/admin/skills/upload`.
- The endpoint should unzip/parse the skill package, upload assets to object storage, and write template records to database.

Recommended tables:

- `skill_packages`: package id, name, version, category, storage_prefix, manifest_json, enabled, created_at, updated_at.
- `skill_templates`: template id, package id, style name, category, subcategory, prompt text, negative prompt, tags, preview asset ids.

Important product rule from the owner:

- Skill upload should be maintainer-only, not open to all users.

## Environment variables

Current AI API variables:

- `CHAT_API_URL`
- `CHAT_API_KEY`
- `SKILLS_ROOT` for optional local skill folder scanning. If it is not set, the app reads bundled repo skills from `skills/`.

Deployment should add Coze-specific variables as needed. Exact names depend on Coze service SDK, but the project needs:

- Database connection or Coze database binding.
- Object storage bucket/binding.
- Public object URL base or signed URL helper.
- Optional admin secret for maintainer-only skill upload endpoint.

Do not commit secrets.

## Implementation checklist for Coze Coding agent

1. Run `corepack pnpm install` if dependencies are missing.
2. Run `corepack pnpm ts-check` before changes to confirm baseline.
3. Replace `src/lib/canvas/persistence.ts` local JSON implementation with Coze database functions.
4. Add object storage helper module, for example `src/lib/storage/object-storage.ts`.
5. Add `POST /api/assets/upload` for browser uploads.
6. Update `src/components/canvas/Canvas.tsx` drag-and-drop upload to call `/api/assets/upload`.
7. Update `src/components/canvas/nodes/UploadNode.tsx` file picker upload to call `/api/assets/upload`.
8. Update `src/app/api/generate/route.ts` and `src/app/api/generate/edit/route.ts` to upload generated image bytes to object storage before returning `imageUrl`.
9. Keep `src/components/canvas/nodes/ImageNode.tsx` response contract stable: it expects `{ imageUrl?: string; error?: string }`.
10. Decide first-deployment skill strategy: keep `SKILLS_ROOT` temporarily, or implement DB/object-storage backed skill packages.
11. Run `corepack pnpm ts-check`.
12. Run targeted eslint or `corepack pnpm lint`.
13. Test manually: create canvas, add text/upload/image nodes, save, switch history, reload, reopen canvas, generate image, save again.

## Production data rule

Use this rule for all future deployment work:

- Database stores canvas structure and metadata.
- Object storage stores binary files.
- Canvas node data stores permanent object URLs / asset ids.
- Never persist browser-only `blob:` URLs.
- Avoid persisting large base64 data URLs in the database.
