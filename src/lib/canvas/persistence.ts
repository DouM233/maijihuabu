import { randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { CanvasData, CanvasListItem } from './types';

interface CanvasStoreFile {
  canvases: CanvasData[];
}

const DATA_DIR = path.join(process.cwd(), '.canvas-data');
const DATA_FILE = path.join(DATA_DIR, 'canvases.json');

function now() {
  return Date.now();
}

function toListItem(canvas: CanvasData): CanvasListItem {
  return {
    id: canvas.id,
    name: canvas.name,
    nodeCount: canvas.nodes.length,
    createdAt: canvas.createdAt,
    updatedAt: canvas.updatedAt,
  };
}

async function readStore(): Promise<CanvasStoreFile> {
  try {
    const raw = await readFile(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw) as Partial<CanvasStoreFile>;
    return { canvases: Array.isArray(parsed.canvases) ? parsed.canvases : [] };
  } catch (error: unknown) {
    const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : '';
    if (code === 'ENOENT') {
      return { canvases: [] };
    }
    throw error;
  }
}

async function writeStore(store: CanvasStoreFile) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, `${JSON.stringify(store, null, 2)}\n`, 'utf8');
}

export async function listCanvases() {
  const store = await readStore();
  return store.canvases.map(toListItem).sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function createCanvas(name = 'Untitled canvas') {
  const timestamp = now();
  const canvas: CanvasData = {
    id: randomUUID(),
    name: name.trim() || 'Untitled canvas',
    nodes: [],
    edges: [],
    viewport: { x: 0, y: 0, zoom: 1 },
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  const store = await readStore();
  store.canvases.unshift(canvas);
  await writeStore(store);
  return canvas;
}

export async function getCanvas(id: string) {
  const store = await readStore();
  return store.canvases.find((canvas) => canvas.id === id) || null;
}

export async function saveCanvas(id: string, data: Partial<CanvasData>) {
  const store = await readStore();
  const index = store.canvases.findIndex((canvas) => canvas.id === id);
  if (index < 0) {
    return null;
  }

  const existing = store.canvases[index];
  const updated: CanvasData = {
    ...existing,
    name: typeof data.name === 'string' && data.name.trim() ? data.name.trim() : existing.name,
    nodes: Array.isArray(data.nodes) ? data.nodes : existing.nodes,
    edges: Array.isArray(data.edges) ? data.edges : existing.edges,
    viewport: data.viewport || existing.viewport,
    updatedAt: now(),
  };

  store.canvases[index] = updated;
  await writeStore(store);
  return updated;
}

export async function renameCanvas(id: string, name: string) {
  return saveCanvas(id, { name });
}

export async function deleteCanvas(id: string) {
  const store = await readStore();
  const nextCanvases = store.canvases.filter((canvas) => canvas.id !== id);
  if (nextCanvases.length === store.canvases.length) {
    return false;
  }
  await writeStore({ canvases: nextCanvases });
  return true;
}

export { toListItem };
