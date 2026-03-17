"use client";

import { useState, useRef } from "react";

const IGNORE_DIRS = new Set([
  "node_modules", ".git", ".next", "dist", "build", "coverage",
  ".turbo", ".cache", "__pycache__", ".venv", "venv",
]);
const SUPPORTED_EXT = new Set([".js", ".ts", ".jsx", ".tsx", ".json", ".md", ".yml", ".yaml", ".txt"]);
const IGNORE_FILES = new Set(["package-lock.json", "yarn.lock", "pnpm-lock.yaml", "bun.lock"]);
const MAX_FILE_SIZE = 200 * 1024;

function shouldIncludeFile(relPath: string, size: number): boolean {
  const parts = relPath.split("/");
  for (const p of parts) {
    if (IGNORE_DIRS.has(p)) return false;
  }
  const base = relPath.split("/").pop() || "";
  if (IGNORE_FILES.has(base)) return false;
  const ext = "." + (relPath.split(".").pop() || "").toLowerCase();
  if (!SUPPORTED_EXT.has(ext)) return false;
  if (size > MAX_FILE_SIZE) return false;
  return true;
}

interface RepoSelectorProps {
  onIndex: (path: string) => Promise<void>;
  onIndexFromFiles: (files: { relativePath: string; content: string }[], folderName: string) => Promise<void>;
  isIndexing: boolean;
  indexStats?: { filesIndexed: number; chunksCreated: number; skippedFiles: number; indexId: string } | null;
  error?: string | null;
}

export function RepoSelector({ onIndex, onIndexFromFiles, isIndexing, indexStats, error }: RepoSelectorProps) {
  const [repoPath, setRepoPath] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleIndex() {
    if (!repoPath.trim()) return;
    await onIndex(repoPath.trim());
  }

  async function handleBrowse(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length || isIndexing) return;
    const toProcess: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (shouldIncludeFile(f.webkitRelativePath || f.name, f.size)) toProcess.push(f);
    }
    if (toProcess.length === 0) {
      return;
    }
    const folderName = toProcess[0].webkitRelativePath?.split("/")[0] || "browse";
    const fileContents: { relativePath: string; content: string }[] = [];
    for (const f of toProcess) {
      try {
        const content = await f.text();
        fileContents.push({ relativePath: f.webkitRelativePath || f.name, content });
      } catch {
        /* skip unreadable */
      }
    }
    if (fileContents.length > 0) {
      await onIndexFromFiles(fileContents, folderName);
    }
    e.target.value = "";
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-stone-400">
        Repository path
      </label>
      <div className="flex flex-wrap gap-2">
        <input
          type="text"
          value={repoPath}
          onChange={(e) => setRepoPath(e.target.value)}
          placeholder="/path/to/repo or browse"
          className="flex-1 min-w-0 rounded border border-stone-600 bg-stone-800 px-3 py-2 text-sm text-stone-200 placeholder-stone-500 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
          disabled={isIndexing}
        />
        <input
          ref={fileInputRef}
          type="file"
          {...({
            webkitdirectory: "",
            directory: "",
          } as React.InputHTMLAttributes<HTMLInputElement>)}
          multiple
          className="hidden"
          onChange={handleBrowse}
          disabled={isIndexing}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isIndexing}
          className="rounded border border-stone-600 bg-stone-800 px-3 py-2 text-sm text-stone-200 hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Browse…
        </button>
        <button
          onClick={handleIndex}
          disabled={isIndexing || !repoPath.trim()}
          className="rounded bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isIndexing ? "Indexing…" : "Index"}
        </button>
      </div>
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
      {indexStats && !error && (
        <p className="text-sm text-stone-500">
          Indexed {indexStats.filesIndexed} files, {indexStats.chunksCreated} chunks.
          {indexStats.skippedFiles > 0 && ` Skipped ${indexStats.skippedFiles} files.`}
        </p>
      )}
    </div>
  );
}
