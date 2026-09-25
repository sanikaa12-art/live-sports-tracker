import { dataProvider } from "./dataProvider.js";

export const VALID_STATUSES = ["live", "upcoming", "completed"];

export function isValidStatus(status) {
  return VALID_STATUSES.includes(status);
}

export async function listMatches({ status, sport } = {}) {
  if (status && !isValidStatus(status)) {
    const err = new Error(`Invalid status "${status}". Expected one of: ${VALID_STATUSES.join(", ")}`);
    err.statusCode = 400;
    throw err;
  }
  return dataProvider.getMatches({ status, sport });
}

export async function getMatch(id) {
  if (!id) {
    const err = new Error("Match id is required");
    err.statusCode = 400;
    throw err;
  }
  const match = await dataProvider.getMatchById(id);
  if (!match) {
    const err = new Error(`No match found with id "${id}"`);
    err.statusCode = 404;
    throw err;
  }
  return match;
}

export async function searchAll(query) {
  if (!query || !query.trim()) {
    const err = new Error("Search query cannot be empty");
    err.statusCode = 400;
    throw err;
  }
  return dataProvider.search(query);
}

// Pure function, kept separate from the provider so it's trivial to unit
// test: given a match list and a set of favorite team ids, return only the
// matches involving those teams.
export function filterByFavorites(matches, favoriteTeamIds) {
  if (!favoriteTeamIds || favoriteTeamIds.length === 0) return [];
  const favSet = new Set(favoriteTeamIds);
  return matches.filter((m) => favSet.has(m.home.id) || favSet.has(m.away.id));
}
