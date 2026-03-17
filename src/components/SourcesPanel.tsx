"use client";

interface SourcesPanelProps {
  sourcePaths: string[];
}

export function SourcesPanel({ sourcePaths }: SourcesPanelProps) {
  if (!sourcePaths.length) return null;
  return (
    <div className="rounded-lg border border-stone-700 bg-stone-800/30 p-3 shrink-0">
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-stone-500">
        Source files
      </p>
      <ul className="list-inside list-disc space-y-1 text-sm text-stone-400">
        {sourcePaths.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
    </div>
  );
}
