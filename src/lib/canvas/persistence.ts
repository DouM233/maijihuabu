import { randomUUID } from 'node:crypto';
import { getDatabase } from '@/lib/local-data/database';
import type { UserContext } from '@/lib/local-data/users';
import type { CanvasData, CanvasListItem } from './types';

interface CanvasRow {
  id: string;
  owner_id: string;
  owner_name: string;
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

export async function listCanvases(ownerId = 'shared') {
  const rows = getDatabase()
    .prepare('select id, name, nodes_json, created_at, updated_at from canvases where owner_id = ? order by updated_at desc')
    .all(ownerId) as Array<Pick<CanvasRow, 'id' | 'name' | 'nodes_json' | 'created_at' | 'updated_at'>>;

  return rows.map(toListItemFromRow);
}

export async function createCanvas(name = 'Untitled canvas', owner: UserContext = { id: 'shared', name: 'Shared' }) {
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
    insert into canvases (id, owner_id, owner_name, name, nodes_json, edges_json, viewport_json, created_at, updated_at)
    values (@id, @ownerId, @ownerName, @name, @nodesJson, @edgesJson, @viewportJson, @createdAt, @updatedAt)
  `).run({
    id: canvas.id,
    ownerId: owner.id,
    ownerName: owner.name,
    name: canvas.name,
    nodesJson: JSON.stringify(canvas.nodes),
    edgesJson: JSON.stringify(canvas.edges),
    viewportJson: JSON.stringify(canvas.viewport),
    createdAt: canvas.createdAt,
    updatedAt: canvas.updatedAt,
  });

  return canvas;
}

export async function getCanvas(id: string, ownerId = 'shared') {
  const row = getDatabase()
    .prepare('select * from canvases where id = ? and owner_id = ?')
    .get(id, ownerId) as CanvasRow | undefined;

  return row ? rowToCanvas(row) : null;
}

export async function saveCanvas(id: string, data: Partial<CanvasData>, ownerId = 'shared') {
  const existing = await getCanvas(id, ownerId);
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
    where id = @id and owner_id = @ownerId
  `).run({
    id,
    ownerId,
    name: updated.name,
    nodesJson: JSON.stringify(updated.nodes),
    edgesJson: JSON.stringify(updated.edges),
    viewportJson: JSON.stringify(updated.viewport),
    updatedAt: updated.updatedAt,
  });

  return updated;
}

export async function renameCanvas(id: string, name: string, ownerId = 'shared') {
  return saveCanvas(id, { name }, ownerId);
}

export async function deleteCanvas(id: string, ownerId = 'shared') {
  const result = getDatabase().prepare('delete from canvases where id = ? and owner_id = ?').run(id, ownerId);
  return result.changes > 0;
}

export { toListItem };
