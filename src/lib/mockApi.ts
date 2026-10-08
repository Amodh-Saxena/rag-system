/**
 * Mock API adapter — simulates the FastAPI backend with realistic delays
 * and loading stages. Falls back automatically when real API is unavailable.
 */

import type { QueryResult, GraphNodeData, GraphEdgeData, TimelineEvent } from './types';
import {
  MOCK_QUERY_RESPONSES,
  DEFAULT_QUERY_RESPONSE,
  MOCK_NODES,
  MOCK_EDGES,
  MOCK_TIMELINE_EVENTS,
  MOCK_NODE_DETAILS,
} from './mockData';

// ─── Loading Stage Sequences ───────────────────────────────────────────────────

const QUERY_STAGES = [
  'Reading semantic memory...',
  'Tracing episodic history...',
  'Checking temporal state...',
  'Resolving evidence...',
  'Synthesizing answer...',
];

const GRAPH_STAGES = ['Loading semantic structure...', 'Resolving relationships...'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function matchQuery(query: string): QueryResult {
  const q = query.toLowerCase();
  if (q.includes('chromadb') || q.includes('qdrant') || q.includes('replaced') || q.includes('vector')) {
    return { ...MOCK_QUERY_RESPONSES.chromadb, query };
  }
  if (q.includes('retrieval') || q.includes('architecture') || q.includes('changed') || q.includes('evolv')) {
    return { ...MOCK_QUERY_RESPONSES.retrieval, query };
  }
  if (q.includes('reviewer') || q.includes('depend') || q.includes('uses')) {
    return { ...MOCK_QUERY_RESPONSES.reviewer, query };
  }
  return { ...DEFAULT_QUERY_RESPONSE, query };
}

// ─── Mock API ─────────────────────────────────────────────────────────────────

export const mockApi = {
  /**
   * Executes a memory query with staged loading progress.
   */
  async query(
    query: string,
    onStage: (stage: string) => void,
  ): Promise<QueryResult> {
    for (const stage of QUERY_STAGES) {
      onStage(stage);
      await delay(400 + Math.random() * 400);
    }
    await delay(200);
    return matchQuery(query);
  },

  /**
   * Loads the memory graph data.
   */
  async getGraph(
    onStage: (stage: string) => void,
  ): Promise<{ nodes: GraphNodeData[]; edges: GraphEdgeData[] }> {
    for (const stage of GRAPH_STAGES) {
      onStage(stage);
      await delay(400);
    }
    return { nodes: MOCK_NODES, edges: MOCK_EDGES };
  },

  /**
   * Loads timeline events.
   */
  async getTimeline(): Promise<TimelineEvent[]> {
    await delay(300);
    return MOCK_TIMELINE_EVENTS;
  },

  /**
   * Loads node detail.
   */
  async getNodeDetail(nodeId: string) {
    await delay(200);
    return MOCK_NODE_DETAILS[nodeId] ?? null;
  },

  /**
   * Simulates a repository ingest with progress stages.
   */
  async ingest(
    repoPath: string,
    onStage: (stage: string, done: boolean) => void,
  ): Promise<void> {
    const stages = [
      'Scanning repository...',
      'Extracting code structure...',
      'Building semantic memory...',
      'Recording episodic history...',
      'Consolidating memory...',
    ];
    for (let i = 0; i < stages.length; i++) {
      onStage(stages[i], false);
      await delay(700 + Math.random() * 500);
    }
    onStage('Memory synchronized.', true);
    void repoPath; // suppress unused warning
  },
};
