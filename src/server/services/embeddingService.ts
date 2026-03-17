const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const EMBEDDING_MODEL = process.env.OLLAMA_EMBEDDING_MODEL || 'nomic-embed-text';

export interface EmbeddingResult {
  embedding: number[];
  model: string;
}

let _embeddingModelOk: boolean | null = null;

export async function embed(text: string): Promise<number[]> {
  try {
    const res = await fetch(`${OLLAMA_BASE_URL}/api/embeddings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: EMBEDDING_MODEL, prompt: text }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Ollama embeddings failed: ${res.status} ${text}`);
    }
    const data = (await res.json()) as { embedding?: number[] };
    if (!data.embedding || !Array.isArray(data.embedding)) {
      throw new Error('Invalid embedding response');
    }
    _embeddingModelOk = true;
    return data.embedding;
  } catch (err) {
    _embeddingModelOk = false;
    return fallbackEmbed(text);
  }
}

function fallbackEmbed(text: string): number[] {
  const dim = 384;
  const vec = new Array(dim).fill(0);
  for (let i = 0; i < text.length; i++) {
    const j = (text.charCodeAt(i) * 7 + i) % dim;
    vec[j] += 0.1;
  }
  const norm = Math.sqrt(vec.reduce((a, b) => a + b * b, 0)) || 1;
  return vec.map((v) => v / norm);
}

export async function embedMany(texts: string[]): Promise<number[][]> {
  const results: number[][] = [];
  for (const t of texts) {
    results.push(await embed(t));
  }
  return results;
}

export function isEmbeddingModelOk(): boolean {
  return _embeddingModelOk === true;
}

export const createEmbeddings = embedMany;
export const embedQuery = embed;
