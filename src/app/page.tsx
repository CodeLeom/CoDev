"use client";

import { useState } from "react";
import { RepoSelector } from "@/components/RepoSelector";
import { ModeSelector } from "@/components/ModeSelector";
import { PromptBox } from "@/components/PromptBox";
import { OutputPanel } from "@/components/OutputPanel";
import { SourcesPanel } from "@/components/SourcesPanel";
import { StatusBar } from "@/components/StatusBar";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export default function Home() {
  const [indexed, setIndexed] = useState(false);
  const [indexStats, setIndexStats] = useState<{
    filesIndexed: number;
    chunksCreated: number;
    skippedFiles: number;
    indexId: string;
  } | null>(null);
  const [indexError, setIndexError] = useState<string | null>(null);
  const [isIndexing, setIsIndexing] = useState(false);
  const [mode, setMode] = useState<"ask" | "article" | "api-docs" | "diataxis">(
    "ask"
  );
  const [diataxisType, setDiataxisType] = useState<
    "tutorial" | "how-to" | "explanation" | "reference"
  >("reference");
  const [output, setOutput] = useState("");
  const [sourcePaths, setSourcePaths] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleIndex(path: string) {
    setIsIndexing(true);
    setIndexError(null);
    try {
      const res = await fetch(`${API_BASE}/api/index`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoPath: path }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Indexing failed");
      setIndexed(true);
      setIndexStats({
        filesIndexed: data.filesIndexed ?? 0,
        chunksCreated: data.chunksCreated ?? 0,
        skippedFiles: data.skippedFiles ?? 0,
        indexId: data.indexId ?? "index",
      });
    } catch (err) {
      setIndexError(err instanceof Error ? err.message : "Indexing failed");
    } finally {
      setIsIndexing(false);
    }
  }

  async function handleIndexFromFiles(
    files: { relativePath: string; content: string }[],
    folderName: string
  ) {
    setIsIndexing(true);
    setIndexError(null);
    try {
      const res = await fetch(`${API_BASE}/api/index`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files, folderName }),
      });
      const text = await res.text();
      let data: { error?: string; filesIndexed?: number; chunksCreated?: number; skippedFiles?: number; indexId?: string };
      try {
        data = JSON.parse(text);
      } catch {
        if (text.startsWith("<!") || text.includes("<!DOCTYPE")) {
          throw new Error("Backend returned an HTML error page. Make sure the server is running (npm run dev) and the folder is not too large.");
        }
        throw new Error(text || "Indexing failed");
      }
      if (!res.ok) throw new Error(data.error || "Indexing failed");
      setIndexed(true);
      setIndexStats({
        filesIndexed: data.filesIndexed ?? 0,
        chunksCreated: data.chunksCreated ?? 0,
        skippedFiles: data.skippedFiles ?? 0,
        indexId: data.indexId ?? "index",
      });
    } catch (err) {
      setIndexError(err instanceof Error ? err.message : "Indexing failed");
    } finally {
      setIsIndexing(false);
    }
  }

  const handleSubmit = async (query: string) => {
    if (!indexed || !query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      if (mode === "ask") {
        const res = await fetch(`${API_BASE}/api/ask`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Ask failed");
        setOutput(data.answer);
        setSourcePaths(data.sourcePaths || []);
      } else {
        const body: Record<string, string> = { mode, query };
        if (mode === "diataxis") body.diataxisType = diataxisType;
        const res = await fetch(`${API_BASE}/api/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Generation failed");
        setOutput(data.generatedOutput);
        setSourcePaths(data.sourcePaths || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-stone-950 text-stone-200">
      <aside className="w-80 border-r border-stone-700 flex flex-col bg-stone-900/50 shrink-0">
        <div className="p-4 border-b border-stone-700">
          <h1 className="font-semibold text-lg text-stone-100">CoDev</h1>
          <p className="text-xs text-stone-400 mt-1">
            Local AI developer copilot for codebase Q&A and documentation
          </p>
        </div>
        <div className="p-4 flex-1 overflow-auto space-y-4">
          <RepoSelector
            onIndex={handleIndex}
            onIndexFromFiles={handleIndexFromFiles}
            isIndexing={isIndexing}
            indexStats={indexStats}
            error={indexError}
          />
          <ModeSelector
            mode={mode}
            diataxisType={diataxisType}
            onModeChange={setMode}
            onDiataxisTypeChange={setDiataxisType}
            disabled={loading}
          />
        </div>
        <StatusBar
          indexed={indexed}
          indexStats={indexStats}
          error={indexError}
          loading={isIndexing}
        />
      </aside>
      <main className="flex-1 flex flex-col min-w-0 p-4 overflow-hidden">
        <div className="space-y-4 flex-1 flex flex-col min-h-0">
          <PromptBox
            onSubmit={handleSubmit}
            disabled={!indexed || loading}
            placeholder={
              mode === "ask"
                ? "Ask about the codebase..."
                : "Describe what you want to generate..."
            }
          />
          <OutputPanel content={output} isLoading={loading} error={error} />
          <SourcesPanel sourcePaths={sourcePaths} />
        </div>
      </main>
    </div>
  );
}
