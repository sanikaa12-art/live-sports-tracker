import { describe, it, expect } from "vitest";
import { getPrimaryScore, getWinner, getStatusLabel } from "../utils/matchDisplay.js";

const footballMatch = {
  sport: "football",
  status: "live",
  sportData: { score: { home: 2, away: 1 }, clockMinute: 54, period: "2nd Half" },
};

const cricketMatch = {
  sport: "cricket",
  status: "live",
  sportData: {
    innings: 2,
    overs: 14.3,
    score: { home: { runs: 168, wickets: 4, overs: 20 }, away: { runs: 129, wickets: 3, overs: 14.3 } },
  },
};

const tennisMatch = {
  sport: "tennis",
  status: "completed",
  sportData: {
    sets: [
      { home: 6, away: 4 },
      { home: 4, away: 6 },
      { home: 6, away: 3 },
    ],
  },
};

describe("getPrimaryScore", () => {
  it("reads a plain home/away score for football", () => {
    expect(getPrimaryScore(footballMatch)).toEqual({ home: "2", away: "1" });
  });

  it("formats cricket as runs/wickets", () => {
    expect(getPrimaryScore(cricketMatch)).toEqual({ home: "168/4", away: "129/3" });
  });

  it("counts sets won for tennis", () => {
    expect(getPrimaryScore(tennisMatch)).toEqual({ home: "2", away: "1" });
  });
});

describe("getWinner", () => {
  it("returns null for a match still in progress", () => {
    expect(getWinner(footballMatch)).toBeNull();
  });

  it("picks the higher-scoring side once completed", () => {
    expect(getWinner({ ...footballMatch, status: "completed" })).toBe("home");
  });

  it("returns null for a tie", () => {
    const tied = { sport: "football", status: "completed", sportData: { score: { home: 2, away: 2 } } };
    expect(getWinner(tied)).toBeNull();
  });
});

describe("getStatusLabel", () => {
  it("shows the clock/period label while live", () => {
    expect(getStatusLabel(footballMatch)).toBe("54' — 2nd Half");
  });

  it("shows Full time once completed", () => {
    expect(getStatusLabel({ ...footballMatch, status: "completed" })).toBe("Full time");
  });

  it("shows Upcoming before kickoff", () => {
    expect(getStatusLabel({ ...footballMatch, status: "upcoming" })).toBe("Upcoming");
  });
});
