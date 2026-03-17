"use client";

function stripMarkdown(text: string): string {
  return text
    .replace(/#{1,6}\s+/g, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^\s*[-*+]\s+/gm, "  ")
    .replace(/^\s*\d+\.\s+/gm, "  ")
    .trim();
}

interface OutputPanelProps {
  content: string | null;
  isLoading?: boolean;
  error?: string | null;
}

export function OutputPanel({ content, isLoading, error }: OutputPanelProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-stone-700 bg-stone-800/50 p-4 flex-1 overflow-auto">
        <p className="text-sm text-stone-500">Generating…</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="rounded-lg border border-red-900/50 bg-red-950/30 p-4 flex-1 overflow-auto">
        <p className="text-sm text-red-400">{error}</p>
      </div>
    );
  }
  if (!content) {
    return (
      <div className="rounded-lg border border-stone-700 bg-stone-800/50 p-4 flex-1 overflow-auto">
        <p className="text-sm text-stone-500">Output will appear here.</p>
      </div>
    );
  }
  const plainContent = stripMarkdown(content);
  return (
    <div className="rounded-lg border border-stone-700 bg-stone-800/50 p-4 flex-1 overflow-auto">
      <pre className="whitespace-pre-wrap font-sans text-sm text-stone-300 leading-relaxed">
        {plainContent}
      </pre>
    </div>
  );
}
