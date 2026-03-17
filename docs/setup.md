# Setup Instructions

## Prerequisites

- **Node.js 18+**
- **Ollama** — [ollama.com](https://ollama.com)
- **Model** — `llama3.1:latest`
- **Optional** — `nomic-embed-text` for embeddings (fallback works without it)

## Quick Start

```bash
git clone <this-repo>
cd CoDev
npm install
cp .env.example .env
ollama pull llama3.1:latest
npm run dev
```

Then open http://localhost:3000 and index the included `sample-repo/`.

## Step-by-Step Setup

### 1. Clone and Install

```bash
git clone <repo-url>
cd CoDev
npm install
```

### 2. Environment

```bash
cp .env.example .env
```

Edit `.env` if needed. Defaults:

| Variable | Default | Purpose |
|----------|---------|---------|
| `OLLAMA_BASE_URL` | `http://localhost:11434` | Ollama API URL |
| `OLLAMA_MODEL` | `llama3.1:latest` | LLM for generation |
| `OLLAMA_EMBEDDING_MODEL` | `nomic-embed-text` | Embedding model |
| `SERVER_PORT` | `4000` | Backend port |
| `NEXT_PUBLIC_API_BASE_URL` | `http://localhost:4000` | API URL for frontend |
| `TOP_K` | `5` | Chunks retrieved per query |

### 3. Ollama Setup

Ensure Ollama is installed and running:

```bash
ollama serve
```

Pull the required models:

```bash
ollama pull llama3.1:latest
ollama pull nomic-embed-text
```

If `nomic-embed-text` fails, CoDev uses a simple fallback (lower quality but functional).

### 4. Run

```bash
npm run dev
```

This starts:

- **Backend** — http://localhost:4000
- **Frontend** — http://localhost:3000

### 5. First Run

1. Open http://localhost:3000
2. Use **Browse** to select `sample-repo/` (or enter its path)
3. Click **Index**
4. Choose **Ask** and try: *"Explain how authentication works in this repository"*

## Alternative: Run Backend and Frontend Separately

```bash
# Terminal 1
npm run dev:server

# Terminal 2
npm run dev:web
```
