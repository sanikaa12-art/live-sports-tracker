import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { listMatches, getMatch, searchAll } from "../services/matchService.js";
import { dataProvider } from "../services/dataProvider.js";

export const matchesRouter = Router();

matchesRouter.get(
  "/matches",
  asyncHandler(async (req, res) => {
    const { status, sport } = req.query;
    const matches = await listMatches({ status, sport });
    res.json({ matches });
  })
);

matchesRouter.get(
  "/matches/:id",
  asyncHandler(async (req, res) => {
    const match = await getMatch(req.params.id);
    res.json({ match });
  })
);

matchesRouter.get(
  "/sports",
  asyncHandler(async (req, res) => {
    const sports = await dataProvider.getSports();
    res.json({ sports });
  })
);

matchesRouter.get(
  "/search",
  asyncHandler(async (req, res) => {
    const { q } = req.query;
    const results = await searchAll(q ?? "");
    res.json(results);
  })
);
