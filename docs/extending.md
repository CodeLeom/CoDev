# Extending CoDev

## Add New File Types

Edit `src/server/utils/fileFilters.ts`:

```ts
const SUPPORTED_EXT = new Set([
  '.js', '.ts', '.jsx', '.tsx', '.json', '.md', '.yml', '.yaml', '.txt',
  '.py', '.go', '.rs',  // add more as needed
]);
```

Keep `repoLoader` path validation and `shouldIgnorePath` in sync if you change semantics.

---

## Add a New Generation Mode

1. **Create the prompt**: In `src/server/services/promptRouter.ts`:

```ts
export function buildMyModePrompt(query: string, chunks: RetrievedChunk[]): string {
  const context = formatContext(chunks);
  return `${baseInstructions()}
## Retrieved Context
${context}
## Task
${query}
Your custom instructions here...`;
}
```

2. **Register it**: Add to the `promptRouter` object and the switch in `generate.ts`.
3. **Frontend**: Add the mode to `ModeSelector.tsx` and handle it in `page.tsx`.

---

## Swap Models

Change `.env`:

```
OLLAMA_MODEL=llama3.2:latest
OLLAMA_EMBEDDING_MODEL=nomic-embed-text
```

Then pull the new model:

```bash
ollama pull llama3.2:latest
```

---

## Improve Retrieval

**Increase context**: Bump `TOP_K` in `.env` (more chunks = more context, larger prompts).

**Better embeddings**: Use a stronger embedding model if Ollama supports it; ensure fallback behavior is acceptable.

**Reranking**: Add a second pass that scores or filters the top-k before building the prompt (e.g., by relevance heuristics).

**Hybrid search**: Combine embeddings with keyword/BM25 for exact matches on names and identifiers.

---

## Future Ideas

| Idea | Notes |
|------|------|
| **AST parsing** | Use tree-sitter or similar to chunk by functions/classes instead of raw text |
| **OpenAPI extraction** | Derive API docs from route decorators or OpenAPI specs |
| **Streaming responses** | Stream Ollama output for better perceived performance |
| **Multiple indexes** | Support multiple repos and let users switch |
| **Source highlighting** | Highlight retrieved regions in the UI |
| **Export formats** | Export generated docs as Markdown or HTML files |
