"use client";

interface StatusBarProps {
  indexed: boolean;
  indexStats?: {
    filesIndexed: number;
    chunksCreated: number;
    skippedFiles?: number;
    indexId?: string;
  } | null;
  error?: string | null;
  loading?: boolean;
}

export function StatusBar({
  indexed,
  indexStats,
  error,
  loading,
}: StatusBarProps) {
  return (
    <div className="p-4 border-t border-stone-700">
      {error && (
        <p className="text-sm text-red-400 mb-2">{error}</p>
      )}
      <div className="text-xs text-stone-500 space-y-1">
        {loading ? (
          <span>Indexing…</span>
        ) : indexed && indexStats ? (
          <>
            <span>Indexed {indexStats.filesIndexed} files</span>
            <span className="mx-2">·</span>
            <span>{indexStats.chunksCreated} chunks</span>
            {indexStats.skippedFiles && indexStats.skippedFiles > 0 && (
              <>
                <span className="mx-2">·</span>
                <span>Skipped {indexStats.skippedFiles} files</span>
              </>
            )}
          </>
        ) : (
          <span>Enter repo path and click Index</span>
        )}
      </div>
    </div>
  );
}
