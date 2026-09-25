import express from "express";
import cors from "cors";
import { matchesRouter } from "./routes/matches.js";
import { favoritesRouter } from "./routes/favorites.js";

export function createApp() {
  const app = express();

  app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? "*" }));
  app.use(express.json());

  app.get("/health", (req, res) => res.json({ status: "ok" }));
  app.use("/api", matchesRouter);
  app.use("/api", favoritesRouter);

  app.use((req, res) => {
    res.status(404).json({ error: `No route for ${req.method} ${req.originalUrl}` });
  });

  // Centralized error handler — every asyncHandler-wrapped route lands here
  // on failure instead of leaking a stack trace or hanging the request.
  app.use((err, req, res, next) => {
    const statusCode = err.statusCode ?? 500;
    if (statusCode === 500) console.error(err);
    res.status(statusCode).json({ error: err.message ?? "Internal server error" });
  });

  return app;
}
