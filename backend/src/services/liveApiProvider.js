// Stub for a real sports-data API (e.g. api-football, SportRadar, TheSportsDB).
// It implements the exact same interface as mockDataProvider so dataProvider.js
// can switch between them with a single environment variable and nothing else
// in the app has to change.
//
// Fill in BASE_URL/API_KEY handling and response mapping for whichever
// provider you sign up with, keeping the return shapes identical to the
// mock provider (see data/seed.js for the canonical match shape).

const BASE_URL = process.env.LIVE_SPORTS_API_BASE_URL;
const API_KEY = process.env.LIVE_SPORTS_API_KEY;

function assertConfigured() {
  if (!BASE_URL || !API_KEY) {
    throw new Error(
      "LIVE_SPORTS_API_BASE_URL and LIVE_SPORTS_API_KEY must be set to use DATA_PROVIDER=live"
    );
  }
}

async function request(path) {
  assertConfigured();
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  });
  if (!res.ok) throw new Error(`Live sports API error: ${res.status}`);
  return res.json();
}

export const liveApiProvider = {
  async getSports() {
    return request("/sports");
    // Map the provider's response shape into { id, name, icon }[] here.
  },

  async getMatches({ status, sport } = {}) {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (sport) params.set("sport", sport);
    return request(`/matches?${params.toString()}`);
    // Map into the canonical match shape used across the app.
  },

  async getMatchById(id) {
    return request(`/matches/${id}`);
  },

  async search(query) {
    return request(`/search?q=${encodeURIComponent(query)}`);
  },

  // A real provider typically pushes updates itself (webhook or its own
  // socket feed) rather than being polled, so this is a no-op here.
  tickLiveMatches() {
    return [];
  },
};
