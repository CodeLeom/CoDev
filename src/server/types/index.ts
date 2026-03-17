export interface ChunkMetadata {
  filePath?: string;
  startIndex?: number;
  endIndex?: number;
}

export interface Chunk {
  id: string;
  content: string;
  metadata: ChunkMetadata;
}

export interface IndexMetadata {
  indexId: string;
  repoPath: string;
  filesIndexed: number;
  chunksCreated: number;
  skippedFiles: number;
  createdAt: string;
}

export interface RetrievedChunk {
  chunk: Chunk;
  score: number;
}

export interface RetrievalContext {
  chunks: (Chunk & { score?: number })[];
  query: string;
}
