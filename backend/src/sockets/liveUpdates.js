import { dataProvider, activeProviderName } from "../services/dataProvider.js";

const TICK_INTERVAL_MS = 4000;

// Broadcasts score/state deltas to every connected client on an interval.
// Only the mock provider actually mutates state on tick (see
// mockDataProvider.tickLiveMatches); a live provider would instead push
// updates here from its own webhook/socket feed.
export function attachLiveUpdates(io) {
  io.on("connection", (socket) => {
    socket.emit("provider:info", { provider: activeProviderName });
  });

  if (activeProviderName !== "mock") return () => {};

  const interval = setInterval(() => {
    const updatedMatches = dataProvider.tickLiveMatches();
    if (updatedMatches.length > 0) {
      io.emit("matches:update", { matches: updatedMatches });
    }
  }, TICK_INTERVAL_MS);

  return () => clearInterval(interval);
}
