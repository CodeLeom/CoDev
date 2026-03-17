# CoDev — Local Developer Knowledge Copilot

> Fully local. No API keys. No data leaves your machine.

CoDev is a local AI developer copilot that helps developers understand a codebase and generate technical content such as articles, API documentation, and Diátaxis-structured documentation entirely on-device, without sending code to any cloud AI service. CoDev is designed not just as a tool, but as a reference implementation for how to build local AI-powered developer workflows using retrieval and on-device inference.

## Features

- **Ask** — Chat with your indexed codebase
- **Article** — Generate technical articles from repository context
- **API Docs** — Generate structured API reference documentation
- **Diátaxis** — Generate documentation in tutorial, how-to, explanation, or reference style

CoDev uses local retrieval over indexed repository files and runs inference locally via [Ollama](https://ollama.com) using `llama3.1:latest`. Embeddings use a local embedding model when available, with a simple local fallback for lower-dependency setups.

## How It Works

CoDev indexes a repository by:

1. Loading and filtering source files
2. Splitting them into chunks
3. Generating embeddings locally
4. Storing them for retrieval

When you ask a question or generate content:

- CoDev retrieves relevant code snippets
- Passes them to the local model (`llama3.1:latest`)
- Generates grounded outputs based on actual repository context

This ensures answers are traceable and reduces hallucination.

## Documentation

Developer documentation for understanding and reproducing CoDev:

- [Overview](docs/overview.md) — What CoDev is and who it's for
- [Architecture](docs/architecture.md) — How the system works end-to-end
- [Setup](docs/setup.md) — Prerequisites and install instructions
- [Walkthrough](docs/walkthrough.md) — Step-by-step implementation guide
- [Code Structure](docs/code-structure.md) — Navigate the codebase
- [Extending](docs/extending.md) — Add file types, modes, and features
- [Diátaxis](docs/diataxis.md) — Documentation framework in CoDev

## Why Local AI?

- **Privacy** — Your code stays on your machine
- **No API costs** — No usage-based cloud billing
- **Offline-capable** — Useful without internet access after setup
- **Reproducible** — Easy to run locally with a consistent setup

## Why `llama3.1:latest`?

`llama3.1:latest` provides a good balance of output quality and local performance for this project. It works well for codebase Q&A, documentation drafting, and structured developer-facing outputs, while remaining simple to run through Ollama.

## Tested Environment

CoDev was tested locally with:

- macOS
- Node.js 18+
- Ollama running locally
- `llama3.1:latest`

## Local Setup

### Prerequisites

- Node.js 18+
- [Ollama](https://ollama.com) installed
- Model: `llama3.1:latest`
- Optional embedding model: `nomic-embed-text`

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

If `nomic-embed-text` is unavailable, CoDev falls back to a simpler local embedding strategy. Output quality may be lower, but the app remains functional.

## Environment

Edit `.env` if needed:

| Variable                   | Default                  | Description                   |
| -------------------------- | ------------------------ | ----------------------------- |
| `OLLAMA_BASE_URL`          | `http://localhost:11434` | Ollama API URL                |
| `OLLAMA_MODEL`             | `llama3.1:latest`        | Local LLM used for generation |
| `OLLAMA_EMBEDDING_MODEL`   | `nomic-embed-text`       | Embedding model               |
| `SERVER_PORT`              | `4000`                   | Express API port              |
| `NEXT_PUBLIC_API_BASE_URL` | `http://localhost:4000`  | API base URL for frontend     |
| `TOP_K`                    | `5`                      | Number of chunks to retrieve  |

## Run

```bash
npm run dev
```

* **Backend:** `http://localhost:4000`
* **Frontend:** `http://localhost:3000`

Or run them separately:

```bash
npm run dev:server
npm run dev:web
```

## Index a Project Folder

1. Open `http://localhost:3000`
2. Enter the **absolute path** to a folder
3. Click **Index**
4. Once indexing completes, choose a mode and submit a prompt

You can also use the included sample repository.

## Example Paths

```text
# macOS / Linux
/Users/yourname/Desktop/CoDev/sample-repo

# Relative to the project root
sample-repo
```

## Example Prompts

### Ask

* "Explain how authentication works in this repository"
* "Which files define the billing flow?"
* "Summarize the architecture of this project"

### Article

* "Write a beginner-friendly overview of this project"
* "Draft an article introducing this API to new developers"

### API Docs

* "Generate docs for the authentication endpoints"
* "Document the /login and /register routes"

## Diátaxis

CoDev supports the Diátaxis documentation framework, allowing the same codebase context to be transformed into different types of documentation:

- **Tutorial** — learning-oriented, step-by-step
- **How-to** — task-oriented and practical
- **Explanation** — conceptual understanding and rationale
- **Reference** — structured, factual lookup

This ensures generated documentation is fit for purpose, not one-size-fits-all.

### Example Prompts

* "Create a tutorial for using the auth module"
* "Write a how-to for adding JWT auth to a route"
* "Explain why the middleware stack is structured this way"
* "Generate reference docs for the auth controller"

## Sample Repo

A basic Express API is included in `sample-repo/` for demos and testing. It includes auth routes, user routes, middleware, and controller/service separation.

## API Endpoints

| Method | Path            | Description                                                                      |
| ------ | --------------- | -------------------------------------------------------------------------------- |
| GET    | `/api/health`   | Server and Ollama health check                                                   |
| POST   | `/api/index`    | Index a repository with `{ "repoPath": "/path" }`                                |
| POST   | `/api/ask`      | Ask a repository question with `{ "query": "..." }`                              |
| POST   | `/api/generate` | Generate content with `{ "mode": "...", "query": "...", "diataxisType": "..." }` |

## Common Issues

### Ollama not running

If you start the CoDev, then you try to ask a question and it return `fetch failed`, it means Ollama is not running.

> Make sure Ollama is running locally: Open your terminal and run the command below

```bash
ollama serve
```

### Model not found

```bash
ollama pull llama3.1:latest
```

### Empty or poor results

- Ensure the folder was indexed successfully
- Try increasing `TOP_K` in `.env`
- Avoid indexing large generated folders (e.g. `dist`, `build`, `coverage`)

### Slow responses

Local inference depends on machine performance. Close other heavy applications if needed.

## Notes

* CoDev is designed for local developer workflows and small-to-medium repositories
* Outputs are grounded in retrieved repository context
* Source file paths are returned to improve trust and traceability

## License

MIT