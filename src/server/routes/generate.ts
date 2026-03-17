import { Router } from "express";
import { retrievalService } from "../services/retrievalService";
import { ollamaService } from "../services/ollamaService";
import { promptRouter } from "../services/promptRouter";

export const generateRouter = Router();

generateRouter.post("/", async (req, res) => {
  try {
    const { mode, query, diataxisType } = req.body as {
      mode?: string;
      query?: string;
      diataxisType?: string;
    };

    if (!query || typeof query !== "string") {
      return res.status(400).json({
        success: false,
        error: "query is required and must be a string",
      });
    }

    const validModes = ["article", "api-docs", "diataxis"];
    if (!mode || !validModes.includes(mode)) {
      return res.status(400).json({
        success: false,
        error: `mode must be one of: ${validModes.join(", ")}`,
      });
    }

    if (mode === "diataxis") {
      const validTypes = ["tutorial", "how-to", "explanation", "reference"];
      if (!diataxisType || !validTypes.includes(diataxisType)) {
        return res.status(400).json({
          success: false,
          error: `diataxisType must be one of: ${validTypes.join(", ")}`,
        });
      }
    }

    const chunks = await retrievalService.retrieve(query);
    if (!chunks.length) {
      return res.status(400).json({
        success: false,
        error: "No index found. Please index a repository first.",
      });
    }

    const prompt =
      mode === "diataxis"
        ? promptRouter.diataxis(
            query,
            diataxisType as "tutorial" | "how-to" | "explanation" | "reference",
            chunks
          )
        : mode === "api-docs"
        ? promptRouter.apiDocs(query, chunks)
        : promptRouter.article(query, chunks);

    const output = await ollamaService.generate(prompt);

    const sourcePaths = [...new Set(chunks.map((c) => c.metadata?.filePath).filter(Boolean))] as string[];

    return res.json({
      success: true,
      generatedOutput: output,
      sourcePaths,
      retrievalMetadata: {
        chunkCount: chunks.length,
        mode,
        diataxisType: mode === "diataxis" ? diataxisType : undefined,
      },
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Generation request failed";
    return res.status(500).json({ success: false, error: message });
  }
});
