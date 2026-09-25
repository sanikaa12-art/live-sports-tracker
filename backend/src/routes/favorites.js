import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { getFavorites, addFavorite, removeFavorite } from "../services/favoritesService.js";

export const favoritesRouter = Router();

function requireClientId(req, res) {
  const clientId = req.header("x-client-id");
  if (!clientId) {
    res.status(400).json({ error: "Missing X-Client-Id header" });
    return null;
  }
  return clientId;
}

favoritesRouter.get(
  "/favorites",
  asyncHandler(async (req, res) => {
    const clientId = requireClientId(req, res);
    if (!clientId) return;
    res.json({ favorites: getFavorites(clientId) });
  })
);

favoritesRouter.post(
  "/favorites",
  asyncHandler(async (req, res) => {
    const clientId = requireClientId(req, res);
    if (!clientId) return;
    const { teamId } = req.body ?? {};
    if (!teamId) return res.status(400).json({ error: "teamId is required" });
    res.status(201).json({ favorites: addFavorite(clientId, teamId) });
  })
);

favoritesRouter.delete(
  "/favorites/:teamId",
  asyncHandler(async (req, res) => {
    const clientId = requireClientId(req, res);
    if (!clientId) return;
    res.json({ favorites: removeFavorite(clientId, req.params.teamId) });
  })
);
