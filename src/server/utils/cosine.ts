export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  let dot = 0,
    na = 0,
    nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb);
  return denom === 0 ? 0 : dot / denom;
}

export interface Scored<T> {
  item: T;
  score: number;
}

export function topK<T>(items: T[], scores: number[], k: number): Scored<T>[] {
  const indexed = items.map((item, i) => ({ item, score: scores[i] }));
  indexed.sort((a, b) => b.score - a.score);
  return indexed.slice(0, k);
}

export function findTopK<T>(
  scored: { chunk: T; score: number }[],
  k: number
): { chunk: T; score: number }[] {
  const sorted = [...scored].sort((a, b) => b.score - a.score);
  return sorted.slice(0, k);
}
