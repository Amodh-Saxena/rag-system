# Architecture & Integration Design

NeuroMemory uses a clean, decoupled architecture separating the React UI from the Python FastAPI backend memory engine.

```
                      +-----------------------------+
                      |     React SPA (Vite)        |
                      |   Query / Graph / Timeline  |
                      +--------------+--------------+
                                     |
                             REST API (JSON)
                                     v
                      +-----------------------------+
                      |   FastAPI Backend Core      |
                      |   http://localhost:8000     |
                      +--------------+--------------+
                                     |
               +---------------------+---------------------+
               |                     |                     |
               v                     v                     v
     +-------------------+ +-------------------+ +-------------------+
     |  Episodic Memory  | |  Semantic Memory  | |  Temporal Memory  |
     | (Commits/Events)  | | (AST/Files/Nodes) | | (Deprecations/  |
     +-------------------+ +-------------------+ |   Transitions)    |
                                                 +-------------------+
```

## Backend Architecture (`backend/`)

- `main.py`: FastAPI server setup with CORS middleware.
- `routes/`: Endpoint handlers (`health.py`, `query.py`, `graph.py`, `timeline.py`, `node.py`).
- `memory/graph_store.py`: Loads and indexes repository memory from `backend/data/nexus-research.json`.
- `memory/retrieval.py`: `CognitiveMemoryRetriever` executing semantic, episodic, and temporal memory queries.

## Frontend Architecture (`src/`)

- `src/views/`: Primary route views (`QueryView.tsx`, `GraphView.tsx`, `TimelineView.tsx`).
- `src/components/`: UI components (`MemoryTrace.tsx`, `NodePanel.tsx`, `CommandPalette.tsx`, `ApiSettingsPanel.tsx`).
- `src/lib/`: API connection store (`apiStore.ts`), HTTP adapters (`api.ts`), and mock fallback (`mockApi.ts`).
- `src/hooks/`: Reactive state hooks (`useQuery.ts`, `useApiConfig.ts`, `useTheme.ts`).

## Memory Conceptual Architecture

The system renders three cognitive memory layers:

1. **Episodic Memory**: Records of events (Commits, Deployments, Refactors).
2. **Semantic Memory**: Records of facts and structures (Files, Dependencies, Functions, Agents).
3. **Temporal Memory**: Records of change over time (Historical states and deprecation transitions).

## API Integration

Communication between frontend and backend uses clean REST endpoints:

- `GET /health`: Engine status, active repository ID, node and edge counts.
- `POST /query`: Submits developer query, returning synthesized answer, confidence score, citations, provenance, and trace steps.
- `GET /graph/{repository_id}`: Retrieves complete graph nodes, edges, and repository metadata.
- `GET /timeline/{repository_id}`: Retrieves chronological timeline events.
- `GET /node/{node_id}`: Retrieves detailed node metadata, code snippet evidence, and dependencies.
- `POST /ingest`: Repository scanning and memory synchronization endpoint.
