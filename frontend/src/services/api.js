import { getClientId } from "./clientId.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "X-Client-Id": getClientId(),
        ...options.headers,
      },
    });
  } catch {
    throw new ApiError("Couldn't reach the server. Check your connection and try again.", 0);
  }

  let body = null;
  try {
    body = await res.json();
  } catch {
    // no JSON body — leave body as null
  }

  if (!res.ok) {
    throw new ApiError(body?.error || `Request failed (${res.status})`, res.status);
  }
  return body;
}

export const api = {
  getMatches: (params = {}) => {
    const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v));
    return request(`/api/matches${qs.toString() ? `?${qs}` : ""}`).then((d) => d.matches);
  },
  getMatch: (id) => request(`/api/matches/${id}`).then((d) => d.match),
  getSports: () => request("/api/sports").then((d) => d.sports),
  search: (query) => request(`/api/search?q=${encodeURIComponent(query)}`),
  getFavorites: () => request("/api/favorites").then((d) => d.favorites),
  addFavorite: (teamId) => request("/api/favorites", { method: "POST", body: JSON.stringify({ teamId }) }).then((d) => d.favorites),
  removeFavorite: (teamId) => request(`/api/favorites/${teamId}`, { method: "DELETE" }).then((d) => d.favorites),
};

export { ApiError };
