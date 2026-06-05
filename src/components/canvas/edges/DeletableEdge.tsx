'use client';

import { memo, useState, type MouseEvent } from 'react';
import { BaseEdge, EdgeLabelRenderer, type EdgeProps, getSmoothStepPath } from '@xyflow/react';
import { X } from 'lucide-react';

type DeletableEdgeData = {
  onDelete?: (edgeId: string) => void;
};

function DeletableEdge({ id, sourceX, sourceY, targetX, targetY, markerEnd, data }: EdgeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const onDelete = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    (data as DeletableEdgeData | undefined)?.onDelete?.(id);
  };

  return (
    <>
      <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} style={{ stroke: '#8B6FF6', strokeWidth: 2 }} />
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={18}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ pointerEvents: 'stroke' }}
      />
      <EdgeLabelRenderer>
        <button
          type="button"
          aria-label="剪断连线"
          onClick={onDelete}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="nodrag nopan flex h-6 w-6 items-center justify-center rounded-full border border-red-300 bg-red-500 text-white shadow-md shadow-red-500/20 transition-all hover:scale-110 hover:bg-red-600"
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            opacity: isHovered ? 1 : 0,
            pointerEvents: isHovered ? 'auto' : 'none',
          }}
        >
          <X className="w-3 h-3" />
        </button>
      </EdgeLabelRenderer>
    </>
  );
}

export default memo(DeletableEdge);
