// Mock provider: the only place that knows matches live "in memory".
// A real provider (see liveApiProvider.js) implements the exact same method
// signatures, so services/matchService.js and every route never need to
// know which one is active.

import { sports, initialMatches, upcomingMatches, completedMatches } from "../data/seed.js";

let matches = [...initialMatches, ...upcomingMatches, ...completedMatches];

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export const mockDataProvider = {
  async getSports() {
    return clone(sports);
  },

  async getMatches({ status, sport } = {}) {
    let result = matches;
    if (status) result = result.filter((m) => m.status === status);
    if (sport) result = result.filter((m) => m.sport === sport);
    return clone(result.sort((a, b) => new Date(a.startTime) - new Date(b.startTime)));
  },

  async getMatchById(id) {
    const match = matches.find((m) => m.id === id);
    return match ? clone(match) : null;
  },

  async search(query) {
    const q = query.trim().toLowerCase();
    if (!q) return { matches: [], teams: [] };
    const matchHits = matches.filter(
      (m) =>
        m.home.name.toLowerCase().includes(q) ||
        m.away.name.toLowerCase().includes(q) ||
        m.league.toLowerCase().includes(q)
    );
    return { matches: clone(matchHits) };
  },

  // Called on an interval by sockets/liveUpdates.js to nudge live matches
  // forward, simulating what a real push-feed would deliver.
  tickLiveMatches() {
    const changed = [];
    matches = matches.map((match) => {
      if (match.status !== "live") return match;
      const updated = advanceMatch(match);
      changed.push(updated);
      return updated;
    });
    return clone(changed);
  },
};

function advanceMatch(match) {
  const next = clone(match);
  const r = Math.random();

  switch (next.sport) {
    case "football": {
      next.sportData.clockMinute = Math.min(90, next.sportData.clockMinute + 1);
      if (r > 0.9) {
        const scorer = Math.random() > 0.5 ? "home" : "away";
        next.sportData.score[scorer] += 1;
        next.sportData.events.unshift({
          minute: next.sportData.clockMinute,
          type: "goal",
          team: scorer,
          detail: `Late goal for ${next[scorer].name}`,
        });
      }
      if (next.sportData.clockMinute >= 90) next.status = "completed";
      break;
    }
    case "cricket": {
      const battingSide = next.sportData.innings === 1 ? "home" : "away";
      const ball = next.sportData.score[battingSide];
      const runsThisBall = [0, 1, 1, 2, 4, 6][Math.floor(Math.random() * 6)];
      ball.runs += runsThisBall;
      ball.overs = Math.round((ball.overs + 1 / 6) * 10) / 10;
      next.sportData.overs = ball.overs;
      next.sportData.runRate = Math.round((ball.runs / (ball.overs || 1)) * 100) / 100;
      if (r > 0.92 && ball.wickets < 9) ball.wickets += 1;
      if (ball.overs >= 20 || ball.wickets >= 10) next.status = "completed";
      break;
    }
    case "basketball": {
      const scorer = Math.random() > 0.5 ? "home" : "away";
      if (r > 0.55) next.sportData.score[scorer] += [1, 2, 2, 3][Math.floor(Math.random() * 4)];
      break;
    }
    case "tennis": {
      const winner = Math.random() > 0.5 ? "home" : "away";
      next.sportData.games[winner] += 1;
      if (next.sportData.games[winner] >= 6) {
        next.sportData.sets.push({ ...next.sportData.games });
        next.sportData.games = { home: 0, away: 0 };
        next.sportData.currentSet += 1;
      }
      break;
    }
    default:
      break;
  }

  return next;
}
