# Code Structure

## Overview

CoDev uses a single repo with a clear split between backend (Express) and frontend (Next.js).

```
CoDev/
├── src/
│   ├── server/          # Express API + core logic
│   ├── app/             # Next.js App Router pages
│   └── components/      # Shared UI components
├── sample-repo/         # Demo Express API to index
├── docs/                # Documentation
└── package.json
```

---

## Backend (`src/server/`)

### Routes (`src/server/routes/`)

| File | Responsibility |
|------|----------------|
| `health.ts` | `GET /api/health` — Server and Ollama status |
| `indexRepo.ts` | `POST /api/index` — Index by path or uploaded files |
| `ask.ts` | `POST /api/ask` — Q&A with retrieved context |
| `generate.ts` | `POST /api/generate` — Article, API Docs, Diátaxis |

### Services (`src/server/services/`)

| File | Responsibility |
|------|----------------|
| `indexingService.ts` | Repo loading, chunking, embedding, persistence |
| `retrievalService.ts` | Query embedding, cosine similarity, top-k retrieval |
| `embeddingService.ts` | Calls Ollama embeddings or fallback |
| `ollamaService.ts` | Calls Ollama for LLM generation |
| `promptRouter.ts` | Builds mode-specific prompts from chunks |

### Utils (`src/server/utils/`)

| File | Responsibility |
|------|----------------|
| `repoLoader.ts` | Recursive file loading, path validation |
| `fileFilters.ts` | Ignore rules, supported extensions, size limits |
| `chunker.ts` | Splits text into overlapping chunks |
| `cosine.ts` | Cosine similarity and top-k selection |

### Data

- `src/server/data/` — Stores `index.json` (chunks + embeddings). Gitignored.

---

## Frontend (`src/app/` + `src/components/`)

### App

| File | Responsibility |
|------|----------------|
| `app/layout.tsx` | Root layout, metadata |
| `app/page.tsx` | Main UI, state, API calls |
| `app/globals.css` | Global styles (Tailwind) |

### Components

| Component | Responsibility |
|-----------|----------------|
| `RepoSelector.tsx` | Path input, Browse picker, Index button |
| `ModeSelector.tsx` | Ask / Article / API Docs / Diátaxis + subtype |
| `PromptBox.tsx` | Query input and submit |
| `OutputPanel.tsx` | Renders response, strips markdown |
| `SourcesPanel.tsx` | Lists source file paths |
| `StatusBar.tsx` | Indexing status and stats |

---

## Key Entry Points

| Task | Where to look |
|------|---------------|
| Change indexing behavior | `indexingService.ts`, `repoLoader.ts`, `fileFilters.ts` |
| Change retrieval | `retrievalService.ts`, `cosine.ts` |
| Add a new generation mode | `promptRouter.ts`, `generate.ts` |
| Adjust prompts | `promptRouter.ts` |
| Modify UI | `app/page.tsx`, `src/components/` |

---

## If You Join This Project

1. Start with `src/server/index.ts` to see how the API is wired.
2. Follow `POST /api/index` → `indexingService` → `repoLoader` + `chunker` + `embeddingService`.
3. Follow `POST /api/ask` → `retrievalService` → `promptRouter` → `ollamaService`.
4. Inspect `promptRouter.ts` for the exact prompt templates.
