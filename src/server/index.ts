import "dotenv/config";
import express from "express";
import cors from "cors";
import { healthRouter } from "./routes/health";
import { indexRouter } from "./routes/indexRepo";
import { askRouter } from "./routes/ask";
import { generateRouter } from "./routes/generate";

const app = express();
const PORT = process.env.SERVER_PORT || 4000;

app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.use("/api/health", healthRouter);
app.use("/api/index", indexRouter);
app.use("/api/ask", askRouter);
app.use("/api/generate", generateRouter);

app.listen(PORT, () => {
  console.log(`CoDev server running at http://localhost:${PORT}`);
});
