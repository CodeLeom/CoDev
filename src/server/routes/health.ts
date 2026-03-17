import { Router } from "express";

export const healthRouter = Router();

healthRouter.get("/", async (req, res) => {
  const ollamaBaseUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
  const model = process.env.OLLAMA_MODEL || "llama3.1:latest";

  let ollamaReachable = false;
  let modelAvailable = false;

  try {
    const healthRes = await fetch(`${ollamaBaseUrl}/api/tags`);
    if (healthRes.ok) {
      ollamaReachable = true;
      const data = (await healthRes.json()) as { models?: { name: string }[] };
      modelAvailable = (data.models ?? []).some(
        (m) => m.name === model || m.name.startsWith(model.split(":")[0])
      );
    }
  } catch {
    /* no-op */
  }

  res.json({
    server: "ok",
    ollamaReachable,
    modelAvailable,
    model,
  });
});
