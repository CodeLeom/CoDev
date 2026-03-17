const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.1:latest';

export interface OllamaHealth {
  ok: boolean;
  reachable: boolean;
  modelName: string;
  error?: string;
}

export async function checkOllamaHealth(): Promise<OllamaHealth> {
  try {
    const res = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      return {
        ok: false,
        reachable: true,
        modelName: OLLAMA_MODEL,
        error: `Ollama returned ${res.status}`,
      };
    }
    const data = (await res.json()) as { models?: { name: string }[] };
    const models = data.models || [];
    const hasModel = models.some(
      (m) =>
        m.name === OLLAMA_MODEL ||
        m.name.startsWith(OLLAMA_MODEL) ||
        m.name.includes('llama3.1')
    );
    return {
      ok: hasModel,
      reachable: true,
      modelName: OLLAMA_MODEL,
      error: hasModel ? undefined : `Model ${OLLAMA_MODEL} not found. Run: ollama pull ${OLLAMA_MODEL}`,
    };
  } catch (err) {
    return {
      ok: false,
      reachable: false,
      modelName: OLLAMA_MODEL,
      error: err instanceof Error ? err.message : 'Ollama not reachable. Is it running?',
    };
  }
}

export async function generateCompletion(prompt: string): Promise<string> {
  const res = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt,
      stream: false,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Ollama generate failed: ${res.status} ${text}`);
  }
  const data = (await res.json()) as { response?: string };
  return data.response || '';
}

export const ollamaService = {
  generate: generateCompletion,
  checkHealth: checkOllamaHealth,
};
