"use client";

import { useState } from "react";

interface PromptBoxProps {
  onSubmit: (prompt: string) => Promise<void>;
  disabled?: boolean;
  placeholder?: string;
}

export function PromptBox({
  onSubmit,
  disabled,
  placeholder = "Enter your prompt…",
}: PromptBoxProps) {
  const [prompt, setPrompt] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim() || disabled) return;
    await onSubmit(prompt.trim());
    setPrompt("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`space-y-2 ${disabled ? "pointer-events-none select-none opacity-60" : ""}`}
    >
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder={disabled ? "Index a repository first to ask or generate" : placeholder}
        rows={3}
        disabled={disabled}
        readOnly={disabled}
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        className="w-full rounded border border-stone-600 bg-stone-800 px-3 py-2 text-sm text-stone-200 placeholder-stone-500 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed resize-none"
      />
      <button
        type="submit"
        disabled={disabled || !prompt.trim()}
        className="rounded bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Submit
      </button>
    </form>
  );
}
