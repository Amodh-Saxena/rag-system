import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  type Node as RFNode,
  type Edge as RFEdge,
  type NodeProps,
  Handle,
  Position,
  MarkerType,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { getGraph } from '../lib/api';
import { NodePanel } from '../components/NodePanel';
import type { GraphNodeData, GraphEdgeData, NodeType } from '../lib/types';

// ─── Filter Views ─────────────────────────────────────────────────────────────

type GraphFilter = 'all' | 'agents' | 'memory' | 'dataflow' | 'commits';

interface FilterDef {
  id: GraphFilter;
  label: string;
  desc: string;
  nodeTypes: NodeType[];
}

const FILTERS: FilterDef[] = [
  {
    id: 'all',
    label: 'All',
    desc: 'Full semantic graph',
    nodeTypes: ['repository', 'folder', 'file', 'function', 'class', 'agent', 'database', 'api', 'dependency', 'concept', 'commit'],
  },
  {
    id: 'agents',
    label: 'Agents',
    desc: 'Agent architecture & calls',
    nodeTypes: ['agent', 'concept', 'dependency'],
  },
  {
    id: 'memory',
    label: 'Memory',
    desc: 'Memory system nodes',
    nodeTypes: ['class', 'concept', 'commit'],
  },
  {
    id: 'dataflow',
    label: 'Data Flow',
    desc: 'Files, classes & databases',
    nodeTypes: ['file', 'class', 'database', 'api', 'dependency'],
  },
  {
    id: 'commits',
    label: 'Commits',
    desc: 'Episodic history graph',
    nodeTypes: ['commit', 'file', 'class'],
  },
];

// ─── Node type styles ─────────────────────────────────────────────────────────

const TYPE_STYLES: Record<NodeType, { shape: string; color: string; bg: string; size: string }> = {
  file:       { shape: 'rect',          color: '#4F6854', bg: 'rgba(79,104,84,0.08)',   size: 'normal' },
  function:   { shape: 'square',        color: '#2D6A73', bg: 'rgba(45,106,115,0.08)', size: 'small'  },
  class:      { shape: 'outlined-rect', color: '#2D6A73', bg: 'transparent',            size: 'normal' },
  commit:     { shape: 'diamond',       color: '#A84A32', bg: 'rgba(168,74,50,0.08)',  size: 'small'  },
  concept:    { shape: 'circle',        color: '#4F6854', bg: 'rgba(79,104,84,0.08)',  size: 'normal' },
  agent:      { shape: 'capsule',       color: '#2D6A73', bg: 'rgba(45,106,115,0.12)', size: 'large'  },
  database:   { shape: 'rect',          color: '#667078', bg: 'rgba(102,112,120,0.08)',size: 'normal' },
  api:        { shape: 'rect',          color: '#667078', bg: 'rgba(102,112,120,0.06)',size: 'normal' },
  dependency: { shape: 'square',        color: '#667078', bg: 'transparent',            size: 'small'  },
  repository: { shape: 'rect',          color: '#17202A', bg: 'rgba(23,32,42,0.05)',   size: 'large'  },
  folder:     { shape: 'rect',          color: '#667078', bg: 'transparent',            size: 'normal' },
};

// ─── Custom Node ──────────────────────────────────────────────────────────────

function MemoryNode({ data, selected }: NodeProps<RFNode>) {
  const nodeData = data as unknown as GraphNodeData & { dimmed?: boolean };
  const style = TYPE_STYLES[nodeData.type] ?? TYPE_STYLES.file;
  const isDimmed = nodeData.dimmed && !selected;

  const borderRadius =
    style.shape === 'circle'  ? '50%'   :
    style.shape === 'capsule' ? '999px' : '2px';

  const isAgent = nodeData.type === 'agent';
  const isDiamond = style.shape === 'diamond';

  return (
    <div style={{ opacity: isDimmed ? 0.12 : 1, transition: 'opacity 200ms' }}>
      <Handle type="target" position={Position.Top}    style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Left}   style={{ opacity: 0 }} />

      <div
        style={{
          background: selected ? `${style.color}20` : style.bg,
          border: `${selected ? 2 : 1}px solid ${selected ? style.color : style.color + '55'}`,
          borderRadius,
          transform: isDiamond ? 'rotate(45deg)' : 'none',
          minWidth:
            style.size === 'small' ? 52 :
            isAgent              ? 140 : 88,
          padding: isDiamond ? '6px 10px' : isAgent ? '7px 16px' : '5px 10px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: selected ? `0 0 0 3px ${style.color}30` : 'none',
          transition: 'all 150ms',
          position: 'relative',
        }}
      >
        {/* Type badge on agents */}
        {isAgent && (
          <span style={{
            fontSize: '8px',
            fontFamily: 'JetBrains Mono, monospace',
            color: style.color,
            opacity: 0.7,
            letterSpacing: '0.08em',
            marginBottom: 2,
          }}>
            AGENT
          </span>
        )}

        <span
          style={{
            transform: isDiamond ? 'rotate(-45deg)' : 'none',
            display: 'block',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: isAgent ? '11px' : '10px',
            fontWeight: isAgent ? 500 : 400,
            color: style.color,
            textAlign: 'center',
            whiteSpace: 'nowrap',
            maxWidth: isAgent ? 130 : 100,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {isDiamond ? nodeData.label.replace('commit ', '') : nodeData.label}
        </span>

        {/* Path hint for files */}
        {nodeData.path && !isAgent && !isDiamond && (
          <span style={{
            fontSize: '8px',
            fontFamily: 'JetBrains Mono, monospace',
            color: style.color,
            opacity: 0.5,
            marginTop: 1,
            maxWidth: 100,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'block',
            textAlign: 'center',
          }}>
            {nodeData.path.split('/').pop()}
          </span>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right}  style={{ opacity: 0 }} />
    </div>
  );
}

const nodeTypes = { memoryNode: MemoryNode };

// ─── Layout engine ────────────────────────────────────────────────────────────

function computeLayout(
  nodes: GraphNodeData[],
  filter: GraphFilter,
): Record<string, { x: number; y: number }> {
  const positions: Record<string, { x: number; y: number }> = {};

  if (filter === 'agents') {
    // Agents in a row at top, their dependencies below
    const agents = nodes.filter((n) => n.type === 'agent');
    const others = nodes.filter((n) => n.type !== 'agent');

    agents.forEach((n, i) => {
      positions[n.id] = { x: 160 + i * 200, y: 80 };
    });
    others.forEach((n, i) => {
      positions[n.id] = { x: 160 + (i % 4) * 180, y: 280 + Math.floor(i / 4) * 110 };
    });
    return positions;
  }

  if (filter === 'commits') {
    const commits = nodes.filter((n) => n.type === 'commit');
    const files   = nodes.filter((n) => n.type !== 'commit');

    commits.forEach((n, i) => {
      positions[n.id] = { x: 120 + i * 180, y: 60 };
    });
    files.forEach((n, i) => {
      positions[n.id] = { x: 100 + (i % 5) * 170, y: 230 + Math.floor(i / 5) * 100 };
    });
    return positions;
  }

  // Default: column groups
  const groups: Record<string, GraphNodeData[]> = {};
  for (const n of nodes) {
    const g =
      n.type === 'agent'                        ? 'agents'   :
      n.type === 'class' || n.type === 'file'   ? 'files'    :
      n.type === 'commit'                        ? 'commits'  :
      n.type === 'database' || n.type === 'dependency' ? 'deps' :
      n.type === 'concept'                       ? 'concepts' : 'other';
    (groups[g] ??= []).push(n);
  }

  const cols = [
    { key: 'agents',   x: 80  },
    { key: 'files',    x: 320 },
    { key: 'deps',     x: 580 },
    { key: 'commits',  x: 840 },
    { key: 'concepts', x: 200 },
    { key: 'other',    x: 460 },
  ];

  for (const { key, x } of cols) {
    (groups[key] ?? []).forEach((n, i) => {
      positions[n.id] = { x, y: 60 + i * 110 };
    });
  }

  return positions;
}

// ─── Agent roster panel ───────────────────────────────────────────────────────

const AGENT_ROLES: Record<string, { role: string; color: string; calls: string[]; memory: string[] }> = {
  'research-agent': {
    role: 'Orchestrates research tasks using LangGraph',
    color: '#2D6A73',
    calls: ['LiteratureAgent', 'HypothesisAgent'],
    memory: ['EpisodicMemory', 'SemanticMemory'],
  },
  'literature-agent': {
    role: 'Retrieves & summarises academic literature',
    color: '#2D6A73',
    calls: ['HybridRetriever'],
    memory: ['SemanticMemory'],
  },
  'hypothesis-agent': {
    role: 'Generates & validates research hypotheses',
    color: '#2D6A73',
    calls: [],
    memory: ['SemanticMemory'],
  },
  'reviewer-agent': {
    role: 'Reviews & critiques agent outputs',
    color: '#2D6A73',
    calls: [],
    memory: ['EpisodicMemory', 'ResearchState'],
  },
};

function AgentRoster({
  agents,
  onFocus,
  selectedId,
}: {
  agents: GraphNodeData[];
  onFocus: (id: string) => void;
  selectedId: string | null;
}) {
  return (
    <div className="w-52 border-r border-border-color bg-bg-color flex flex-col shrink-0 overflow-y-auto">
      <div className="px-4 py-3 border-b border-border-color">
        <div className="text-[10px] font-code text-muted-color uppercase tracking-widest">
          Agent Roster
        </div>
        <div className="text-xs text-muted-color mt-0.5">
          {agents.length} agents in system
        </div>
      </div>

      <div className="flex flex-col divide-y divide-border-color">
        {agents.map((agent) => {
          const info = AGENT_ROLES[agent.id];
          const isSelected = selectedId === agent.id;

          return (
            <button
              key={agent.id}
              onClick={() => onFocus(agent.id)}
              className={`w-full text-left px-4 py-3 transition-colors ${
                isSelected ? 'bg-[#2D6A73]/8' : 'hover:bg-black/3 dark:hover:bg-white/3'
              }`}
              aria-pressed={isSelected}
            >
              <div className="flex items-start gap-2">
                {/* Active indicator */}
                <div className={`w-1 h-1 rounded-full mt-1.5 shrink-0 ${isSelected ? 'bg-[#2D6A73]' : 'bg-border-color'}`} />
                <div className="min-w-0">
                  <div className={`text-xs font-code font-medium ${isSelected ? 'text-[#2D6A73]' : 'text-text-color'}`}>
                    {agent.label}
                  </div>
                  {info && (
                    <div className="text-[10px] text-muted-color leading-relaxed mt-0.5">
                      {info.role}
                    </div>
                  )}
                  {info?.calls && info.calls.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {info.calls.map((c) => (
                        <span key={c} className="text-[9px] font-code text-[#2D6A73] border border-[#2D6A73]/30 px-1 py-0.5">
                          → {c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* What agents do */}
      <div className="px-4 py-4 mt-auto border-t border-border-color">
        <div className="text-[10px] font-code text-muted-color uppercase tracking-widest mb-2">
          What Agents Do
        </div>
        <div className="text-[10px] text-muted-color leading-relaxed space-y-1">
          <div>• Orchestrate research tasks</div>
          <div>• Write to episodic memory</div>
          <div>• Query semantic memory</div>
          <div>• Form & validate hypotheses</div>
        </div>
      </div>
    </div>
  );
}

// ─── GraphView ────────────────────────────────────────────────────────────────

export function GraphView() {
  const [nodes, setNodes] = useNodesState<RFNode>([]);
  const [edges, setEdges] = useEdgesState<RFEdge>([]);
  const [loading, setLoading] = useState(true);
  const [loadStage, setLoadStage] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [rawNodes, setRawNodes] = useState<GraphNodeData[]>([]);
  const [rawEdges, setRawEdges] = useState<GraphEdgeData[]>([]);
  const [activeFilter, setActiveFilter] = useState<GraphFilter>('all');

  // Derived
  const agentNodes = useMemo(
    () => rawNodes.filter((n) => n.type === 'agent'),
    [rawNodes],
  );

  // Load graph data
  useEffect(() => {
    getGraph((stage) => setLoadStage(stage)).then(({ nodes: gn, edges: ge }) => {
      setRawNodes(gn);
      setRawEdges(ge);
      setLoading(false);
    });
  }, []);

  // Rebuild flow nodes/edges when filter changes
  useEffect(() => {
    if (!rawNodes.length) return;

    const filterDef = FILTERS.find((f) => f.id === activeFilter)!;
    const visibleNodeIds = new Set(
      rawNodes
        .filter((n) => filterDef.nodeTypes.includes(n.type))
        .map((n) => n.id),
    );

    const visibleNodes = rawNodes.filter((n) => visibleNodeIds.has(n.id));
    const positions = computeLayout(visibleNodes, activeFilter);

    const flowNodes: RFNode[] = visibleNodes.map((n) => ({
      id: n.id,
      type: 'memoryNode',
      position: positions[n.id] ?? { x: 200, y: 200 },
      data: { ...n },
    }));

    const flowEdges: RFEdge[] = rawEdges
      .filter((e) => visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target))
      .map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        label: e.label,
        type: 'smoothstep',
        animated: false,
        style: { stroke: '#667078', strokeWidth: 1, opacity: 0.5 },
        labelStyle: { fontFamily: 'JetBrains Mono,monospace', fontSize: 9, fill: '#667078' },
        markerEnd: { type: MarkerType.ArrowClosed, width: 8, height: 8, color: '#667078' },
      }));

    setNodes(flowNodes);
    setEdges(flowEdges);
    setSelectedNodeId(null);
  }, [rawNodes, rawEdges, activeFilter]);

  // When a node is selected, dim unrelated nodes/edges
  useEffect(() => {
    if (!selectedNodeId) {
      setNodes((nds) => nds.map((n) => ({ ...n, data: { ...n.data, dimmed: false } })));
      setEdges((eds) => eds.map((e) => ({
        ...e,
        style: { stroke: '#667078', strokeWidth: 1, opacity: 0.5 },
        animated: false,
      })));
      return;
    }

    const connectedIds = new Set<string>([selectedNodeId]);
    edges.forEach((e) => {
      if (e.source === selectedNodeId) connectedIds.add(e.target);
      if (e.target === selectedNodeId) connectedIds.add(e.source);
    });

    setNodes((nds) =>
      nds.map((n) => ({ ...n, data: { ...n.data, dimmed: !connectedIds.has(n.id) } })),
    );
    setEdges((eds) =>
      eds.map((e) => {
        const hit = e.source === selectedNodeId || e.target === selectedNodeId;
        return {
          ...e,
          style: {
            stroke: hit ? '#A84A32' : '#667078',
            strokeWidth: hit ? 2 : 1,
            opacity: hit ? 0.9 : 0.08,
          },
          animated: hit,
        };
      }),
    );
  }, [selectedNodeId, edges.length]);

  // Search filter
  const filteredNodeIds = useMemo(() => {
    if (!searchTerm.trim()) return null;
    const term = searchTerm.toLowerCase();
    return new Set(
      rawNodes
        .filter((n) => n.label.toLowerCase().includes(term) || n.path?.toLowerCase().includes(term))
        .map((n) => n.id),
    );
  }, [searchTerm, rawNodes]);

  useEffect(() => {
    if (!filteredNodeIds) {
      setNodes((nds) => nds.map((n) => ({ ...n, data: { ...n.data, dimmed: false } })));
      return;
    }
    setNodes((nds) =>
      nds.map((n) => ({ ...n, data: { ...n.data, dimmed: !filteredNodeIds.has(n.id) } })),
    );
  }, [filteredNodeIds]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: RFNode) => {
    setSelectedNodeId((prev) => (prev === node.id ? null : node.id));
  }, []);

  const onPaneClick = useCallback(() => setSelectedNodeId(null), []);

  const handleAgentFocus = useCallback((agentId: string) => {
    setActiveFilter('agents');
    setSelectedNodeId(agentId);
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <div className="text-xs font-code text-muted-color animate-pulse">{loadStage}</div>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-[#2D6A73] animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>
    );
  }

  const currentFilterDef = FILTERS.find((f) => f.id === activeFilter)!;

  return (
    <div className="flex h-full">
      {/* Agent Roster */}
      <AgentRoster
        agents={agentNodes}
        onFocus={handleAgentFocus}
        selectedId={selectedNodeId}
      />

      {/* Graph canvas */}
      <div className="flex-1 flex flex-col relative">

        {/* Filter tabs + search bar */}
        <div className="border-b border-border-color px-4 flex items-center gap-0 shrink-0">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-3 py-2.5 text-xs font-code transition-colors border-b-2 -mb-px ${
                activeFilter === f.id
                  ? 'border-[#2D6A73] text-text-color'
                  : 'border-transparent text-muted-color hover:text-text-color'
              }`}
              aria-pressed={activeFilter === f.id}
              title={f.desc}
            >
              {f.label}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-2">
            {/* Filter description */}
            <span className="text-[10px] font-code text-muted-color hidden lg:block">
              {currentFilterDef.desc}
            </span>

            {/* Search */}
            <div className="flex items-center gap-2 border border-border-color px-3 py-1.5">
              <span className="text-muted-color text-xs">⌕</span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search nodes..."
                className="bg-transparent border-none outline-none text-xs font-code text-text-color placeholder:text-muted-color/50 w-28"
                aria-label="Search graph nodes"
              />
            </div>

            {selectedNodeId && (
              <button
                onClick={() => setSelectedNodeId(null)}
                className="px-2 py-1.5 text-xs font-code text-muted-color hover:text-text-color transition-colors border border-border-color"
                aria-label="Clear selection"
              >
                ✕ Clear
              </button>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-10 bg-bg-color/90 border border-border-color px-3 py-2 flex gap-4">
          {[
            { label: 'Agent', color: '#2D6A73', shape: 'capsule' },
            { label: 'Class/File', color: '#4F6854', shape: 'rect' },
            { label: 'Commit', color: '#A84A32', shape: 'diamond' },
            { label: 'Database', color: '#667078', shape: 'rect' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div
                className="w-2.5 h-2"
                style={{
                  background: item.color + '25',
                  border: `1px solid ${item.color}80`,
                  borderRadius: item.shape === 'capsule' ? 4 : 0,
                  transform: item.shape === 'diamond' ? 'rotate(45deg)' : 'none',
                }}
              />
              <span className="text-xs font-code text-muted-color">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Node count */}
        <div className="absolute bottom-4 right-4 z-10 text-[10px] font-code text-muted-color">
          {nodes.length} nodes · {edges.length} edges
        </div>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          onNodesChange={(changes) => setNodes((nds) => applyNodeChanges(changes, nds))}
          onEdgesChange={(changes) => setEdges((eds) => applyEdgeChanges(changes, eds))}
          fitView
          fitViewOptions={{ padding: 0.25 }}
          minZoom={0.2}
          maxZoom={4}
          proOptions={{ hideAttribution: true }}
          style={{ background: 'transparent', flex: 1 }}
        >
          <Background color="#66707820" gap={28} size={0.7} />
          <Controls
            style={{
              background: 'var(--bg-color)',
              border: '1px solid var(--border-color)',
              borderRadius: 0,
            }}
          />
        </ReactFlow>
      </div>

      {/* Node detail panel */}
      <NodePanel nodeId={selectedNodeId} onClose={() => setSelectedNodeId(null)} />
    </div>
  );
}
