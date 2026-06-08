import { randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { getDatabase } from './database';
import { getLocalAssetsDir } from './config';

export interface LocalAssetRecord {
  id: string;
  canvasId?: string | null;
  originalName: string;
  kind: string;
  relativePath: string;
  url: string;
  mimeType: string;
  size: number;
  model?: string | null;
  prompt?: string | null;
  createdAt: number;
}

interface SaveLocalAssetInput {
  buffer: Buffer;
  originalName: string;
  kind: string;
  mimeType: string;
  canvasId?: string | null;
  model?: string | null;
  prompt?: string | null;
}

const MIME_EXTENSION: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'video/mp4': '.mp4',
  'audio/mpeg': '.mp3',
  'audio/wav': '.wav',
};

export function sanitizeFileName(fileName: string) {
  const parsed = path.parse(fileName || 'asset');
  const safeName = parsed.name
    .replace(/[^\w\u4e00-\u9fa5.-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 80) || 'asset';
  return `${safeName}${parsed.ext.toLowerCase()}`;
}

export function getAssetAbsolutePath(relativePath: string) {
  const safeRelativePath = relativePath.replace(/^[/\\]+/, '');
  const absolutePath = path.resolve(getLocalAssetsDir(), safeRelativePath);
  const root = path.resolve(getLocalAssetsDir());
  const relativeToRoot = path.relative(root, absolutePath);

  if (relativeToRoot.startsWith('..') || path.isAbsolute(relativeToRoot)) {
    throw new Error('Invalid asset path');
  }

  return absolutePath;
}

export function getAssetMimeType(filePath: string) {
  const extension = path.extname(filePath).toLowerCase();
  if (extension === '.jpg' || extension === '.jpeg') return 'image/jpeg';
  if (extension === '.png') return 'image/png';
  if (extension === '.webp') return 'image/webp';
  if (extension === '.gif') return 'image/gif';
  if (extension === '.mp4') return 'video/mp4';
  if (extension === '.mp3') return 'audio/mpeg';
  if (extension === '.wav') return 'audio/wav';
  return 'application/octet-stream';
}

export async function readLocalAsset(relativePath: string) {
  const absolutePath = getAssetAbsolutePath(relativePath);
  const buffer = await readFile(absolutePath);
  return {
    buffer,
    mimeType: getAssetMimeType(absolutePath),
  };
}

export async function saveLocalAsset(input: SaveLocalAssetInput): Promise<LocalAssetRecord> {
  const timestamp = Date.now();
  const date = new Date(timestamp);
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const id = randomUUID();
  const fallbackExt = MIME_EXTENSION[input.mimeType] || '.bin';
  const safeOriginalName = sanitizeFileName(input.originalName || `asset${fallbackExt}`);
  const ext = path.extname(safeOriginalName) || fallbackExt;
  const baseName = path.basename(safeOriginalName, path.extname(safeOriginalName));
  const fileName = `${baseName}_${id.slice(0, 8)}${ext}`;
  const relativePath = path.posix.join(input.kind, year, month, day, fileName);
  const absolutePath = getAssetAbsolutePath(relativePath);

  await mkdir(path.dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, input.buffer);

  const url = `/api/assets/file/${relativePath}`;
  const record: LocalAssetRecord = {
    id,
    canvasId: input.canvasId || null,
    originalName: safeOriginalName,
    kind: input.kind,
    relativePath,
    url,
    mimeType: input.mimeType,
    size: input.buffer.length,
    model: input.model || null,
    prompt: input.prompt || null,
    createdAt: timestamp,
  };

  getDatabase().prepare(`
    insert into assets (
      id, canvas_id, original_name, kind, relative_path, url, mime_type, size, model, prompt, created_at
    ) values (
      @id, @canvasId, @originalName, @kind, @relativePath, @url, @mimeType, @size, @model, @prompt, @createdAt
    )
  `).run(record);

  return record;
}
