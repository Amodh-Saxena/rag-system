# New Updates and Technologies

NeuroMemory is built upon a modern, responsive web stack prioritized for data visualization and strict structural rendering, connected to a live FastAPI memory backend.

## Core Technologies

- **FastAPI & Uvicorn**: The Python backend memory engine serving real-time graph data, multi-layered retrieval, and timeline endpoints at `http://localhost:8000`.
- **React & TypeScript**: Provides foundational component logic and strict typing (`tsc --noEmit` clean) for handling complex graph and semantic data objects.
- **Vite**: High-performance dev server and build tool.
- **Tailwind CSS**: The exclusive styling solution, using a strict 6-color semantic token configuration (`--ink`, `--paper`, `--oxide`, `--moss`, `--signal`, `--graphite`).
- **React Router**: For client-side routing across Query, Graph, and Timeline views.
- **@xyflow/react (React Flow)**: Interactive knowledge graph visualization with custom memory node shapes and dynamic filter views.

## Key Technical Updates

- **Live FastAPI Backend Core**: Fully implemented under `backend/` with endpoints:
  - `GET /health`: Core health status and node count.
  - `POST /query`: Cognitive memory query with retrieval across Episodic, Semantic, and Temporal memory layers.
  - `GET /graph/{repository_id}`: Knowledge graph topology and relationship edges.
  - `GET /timeline/{repository_id}`: Stratified historical event sequence.
  - `GET /node/{node_id}`: Detailed node metadata and inspection evidence.
- **Cognitive Memory Retriever (`backend/memory/retrieval.py`)**: Multi-layered search engine returning synthesized answers, citations, confidence scores, evidence provenance, and trace steps.
- **Runtime API Store & Adapters (`src/lib/apiStore.ts`, `src/lib/api.ts`)**: State-managed connection store with automatic fallback handling and response normalization for camelCase/snake_case properties.
- **Memory Trace Animations**: Implemented using pure CSS transitions (~150-250ms), respecting `prefers-reduced-motion` media queries.
- **Interactive Agent Roster & Graph Filters**: GraphView features an Agent Roster panel and 5 view modes (*All*, *Agents*, *Memory*, *Data Flow*, *Commits*) with connection highlighting.
