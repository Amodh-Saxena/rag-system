/**
 * API adapter — routes requests through either the real FastAPI backend
 * or the mock API based on the runtime ApiStore setting.
 *
 * All real API responses are normalised through adapter functions so the
 * UI never needs to know whether data came from mock or live.
 */

import { mockApi } from './mockApi';
import { apiStore } from './apiStore';
import type {
  QueryResult,
  GraphNodeData,
  GraphEdgeData,
  TimelineEvent,
  NodeDetail,
  ProvenanceSource,
  TraceStep,
  Citation,
} from './types';

// ─── Response Adapters ────────────────────────────────────────────────────────
// Normalise real API shapes → our internal types.
// If the real API already matches, adapters are identity functions.

function adaptQueryResult(raw: Record<string, unknown>, query: string): QueryResult {
  // Support both flat and nested provenance shapes
  const rawProv = (raw.provenance ?? {}) as Record<string, unknown[]>;
  const provenance: ProvenanceSource[] = [];

  for (const [type, items] of Object.entries(rawProv)) {
    if (!Array.isArray(items)) continue;
    provenance.push({
      type: type as 'episodic' | 'semantic' | 'temporal',
      count: items.length,
      label: `${items.length} ${items.length === 1 ? 'source' : 'sources'}`,
      items: (items as Record<string, unknown>[]).map((it) => ({
        id: String(it.id ?? it.node_id ?? ''),
        label: String(it.label ?? it.title ?? it.id ?? ''),
        detail: it.detail ? String(it.detail) : undefined,
      })),
    });
  }

  const citations: Citation[] = ((raw.citations ?? []) as Record<string, unknown>[]).map(
    (c) => ({
      id: String(c.id ?? c.hash ?? ''),
      label: String(c.label ?? c.id ?? ''),
      nodeId: String(c.node_id ?? c.nodeId ?? c.id ?? ''),
      type: (c.type ?? 'episodic') as 'episodic' | 'semantic' | 'temporal',
    }),
  );

  const trace: TraceStep[] = ((raw.trace ?? []) as Record<string, unknown>[]).map((s) => ({
    id: String(s.id ?? s.step ?? Math.random()),
    label: String(s.label ?? s.step ?? s.name ?? ''),
    memoryType: (s.memoryType ?? s.memory_type ?? undefined) as
      | 'episodic'
      | 'semantic'
      | 'temporal'
      | undefined,
    detail: s.detail ? String(s.detail) : undefined,
  }));

  return {
    query,
    answer: String(raw.answer ?? raw.response ?? ''),
    confidence: Number(raw.confidence ?? 0.8),
    citations,
    provenance,
    trace,
  };
}

function adaptGraphData(raw: Record<string, unknown>): {
  nodes: GraphNodeData[];
  edges: GraphEdgeData[];
} {
  const rawNodes = (raw.nodes ?? raw.vertices ?? []) as Record<string, unknown>[];
  const rawEdges = (raw.edges ?? raw.relationships ?? []) as Record<string, unknown>[];

  const nodes: GraphNodeData[] = rawNodes.map((n) => ({
    id: String(n.id ?? n.node_id ?? ''),
    label: String(n.label ?? n.name ?? n.id ?? ''),
    type: String(n.type ?? n.node_type ?? 'file') as GraphNodeData['type'],
    memoryType: (n.memoryType ?? n.memory_type ?? undefined) as 'episodic' | 'semantic' | 'temporal' | undefined,
    description: n.description ? String(n.description) : undefined,
    path: n.path ? String(n.path) : undefined,
    metadata: (n.metadata ?? n.properties ?? undefined) as Record<string, string> | undefined,
  }));

  const edges: GraphEdgeData[] = rawEdges.map((e, i) => ({
    id: String(e.id ?? `e${i}`),
    source: String(e.source ?? e.from ?? e.source_id ?? ''),
    target: String(e.target ?? e.to ?? e.target_id ?? ''),
    label: String(e.label ?? e.relationship ?? e.type ?? ''),
    type: (e.type ?? undefined) as GraphEdgeData['type'],
  }));

  return { nodes, edges };
}

function adaptTimeline(raw: unknown[]): TimelineEvent[] {
  return raw.map((ev) => {
    const e = ev as Record<string, unknown>;
    return {
      id: String(e.id ?? Math.random()),
      date: String(e.date ?? e.display_date ?? ''),
      isoDate: String(e.isoDate ?? e.iso_date ?? e.date ?? ''),
      title: String(e.title ?? e.summary ?? ''),
      commit: String(e.commit ?? e.commit_hash ?? ''),
      commitMessage: String(e.commitMessage ?? e.commit_message ?? e.message ?? ''),
      memoryType: (e.memoryType ?? e.memory_type ?? 'episodic') as 'episodic' | 'semantic' | 'temporal',
      filesAffected: (e.filesAffected ?? e.files_affected ?? []) as string[],
      reason: String(e.reason ?? e.why ?? ''),
      detail: String(e.detail ?? e.description ?? ''),
    };
  });
}

// ─── Core fetch helper ────────────────────────────────────────────────────────

async function apiFetch(path: string, options?: RequestInit): Promise<Response> {
  const { url } = apiStore.get();
  const res = await fetch(`${url}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
    signal: options?.signal ?? AbortSignal.timeout(15000),
  });
  return res;
}

// ─── isUsingMock (backwards-compat export) ────────────────────────────────────

export function isUsingMock(): boolean {
  return apiStore.isMock();
}

// ─── Query ────────────────────────────────────────────────────────────────────

export async function queryMemory(
  query: string,
  onStage: (stage: string) => void,
): Promise<QueryResult> {
  if (apiStore.isMock()) {
    return mockApi.query(query, onStage);
  }

  const { repositoryId } = apiStore.get();

  onStage('Connecting to memory core...');

  let res: Response;
  try {
    res = await apiFetch('/query', {
      method: 'POST',
      body: JSON.stringify({ query, repository_id: repositoryId }),
    });
  } catch (err) {
    throw new Error(`MEMORY CORE UNAVAILABLE — could not reach backend. ${String(err)}`);
  }

  onStage('Processing memory trace...');

  if (!res.ok) {
    const errText = await res.text().catch(() => res.statusText);
    throw new Error(`RETRIEVAL INTERRUPTED — ${res.status}: ${errText}`);
  }

  const raw = (await res.json()) as Record<string, unknown>;
  onStage('Resolving evidence...');
  return adaptQueryResult(raw, query);
}

// ─── Graph ────────────────────────────────────────────────────────────────────

export async function getGraph(
  onStage: (stage: string) => void,
): Promise<{ nodes: GraphNodeData[]; edges: GraphEdgeData[] }> {
  if (apiStore.isMock()) return mockApi.getGraph(onStage);

  const { repositoryId } = apiStore.get();
  onStage('Loading semantic structure...');

  let res: Response;
  try {
    res = await apiFetch(`/graph/${encodeURIComponent(repositoryId)}`);
  } catch {
    throw new Error('Could not reach memory graph endpoint.');
  }

  onStage('Resolving relationships...');
  if (!res.ok) throw new Error(`Graph fetch failed: ${res.status}`);

  const raw = (await res.json()) as Record<string, unknown>;
  return adaptGraphData(raw);
}

// ─── Timeline ─────────────────────────────────────────────────────────────────

export async function getTimeline(): Promise<TimelineEvent[]> {
  if (apiStore.isMock()) return mockApi.getTimeline();

  const { repositoryId } = apiStore.get();

  let res: Response;
  try {
    res = await apiFetch(`/timeline/${encodeURIComponent(repositoryId)}`);
  } catch {
    throw new Error('Could not reach timeline endpoint.');
  }

  if (!res.ok) throw new Error(`Timeline fetch failed: ${res.status}`);
  const raw = (await res.json()) as unknown[];
  return adaptTimeline(raw);
}

// ─── Node Detail ──────────────────────────────────────────────────────────────

export async function getNodeDetail(nodeId: string): Promise<NodeDetail | null> {
  if (apiStore.isMock()) return mockApi.getNodeDetail(nodeId);

  let res: Response;
  try {
    res = await apiFetch(`/node/${encodeURIComponent(nodeId)}`);
  } catch {
    return null;
  }

  if (!res.ok) return null;
  return res.json() as Promise<NodeDetail>;
}

// ─── Ingest ───────────────────────────────────────────────────────────────────

export async function ingestRepository(
  repoPath: string,
  onStage: (stage: string, done: boolean) => void,
): Promise<void> {
  if (apiStore.isMock()) return mockApi.ingest(repoPath, onStage);

  const { repositoryId } = apiStore.get();
  onStage('Connecting to memory core...', false);

  let res: Response;
  try {
    res = await apiFetch('/ingest', {
      method: 'POST',
      body: JSON.stringify({ path: repoPath, repository_id: repositoryId }),
    });
  } catch (err) {
    throw new Error(`INGESTION STOPPED — could not reach backend. ${String(err)}`);
  }

  if (!res.ok) {
    const txt = await res.text().catch(() => res.statusText);
    throw new Error(`INGESTION STOPPED — ${res.status}: ${txt}`);
  }

  onStage('Memory synchronized.', true);
}
