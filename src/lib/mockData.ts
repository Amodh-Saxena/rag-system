/**
 * Mock data for the nexus-research repository.
 * This is a realistic fictional codebase used for demonstration.
 */

import type {
  GraphNodeData,
  GraphEdgeData,
  TimelineEvent,
  QueryResult,
  NodeDetail,
} from './types';

// ─── Mock Graph Nodes ─────────────────────────────────────────────────────────

export const MOCK_NODES: GraphNodeData[] = [
  // Agents
  {
    id: 'research-agent',
    label: 'ResearchAgent',
    type: 'agent',
    memoryType: 'semantic',
    path: 'agents/research.py',
    description: 'Orchestrates research tasks using LangGraph',
    metadata: { language: 'Python', lines: '284' },
  },
  {
    id: 'literature-agent',
    label: 'LiteratureAgent',
    type: 'agent',
    memoryType: 'semantic',
    path: 'agents/literature.py',
    description: 'Retrieves and summarizes academic literature',
    metadata: { language: 'Python', lines: '156' },
  },
  {
    id: 'hypothesis-agent',
    label: 'HypothesisAgent',
    type: 'agent',
    memoryType: 'semantic',
    path: 'agents/hypothesis.py',
    description: 'Generates and validates research hypotheses',
    metadata: { language: 'Python', lines: '201' },
  },
  {
    id: 'reviewer-agent',
    label: 'ReviewerAgent',
    type: 'agent',
    memoryType: 'semantic',
    path: 'agents/reviewer.py',
    description: 'Reviews and critiques agent outputs',
    metadata: { language: 'Python', lines: '178', added: 'Aug 18' },
  },
  // Memory
  {
    id: 'episodic-memory',
    label: 'EpisodicMemory',
    type: 'class',
    memoryType: 'episodic',
    path: 'memory/episodic.py',
    description: 'Records and retrieves episodic events (commits, decisions)',
    metadata: { language: 'Python', lines: '312' },
  },
  {
    id: 'semantic-memory',
    label: 'SemanticMemory',
    type: 'class',
    memoryType: 'semantic',
    path: 'memory/semantic.py',
    description: 'Stores structured facts and relationships',
    metadata: { language: 'Python', lines: '289' },
  },
  {
    id: 'consolidation',
    label: 'MemoryConsolidator',
    type: 'class',
    memoryType: 'episodic',
    path: 'memory/consolidation.py',
    description: 'Consolidates episodic memories into semantic facts',
    metadata: { language: 'Python', lines: '143' },
  },
  // Retrieval
  {
    id: 'hybrid-retriever',
    label: 'HybridRetriever',
    type: 'class',
    memoryType: 'semantic',
    path: 'retrieval/hybrid.py',
    description: 'Combines vector and graph retrieval strategies',
    metadata: { language: 'Python', lines: '221' },
  },
  {
    id: 'vector-store',
    label: 'QdrantVectorStore',
    type: 'class',
    memoryType: 'semantic',
    path: 'retrieval/vector_store.py',
    description: 'Vector retrieval implementation using Qdrant',
    metadata: { language: 'Python', lines: '167', changed: 'Aug 14' },
  },
  // Databases
  {
    id: 'qdrant',
    label: 'Qdrant',
    type: 'database',
    memoryType: 'semantic',
    description: 'Vector database for semantic retrieval',
    metadata: { version: '1.7.4', introduced: 'Aug 14' },
  },
  {
    id: 'chromadb',
    label: 'ChromaDB',
    type: 'database',
    memoryType: 'episodic',
    description: 'Former vector database, replaced by Qdrant',
    metadata: { status: 'deprecated', removed: 'Aug 14' },
  },
  // Graph
  {
    id: 'knowledge-graph',
    label: 'KnowledgeGraph',
    type: 'class',
    memoryType: 'semantic',
    path: 'graph/knowledge.py',
    description: 'Manages the repository knowledge graph',
    metadata: { language: 'Python', lines: '398' },
  },
  // External
  {
    id: 'langgraph',
    label: 'LangGraph',
    type: 'dependency',
    memoryType: 'semantic',
    description: 'Graph-based agent orchestration framework',
    metadata: { version: '0.2.18' },
  },
  // Commits
  {
    id: 'commit-a81f2',
    label: 'commit a81f2',
    type: 'commit',
    memoryType: 'episodic',
    description: 'Replace ChromaDB with Qdrant',
    metadata: { date: 'Aug 14', author: 'amodh', hash: 'a81f2b3' },
  },
  {
    id: 'commit-c94e1',
    label: 'commit c94e1',
    type: 'commit',
    memoryType: 'episodic',
    description: 'Add ReviewerAgent for quality control',
    metadata: { date: 'Aug 18', author: 'amodh', hash: 'c94e1f8' },
  },
  // API
  {
    id: 'api-query',
    label: 'QueryAPI',
    type: 'api',
    memoryType: 'semantic',
    path: 'api/query.py',
    description: 'FastAPI endpoints for memory queries',
    metadata: { language: 'Python', lines: '98' },
  },
  // Concepts
  {
    id: 'research-state',
    label: 'ResearchState',
    type: 'concept',
    memoryType: 'semantic',
    description: 'Shared state object passed between research agents',
    metadata: { firstSeen: 'Aug 10' },
  },
];

// ─── Mock Graph Edges ─────────────────────────────────────────────────────────

export const MOCK_EDGES: GraphEdgeData[] = [
  { id: 'e1', source: 'research-agent', target: 'langgraph', label: 'uses', type: 'uses' },
  { id: 'e2', source: 'research-agent', target: 'literature-agent', label: 'calls', type: 'calls' },
  { id: 'e3', source: 'research-agent', target: 'hypothesis-agent', label: 'calls', type: 'calls' },
  { id: 'e4', source: 'reviewer-agent', target: 'research-state', label: 'reads', type: 'reads' },
  { id: 'e5', source: 'hybrid-retriever', target: 'qdrant', label: 'uses', type: 'uses' },
  { id: 'e6', source: 'hybrid-retriever', target: 'vector-store', label: 'uses', type: 'uses' },
  { id: 'e7', source: 'qdrant', target: 'chromadb', label: 'replaced', type: 'replaced' },
  { id: 'e8', source: 'consolidation', target: 'semantic-memory', label: 'updates', type: 'updates' },
  { id: 'e9', source: 'episodic-memory', target: 'commit-a81f2', label: 'records', type: 'records' },
  { id: 'e10', source: 'episodic-memory', target: 'commit-c94e1', label: 'records', type: 'records' },
  { id: 'e11', source: 'commit-a81f2', target: 'vector-store', label: 'changed', type: 'imports' },
  { id: 'e12', source: 'commit-c94e1', target: 'reviewer-agent', label: 'introduced', type: 'imports' },
  { id: 'e13', source: 'vector-store', target: 'qdrant', label: 'imports', type: 'imports' },
  { id: 'e14', source: 'knowledge-graph', target: 'semantic-memory', label: 'reads', type: 'reads' },
  { id: 'e15', source: 'api-query', target: 'hybrid-retriever', label: 'calls', type: 'calls' },
  { id: 'e16', source: 'research-agent', target: 'research-state', label: 'writes', type: 'reads' },
  { id: 'e17', source: 'literature-agent', target: 'hybrid-retriever', label: 'uses', type: 'uses' },
];

// ─── Mock Timeline Events ──────────────────────────────────────────────────────

export const MOCK_TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 'evt-1',
    date: 'AUG 18',
    isoDate: '2026-08-18',
    title: 'ReviewerAgent added',
    commit: 'c94e1f8',
    commitMessage: 'Add ReviewerAgent for quality control loop',
    memoryType: 'episodic',
    filesAffected: ['agents/reviewer.py', 'agents/research.py', 'memory/episodic.py'],
    reason: 'Research outputs lacked systematic review. ReviewerAgent creates a feedback loop.',
    detail: 'Introduced ReviewerAgent that reads ResearchState and generates critique. Wired into the LangGraph orchestration loop.',
  },
  {
    id: 'evt-2',
    date: 'AUG 16',
    isoDate: '2026-08-16',
    title: 'Memory consolidation pipeline',
    commit: 'b72c4a1',
    commitMessage: 'Implement MemoryConsolidator for episodic → semantic conversion',
    memoryType: 'episodic',
    filesAffected: ['memory/consolidation.py', 'memory/semantic.py', 'memory/episodic.py'],
    reason: 'Episodic memories accumulated but were not being synthesized into durable semantic facts.',
    detail: 'MemoryConsolidator runs on a schedule and converts important episodic events into semantic memory entries.',
  },
  {
    id: 'evt-3',
    date: 'AUG 15',
    isoDate: '2026-08-15',
    title: 'Graph retrieval optimized',
    commit: '9f3e2d7',
    commitMessage: 'Optimize KnowledgeGraph traversal with indexed neighbors',
    memoryType: 'semantic',
    filesAffected: ['graph/knowledge.py', 'retrieval/hybrid.py'],
    reason: 'Graph traversal was O(n²) for large codebases. Indexed neighbor maps reduce to O(1).',
    detail: 'Added adjacency index to KnowledgeGraph. HybridRetriever now uses indexed traversal.',
  },
  {
    id: 'evt-4',
    date: 'AUG 14',
    isoDate: '2026-08-14',
    title: 'Qdrant migration',
    commit: 'a81f2b3',
    commitMessage: 'Replace ChromaDB with Qdrant for vector retrieval',
    memoryType: 'episodic',
    filesAffected: ['retrieval/vector_store.py', 'retrieval/hybrid.py', 'requirements.txt'],
    reason: 'ChromaDB lacked metadata filtering needed for temporal queries. Qdrant provides payload-based filtering.',
    detail: 'QdrantVectorStore replaced ChromaVectorStore. HybridRetriever updated to use new interface.',
  },
  {
    id: 'evt-5',
    date: 'AUG 12',
    isoDate: '2026-08-12',
    title: 'HypothesisAgent introduced',
    commit: '7d1a9c5',
    commitMessage: 'Add HypothesisAgent to research pipeline',
    memoryType: 'episodic',
    filesAffected: ['agents/hypothesis.py', 'agents/research.py'],
    reason: 'ResearchAgent was generating outputs without systematic hypothesis formation.',
    detail: 'HypothesisAgent generates structured hypotheses from LiteratureAgent outputs and validates them.',
  },
  {
    id: 'evt-6',
    date: 'AUG 11',
    isoDate: '2026-08-11',
    title: 'Hybrid retrieval strategy',
    commit: '5b8f3e2',
    commitMessage: 'Implement HybridRetriever combining vector and graph search',
    memoryType: 'semantic',
    filesAffected: ['retrieval/hybrid.py', 'retrieval/vector_store.py'],
    reason: 'Pure vector retrieval missed structural relationships. Hybrid combines vector + graph for better recall.',
    detail: 'HybridRetriever merges results from vector similarity and graph traversal using reciprocal rank fusion.',
  },
  {
    id: 'evt-7',
    date: 'AUG 10',
    isoDate: '2026-08-10',
    title: 'Initial LangGraph architecture',
    commit: '2c4f7a8',
    commitMessage: 'Initial commit: LangGraph multi-agent research system',
    memoryType: 'episodic',
    filesAffected: [
      'agents/research.py',
      'agents/literature.py',
      'memory/episodic.py',
      'memory/semantic.py',
      'graph/knowledge.py',
      'api/query.py',
    ],
    reason: 'Project inception. LangGraph chosen for stateful multi-agent orchestration.',
    detail: 'Initial architecture with ResearchAgent, LiteratureAgent, EpisodicMemory, SemanticMemory, and KnowledgeGraph.',
  },
];

// ─── Mock Query Results ────────────────────────────────────────────────────────

export const MOCK_QUERY_RESPONSES: Record<string, QueryResult> = {
  chromadb: {
    query: 'Why was ChromaDB replaced with Qdrant?',
    answer:
      'Qdrant replaced ChromaDB during the retrieval architecture refactor on August 14 [a81f2b3]. The decision was primarily driven by improved metadata filtering and the need for scalable vector retrieval. ChromaDB lacked the payload-based filtering required for temporal memory queries — specifically, the ability to filter vectors by date range and file path simultaneously. Qdrant\'s rich payload filtering made this straightforward.',
    confidence: 0.94,
    citations: [
      { id: 'a81f2b3', label: 'commit a81f2b3', nodeId: 'commit-a81f2', type: 'episodic' },
      { id: 'vs-py', label: 'retrieval/vector_store.py', nodeId: 'vector-store', type: 'semantic' },
    ],
    provenance: [
      {
        type: 'episodic',
        count: 3,
        label: '3 sources',
        items: [
          { id: 'commit-a81f2', label: 'commit a81f2b3', detail: 'Replace ChromaDB with Qdrant' },
          { id: 'evt-4', label: 'Aug 14 migration event', detail: 'Qdrant migration' },
          { id: 'chromadb', label: 'ChromaDB deprecation record' },
        ],
      },
      {
        type: 'semantic',
        count: 7,
        label: '7 nodes',
        items: [
          { id: 'vector-store', label: 'QdrantVectorStore', detail: 'retrieval/vector_store.py' },
          { id: 'hybrid-retriever', label: 'HybridRetriever', detail: 'retrieval/hybrid.py' },
          { id: 'qdrant', label: 'Qdrant', detail: 'database dependency' },
          { id: 'chromadb', label: 'ChromaDB', detail: 'deprecated' },
        ],
      },
      {
        type: 'temporal',
        count: 2,
        label: '2 transitions',
        items: [
          { id: 'trans-1', label: 'Aug 10 → Aug 14', detail: 'ChromaDB era' },
          { id: 'trans-2', label: 'Aug 14 → present', detail: 'Qdrant era' },
        ],
      },
    ],
    trace: [
      { id: 't1', label: 'Query', detail: 'Why was ChromaDB replaced with Qdrant?' },
      { id: 't2', label: 'Query Planner', detail: 'Routing to episodic + semantic + temporal' },
      { id: 't3', label: 'Semantic Memory', memoryType: 'semantic', detail: '7 relevant nodes found' },
      { id: 't4', label: 'Episodic Memory', memoryType: 'episodic', detail: 'commit a81f2b3 — Aug 14' },
      { id: 't5', label: 'Temporal Memory', memoryType: 'temporal', detail: 'Aug 10 → Aug 14 transition' },
      { id: 't6', label: 'Evidence', detail: 'Synthesizing 3 episodic + 7 semantic sources' },
      { id: 't7', label: 'Answer', detail: 'Confidence: 0.94' },
    ],
  },
  retrieval: {
    query: 'How has the retrieval architecture changed?',
    answer:
      'The retrieval architecture has undergone two major phases. The initial architecture (Aug 10 [2c4f7a8]) used ChromaDB for vector retrieval in isolation. On Aug 11 [5b8f3e2], HybridRetriever was introduced, combining vector and graph-based search using reciprocal rank fusion. On Aug 14 [a81f2b3], ChromaDB was replaced with Qdrant, enabling payload-filtered retrieval essential for temporal queries. The current architecture routes queries through HybridRetriever which parallelizes Qdrant vector search and KnowledgeGraph traversal.',
    confidence: 0.91,
    citations: [
      { id: '2c4f7a8', label: 'commit 2c4f7a8', nodeId: 'commit-a81f2', type: 'episodic' },
      { id: '5b8f3e2', label: 'commit 5b8f3e2', nodeId: 'hybrid-retriever', type: 'episodic' },
      { id: 'a81f2b3', label: 'commit a81f2b3', nodeId: 'commit-a81f2', type: 'episodic' },
    ],
    provenance: [
      {
        type: 'episodic',
        count: 4,
        label: '4 sources',
        items: [
          { id: 'evt-6', label: 'Aug 11: HybridRetriever added' },
          { id: 'evt-4', label: 'Aug 14: Qdrant migration' },
        ],
      },
      {
        type: 'semantic',
        count: 5,
        label: '5 nodes',
        items: [
          { id: 'hybrid-retriever', label: 'HybridRetriever' },
          { id: 'vector-store', label: 'QdrantVectorStore' },
          { id: 'knowledge-graph', label: 'KnowledgeGraph' },
        ],
      },
      {
        type: 'temporal',
        count: 3,
        label: '3 transitions',
        items: [
          { id: 'tr1', label: 'Aug 10 → Aug 11', detail: 'Vector only' },
          { id: 'tr2', label: 'Aug 11 → Aug 14', detail: 'Hybrid (ChromaDB)' },
          { id: 'tr3', label: 'Aug 14 → present', detail: 'Hybrid (Qdrant)' },
        ],
      },
    ],
    trace: [
      { id: 't1', label: 'Query', detail: 'How has the retrieval architecture changed?' },
      { id: 't2', label: 'Query Planner', detail: 'Multi-temporal query detected' },
      { id: 't3', label: 'Temporal Memory', memoryType: 'temporal', detail: '3 architectural phases' },
      { id: 't4', label: 'Episodic Memory', memoryType: 'episodic', detail: '4 relevant commits found' },
      { id: 't5', label: 'Semantic Memory', memoryType: 'semantic', detail: '5 structural nodes' },
      { id: 't6', label: 'Evidence', detail: 'Synthesizing timeline of changes' },
      { id: 't7', label: 'Answer', detail: 'Confidence: 0.91' },
    ],
  },
  reviewer: {
    query: 'What depends on ReviewerAgent?',
    answer:
      'ReviewerAgent [c94e1f8] was added on August 18 and is currently depended upon by the core research orchestration loop in ResearchAgent. ReviewerAgent reads ResearchState and generates structured critique. No other agents currently call ReviewerAgent directly — it is integrated as a terminal node in the LangGraph workflow graph. EpisodicMemory records its invocations as episodic events.',
    confidence: 0.88,
    citations: [
      { id: 'c94e1f8', label: 'commit c94e1f8', nodeId: 'commit-c94e1', type: 'episodic' },
      { id: 'ra-py', label: 'agents/research.py', nodeId: 'research-agent', type: 'semantic' },
    ],
    provenance: [
      {
        type: 'episodic',
        count: 2,
        label: '2 sources',
        items: [
          { id: 'commit-c94e1', label: 'commit c94e1f8', detail: 'Add ReviewerAgent' },
          { id: 'evt-1', label: 'Aug 18 event' },
        ],
      },
      {
        type: 'semantic',
        count: 4,
        label: '4 nodes',
        items: [
          { id: 'reviewer-agent', label: 'ReviewerAgent' },
          { id: 'research-agent', label: 'ResearchAgent' },
          { id: 'research-state', label: 'ResearchState' },
          { id: 'langgraph', label: 'LangGraph' },
        ],
      },
      {
        type: 'temporal',
        count: 1,
        label: '1 transition',
        items: [{ id: 'tr1', label: 'Aug 18 → present', detail: 'ReviewerAgent era' }],
      },
    ],
    trace: [
      { id: 't1', label: 'Query', detail: 'What depends on ReviewerAgent?' },
      { id: 't2', label: 'Query Planner', detail: 'Dependency graph query' },
      { id: 't3', label: 'Semantic Memory', memoryType: 'semantic', detail: 'Traversing dependents graph' },
      { id: 't4', label: 'Episodic Memory', memoryType: 'episodic', detail: 'Introduction event found' },
      { id: 't5', label: 'Evidence', detail: '4 semantic nodes, 2 episodic sources' },
      { id: 't6', label: 'Answer', detail: 'Confidence: 0.88' },
    ],
  },
};

// Default query response for unmatched queries
export const DEFAULT_QUERY_RESPONSE: QueryResult = {
  query: '',
  answer:
    'The memory trace identified relevant nodes across episodic, semantic, and temporal memory. The query relates to architectural decisions within the nexus-research codebase. Based on available evidence, the system synthesized an answer from 3 episodic events and 5 semantic relationships.',
  confidence: 0.72,
  citations: [
    { id: 'a81f2b3', label: 'commit a81f2b3', nodeId: 'commit-a81f2', type: 'episodic' },
    { id: 'vector-store', label: 'retrieval/vector_store.py', nodeId: 'vector-store', type: 'semantic' },
  ],
  provenance: [
    {
      type: 'episodic',
      count: 3,
      label: '3 sources',
      items: [
        { id: 'commit-a81f2', label: 'commit a81f2b3' },
        { id: 'evt-1', label: 'Aug 18 event' },
        { id: 'evt-4', label: 'Aug 14 event' },
      ],
    },
    {
      type: 'semantic',
      count: 5,
      label: '5 nodes',
      items: [
        { id: 'hybrid-retriever', label: 'HybridRetriever' },
        { id: 'vector-store', label: 'QdrantVectorStore' },
      ],
    },
    {
      type: 'temporal',
      count: 2,
      label: '2 transitions',
      items: [{ id: 'tr1', label: 'Aug 10 → present' }],
    },
  ],
  trace: [
    { id: 't1', label: 'Query', detail: 'Processing query...' },
    { id: 't2', label: 'Query Planner', detail: 'Routing to all memory types' },
    { id: 't3', label: 'Semantic Memory', memoryType: 'semantic', detail: '5 nodes found' },
    { id: 't4', label: 'Episodic Memory', memoryType: 'episodic', detail: '3 events found' },
    { id: 't5', label: 'Temporal Memory', memoryType: 'temporal', detail: '2 transitions' },
    { id: 't6', label: 'Evidence', detail: 'Synthesizing across memory types' },
    { id: 't7', label: 'Answer', detail: 'Confidence: 0.72' },
  ],
};

// ─── Mock Node Details ─────────────────────────────────────────────────────────

export const MOCK_NODE_DETAILS: Record<string, NodeDetail> = {
  'vector-store': {
    id: 'vector-store',
    type: 'class',
    label: 'QdrantVectorStore',
    path: 'retrieval/vector_store.py',
    description: 'Vector retrieval implementation using Qdrant',
    language: 'Python',
    functions: ['search', 'upsert', 'delete', 'get_collection', 'build_filter'],
    classes: ['QdrantVectorStore', 'VectorConfig'],
    dependsOn: ['qdrant-client', 'embeddings.py', 'RetrievalConfig'],
    dependents: ['retrieval/hybrid.py'],
    lastChanged: 'Aug 14',
    recentChanges: [
      { date: 'Aug 14', description: 'Replace ChromaDB with Qdrant', commit: 'a81f2b3' },
      { date: 'Aug 10', description: 'Initial ChromaVectorStore implementation', commit: '2c4f7a8' },
    ],
    relatedDecisions: ['Qdrant chosen for payload filtering support', 'ChromaDB deprecated'],
    evidence: ['commit a81f2b3', 'commit 2c4f7a8'],
    confidence: 0.97,
  },
  'reviewer-agent': {
    id: 'reviewer-agent',
    type: 'agent',
    label: 'ReviewerAgent',
    path: 'agents/reviewer.py',
    description: 'Reviews and critiques agent outputs',
    language: 'Python',
    functions: ['review', 'critique', 'score', 'generate_feedback'],
    classes: ['ReviewerAgent', 'ReviewCriteria'],
    dependsOn: ['research-state', 'langgraph', 'memory/episodic.py'],
    dependents: ['agents/research.py'],
    lastChanged: 'Aug 18',
    recentChanges: [{ date: 'Aug 18', description: 'Initial ReviewerAgent implementation', commit: 'c94e1f8' }],
    relatedDecisions: ['Added to create quality control feedback loop'],
    evidence: ['commit c94e1f8'],
    confidence: 0.95,
  },
  'commit-a81f2': {
    id: 'commit-a81f2',
    type: 'commit',
    label: 'commit a81f2b3',
    hash: 'a81f2b3',
    author: 'amodh',
    timestamp: '2026-08-14T14:32:07+05:30',
    description: 'Replace ChromaDB with Qdrant',
    filesChanged: ['retrieval/vector_store.py', 'retrieval/hybrid.py', 'requirements.txt'],
    relatedDecisions: ['ChromaDB lacked payload filtering for temporal queries'],
    evidence: ['retrieval/vector_store.py diff', 'requirements.txt — qdrant-client added'],
  },
};

// ─── Example Queries ──────────────────────────────────────────────────────────

export const EXAMPLE_QUERIES = [
  'Why was ChromaDB replaced with Qdrant?',
  'How has the retrieval architecture changed?',
  'What depends on ReviewerAgent?',
  'What decisions led to the current agent architecture?',
  'What changed in the memory system this week?',
  'Which memories are stale?',
  'What would break if LangGraph were removed?',
];
