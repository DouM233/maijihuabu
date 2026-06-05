'use client';

import { useCallback, useEffect, useRef, useState, type ComponentType } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlowProvider,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  useReactFlow,
  type Connection,
  type Edge,
  type Node,
  type NodeChange,
  type EdgeChange,
  type NodeTypes,
  type IsValidConnection,
  type NodeProps,
  SelectionMode,
  NodeResizer,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { isConnectionValid } from '@/lib/canvas/portTypes';
import { NODE_REGISTRY } from '@/lib/canvas/nodeRegistry';
import type { PromptTemplate } from '@/lib/skillsData';
import CanvasSidebar from './CanvasSidebar';
import NodeActionBar from './NodeActionBar';

// 节点组件映射
import ResizableTextNode from './nodes/ResizableTextNode';
import ImageNode from './nodes/ImageNode';
import LLMNode from './nodes/LLMNode';
import UploadNode from './nodes/UploadNode';
import OutputNode from './nodes/OutputNode';
import IdeaNode from './nodes/IdeaNode';
import RelayNode from './nodes/RelayNode';
import CinematicNode from './nodes/CinematicNode';
import VideoMotionNode from './nodes/VideoMotionNode';
import VideoNode from './nodes/VideoNode';
import SeedanceNode from './nodes/SeedanceNode';
import AudioNode from './nodes/AudioNode';
import ResizeNode from './nodes/ResizeNode';
import RemoveBgNode from './nodes/RemoveBgNode';
import UpscaleNode from './nodes/UpscaleNode';
import CombineNode from './nodes/CombineNode';
import GridCropNode from './nodes/GridCropNode';
import LoopNode from './nodes/LoopNode';
import PickFromSetNode from './nodes/PickFromSetNode';
import ImageCompareNode from './nodes/ImageCompareNode';
import FrameExtractorNode from './nodes/FrameExtractorNode';
import FramePairNode from './nodes/FramePairNode';
import BrowserNode from './nodes/BrowserNode';
import DrawingBoardNode from './nodes/DrawingBoardNode';
import MultiAngle3DNode from './nodes/MultiAngle3DNode';
import Panorama720Node from './nodes/Panorama720Node';
import PenguinPortraitNode from './nodes/PenguinPortraitNode';
import PortraitMetadataNode from './nodes/PortraitMetadataNode';
import StoryboardGridNode from './nodes/StoryboardGridNode';

const INTERACTIVE_NODE_SELECTOR = [
  'input',
  'textarea',
  'select',
  'button',
  'label',
  '[contenteditable="true"]',
  '[role="textbox"]',
  '.nodrag',
  '.nopan',
].join(',');

function isInteractiveNodeTarget(target: EventTarget | null) {
  return target instanceof HTMLElement && !!target.closest(INTERACTIVE_NODE_SELECTOR);
}

function cloneNodeForHistory(node: Node): Node {
  return {
    ...node,
    data: { ...node.data },
    position: { ...node.position },
  };
}

function cloneEdgeForHistory(edge: Edge): Edge {
  return {
    ...edge,
    data: edge.data ? { ...edge.data } : edge.data,
  };
}

interface CanvasSnapshot {
  nodes: Node[];
  edges: Edge[];
}

function withNodeResizer(Component: ComponentType<NodeProps>) {
  function ResizableCanvasNode(props: NodeProps) {
    const { updateNodeData } = useReactFlow();
    const containerRef = useRef<HTMLDivElement>(null);
    const nodeData = props.data as Record<string, unknown>;
    const width = typeof nodeData.nodeWidth === 'number' ? nodeData.nodeWidth : undefined;
    const height = typeof nodeData.nodeHeight === 'number' ? nodeData.nodeHeight : undefined;

    useEffect(() => {
      const interactiveElements = containerRef.current?.querySelectorAll(INTERACTIVE_NODE_SELECTOR);
      interactiveElements?.forEach((element) => {
        element.classList.add('nodrag', 'nowheel');
      });
    });

    return (
      <>
        <NodeResizer
          isVisible={props.selected}
          minWidth={180}
          minHeight={110}
          lineClassName="!border-primary"
          handleClassName="!h-3 !w-3 !border-primary !bg-card"
          onResizeEnd={(_, params) => {
            updateNodeData(props.id, {
              nodeWidth: params.width,
              nodeHeight: params.height,
            });
          }}
        />
        <div
          ref={containerRef}
          className="h-full w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm [&_*]:box-border [&>div]:!h-full [&>div]:!max-w-full [&>div]:!w-full [&_input]:max-w-full [&_select]:max-w-full [&_textarea]:max-w-full"
          onDoubleClickCapture={(event) => {
            if (isInteractiveNodeTarget(event.target)) {
              event.stopPropagation();
            }
          }}
          onWheelCapture={(event) => {
            if (isInteractiveNodeTarget(event.target)) {
              event.stopPropagation();
            }
          }}
          style={{
            width,
            height,
          }}
        >
          <Component {...props} />
        </div>
      </>
    );
  }
  ResizableCanvasNode.displayName = `ResizableCanvasNode`;
  return ResizableCanvasNode;
}

const NODE_TYPES: NodeTypes = {
  text: withNodeResizer(ResizableTextNode),
  image: withNodeResizer(ImageNode),
  llm: withNodeResizer(LLMNode),
  upload: withNodeResizer(UploadNode),
  output: withNodeResizer(OutputNode),
  idea: withNodeResizer(IdeaNode),
  relay: withNodeResizer(RelayNode),
  cinematic: withNodeResizer(CinematicNode),
  'video-motion': withNodeResizer(VideoMotionNode),
  video: withNodeResizer(VideoNode),
  seedance: withNodeResizer(SeedanceNode),
  audio: withNodeResizer(AudioNode),
  resize: withNodeResizer(ResizeNode),
  'remove-bg': withNodeResizer(RemoveBgNode),
  upscale: withNodeResizer(UpscaleNode),
  combine: withNodeResizer(CombineNode),
  'grid-crop': withNodeResizer(GridCropNode),
  loop: withNodeResizer(LoopNode),
  'pick-from-set': withNodeResizer(PickFromSetNode),
  'image-compare': withNodeResizer(ImageCompareNode),
  'frame-extractor': withNodeResizer(FrameExtractorNode),
  'frame-pair': withNodeResizer(FramePairNode),
  browser: withNodeResizer(BrowserNode),
  'drawing-board': withNodeResizer(DrawingBoardNode),
  'multi-angle-3d': withNodeResizer(MultiAngle3DNode),
  'panorama-720': withNodeResizer(Panorama720Node),
  'penguin-portrait': withNodeResizer(PenguinPortraitNode),
  'portrait-metadata': withNodeResizer(PortraitMetadataNode),
  'storyboard-grid': withNodeResizer(StoryboardGridNode),
};

interface SelectedSkillTemplate {
  template: PromptTemplate;
  sceneName?: string;
  scenePrompt?: string;
  requestId: number;
}

interface CanvasInnerProps {
  onAddNodeRef?: React.MutableRefObject<((type: string, position?: { x: number; y: number }) => void) | null>;
  selectedSkillTemplate?: SelectedSkillTemplate | null;
}

function buildSkillRequirementText(selection: SelectedSkillTemplate) {
  const scenePrompt = selection.scenePrompt?.trim();
  if (scenePrompt) {
    return `场景名称：${selection.sceneName || '未命名场景'}

本次需求：
${scenePrompt}

可继续补充：产品名、颜色材质、人物动作、产品露出比例、硬性展示要求、文案空间。`;
  }

  return `产品名：
产品颜色/材质/形状：
使用场景：
目标人群/人物设定：
人物动作：
产品位置和露出比例：
硬性展示要求：
画幅和文案空间：竖版4:5，保留电商文案空间`;
}

function buildSkillSystemPrompt(template: PromptTemplate) {
  return `你是电商商业摄影提示词总监，负责把用户需求和 Skill 模板合成为一条可直接用于图像生成的中文 prompt。

工作规则：
1. 必须继承 Skill 的风格、画面、灯光、产品展示和质量要求。
2. 必须补齐所有方括号占位符，最终输出里不能保留 []、例如、待补充、空白字段。
3. 如果用户需求缺失，请基于高端电商生活方式主视觉主动合理补全，不能把缺失字段原样留给生图模型。
4. 产品必须清晰可读，人物、环境、灯光都服务于产品展示。
5. 只输出最终完整生图 prompt，不输出解释、标题、步骤或 Markdown。

Skill 名称：
${template.styleName}

Skill 模板：
${template.prompt}

负面约束：
${template.negativePrompt || '无'}`;
}

function buildSkillLLMUserPrompt(selection: SelectedSkillTemplate, requirementText: string) {
  return `当前选中的 Skill：${selection.template.styleName}

请根据下面“本次需求”补齐当前 Skill 模板，生成一条完整、没有空槽位、可以直接交给图像生成节点使用的中文提示词。

本次需求：
${requirementText}`;
}

function CanvasInner({ onAddNodeRef, selectedSkillTemplate }: CanvasInnerProps) {
  const { fitView, screenToFlowPosition, setViewport, zoomIn, zoomOut } = useReactFlow();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  const nodesRef = useRef<Node[]>([]);
  const edgesRef = useRef<Edge[]>([]);
  const undoStackRef = useRef<CanvasSnapshot[]>([]);
  useEffect(() => { nodesRef.current = nodes; }, [nodes]);
  useEffect(() => { edgesRef.current = edges; }, [edges]);

  const pushHistory = useCallback(() => {
    undoStackRef.current.push({
      nodes: nodesRef.current.map(cloneNodeForHistory),
      edges: edgesRef.current.map(cloneEdgeForHistory),
    });
    if (undoStackRef.current.length > 80) {
      undoStackRef.current.shift();
    }
  }, []);

  const undoCanvas = useCallback(() => {
    const snapshot = undoStackRef.current.pop();
    if (!snapshot) return;
    setNodes(snapshot.nodes.map(cloneNodeForHistory));
    setEdges(snapshot.edges.map(cloneEdgeForHistory));
    setSelectedIds([]);
  }, []);

  // 当 Skill 模板被应用时，创建“需求 -> LLM补全 -> 生图”的工作流。
  useEffect(() => {
    if (!selectedSkillTemplate) return;

    const { template, requestId } = selectedSkillTemplate;
    const requirementText = buildSkillRequirementText(selectedSkillTemplate);
    const requirementId = `skill_requirement_${requestId}`;
    const llmId = `skill_llm_${requestId}`;
    const imageId = `skill_image_${requestId}`;

    pushHistory();
    setNodes((nds) => [
      ...nds,
      {
        id: requirementId,
        type: 'text',
        position: { x: 100, y: 100 },
        data: {
          label: '本次需求',
          prompt: requirementText,
          nodeWidth: 300,
          nodeHeight: 220,
          skillTemplateId: template.id,
          skillTemplateName: template.styleName,
        },
      },
      {
        id: llmId,
        type: 'llm',
        position: { x: 470, y: 120 },
        data: {
          label: 'Skill 补全',
          model: 'gpt-5.4',
          systemPrompt: buildSkillSystemPrompt(template),
          prompt: buildSkillLLMUserPrompt(selectedSkillTemplate, requirementText),
          nodeWidth: 320,
          nodeHeight: 460,
          status: 'idle',
          skillTemplateId: template.id,
          skillTemplateName: template.styleName,
        },
      },
      {
        id: imageId,
        type: 'image',
        position: { x: 800, y: 120 },
        data: {
          label: '图像生成',
          model: 'gpt-image-2',
          size: '1024x1536',
          prompt: '',
          nodeWidth: 300,
          nodeHeight: 460,
          status: 'idle',
          skillTemplateId: template.id,
          skillTemplateName: template.styleName,
        },
      },
    ]);
    setEdges((eds) => [
      ...eds,
      {
        id: `${requirementId}-${llmId}`,
        source: requirementId,
        sourceHandle: 'text-out',
        target: llmId,
        animated: true,
      },
      {
        id: `${llmId}-${imageId}`,
        source: llmId,
        sourceHandle: 'llm-out',
        target: imageId,
        targetHandle: 'image-in',
        animated: true,
      },
    ]);
  }, [pushHistory, selectedSkillTemplate]);

  // 节点变化
  const onNodesChange = useCallback((changes: NodeChange[]) => {
    if (changes.some((change) => change.type === 'remove')) {
      pushHistory();
    }
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, [pushHistory]);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    if (changes.some((change) => change.type === 'remove')) {
      pushHistory();
    }
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, [pushHistory]);

  const onConnect = useCallback((connection: Connection) => {
    pushHistory();
    setEdges((eds) => addEdge({ ...connection, animated: true }, eds));
  }, [pushHistory]);

  const isValidConnection = useCallback((connection: Connection) => {
    const source = nodesRef.current.find((n) => n.id === connection.source);
    const target = nodesRef.current.find((n) => n.id === connection.target);
    return isConnectionValid(source, target);
  }, []);

  // 添加节点
  const addNode = useCallback((type: string, position?: { x: number; y: number }) => {
    pushHistory();
    const id = `${type}_${Date.now()}`;
    const pos = position || { x: Math.random() * 300 + 50, y: Math.random() * 200 + 50 };
    const newNode: Node = {
      id,
      type,
      position: pos,
      data: { label: type, status: 'idle' },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [pushHistory]);

  useEffect(() => {
    if (onAddNodeRef) onAddNodeRef.current = addNode;
  }, [addNode, onAddNodeRef]);

  const addNodeFromSidebar = useCallback(
    (type: string, clientPosition?: { x: number; y: number }) => {
      addNode(type, clientPosition ? screenToFlowPosition(clientPosition) : undefined);
    },
    [addNode, screenToFlowPosition]
  );

  // 选中变化
  const onSelectionChange = useCallback(({ nodes: selectedNodes }: { nodes: Node[] }) => {
    setSelectedIds(selectedNodes.map((n) => n.id));
  }, []);

  // 删除选中
  const deleteSelected = useCallback(() => {
    if (selectedIds.length === 0) return;
    pushHistory();
    setNodes((nds) => nds.filter((n) => !selectedIds.includes(n.id)));
    setEdges((eds) => eds.filter((e) => !selectedIds.includes(e.source) && !selectedIds.includes(e.target)));
    setSelectedIds([]);
  }, [pushHistory, selectedIds]);

  // 复制选中
  const duplicateSelected = useCallback(() => {
    const toCopy = nodes.filter((n) => selectedIds.includes(n.id));
    if (toCopy.length === 0) return;
    pushHistory();
    const newNodes = toCopy.map((n) => ({
      ...n,
      id: `${n.type}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      position: { x: n.position.x + 40, y: n.position.y + 40 },
      selected: false,
    }));
    setNodes((nds) => [...nds, ...newNodes]);
    setSelectedIds(newNodes.map((n) => n.id));
  }, [nodes, pushHistory, selectedIds]);

  const showContextMenu = useCallback((e: React.MouseEvent | MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY });
  }, []);

  const runContextAction = useCallback((action: () => void | Promise<unknown>) => {
    setContextMenu(null);
    void action();
  }, []);

  useEffect(() => {
    if (!contextMenu) return;

    const close = () => setContextMenu(null);
    window.addEventListener('pointerdown', close);
    window.addEventListener('keydown', close);
    return () => {
      window.removeEventListener('pointerdown', close);
      window.removeEventListener('keydown', close);
    };
  }, [contextMenu]);

  // 快捷键
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const fromInteractiveInput = isInteractiveNodeTarget(e.target);
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !fromInteractiveInput) {
        e.preventDefault();
        undoCanvas();
        return;
      }
      if (fromInteractiveInput) return;
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedIds.length > 0) {
        e.preventDefault();
        deleteSelected();
      }
      if (e.key === 'd' && (e.ctrlKey || e.metaKey) && selectedIds.length > 0) {
        e.preventDefault();
        duplicateSelected();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedIds, deleteSelected, duplicateSelected, undoCanvas]);

  // 文件拖拽上传
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // 处理从侧边栏拖拽的节点
      const nodeType = e.dataTransfer.getData('application/reactflow');
      const registryNode = NODE_REGISTRY.find((n) => n.type === nodeType);
      if (nodeType && registryNode) {
        e.stopPropagation();
        const pos = screenToFlowPosition({ x: e.clientX, y: e.clientY });
        const id = `${nodeType}_${Date.now()}`;
        pushHistory();
        setNodes((nds) => [
          ...nds,
          {
            id,
            type: nodeType,
            position: pos,
            data: { label: registryNode.label },
          },
        ]);
        return;
      }

      // 处理文件拖拽上传
      const files = e.dataTransfer.files;
      if (files.length === 0) return;
      pushHistory();
      const pos = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = URL.createObjectURL(file);
        const id = `upload_${Date.now()}_${i}`;
        const uploadType = file.type.startsWith('image/')
          ? 'image'
          : file.type.startsWith('video/')
            ? 'video'
            : file.type.startsWith('audio/')
              ? 'audio'
              : 'image';
        setNodes((nds) => [
          ...nds,
          {
            id,
            type: 'upload',
            position: { x: pos.x + i * 20, y: pos.y + i * 20 },
            data: { label: file.name, imageUrl: uploadType === 'image' ? url : undefined, videoUrl: uploadType === 'video' ? url : undefined, audioUrl: uploadType === 'audio' ? url : undefined, uploadType },
          },
        ]);
      }
    },
    [pushHistory, screenToFlowPosition]
  );

  return (
    <div className="flex h-full w-full relative">
      {/* 左侧节点侧边栏 */}
      <CanvasSidebar onAddNode={addNodeFromSidebar} />

      {/* 画布区域 */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          isValidConnection={isValidConnection as IsValidConnection<Edge>}
          onSelectionChange={onSelectionChange}
          nodeTypes={NODE_TYPES}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onPaneContextMenu={showContextMenu}
          onNodeContextMenu={showContextMenu}
          fitView
          deleteKeyCode={null}
          panOnDrag={[1]}
          selectionOnDrag
          selectionMode={SelectionMode.Partial}
          proOptions={{ hideAttribution: true }}
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#E6DCCB" />
          <Controls className="!bg-card !border-border !text-foreground !shadow-sm" />
          <MiniMap
            className="!bg-card/80 !border-border"
            nodeColor={() => '#8B6FF6'}
            maskColor="rgba(36, 34, 31, 0.1)"
          />
        </ReactFlow>

        {/* 节点操作栏（选中时显示） */}
        {selectedIds.length > 0 && (
          <NodeActionBar
            selectedCount={selectedIds.length}
            onDelete={deleteSelected}
            onDuplicate={duplicateSelected}
          />
        )}

        {contextMenu && (
          <div
            className="fixed z-50 w-56 overflow-hidden rounded-xl border border-border bg-card/95 py-1 text-sm text-foreground shadow-xl backdrop-blur-sm"
            style={{ left: contextMenu.x, top: contextMenu.y }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              disabled
              className="flex w-full items-center justify-between px-3 py-2 text-left text-muted-foreground/60"
            >
              <span>粘贴</span>
              <span className="text-xs">Ctrl+V</span>
            </button>
            <button
              type="button"
              onClick={() => runContextAction(() => zoomIn())}
              className="flex w-full items-center justify-between px-3 py-2 text-left hover:bg-muted"
            >
              <span>放大</span>
              <span className="text-xs text-muted-foreground">Ctrl++</span>
            </button>
            <button
              type="button"
              onClick={() => runContextAction(() => zoomOut())}
              className="flex w-full items-center justify-between px-3 py-2 text-left hover:bg-muted"
            >
              <span>缩小</span>
              <span className="text-xs text-muted-foreground">Ctrl+-</span>
            </button>
            <button
              type="button"
              onClick={() => runContextAction(() => fitView({ padding: 0.2 }))}
              className="flex w-full items-center justify-between px-3 py-2 text-left hover:bg-muted"
            >
              <span>显示画面所有元素</span>
              <span className="text-xs text-muted-foreground">Shift+1</span>
            </button>
            <button
              type="button"
              onClick={() => runContextAction(() => setViewport({ x: 0, y: 0, zoom: 1 }))}
              className="flex w-full items-center justify-between px-3 py-2 text-left hover:bg-muted"
            >
              <span>缩放至100%</span>
              <span className="text-xs text-muted-foreground">Ctrl+0</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default function Canvas(props: CanvasInnerProps) {
  return (
    <ReactFlowProvider>
      <CanvasInner {...props} />
    </ReactFlowProvider>
  );
}
