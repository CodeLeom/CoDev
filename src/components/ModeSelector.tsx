"use client";

export type Mode = "ask" | "article" | "api-docs" | "diataxis";

export type DiataxisType = "tutorial" | "how-to" | "explanation" | "reference";

interface ModeSelectorProps {
  mode: Mode;
  diataxisType: DiataxisType;
  onModeChange: (mode: Mode) => void;
  onDiataxisTypeChange: (t: DiataxisType) => void;
  disabled?: boolean;
}

export function ModeSelector({
  mode,
  diataxisType,
  onModeChange,
  onDiataxisTypeChange,
  disabled,
}: ModeSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-stone-400">Mode</label>
      <select
        value={mode}
        onChange={(e) => onModeChange(e.target.value as Mode)}
        disabled={disabled}
        className="w-full rounded border border-stone-600 bg-stone-800 px-3 py-2 text-sm text-stone-200 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 disabled:opacity-50"
      >
        <option value="ask">Ask</option>
        <option value="article">Article</option>
        <option value="api-docs">API Docs</option>
        <option value="diataxis">Diátaxis</option>
      </select>
      {mode === "diataxis" && (
        <div className="space-y-1">
          <label className="block text-sm font-medium text-stone-500">
            Diátaxis type
          </label>
          <select
            value={diataxisType}
            onChange={(e) => onDiataxisTypeChange(e.target.value as DiataxisType)}
            disabled={disabled}
            className="w-full rounded border border-stone-600 bg-stone-800 px-3 py-2 text-sm text-stone-200 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 disabled:opacity-50"
          >
            <option value="tutorial">Tutorial</option>
            <option value="how-to">How-to</option>
            <option value="explanation">Explanation</option>
            <option value="reference">Reference</option>
          </select>
        </div>
      )}
    </div>
  );
}
