export function buildProjectStructureOverview(
  files: { relativePath: string; content?: string }[]
): string {
  const paths = files.map((f) => f.relativePath);
  const tree: Record<string, unknown> = {};
  for (const p of paths) {
    const parts = p.split("/").filter(Boolean);
    let curr: Record<string, unknown> = tree;
    for (let i = 0; i < parts.length; i++) {
      const name = parts[i];
      if (i === parts.length - 1) {
        curr[name] = 1;
      } else {
        if (!curr[name] || curr[name] === 1) curr[name] = {};
        curr = curr[name] as Record<string, unknown>;
      }
    }
  }
  function renderTree(obj: Record<string, unknown>, indent = ""): string {
    const entries = Object.entries(obj).sort((a, b) => {
      const aIsDir = typeof a[1] === "object";
      const bIsDir = typeof b[1] === "object";
      if (aIsDir !== bIsDir) return aIsDir ? -1 : 1;
      return a[0].localeCompare(b[0]);
    });
    return entries
      .map(([k, v]) => {
        const line = indent + (typeof v === "object" ? `${k}/` : k);
        return typeof v === "object" && v !== null
          ? line + "\n" + renderTree(v as Record<string, unknown>, indent + "  ")
          : line;
      })
      .join("\n");
  }
  let overview = "Project structure:\n" + renderTree(tree);
  const packageJson = files.find(
    (f) => f.relativePath.endsWith("package.json") || f.relativePath === "package.json"
  );
  if (packageJson?.content) {
    try {
      const pkg = JSON.parse(packageJson.content) as {
        name?: string;
        description?: string;
        dependencies?: Record<string, string>;
        scripts?: Record<string, string>;
      };
      const deps = pkg.dependencies ? Object.keys(pkg.dependencies).join(", ") : "";
      const scripts = pkg.scripts ? Object.keys(pkg.scripts).join(", ") : "";
      overview += `\n\nProject metadata: name=${pkg.name || "unknown"}, description=${pkg.description || "none"}`;
      if (deps) overview += `, dependencies=[${deps}]`;
      if (scripts) overview += `, scripts=[${scripts}]`;
    } catch {
      /* ignore parse errors */
    }
  }
  return overview;
}

export interface ChunkOutput {
  content: string;
  metadata: { filePath: string; startIndex?: number; endIndex?: number };
}

const DEFAULT_CHUNK_SIZE = 1500;
const DEFAULT_OVERLAP = 200;

export function chunkContent(
  text: string,
  filePath: string,
  chunkSize = DEFAULT_CHUNK_SIZE,
  overlap = DEFAULT_OVERLAP
): ChunkOutput[] {
  const chunks: ChunkOutput[] = [];
  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    const slice = text.slice(start, end);
    chunks.push({
      content: slice,
      metadata: { filePath, startIndex: start, endIndex: end },
    });
    start = end - overlap;
    if (start >= text.length - overlap) break;
  }
  return chunks;
}
