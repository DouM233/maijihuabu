'use client';

import { memo, useEffect, useRef, useState, type MouseEvent, type PointerEvent } from 'react';
import { BaseEdge, EdgeLabelRenderer, type EdgeProps, getSmoothStepPath, useReactFlow } from '@xyflow/react';
import { X } from 'lucide-react';

type DeletableEdgeData = {
  onDelete?: (edgeId: string) => void;
};

function DeletableEdge({ id, sourceX, sourceY, targetX, targetY, markerEnd, data }: EdgeProps) {
  const { screenToFlowPosition, setEdges } = useReactFlow();
  const [isHovered, setIsHovered] = useState(false);
  const [buttonPosition, setButtonPosition] = useState<{ x: number; y: number } | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [edgePath, labelX, labelY] = getSmoothStepPath({
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

  const updateButtonPosition = (event: PointerEvent<SVGPathElement>) => {
    keepVisible();
    setButtonPosition(screenToFlowPosition({ x: event.clientX, y: event.clientY }));
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

  const position = buttonPosition ?? { x: labelX, y: labelY };

  return (
    <>
      <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} style={{ stroke: '#8B6FF6', strokeWidth: 2 }} />
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={18}
        onPointerEnter={updateButtonPosition}
        onPointerMove={updateButtonPosition}
        onPointerLeave={scheduleHide}
        style={{ pointerEvents: 'stroke' }}
      />
      <EdgeLabelRenderer>
        <button
          type="button"
          aria-label="剪断连线"
          onClick={onDelete}
          onMouseEnter={keepVisible}
          onMouseLeave={scheduleHide}
          className="nodrag nopan flex h-6 w-6 items-center justify-center rounded-full border border-red-300 bg-red-500 text-white shadow-md shadow-red-500/20 transition-all hover:scale-110 hover:bg-red-600"
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px)`,
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
