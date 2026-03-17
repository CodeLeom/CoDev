# CoDev — Local Developer Knowledge Copilot

CoDev is a local AI developer copilot that helps you understand a codebase and generate technical contents such as articles, API docs, and Diátaxis-structured documentation, **entirely on-device** without sending code to any cloud AI service.

## Features

- **Ask** — Chat with your indexed codebase
- **Article** — Generate technical articles from the codebase context
- **API Docs** — Generate structured API reference documentation
- **Diátaxis** — Generate documentation in tutorial, how-to, explanation, or reference style

All inference runs locally via [Ollama](https://ollama.com) using `llama3.1:latest`. Embeddings use a local model (or a simple fallback when unavailable).

## Why Local AI?

- **Privacy** — Your code never leaves your machine
- **No API costs** — Run as much as you like
- **Offline-capable** — Work without internet
- **Reproducible** — Same setup everywhere

## Why llama3.1:latest?

A good balance of quality and speed for my laptop (MacBook Pro M4 Pro). Runs well on 16GB+ RAM. Easy to swap for another Ollama model if needed.

## Local Setup

### Prerequisites

- Node.js 18+
- [Ollama](https://ollama.com) installed
- Model: `llama3.1:latest`
- Embedding model (optional): `nomic-embed-text`

### Install

```bash
git clone <this-repo>
cd CoDev
npm install
cp .env.example .env
```

### Ollama Setup

```bash
ollama pull llama3.1:latest
ollama pull nomic-embed-text
```

If `nomic-embed-text` is not available, CoDev falls back to a simple local embedding method (lower quality but functional).

### Environment

Edit `.env` if needed:

| Variable | Default | Description |
|----------|---------|-------------|
| `OLLAMA_BASE_URL` | `http://localhost:11434` | Ollama API URL |
| `OLLAMA_MODEL` | `llama3.1:latest` | LLM model for generation |
| `OLLAMA_EMBEDDING_MODEL` | `nomic-embed-text` | Embedding model |
| `SERVER_PORT` | `4000` | Express API port |
| `NEXT_PUBLIC_API_BASE_URL` | `http://localhost:4000` | API base URL for frontend |
| `TOP_K` | `5` | Number of chunks to retrieve |

### Run

```bash
npm run dev
```

- **Backend**: http://localhost:4000
- **Frontend**: http://localhost:3000

Or run separately:

```bash
npm run dev:server
npm run dev:web
```

### Index a Repository

1. Open http://localhost:3000
2. Enter the **absolute path** to a repository (e.g. `/Users/you/projects/my-app` or `./sample-repo` this is avalaible in this codebase, so, it is relative to the project root)
3. Click **Index**
4. Once indexed, select a mode and ask questions or generate content

### Example Paths

```text
# macOS / Linux
/Users/yourname/Desktop/CoDev/sample-repo

# Or relative to where the server runs (project root)
sample-repo
```

## Example Prompts

**Ask**
- "Explain how authentication works in this repository"
- "Which files define the billing flow?"
- "Summarize the architecture of this project"

**Article**
- "Write a beginner-friendly overview of this project"
- "Draft an article introducing this API to new developers"

**API Docs**
- "Generate docs for the authentication endpoints"
- "Document the /login and /register routes"

**Diátaxis**
- "Create a tutorial for using the auth module"
- "Write a how-to for adding JWT auth to a route"
- "Explain why the middleware stack is structured this way"
- "Generate reference docs for the auth controller"

## Sample Repo

A small Express API is included at `sample-repo/` for demos. It has auth routes, users routes, middleware, and controller/service separation.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Server and Ollama health |
| POST | `/api/index` | Index a repository (`{ "repoPath": "/path" }`) |
| POST | `/api/ask` | Ask a question (`{ "query": "..." }`) |
| POST | `/api/generate` | Generate content (`{ "mode", "query", "diataxisType" }`) |

## License
MIT
