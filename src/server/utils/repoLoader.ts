import * as fs from "fs/promises";
import * as path from "path";
import { existsSync } from "fs";
import { shouldIgnorePath, shouldSkipBySize } from './fileFilters';

export interface LoadedFile {
  relativePath: string;
  content: string;
}

export interface LoadRepoResult {
  files: LoadedFile[];
  skippedCount: number;
}

export function validateRepoPath(repoPath: string): { valid: boolean; error?: string } {
  if (!repoPath || typeof repoPath !== "string") {
    return { valid: false, error: "repoPath is required" };
  }
  const abs = path.resolve(repoPath);
  if (!existsSync(abs)) {
    return { valid: false, error: "Path does not exist" };
  }
  return { valid: true };
}

export async function loadRepoFiles(repoPath: string): Promise<LoadRepoResult> {
  const results: LoadedFile[] = [];
  let skippedCount = 0;
  const absPath = path.resolve(repoPath);

  async function walk(dir: string, relBase: string): Promise<void> {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const rel = path.join(relBase, e.name);
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (shouldIgnorePath(rel)) { skippedCount++; continue; }
        await walk(full, rel);
      } else if (e.isFile()) {
        if (shouldIgnorePath(rel)) { skippedCount++; continue; }
        try {
          const stat = await fs.stat(full);
          if (shouldSkipBySize(stat.size)) { skippedCount++; continue; }
          const content = await fs.readFile(full, 'utf-8');
          const normalized = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
          results.push({ relativePath: rel, content: normalized });
        } catch {
          skippedCount++;
        }
      }
    }
  }

  const stat = await fs.stat(absPath);
  if (!stat.isDirectory()) {
    throw new Error("Path is not a directory");
  }
  await walk(absPath, "");
  return { files: results, skippedCount };
}
