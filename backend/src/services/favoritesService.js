// Minimal in-memory favorites store keyed by an anonymous client id sent
// from the frontend (see frontend/src/services/clientId.js). This keeps the
// project auth-free for now while leaving a clean seam: swap this module
// for a database-backed one behind the same three functions once real
// authentication is added.

const favoritesByClient = new Map();

export function getFavorites(clientId) {
  return Array.from(favoritesByClient.get(clientId) ?? []);
}

export function addFavorite(clientId, teamId) {
  if (!favoritesByClient.has(clientId)) favoritesByClient.set(clientId, new Set());
  favoritesByClient.get(clientId).add(teamId);
  return getFavorites(clientId);
}

export function removeFavorite(clientId, teamId) {
  favoritesByClient.get(clientId)?.delete(teamId);
  return getFavorites(clientId);
}
