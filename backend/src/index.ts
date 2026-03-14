import "dotenv/config";

import express from "express";
import cors from "cors";

import authRouter from "./routes/authRoutes";
import resumeRouter from "./routes/resumeRoutes";

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

app.use("/v1/auth", authRouter);
app.use("/v1/resume", resumeRouter);

app.get("/v1/health", (_req, res) => {
  res.status(200).send("OK");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Global error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});
