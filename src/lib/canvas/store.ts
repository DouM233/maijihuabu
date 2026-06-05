import { create } from 'zustand';
import type { CanvasListItem, CanvasData } from './types';

interface CanvasStoreState {
  canvases: CanvasListItem[];
  activeId: string | null;
  loading: boolean;
  error: string | null;

  loadCanvases: () => Promise<void>;
  createCanvas: (name?: string) => Promise<CanvasListItem | null>;
  loadCanvas: (id: string) => Promise<CanvasData | null>;
  saveCanvas: (canvas: CanvasData) => Promise<CanvasData | null>;
  deleteCanvas: (id: string) => Promise<void>;
  renameCanvas: (id: string, name: string) => Promise<void>;
  setActive: (id: string) => void;
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...init });
  if (!res.ok) {
    let errMsg = `HTTP ${res.status}`;
    try { const data = await res.json(); errMsg = (data as { error?: string }).error || errMsg; } catch { /* ignore */ }
    throw new Error(errMsg);
  }
  return res.json();
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

export const useCanvasStore = create<CanvasStoreState>((set, get) => ({
  canvases: [],
  activeId: null,
  loading: false,
  error: null,

  async loadCanvases() {
    set({ loading: true, error: null });
    try {
      const list = await request<{ data: CanvasListItem[] }>('/api/canvas');
      const sorted = [...(list.data || [])].sort((a, b) => b.updatedAt - a.updatedAt);
      set({ canvases: sorted, loading: false, activeId: get().activeId || sorted[0]?.id || null });
    } catch (e: unknown) {
      set({ loading: false, error: e instanceof Error ? e.message : '加载画布列表失败' });
    }
  },

  async createCanvas(name) {
    try {
      const item = await request<{ data: CanvasListItem }>('/api/canvas', {
        method: 'POST',
        body: JSON.stringify({ name: name || '未命名画布' }),
      });
      set((s) => ({ canvases: [item.data, ...s.canvases], activeId: item.data.id }));
      return item.data;
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : '创建画布失败' });
      return null;
    }
  },

  async loadCanvas(id) {
    try {
      const item = await request<{ data: CanvasData }>(`/api/canvas/${id}`);
      set({ activeId: item.data.id, error: null });
      return item.data;
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : '鍔犺浇鐢诲竷澶辫触' });
      return null;
    }
  },

  async saveCanvas(canvas) {
    try {
      const saved = await request<{ data: CanvasData }>(`/api/canvas/${canvas.id}`, {
        method: 'PUT',
        body: JSON.stringify(canvas),
      });
      const listItem = toListItem(saved.data);
      set((s) => ({
        activeId: saved.data.id,
        canvases: [listItem, ...s.canvases.filter((item) => item.id !== saved.data.id)]
          .sort((a, b) => b.updatedAt - a.updatedAt),
        error: null,
      }));
      return saved.data;
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : '淇濆瓨鐢诲竷澶辫触' });
      return null;
    }
  },

  async deleteCanvas(id) {
    try {
      await request(`/api/canvas/${id}`, { method: 'DELETE' });
      set((s) => {
        const list = s.canvases.filter((x) => x.id !== id);
        return { canvases: list, activeId: s.activeId === id ? list[0]?.id || null : s.activeId };
      });
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : '删除失败' });
    }
  },

  async renameCanvas(id, name) {
    try {
      const updated = await request<{ data: CanvasListItem }>(`/api/canvas/${id}/name`, {
        method: 'PATCH',
        body: JSON.stringify({ name }),
      });
      set((s) => ({
        canvases: s.canvases.map((x) => (x.id === id ? updated.data : x)),
      }));
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : '重命名失败' });
    }
  },

  setActive(id) {
    set({ activeId: id });
  },
}));
