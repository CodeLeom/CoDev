import type { RetrievedChunk } from "./retrievalService";

function formatContext(chunks: RetrievedChunk[]): string {
  return chunks
    .map((c) => {
      const path = c.metadata?.filePath ? `[${c.metadata.filePath}]\n` : "";
      return `${path}${c.content}`;
    })
    .join("\n\n---\n\n");
}

function baseInstructions(): string {
  return `Use the retrieved codebase context below first. Stay grounded in the indexed repository.
Do not fabricate details. If evidence is incomplete, say so explicitly.
Cite relevant file paths when useful.
Respond in plain text only. Do not use markdown formatting (no # headers, **bold**, \`code\`, or other markdown syntax).`;
}

export function buildAskPrompt(query: string, chunks: RetrievedChunk[]): string {
  const context = formatContext(chunks);
  return `${baseInstructions()}

## Retrieved Context

${context}

## User Question

${query}

Answer directly, referencing relevant files. Summarize implementation details clearly. State uncertainty if context is incomplete.`;
}

export function buildArticlePrompt(
  query: string,
  chunks: RetrievedChunk[]
): string {
  const context = formatContext(chunks);
  return `${baseInstructions()}

## Retrieved Context

${context}

## Task

${query}

Write a developer-facing article. Use clear headings and a readable structure. Base claims on the retrieved context. Mention assumptions where needed.`;
}

export function buildApiDocsPrompt(
  query: string,
  chunks: RetrievedChunk[]
): string {
  const context = formatContext(chunks);
  return `${baseInstructions()}

## Retrieved Context

${context}

## Task

${query}

Generate structured API reference documentation. Include when inferable:
- endpoint name, method, path
- purpose
- request parameters, body
- response format
- common errors
- example usage
- source files

If complete API detail cannot be inferred, say so explicitly.`;
}

export function buildDiataxisPrompt(
  diataxisType: "tutorial" | "how-to" | "explanation" | "reference",
  query: string,
  chunks: RetrievedChunk[]
): string {
  const context = formatContext(chunks);

  const typeInstructions: Record<string, string> = {
    tutorial: `Write a TUTORIAL: learning-oriented, step-by-step, outcome-focused, beginner-friendly.`,
    "how-to": `Write a HOW-TO: task-oriented, concise, practical. Assume the user wants to complete a task.`,
    explanation: `Write an EXPLANATION: concept-oriented. Help the reader understand why the system works this way. Discuss tradeoffs and design rationale.`,
    reference: `Write REFERENCE docs: factual, structured, low narrative, suitable for lookup.`,
  };

  const instr = typeInstructions[diataxisType] || typeInstructions.reference;
  return `${baseInstructions()}

## Retrieved Context

${context}

## Task

${query}

${instr}`;
}

export const promptRouter = {
  ask: buildAskPrompt,
  article: buildArticlePrompt,
  apiDocs: buildApiDocsPrompt,
  diataxis: (
    query: string,
    diataxisType: "tutorial" | "how-to" | "explanation" | "reference",
    chunks: RetrievedChunk[]
  ) => buildDiataxisPrompt(diataxisType, query, chunks),
};
