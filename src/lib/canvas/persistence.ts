import { randomUUID } from 'node:crypto';
import { getDatabase } from '@/lib/local-data/database';
import type { CanvasData, CanvasListItem } from './types';

interface CanvasRow {
  id: string;
  name: string;
  nodes_json: string;
  edges_json: string;
  viewport_json: string | null;
  created_at: number;
  updated_at: number;
}

function now() {
  return Date.now();
}

function parseJson<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function rowToCanvas(row: CanvasRow): CanvasData {
  return {
    id: row.id,
    name: row.name,
    nodes: parseJson<CanvasData['nodes']>(row.nodes_json, []),
    edges: parseJson<CanvasData['edges']>(row.edges_json, []),
    viewport: parseJson<CanvasData['viewport']>(row.viewport_json, { x: 0, y: 0, zoom: 1 }),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toListItemFromRow(row: Pick<CanvasRow, 'id' | 'name' | 'nodes_json' | 'created_at' | 'updated_at'>): CanvasListItem {
  const nodes = parseJson<CanvasData['nodes']>(row.nodes_json, []);
  return {
    id: row.id,
    name: row.name,
    nodeCount: nodes.length,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
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

export async function listCanvases() {
  const rows = getDatabase()
    .prepare('select id, name, nodes_json, created_at, updated_at from canvases order by updated_at desc')
    .all() as Array<Pick<CanvasRow, 'id' | 'name' | 'nodes_json' | 'created_at' | 'updated_at'>>;

  return rows.map(toListItemFromRow);
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

  getDatabase().prepare(`
    insert into canvases (id, name, nodes_json, edges_json, viewport_json, created_at, updated_at)
    values (@id, @name, @nodesJson, @edgesJson, @viewportJson, @createdAt, @updatedAt)
  `).run({
    id: canvas.id,
    name: canvas.name,
    nodesJson: JSON.stringify(canvas.nodes),
    edgesJson: JSON.stringify(canvas.edges),
    viewportJson: JSON.stringify(canvas.viewport),
    createdAt: canvas.createdAt,
    updatedAt: canvas.updatedAt,
  });

  return canvas;
}

export async function getCanvas(id: string) {
  const row = getDatabase()
    .prepare('select * from canvases where id = ?')
    .get(id) as CanvasRow | undefined;

  return row ? rowToCanvas(row) : null;
}

export async function saveCanvas(id: string, data: Partial<CanvasData>) {
  const existing = await getCanvas(id);
  if (!existing) return null;

  const updated: CanvasData = {
    ...existing,
    name: typeof data.name === 'string' && data.name.trim() ? data.name.trim() : existing.name,
    nodes: Array.isArray(data.nodes) ? data.nodes : existing.nodes,
    edges: Array.isArray(data.edges) ? data.edges : existing.edges,
    viewport: data.viewport || existing.viewport,
    updatedAt: now(),
  };

  getDatabase().prepare(`
    update canvases
    set name = @name,
        nodes_json = @nodesJson,
        edges_json = @edgesJson,
        viewport_json = @viewportJson,
        updated_at = @updatedAt
    where id = @id
  `).run({
    id,
    name: updated.name,
    nodesJson: JSON.stringify(updated.nodes),
    edgesJson: JSON.stringify(updated.edges),
    viewportJson: JSON.stringify(updated.viewport),
    updatedAt: updated.updatedAt,
  });

  return updated;
}

export async function renameCanvas(id: string, name: string) {
  return saveCanvas(id, { name });
}

export async function deleteCanvas(id: string) {
  const result = getDatabase().prepare('delete from canvases where id = ?').run(id);
  return result.changes > 0;
}

export { toListItem };

