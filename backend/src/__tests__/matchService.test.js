import { jest } from "@jest/globals";
import { isValidStatus, filterByFavorites, listMatches, getMatch } from "../services/matchService.js";

describe("isValidStatus", () => {
  it("accepts the three known statuses", () => {
    expect(isValidStatus("live")).toBe(true);
    expect(isValidStatus("upcoming")).toBe(true);
    expect(isValidStatus("completed")).toBe(true);
  });

  it("rejects anything else", () => {
    expect(isValidStatus("finished")).toBe(false);
    expect(isValidStatus("")).toBe(false);
  });
});

describe("filterByFavorites", () => {
  const matches = [
    { id: "1", home: { id: "team-a" }, away: { id: "team-b" } },
    { id: "2", home: { id: "team-c" }, away: { id: "team-d" } },
  ];

  it("returns matches involving a favorited team", () => {
    expect(filterByFavorites(matches, ["team-b"])).toEqual([matches[0]]);
  });

  it("returns an empty list when no favorites are given", () => {
    expect(filterByFavorites(matches, [])).toEqual([]);
    expect(filterByFavorites(matches, undefined)).toEqual([]);
  });

  it("matches on either home or away team", () => {
    expect(filterByFavorites(matches, ["team-c"])).toEqual([matches[1]]);
  });
});

describe("listMatches", () => {
  it("rejects an invalid status with a 400-flagged error", async () => {
    await expect(listMatches({ status: "not-a-status" })).rejects.toMatchObject({ statusCode: 400 });
  });

  it("returns matches for a valid status", async () => {
    const matches = await listMatches({ status: "live" });
    expect(Array.isArray(matches)).toBe(true);
    expect(matches.every((m) => m.status === "live")).toBe(true);
  });
});

describe("getMatch", () => {
  it("404s for an unknown id", async () => {
    await expect(getMatch("does-not-exist")).rejects.toMatchObject({ statusCode: 404 });
  });

  it("400s when no id is given", async () => {
    await expect(getMatch("")).rejects.toMatchObject({ statusCode: 400 });
  });

  it("returns the match for a known id", async () => {
    const [first] = await import("../data/seed.js").then((m) => m.initialMatches);
    const match = await getMatch(first.id);
    expect(match.id).toBe(first.id);
  });
});
