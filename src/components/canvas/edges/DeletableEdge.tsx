'use client';

import { memo, useEffect, useRef, useState, type MouseEvent } from 'react';
import { BaseEdge, EdgeLabelRenderer, type EdgeProps, getBezierPath, useReactFlow } from '@xyflow/react';
import { X } from 'lucide-react';

type DeletableEdgeData = {
  onDelete?: (edgeId: string) => void;
};

function DeletableEdge({ id, sourceX, sourceY, targetX, targetY, markerEnd, data }: EdgeProps) {
  const { setEdges } = useReactFlow();
  const [isHovered, setIsHovered] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

  const keepVisible = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    setIsHovered(true);
  };

  const scheduleHide = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }
    hideTimerRef.current = setTimeout(() => setIsHovered(false), 320);
  };

  const onDelete = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const onDeleteEdge = (data as DeletableEdgeData | undefined)?.onDelete;
    if (onDeleteEdge) {
      onDeleteEdge(id);
      return;
    }
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{ stroke: '#8B6FF6', strokeWidth: 2.2, strokeLinecap: 'round', opacity: 0.72 }}
      />
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={22}
        onPointerEnter={keepVisible}
        onPointerLeave={scheduleHide}
        style={{ pointerEvents: 'stroke' }}
      />
      <EdgeLabelRenderer>
        <div
          className="nodrag nopan flex h-12 w-12 items-center justify-center"
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            opacity: isHovered ? 1 : 0,
            pointerEvents: isHovered ? 'auto' : 'none',
          }}
          onMouseEnter={keepVisible}
          onMouseLeave={scheduleHide}
        >
          <button
            type="button"
            aria-label="剪断连线"
            onClick={onDelete}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-red-300 bg-red-500 text-white shadow-lg shadow-red-500/25 transition-transform hover:scale-110 hover:bg-red-600"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export default memo(DeletableEdge);
