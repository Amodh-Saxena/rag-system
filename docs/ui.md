# UI Design Specification

NeuroMemory uses a precise, developer-native aesthetic inspired by Git archaeology, scientific instruments, and index cards. It explicitly avoids generic SaaS dashboard layouts and "AI chatbot" tropes.

## 1. Design Tokens

The system is built on a restrained 6-color semantic palette:
- **Ink** (`#17202A`): Primary text and dark accents
- **Paper** (`#F4F1E8`): Light mode background
- **Oxide** (`#A84A32`): Represents EPISODIC memory
- **Moss** (`#4F6854`): Represents SEMANTIC memory
- **Signal** (`#2D6A73`): Represents TEMPORAL memory
- **Graphite** (`#667078`): Muted text and borders

**Dark Mode Variables:**
- Background: `#121719`
- Surface: `#1A2022`
- Text: `#E8E4D8`
- Muted: `#8E9998`

## 2. Typography

- **Display/Identity**: *IBM Plex Serif* (Title, major headings, statements)
- **Body/Interface**: *Inter* (Navigation, labels, general UI)
- **Code/Utility**: *JetBrains Mono* (Filenames, hashes, timestamps, evidence)

## 3. Signature Elements

### The Memory Trace
A subtle animated trace showing the retrieval path through the memory system when a query is executed. It animates exactly once to communicate "thinking through memory", rather than an endless loading spinner.

### Provenance Strip
Every query result exposes which memory types contributed to the answer using a compact strip (e.g., `EPISODIC 3 sources | SEMANTIC 7 nodes`).

## 4. Key Views

1. **Query View (`/`)**: A command-bar IDE-style search yielding editorial typography answers with clickable inline citations.
2. **Memory Graph (`/graph`)**: Interactive graph (pan, zoom, click) where shapes map to data types (e.g., Rectangle = File, Diamond = Commit).
3. **Timeline View (`/timeline`)**: A stratified timeline allowing time-scrubbing to reveal older repository states.
4. **Node Detail**: Contextual right-panel exposing paths, descriptions, dependents, and historical evidence.
