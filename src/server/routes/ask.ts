import { Router } from "express";
import { retrievalService } from "../services/retrievalService";
import { ollamaService } from "../services/ollamaService";
import { promptRouter } from "../services/promptRouter";

export const askRouter = Router();

askRouter.post("/", async (req, res) => {
  try {
    const { query } = req.body as { query?: string };
    if (!query || typeof query !== "string") {
      return res.status(400).json({
        success: false,
        error: "query is required and must be a string",
      });
    }

    const chunks = await retrievalService.retrieve(query);
    if (!chunks.length) {
      return res.status(400).json({
        success: false,
        error: "No index found. Please index a repository first.",
      });
    }

    const prompt = promptRouter.ask(query, chunks);
    const answer = await ollamaService.generate(prompt);

    const sourcePaths = [...new Set(chunks.map((c) => c.metadata?.filePath).filter(Boolean))] as string[];

    return res.json({
      success: true,
      answer,
      sourcePaths,
      retrievalMetadata: {
        chunkCount: chunks.length,
        topK: chunks.length,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Ask request failed";
    return res.status(500).json({ success: false, error: message });
  }
});
