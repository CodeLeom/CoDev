# Architecture Overview

## High-Level Diagram

```
┌─────────────────┐
│   Next.js UI    │
└────────┬────────┘
         │ HTTP
         ▼
┌─────────────────┐
│   Express API   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│  Repository Loader → File Filters → Chunker                  │
│         ↓                                                    │
│  Embedding Service (Ollama or fallback)                      │
│         ↓                                                    │
│  Vector Store (JSON on disk)                                  │
└─────────────────────────────────────────────────────────────┘
         │
         │  On query:
         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────┐
│    Retriever    │ ──► │  Prompt Router  │ ──► │   Ollama    │
│ (cosine search) │     │ (mode-specific)  │     │ llama3.1    │
└─────────────────┘     └─────────────────┘     └─────────────┘
```

## Key Components

| Component | Responsibility |
|----------|----------------|
| **Repository loader** | Recursively scans a path, reads supported files, respects ignore rules (node_modules, .git, etc.) |
| **Chunking system** | Splits file content into overlapping chunks (~1500 chars, 200 overlap) for embedding |
| **Embedding layer** | Converts text to vectors via Ollama (`nomic-embed-text`) or a simple local fallback |
| **Vector store** | Persists chunks + embeddings in `src/server/data/index.json` |
| **Retrieval** | Embeds the query, computes cosine similarity, returns top-k chunks |
| **Prompt router** | Builds mode-specific prompts (Ask, Article, API Docs, Diátaxis) with retrieved context |
| **LLM (Ollama)** | Generates responses using `llama3.1:latest` locally |

## Indexing Flow

1. **Load files**: `repoLoader` walks the directory tree and reads supported extensions (.js, .ts, .jsx, .tsx, .json, .md, .yml, .yaml, .txt).
2. **Filter**: Skip `node_modules`, `.git`, lock files, large files, and unsupported extensions.
3. **Chunk**: Split each file into overlapping segments with metadata (file path, position).
4. **Generate embeddings**: Send each chunk to the embedding model; receive a vector per chunk.
5. **Store**: Write chunks + embeddings to disk for later retrieval.
6. **Project overview**: A structural overview chunk (file tree + package.json) is added for better context when no README exists.

## Query Flow

1. **User submits prompt**: Via Ask, Article, API Docs, or Diátaxis mode.
2. **Embed query**: Convert the user query to a vector.
3. **Retrieve chunks**: Compute cosine similarity against stored vectors; take top-k (default 5).
4. **Build prompt**: Assemble retrieved chunks with mode-specific instructions and the user query.
5. **Send to LLM**: Call Ollama with the grounded prompt.
6. **Return response**: Stream back answer plus source file paths for traceability.

## Why This Design

- **Simple vector store**: JSON on disk keeps setup minimal. No external DB required.
- **Local embeddings**: Ensures full on-device operation; fallback keeps it working even without `nomic-embed-text`.
- **Explicit grounding**: Retrieved chunks are injected into the prompt; the model is instructed to stay within that context.
- **Source paths**: Every response includes file paths so developers can verify and navigate to the relevant code.
