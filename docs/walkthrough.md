# Implementation Walkthrough

This walkthrough explains how CoDev works end-to-end, from indexing to generation.

---

## Step 1: Indexing a Repository

When you provide a path (or browse for a folder), CoDev:

1. **Validates the path** — Confirms it exists and is a directory.
2. **Loads files** — Recursively walks the tree, reads supported extensions (.js, .ts, .jsx, .tsx, .json, .md, .yml, .yaml, .txt).
3. **Filters** — Skips `node_modules`, `.git`, `dist`, lock files, and files over 200KB.
4. **Builds a project overview** — Creates a chunk with the file tree and package.json metadata for better context when there’s no README.
5. **Chunks content** — Splits each file into segments of ~1500 characters with 200-character overlap so related code stays together.

**Why chunking?** LLMs have context limits. Chunking lets us embed and retrieve only the most relevant snippets instead of whole files.

---

## Step 2: Creating Embeddings

Each chunk is converted into a vector (embedding):

- **With Ollama** — Uses `nomic-embed-text` to produce a semantic representation of the text.
- **Without it** — Uses a deterministic fallback (character-based) so the app still runs.

**What embeddings do:** They turn text into numbers so we can compare meaning. Two similar code snippets produce similar vectors. We use this for retrieval.

---

## Step 3: Retrieval

When you ask a question or request generation:

1. **Query embedding** — The user prompt is embedded into a vector.
2. **Similarity search** — Cosine similarity is computed between the query vector and every stored chunk vector.
3. **Top-k selection** — The k highest-scoring chunks are selected (default k=5, configurable via `TOP_K`).
4. **Context assembly** — Those chunks, with file paths, are passed to the prompt builder.

**Why cosine similarity?** It measures the angle between vectors. Similar content has a high similarity score (close to 1), so we get the most relevant code for the question.

---

## Step 4: Prompt Construction

The **prompt router** builds a mode-specific prompt:

1. **Base instructions** — Stay grounded in the retrieved context; don’t fabricate; cite file paths; respond in plain text.
2. **Retrieved context** — Each chunk is formatted with `[file/path.ts]\n<content>`.
3. **User query or task** — The original question or generation request.
4. **Mode-specific instructions** — Different guidance for Ask, Article, API Docs, and each Diátaxis type.

**Grounding:** The model is told to use only the provided context. This reduces hallucination and keeps answers traceable.

---

## Step 5: Generation Modes

| Mode | Purpose | Prompt focus |
|------|---------|--------------|
| **Ask** | Answer questions about the codebase | Direct, concise, with file references |
| **Article** | Technical articles and overviews | Headings, structure, developer-facing tone |
| **API Docs** | Structured API reference | Endpoints, methods, parameters, examples |
| **Diátaxis** | Documentation by purpose | Tutorial / how-to / explanation / reference |

Each mode uses the same retrieval pipeline but different prompt templates so the output fits the intended use.

---

## End-to-End Example

**User:** "How does authentication work in this repository?"

1. **Index** (already done) — Chunks from auth routes, middleware, and services are stored with embeddings.
2. **Query embedding** — "How does authentication work..." → vector.
3. **Retrieval** — Top 5 chunks include `routes/auth.js`, `middleware/auth.js`, `services/authService.js`.
4. **Prompt** — Those chunks + instructions + the user question.
5. **Ollama** — Returns an explanation based only on that context.
6. **UI** — Shows the answer and lists the source paths.
