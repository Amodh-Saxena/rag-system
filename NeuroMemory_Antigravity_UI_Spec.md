# NeuroMemory UI — Antigravity Build Specification

## 0. Mission

Build a polished, distinctive developer-facing web interface called **NeuroMemory — Cognitive Memory Explorer**.

NeuroMemory is a cognitive memory layer for a codebase. It stores and retrieves:
- episodic memory: commits, events, decisions, changes
- semantic memory: files, functions, facts, dependencies, relationships
- temporal memory: how the codebase evolved over time

This frontend is NOT a generic chatbot and NOT an admin dashboard.

The product should feel like a **precision instrument for thinking alongside a codebase**.

The visual language must come from:
- memory
- archaeology
- timelines
- strata/layers
- annotated index cards
- dependency relationships
- evidence trails
- code history

Avoid generic AI SaaS visual language.

---

# 1. Non-Negotiable Design Rules

## Explicitly DO NOT use

- cream + terracotta AI-tool palette
- near-black + one neon accent
- purple-blue gradients
- generic glassmorphism
- excessive rounded cards
- generic dashboard grids
- stat cards with icon + number + label
- generic AI sparkle icons
- decorative blobs
- numbered 01/02/03 sections unless there is a real sequence
- excessive shadows
- excessive animations
- chatbot bubbles
- giant hero marketing sections
- fake analytics dashboards

## Product personality

The UI should feel:

- technical
- intelligent
- archival
- precise
- tactile
- research-oriented
- developer-native
- slightly experimental
- calm
- information-dense without feeling cluttered

Reference mental models:

> Git archaeology + IDE + knowledge graph + field notebook + scientific instrument.

---

# 2. Design Tokens

Use a restrained 6-color system.

## Core palette

```css
--ink: #17202A;
--paper: #F4F1E8;
--oxide: #A84A32;
--moss: #4F6854;
--signal: #2D6A73;
--graphite: #667078;
```

Additional derived neutrals may be generated from these, but do not introduce a rainbow palette.

## Dark mode

Dark mode must be designed intentionally.

```css
--dark-bg: #121719;
--dark-surface: #1A2022;
--dark-text: #E8E4D8;
--dark-muted: #8E9998;
```

Use the same semantic colors for provenance and graph relationships, but adjust contrast appropriately.

## Provenance colors

These are semantic, not decorative:

```text
EPISODIC  → oxide
SEMANTIC  → moss
TEMPORAL  → signal
```

Do not use these as large gradient fills.

---

# 3. Typography

Use 3 complementary typefaces.

## Display / identity

Use:

```text
IBM Plex Serif
```

Use sparingly for:
- NeuroMemory title
- major section headings
- important memory statements

## Body / interface

Use:

```text
Inter
```

Use for:
- navigation
- labels
- descriptions
- controls
- general UI

## Code / utility

Use:

```text
JetBrains Mono
```

Use for:
- filenames
- functions
- commits
- timestamps
- hashes
- API endpoints
- keyboard shortcuts
- graph metadata
- source references

Typography should create a clear distinction between:

**human-readable interpretation** and **machine/code evidence**.

---

# 4. Layout Concept

Use a persistent developer-workspace layout.

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ NeuroMemory        repository: nexus-research     branch: main    ⌘K Search │
├────────────┬─────────────────────────────────────────────────────────────────┤
│            │                                                                 │
│ MEMORY     │                    MAIN EXPLORATION                             │
│            │                                                                 │
│ Query      │   ┌─────────────────────────────────────────────────────────┐   │
│ Graph      │   │                                                         │   │
│ Timeline   │   │                 CURRENT VIEW                            │   │
│            │   │                                                         │   │
│            │   │                                                         │   │
│────────────│   │                                                         │   │
│            │   │                                                         │   │
│ Memory     │   └─────────────────────────────────────────────────────────┘   │
│ Types      │                                                                 │
│            │                                                                 │
│ ● Episodic │                                                                 │
│ ● Semantic │                                                                 │
│ ● Temporal │                                                                 │
│            │                                                                 │
│────────────│                                                                 │
│            │                                                                 │
│ Repository │                                                                 │
│ files      │                                                                 │
│ commits    │                                                                 │
│ agents     │                                                                 │
│            │                                                                 │
├────────────┴─────────────────────────────────────────────────────────────────┤
│ STATUS: memory synchronized     1,842 nodes     last indexed 14m ago        │
└──────────────────────────────────────────────────────────────────────────────┘
```

Important:

The interface should not look like a conventional SaaS sidebar + cards dashboard.

The left rail is an **instrument/navigation rail**, not a list of marketing features.

The main area changes between:
- Query
- Graph
- Timeline
- Node detail

The right side may become contextual only when a node is selected.

---

# 5. Signature Element

## THE MEMORY TRACE

This is the single visual element users should remember.

Whenever a query is executed, show the retrieval path as a subtle animated trace through the memory system.

Example:

```text
QUESTION
   │
   ▼
┌───────────────┐
│ Query Planner │
└───────┬───────┘
        │
        ├──────────────► Semantic Memory
        │                     │
        │                     ▼
        │                 LangGraph
        │
        ├──────────────► Episodic Memory
        │                     │
        │                     ▼
        │                 commit a81f
        │
        └──────────────► Temporal Memory
                              │
                              ▼
                       Aug 10 → Aug 18
```

In the UI, this should become a live trace:

```text
Query
  ↓
Memory Type
  ↓
Relevant Nodes
  ↓
Evidence
  ↓
Answer
```

The trace should animate ONCE when retrieval happens.

It should not constantly pulse or move.

The animation should feel like the system is **thinking through its memory**, not like a loading spinner.

Respect:

```css
@media (prefers-reduced-motion: reduce)
```

When reduced motion is enabled, display the complete trace immediately.

---

# 6. Screen 1 — Query View

Route:

```text
/
```

Purpose:

A developer asks a question about the repository.

## Top command bar

Do NOT make this a chatbot input.

Use a command-bar / IDE search aesthetic.

Example:

```text
┌─────────────────────────────────────────────────────────────────────┐
│ ⌕  Why was ChromaDB replaced with Qdrant?             ⌘ Enter       │
└─────────────────────────────────────────────────────────────────────┘
```

Below it:

```text
Semantic     Episodic     Temporal
   ✓             ✓            ✓
```

These indicate retrieval sources.

## Example query

```text
Why did we replace ChromaDB with Qdrant?
```

## Answer area

Use editorial typography rather than a chatbot bubble.

Example:

```text
Qdrant replaced ChromaDB during the retrieval architecture
refactor on August 14.

The decision was primarily driven by improved metadata filtering
and the need for scalable vector retrieval.

Evidence
────────────────────────────────────────────────────────

EPISODIC
commit a81f2
"Replace ChromaDB with Qdrant"

TEMPORAL
Aug 10 → Aug 14

SEMANTIC
retrieval/vector_store.py
QdrantVectorStore

CONFIDENCE
0.94
```

## Inline citations

Citations must be clickable.

Example:

```text
...during the retrieval architecture refactor [a81f2]
```

Clicking the citation opens the relevant node or commit.

Use code typography for source references.

---

# 7. Query Result Provenance

Every result should expose which memory types contributed.

Use a compact provenance strip:

```text
┌─────────────────────────────────────────────┐
│ EPISODIC  3 sources                         │
│ SEMANTIC  7 nodes                            │
│ TEMPORAL  2 transitions                     │
└─────────────────────────────────────────────┘
```

Do not make this a card grid.

It should look like an evidence annotation.

---

# 8. Screen 2 — Memory Graph

Route:

```text
/graph
```

Purpose:

Explore the semantic structure of the repository.

The graph must NOT be a static node-link diagram.

It must be interactive.

## Nodes

Node types:

```text
Repository
Folder
File
Function
Class
Agent
Database
API
Dependency
Concept
Commit
```

Use restrained shapes.

Example:

```text
File      → rectangle
Function  → small square
Class     → outlined rectangle
Commit    → small diamond
Concept   → circle
Agent     → bracket/outlined capsule
```

Do not use huge colorful circles everywhere.

## Graph interactions

Support:

- pan
- zoom
- click node
- focus node
- expand relationships
- collapse relationships
- search node
- highlight dependency path
- show incoming edges
- show outgoing edges
- keyboard navigation where practical

When selecting a node:

```text
selected node
     ↓
highlight direct relationships
     ↓
fade unrelated graph elements
```

This should create the feeling of navigating a knowledge structure.

---

# 9. Graph Query Mode

Example:

User searches:

```text
Qdrant
```

The graph focuses on:

```text
Qdrant
   │
   ├── used by → VectorStore
   │
   ├── imported by → retrieval.py
   │
   ├── introduced by → commit a81f2
   │
   └── replaced → ChromaDB
```

Animate only the relevant path.

---

# 10. Screen 3 — Timeline View

Route:

```text
/timeline
```

This is the episodic + temporal memory interface.

Do NOT make a generic vertical timeline.

Use a **stratified archaeological timeline**.

Concept:

```text
CURRENT
────────────────────────────────────────
     retrieval.py
     ████████████████████

     reviewer.py
     ███████████

     graph.py
     █████████████████

────────────────────────────────────────
OLDER
```

Each layer represents a period.

Scrolling backward should reveal older project states.

## Timeline events

Display:

```text
AUG 18
ReviewerAgent added

AUG 15
Graph retrieval optimized

AUG 14
Qdrant migration

AUG 10
Initial LangGraph architecture
```

Each event can show:

```text
event
↓
files affected
↓
commit
↓
reason
```

---

# 11. Timeline Scrubbing

Provide a time scrubber:

```text
2026-08-01 ─────────────●────────────── 2026-08-20
                        ↑
                     Aug 14
```

Moving the scrubber should update:

- graph relationships
- active files
- semantic facts
- relevant commits

The interface should feel like **rewinding the memory of the repository**.

---

# 12. Screen 4 — Node Detail

Node detail can appear as a right contextual panel or full view.

Example:

```text
┌─────────────────────────────────────────────┐
│ retrieval/vector_store.py                   │
│ FILE                                        │
│                                             │
│ "Vector retrieval implementation"            │
│                                             │
│ CURRENT STATE                               │
│ QdrantVectorStore                           │
│                                             │
│ DEPENDS ON                                  │
│ ├─ qdrant-client                            │
│ ├─ embeddings.py                            │
│ └─ RetrievalConfig                          │
│                                             │
│ CHANGED                                     │
│ Aug 14                                      │
│                                             │
│ WHY                                         │
│ "Replace ChromaDB with Qdrant"              │
│                                             │
│ HISTORY                                     │
│ Aug 10  ChromaDB                            │
│ Aug 14  Qdrant                               │
│                                             │
│ EVIDENCE                                    │
│ commit a81f2                                │
│                                             │
└─────────────────────────────────────────────┘
```

---

# 13. Node Detail Requirements

For files:

Show:
- path
- description
- language
- functions
- classes
- dependencies
- dependents
- recent changes
- historical changes
- related decisions
- evidence

For functions:

Show:
- function signature
- file
- callers
- dependencies
- related commits
- semantic description
- last changed
- historical versions

For commits:

Show:
- hash
- author
- timestamp
- message
- files changed
- related decisions
- predecessor/successor commits

For concepts:

Show:
- definition
- related files
- related functions
- evidence
- confidence
- first seen
- last verified

---

# 14. Command Palette

Keyboard shortcut:

```text
Cmd/Ctrl + K
```

Open a command palette.

Commands:

```text
Ask about repository
Open graph
Open timeline
Search files
Search functions
Search commits
Go to node
Show recent changes
Show architecture
Show contradictions
Show stale memories
Ingest repository
Toggle light/dark mode
```

Example:

```text
┌───────────────────────────────────────────────┐
│ ⌘  Search memory...                           │
├───────────────────────────────────────────────┤
│ Ask       Why does ReviewerAgent use...?      │
│ Go        agents/reviewer.py                  │
│ Graph     Focus LangGraph                     │
│ Timeline  Show August 10 → August 20          │
│ Check     Find stale memories                 │
└───────────────────────────────────────────────┘
```

Keyboard navigation should work.

---

# 15. Ingest Flow

Backend endpoint:

```text
POST /ingest
```

Create an ingestion control.

Example:

```text
INGEST REPOSITORY

Repository path
[ /workspace/nexus-research ]

[ INGEST ]

──────────────────────────────

Perception
✓ Files discovered
✓ Git history discovered
✓ Dependencies extracted
● Building semantic memory
○ Building graph
○ Consolidating memories
```

Do not create a generic progress bar only.

Show actual memory formation stages.

---

# 16. Empty State

Never use:

> No data found.

Instead:

```text
NO MEMORY YET

The repository has not been ingested.

Give NeuroMemory a codebase to remember.

[ INGEST REPOSITORY ]

or

neuro ingest .
```

For graph:

```text
THE MEMORY GRAPH IS QUIET

Ingest a repository to build its semantic structure.
```

For timeline:

```text
NO HISTORY TO EXCAVATE

Once Git history is indexed, the repository's evolution
will appear here.
```

---

# 17. API Integration

Backend is FastAPI.

Use these endpoints.

## Query

```http
POST /query
```

Expected conceptual request:

```json
{
  "query": "Why was ChromaDB replaced with Qdrant?",
  "repository_id": "nexus-research"
}
```

Handle response flexibly.

Expected conceptual shape:

```json
{
  "answer": "...",
  "confidence": 0.94,
  "provenance": {
    "episodic": [],
    "semantic": [],
    "temporal": []
  },
  "citations": [],
  "trace": []
}
```

If actual backend differs, create a small adapter layer rather than coupling UI components directly to response shape.

## Graph

```http
GET /graph/{node_id}
```

Support loading:
- node
- relationships
- metadata
- connected nodes

## Ingest

```http
POST /ingest
```

Handle:
- loading
- success
- error
- partial progress if available

If backend is unavailable, use realistic mock data through a clean mock API adapter.

---

# 18. Frontend Architecture

Prefer:

```text
React
TypeScript
Tailwind CSS
React Router
```

Suggested structure:

```text
src/
├── app/
│   ├── App.tsx
│   ├── routes.tsx
│   └── providers.tsx
│
├── components/
│   ├── CommandBar/
│   ├── CommandPalette/
│   ├── MemoryTrace/
│   ├── ProvenanceStrip/
│   ├── Graph/
│   ├── Timeline/
│   ├── NodePanel/
│   ├── Citation/
│   └── Ingest/
│
├── views/
│   ├── QueryView.tsx
│   ├── GraphView.tsx
│   ├── TimelineView.tsx
│   └── NodeView.tsx
│
├── hooks/
│   ├── useQuery.ts
│   ├── useGraph.ts
│   ├── useTimeline.ts
│   └── useKeyboard.ts
│
├── lib/
│   ├── api.ts
│   ├── mockApi.ts
│   ├── adapters.ts
│   └── memoryTypes.ts
│
├── data/
│   └── mockMemory.ts
│
└── styles/
    └── globals.css
```

---

# 19. API Adapter

Create:

```text
src/lib/api.ts
```

All backend requests go through this layer.

Create:

```text
src/lib/mockApi.ts
```

for development.

Add:

```text
VITE_API_URL
```

so the frontend can connect to FastAPI without hardcoding localhost.

Example:

```text
VITE_API_URL=http://localhost:8000
```

If the backend is unavailable:

```text
API unavailable → automatically use realistic mock data
```

But make the UI clearly show:

```text
LOCAL MOCK MEMORY
```

Do not silently pretend mock data is real.

---

# 20. Mock Repository Data

Use a realistic fictional repository:

```text
nexus-research
```

Include:

```text
agents/research.py
agents/literature.py
agents/hypothesis.py
agents/reviewer.py
memory/episodic.py
memory/semantic.py
memory/consolidation.py
retrieval/hybrid.py
retrieval/vector_store.py
graph/knowledge.py
api/query.py
```

Relationships:

```text
ResearchAgent → uses → LangGraph
ResearchAgent → calls → LiteratureAgent
ReviewerAgent → reads → ResearchState
HybridRetriever → uses → Qdrant
Qdrant → replaced → ChromaDB
MemoryConsolidator → updates → SemanticMemory
EpisodicMemory → records → GitCommit
```

---

# 21. Realistic Query Examples

Include clickable example queries:

```text
Why was ChromaDB replaced with Qdrant?

How has the retrieval architecture changed?

What depends on ReviewerAgent?

What decisions led to the current agent architecture?

What changed in the memory system this week?

Which memories are stale?

Why does this function exist?

What would break if LangGraph were removed?
```

---

# 22. Memory Types

Use these exact conceptual definitions.

## Episodic

Represents events.

Examples:
- commit
- deployment
- decision
- experiment
- refactor

Label:

```text
EPISODIC
```

## Semantic

Represents facts and structure.

Examples:
- function
- file
- dependency
- architecture fact
- relationship

Label:

```text
SEMANTIC
```

## Temporal

Represents change over time.

Examples:
- version transitions
- historical states
- first seen
- last verified
- before/after relationships

Label:

```text
TEMPORAL
```

---

# 23. Motion Rules

Only use motion when it communicates memory/retrieval.

Primary animation:

```text
Memory Trace
```

Secondary:

- graph settling
- timeline scrub transition
- node panel reveal

Do NOT animate:
- every button
- every card
- every hover
- every icon
- background decorations

Use CSS transitions around 150–250ms for ordinary UI.

Respect:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

# 24. Accessibility

Required:

- visible keyboard focus
- semantic HTML
- accessible buttons
- aria labels for graph controls
- keyboard navigation for command palette
- sufficient contrast
- no information conveyed only through color
- reduced motion support

Focus state should be clearly visible.

---

# 25. Responsive Behavior

Primary target:

```text
1280px+
```

Must remain usable at:

```text
1024px
```

At smaller widths:
- collapse secondary panels
- keep main graph/query functional
- convert node detail into an overlay/drawer
- preserve keyboard interaction

Mobile is not the primary target.

---

# 26. Light Mode

Light mode should feel like an archival research instrument.

Use:

```text
Paper background
Ink typography
Moss semantic markers
Oxide episodic markers
Signal temporal markers
```

Avoid:
- white card everywhere
- excessive borders
- dashboard boxes

Use subtle paper-like layering and precise dividers.

---

# 27. Dark Mode

Dark mode should feel like a developer research console.

Do NOT simply invert light mode.

Use:

```text
#121719
#1A2022
#E8E4D8
```

Maintain:
- high readability
- subtle graph relationships
- restrained provenance colors
- clear code typography

---

# 28. Graph Technology

Use a suitable graph library.

Preferred options:

```text
React Flow
```

or

```text
D3
```

or

```text
Cytoscape.js
```

Choose based on implementation complexity.

The graph must support real interaction rather than a screenshot/mockup.

---

# 29. Timeline Technology

Use:
- CSS + React for the basic timeline
- SVG/canvas only if required

Prioritize smooth scrubbing and clear historical relationships.

---

# 30. Error States

API failure:

```text
MEMORY CORE UNAVAILABLE

NeuroMemory could not reach the FastAPI memory service.

[ RETRY ]

You can continue exploring local demo memory.
```

Query failure:

```text
RETRIEVAL INTERRUPTED

The memory trace could not be completed.

[ RETRY QUERY ]
```

Ingest failure:

```text
INGESTION STOPPED

The repository could not be fully indexed.

Show technical details
Retry
```

---

# 31. Loading States

Never use a generic spinner alone.

For query:

```text
Reading semantic memory...
Tracing episodic history...
Checking temporal state...
Resolving evidence...
```

For graph:

```text
Loading semantic structure...
Resolving relationships...
```

For ingest:

```text
Scanning repository...
Extracting code structure...
Building semantic memory...
Recording episodic history...
Consolidating memory...
```

---

# 32. Final UI Quality Bar

The result should look like a serious developer/research tool.

A developer should immediately understand:

1. What repository am I exploring?
2. What does NeuroMemory currently remember?
3. Why did the system produce this answer?
4. Which evidence supports it?
5. How did this part of the codebase evolve?
6. What depends on this node?
7. What changed over time?

The UI should communicate **memory and evidence**, not "AI".

---

# 33. Build Order

Implement in this order:

### Phase A — Foundation

- React + TypeScript
- Tailwind
- routing
- theme system
- typography
- tokens
- global layout

### Phase B — Query

- command bar
- query state
- answer rendering
- citations
- provenance
- mock API
- FastAPI adapter

### Phase C — Signature Feature

- Memory Trace
- retrieval path visualization
- reduced-motion version

### Phase D — Graph

- interactive graph
- node selection
- relationship highlighting
- node detail panel

### Phase E — Timeline

- temporal layers
- commit events
- scrubber
- historical state

### Phase F — Ingestion

- /ingest integration
- progress states
- errors
- repository state

### Phase G — Polish

- keyboard navigation
- accessibility
- responsive layout
- dark mode
- light mode
- performance
- empty states
- loading states

---

# 34. Important Implementation Rule

Do NOT create the entire interface as static mockup HTML.

The following must actually work:

```text
Query
↓
API/mock API
↓
Answer
↓
Citations
↓
Memory Trace
↓
Click evidence
↓
Open node
↓
Explore graph
↓
Open timeline
↓
Inspect historical state
```

The frontend should be structured so that replacing mock data with the real FastAPI backend requires changing only the API adapter.

---

# 35. Final Deliverable

Produce a working SPA with:

- Query view
- Memory Graph
- Timeline
- Node detail
- Command palette
- Memory Trace
- Provenance visualization
- Ingest flow
- realistic mock repository
- FastAPI integration
- responsive layout
- light/dark themes
- accessibility
- reduced motion
- polished loading/error/empty states

The final result should feel like:

**"I am exploring the memory of a living codebase."**

Not:

**"I am chatting with an AI about my files."**
