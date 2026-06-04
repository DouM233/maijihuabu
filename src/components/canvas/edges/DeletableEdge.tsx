'use client';

import { memo } from 'react';
import { BaseEdge, EdgeLabelRenderer, type EdgeProps, getSmoothStepPath } from '@xyflow/react';
import { X } from 'lucide-react';

function DeletableEdge({ id, sourceX, sourceY, targetX, targetY, markerEnd, data }: EdgeProps) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const onDelete = () => {
    if (data && typeof data === 'object' && 'onDelete' in data && typeof data.onDelete === 'function') {
      data.onDelete(id);
    }
  };

  return (
    <>
      <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} style={{ stroke: '#8B6FF6', strokeWidth: 2 }} />
      <EdgeLabelRenderer>
        <button
          onClick={onDelete}
          className="nodrag nopan pointer-events-auto w-5 h-5 rounded-full bg-card border border-border text-muted-foreground hover:text-destructive hover:border-destructive flex items-center justify-center transition-colors"
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
          }}
        >
          <X className="w-3 h-3" />
        </button>
      </EdgeLabelRenderer>
    </>
  );
}

export default memo(DeletableEdge);
