// ─── Memory Types ─────────────────────────────────────────────────────────────

export type MemoryType = 'episodic' | 'semantic' | 'temporal';

export type NodeType =
  | 'repository'
  | 'folder'
  | 'file'
  | 'function'
  | 'class'
  | 'agent'
  | 'database'
  | 'api'
  | 'dependency'
  | 'concept'
  | 'commit';

// ─── Query Types ──────────────────────────────────────────────────────────────

export interface Citation {
  id: string;
  label: string;
  nodeId: string;
  type: MemoryType;
}

export interface ProvenanceSource {
  type: MemoryType;
  count: number;
  label: string; // "3 sources" | "7 nodes" | "2 transitions"
  items: ProvenanceItem[];
}

export interface ProvenanceItem {
  id: string;
  label: string;
  detail?: string;
}

export interface TraceStep {
  id: string;
  label: string;
  memoryType?: MemoryType;
  detail?: string;
}

export interface QueryResult {
  query: string;
  answer: string; // markdown-ish text with [citationId] references
  citations: Citation[];
  provenance: ProvenanceSource[];
  trace: TraceStep[];
  confidence: number;
}

export type QueryState =
  | { status: 'idle' }
  | { status: 'loading'; stage: string }
  | { status: 'complete'; result: QueryResult }
  | { status: 'error'; message: string };

// ─── Graph Types ───────────────────────────────────────────────────────────────

export interface GraphNodeData {
  id: string;
  label: string;
  type: NodeType;
  memoryType?: MemoryType;
  description?: string;
  path?: string;
  metadata?: Record<string, string>;
}

export interface GraphEdgeData {
  id: string;
  source: string;
  target: string;
  label: string;
  type?: 'uses' | 'calls' | 'imports' | 'reads' | 'replaced' | 'records' | 'updates';
}

// ─── Timeline Types ───────────────────────────────────────────────────────────

export interface TimelineEvent {
  id: string;
  date: string; // "AUG 18"
  isoDate: string; // "2026-08-18"
  title: string;
  commit: string;
  commitMessage: string;
  memoryType: MemoryType;
  filesAffected: string[];
  reason: string;
  detail: string;
}

// ─── Node Detail Types ────────────────────────────────────────────────────────

export interface NodeDetail {
  id: string;
  type: NodeType;
  label: string;
  path?: string;
  description?: string;
  language?: string;
  functions?: string[];
  classes?: string[];
  dependsOn?: string[];
  dependents?: string[];
  recentChanges?: NodeChange[];
  relatedDecisions?: string[];
  evidence?: string[];
  firstSeen?: string;
  lastChanged?: string;
  confidence?: number;
  // Commit-specific
  hash?: string;
  author?: string;
  timestamp?: string;
  filesChanged?: string[];
}

export interface NodeChange {
  date: string;
  description: string;
  commit?: string;
}

// ─── Command Palette ──────────────────────────────────────────────────────────

export interface Command {
  id: string;
  label: string;
  description?: string;
  category: 'navigate' | 'search' | 'action' | 'view';
  icon?: string;
  action: () => void;
}
