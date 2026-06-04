import type { Node, Edge } from '@xyflow/react';

/**
 * 在仅包含 executableTypes 的节点子图上做 Kahn 拓扑排序。
 */
export function topologicalSort(
  nodes: Node[],
  edges: Edge[],
  executableTypes: Set<string>
): string[] {
  const exeNodes = nodes.filter((n) => n.type && executableTypes.has(n.type));
  const exeIds = new Set(exeNodes.map((n) => n.id));

  const inDegree = new Map<string, number>();
  const adj = new Map<string, string[]>();
  exeIds.forEach((id) => {
    inDegree.set(id, 0);
    adj.set(id, []);
  });

  for (const e of edges) {
    if (exeIds.has(e.source) && exeIds.has(e.target) && e.source !== e.target) {
      adj.get(e.source)!.push(e.target);
      inDegree.set(e.target, (inDegree.get(e.target) || 0) + 1);
    }
  }

  const queue: string[] = [];
  for (const n of exeNodes) {
    if ((inDegree.get(n.id) || 0) === 0) queue.push(n.id);
  }

  const result: string[] = [];
  while (queue.length > 0) {
    const id = queue.shift()!;
    result.push(id);
    for (const next of adj.get(id) || []) {
      const d = (inDegree.get(next) || 0) - 1;
      inDegree.set(next, d);
      if (d === 0) queue.push(next);
    }
  }

  if (result.length < exeIds.size) {
    const got = new Set(result);
    for (const n of exeNodes) {
      if (!got.has(n.id)) result.push(n.id);
    }
  }

  return result;
}
