import request from "supertest";
import { createApp } from "../app.js";

const app = createApp();

describe("GET /health", () => {
  it("returns ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });
});

describe("GET /api/matches", () => {
  it("returns all matches with no filters", async () => {
    const res = await request(app).get("/api/matches");
    expect(res.status).toBe(200);
    expect(res.body.matches.length).toBeGreaterThan(0);
  });

  it("filters by status", async () => {
    const res = await request(app).get("/api/matches?status=live");
    expect(res.status).toBe(200);
    expect(res.body.matches.every((m) => m.status === "live")).toBe(true);
  });

  it("400s on an invalid status", async () => {
    const res = await request(app).get("/api/matches?status=bogus");
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Invalid status/);
  });
});

describe("GET /api/matches/:id", () => {
  it("404s for an unknown match", async () => {
    const res = await request(app).get("/api/matches/does-not-exist");
    expect(res.status).toBe(404);
  });
});

describe("GET /api/search", () => {
  it("400s on an empty query", async () => {
    const res = await request(app).get("/api/search?q=");
    expect(res.status).toBe(400);
  });

  it("finds a known team", async () => {
    const res = await request(app).get("/api/search?q=Mumbai");
    expect(res.status).toBe(200);
    expect(res.body.matches.length).toBeGreaterThan(0);
  });
});

describe("Favorites", () => {
  const clientId = "test-client-1";

  it("requires an X-Client-Id header", async () => {
    const res = await request(app).get("/api/favorites");
    expect(res.status).toBe(400);
  });

  it("adds, lists, then removes a favorite", async () => {
    const add = await request(app)
      .post("/api/favorites")
      .set("x-client-id", clientId)
      .send({ teamId: "fc-mumbai" });
    expect(add.status).toBe(201);
    expect(add.body.favorites).toContain("fc-mumbai");

    const list = await request(app).get("/api/favorites").set("x-client-id", clientId);
    expect(list.body.favorites).toContain("fc-mumbai");

    const remove = await request(app).delete("/api/favorites/fc-mumbai").set("x-client-id", clientId);
    expect(remove.body.favorites).not.toContain("fc-mumbai");
  });
});
