import path from "path";
import fs from "fs";
import { loadRepoFiles, validateRepoPath } from "../utils/repoLoader";
import type { ChunkMetadata } from "../types";
import { chunkContent } from "../utils/chunker";
import { createEmbeddings } from "./embeddingService";
import type { Chunk } from "../types";

const DATA_DIR = path.join(process.cwd(), "src", "server", "data");
const INDEX_FILE = path.join(DATA_DIR, "index.json");

export interface IndexResult {
  success: boolean;
  filesIndexed: number;
  chunksCreated: number;
  skippedFiles: number;
  indexId: string;
}

export interface StoredIndex {
  indexId: string;
  repoPath: string;
  filesIndexed: number;
  chunksCreated: number;
  chunks: Array<{
    id: string;
    content: string;
    embedding: number[];
    metadata: ChunkMetadata;
  }>;
  createdAt: string;
}

function slugify(str: string): string {
  return str
    .replace(/[/\\]/g, "-")
    .replace(/^[-]+|[-]+$/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase()
    .slice(0, 50);
}

function buildProjectOverview(
  files: Array<{ relativePath: string; content?: string }>
): string {
  const paths = files.map((f) => f.relativePath.replace(/\\/g, "/"));
  const tree = new Map<string, Set<string>>();
  tree.set("", new Set());
  for (const p of paths) {
    const parts = p.split("/");
    for (let i = 0; i < parts.length; i++) {
      const parent = parts.slice(0, i).join("/");
      const name = parts[i];
      if (!tree.has(parent)) tree.set(parent, new Set());
      tree.get(parent)!.add(name);
    }
  }
  function render(dir: string, indent: number): string[] {
    const entries = [...(tree.get(dir) || [])].filter((e) => e);
    if (entries.length === 0) return [];
    const lines: string[] = [];
    const sorted = entries.sort((a, b) => {
      const aIsDir = tree.has(dir ? `${dir}/${a}` : a) || !a.includes(".");
      const bIsDir = tree.has(dir ? `${dir}/${b}` : b) || !b.includes(".");
      if (aIsDir && !bIsDir) return -1;
      if (!aIsDir && bIsDir) return 1;
      return a.localeCompare(b);
    });
    for (const name of sorted) {
      const full = dir ? `${dir}/${name}` : name;
      const childDir = dir ? `${dir}/${name}` : name;
      const hasChildren = tree.has(childDir);
      lines.push(`${"  ".repeat(indent)}${name}${hasChildren ? "/" : ""}`);
      if (hasChildren) lines.push(...render(childDir, indent + 1));
    }
    return lines;
  }
  const treeStr = render("", 0).join("\n");
  let pkgSummary = "";
  const pkgFile = files.find((f) =>
    f.relativePath.replace(/\\/g, "/").endsWith("package.json")
  );
  if (pkgFile?.content) {
    try {
      const pkg = JSON.parse(pkgFile.content) as {
        name?: string;
        description?: string;
        scripts?: Record<string, string>;
        dependencies?: Record<string, string>;
      };
      const parts: string[] = [];
      if (pkg.name) parts.push(`Name: ${pkg.name}`);
      if (pkg.description) parts.push(`Description: ${pkg.description}`);
      if (pkg.scripts && Object.keys(pkg.scripts).length > 0) {
        parts.push(`Scripts: ${Object.keys(pkg.scripts).join(", ")}`);
      }
      if (parts.length) pkgSummary = "\nPackage info: " + parts.join(". ");
    } catch {
      /* ignore */
    }
  }
  return `Project structure (${paths.length} files):\n\n${treeStr}${pkgSummary}`;
}

export async function indexRepository(repoPath: string): Promise<IndexResult> {
  const validation = validateRepoPath(repoPath);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const { files, skippedCount } = await loadRepoFiles(repoPath);
  const chunks: Chunk[] = [];
  let chunkId = 0;

  const overviewContent = buildProjectOverview(
    files.map((f) => ({ relativePath: f.relativePath, content: f.content }))
  );
  chunks.push({
    id: `chunk-${chunkId++}`,
    content: overviewContent,
    metadata: { filePath: "[project-structure]" },
  });

  for (const file of files) {
    const fileChunks = chunkContent(file.content, file.relativePath);
    for (const c of fileChunks) {
      chunks.push({
        id: `chunk-${chunkId++}`,
        content: c.content,
        metadata: {
          ...c.metadata,
          filePath: file.relativePath,
        },
      });
    }
  }

  if (chunks.length === 0) {
    throw new Error("No content could be indexed. No valid text files found.");
  }

  const embeddings = await createEmbeddings(chunks.map((c) => c.content));
  const chunksWithEmbeddings = chunks.map((c, i) => ({
    id: c.id,
    content: c.content,
    embedding: embeddings[i],
    metadata: c.metadata,
  }));

  const indexId = slugify(path.basename(repoPath)) || "index";
  const stored: StoredIndex = {
    indexId,
    repoPath,
    filesIndexed: files.length,
    chunksCreated: chunks.length,
    chunks: chunksWithEmbeddings,
    createdAt: new Date().toISOString(),
  };

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(INDEX_FILE, JSON.stringify(stored, null, 0), "utf-8");

  return {
    success: true,
    filesIndexed: files.length,
    chunksCreated: chunks.length,
    skippedFiles: skippedCount,
    indexId,
  };
}

export function loadIndex(): StoredIndex | null {
  if (!fs.existsSync(INDEX_FILE)) return null;
  const data = fs.readFileSync(INDEX_FILE, "utf-8");
  return JSON.parse(data) as StoredIndex;
}

export interface IndexFilesInput {
  relativePath: string;
  content: string;
}

export async function indexFromFiles(
  files: IndexFilesInput[],
  folderName: string = "browse"
): Promise<IndexResult> {
  const chunks: Chunk[] = [];
  let chunkId = 0;

  const overviewContent = buildProjectOverview(files);
  chunks.push({
    id: `chunk-${chunkId++}`,
    content: overviewContent,
    metadata: { filePath: "[project-structure]" },
  });

  for (const file of files) {
    const fileChunks = chunkContent(file.content, file.relativePath);
    for (const c of fileChunks) {
      chunks.push({
        id: `chunk-${chunkId++}`,
        content: c.content,
        metadata: {
          ...c.metadata,
          filePath: file.relativePath,
        },
      });
    }
  }

  if (chunks.length === 0) {
    throw new Error("No content could be indexed. No valid text files found.");
  }

  const embeddings = await createEmbeddings(chunks.map((c) => c.content));
  const chunksWithEmbeddings = chunks.map((c, i) => ({
    id: c.id,
    content: c.content,
    embedding: embeddings[i],
    metadata: c.metadata,
  }));

  const indexId = slugify(folderName) || "index";
  const stored: StoredIndex = {
    indexId,
    repoPath: `[browse:${folderName}]`,
    filesIndexed: files.length,
    chunksCreated: chunks.length,
    chunks: chunksWithEmbeddings,
    createdAt: new Date().toISOString(),
  };

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(INDEX_FILE, JSON.stringify(stored, null, 0), "utf-8");

  return {
    success: true,
    filesIndexed: files.length,
    chunksCreated: chunks.length,
    skippedFiles: 0,
    indexId,
  };
}

export const indexingService = {
  indexRepository,
  indexFromFiles,
  loadIndex,
};
