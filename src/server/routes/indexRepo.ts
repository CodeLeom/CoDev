import { Router } from "express";
import { indexingService } from "../services/indexingService";

export const indexRouter = Router();

indexRouter.post("/", async (req, res) => {
  try {
    const { repoPath, files, folderName } = req.body as {
      repoPath?: string;
      files?: Array<{ relativePath: string; content: string }>;
      folderName?: string;
    };

    if (files && Array.isArray(files) && files.length > 0) {
      const result = await indexingService.indexFromFiles(
        files,
        folderName || "browse"
      );
      return res.json(result);
    }

    if (!repoPath || typeof repoPath !== "string") {
      return res.status(400).json({
        success: false,
        error: "repoPath or files is required",
      });
    }

    const result = await indexingService.indexRepository(repoPath);
    return res.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Indexing failed";
    return res.status(500).json({ success: false, error: message });
  }
});
