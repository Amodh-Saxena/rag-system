# History of Changes (Repository & Engine Evolution)

This document tracks the chronological evolution of the Nexus Research codebase and the NeuroMemory system architecture.

## Key Milestones

### August 10, 2026
- **Initial LangGraph Architecture**: The foundational multi-agent setup was introduced.
- **ChromaDB Integration**: Integrated ChromaDB as the primary vector store for semantic retrieval.

### August 14, 2026
- **Qdrant Migration**: Replaced ChromaDB with Qdrant to improve metadata filtering and scale vector retrieval.
- **Refactoring**: `retrieval/vector_store.py` updated to use `QdrantVectorStore`.

### August 15, 2026
- **Graph Retrieval Optimization**: Improved the performance of extracting semantic relationships from the knowledge graph.

### August 18, 2026
- **ReviewerAgent Added**: Introduced a new agent responsible for independently evaluating the generated research state and proposing iterations.

### August 25, 2026
- **FastAPI Backend Core Launched**: Created a live Python backend (`backend/`) running on port 8000 with `/health`, `/query`, `/graph`, `/timeline`, and `/node` REST endpoints.
- **Cognitive Memory Retrieval Engine**: Implemented `GraphMemoryStore` and `CognitiveMemoryRetriever` supporting multi-layer retrieval (Episodic, Semantic, Temporal) with evidence provenance and trace step output.
- **Frontend Live API Integration**: Connected React SPA to FastAPI backend via `src/lib/apiStore.ts` and `src/lib/api.ts` adapters with clean TypeScript compilation (`tsc --noEmit` clean).

## Memory System Impact

These historical changes form the basis of the **Temporal** and **Episodic** memory layers visualizable in the NeuroMemory Timeline and Memory Graph views.
