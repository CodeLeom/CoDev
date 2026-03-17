import { loadIndex } from "./indexingService";
import { embedQuery } from "./embeddingService";
import { cosineSimilarity, findTopK } from "../utils/cosine";

export interface RetrievedChunk {
  content: string;
  metadata: { filePath?: string };
  score: number;
}

const DEFAULT_TOP_K = parseInt(process.env.TOP_K || "5", 10) || 5;

export async function retrieve(
  query: string,
  topK: number = DEFAULT_TOP_K
): Promise<RetrievedChunk[]> {
  const index = loadIndex();
  if (!index || !index.chunks?.length) {
    throw new Error("No index found. Please index a repository first.");
  }

  const queryEmbedding = await embedQuery(query);
  const scores = index.chunks.map((chunk) => ({
    chunk,
    score: cosineSimilarity(queryEmbedding, chunk.embedding),
  }));
  const top = findTopK(scores, topK);

  return top.map(({ chunk, score }: { chunk: (typeof index.chunks)[0]; score: number }) => ({
    content: chunk.content,
    metadata: chunk.metadata || {},
    score,
  }));
}

export const retrievalService = {
  retrieve,
};
