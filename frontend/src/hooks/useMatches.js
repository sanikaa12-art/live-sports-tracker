import { useEffect, useRef, useState, useCallback } from "react";
import { api } from "../services/api.js";
import { getSocket } from "../services/socket.js";

// Fetches matches for a given status/sport and, only for "live" matches,
// keeps them fresh by merging Socket.IO push updates in place — no polling.
export function useMatches({ status, sport } = {}) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const requestId = useRef(0);

  const fetchMatches = useCallback(() => {
    const thisRequest = ++requestId.current;
    setLoading(true);
    setError(null);
    api
      .getMatches({ status, sport })
      .then((data) => {
        if (thisRequest === requestId.current) setMatches(data);
      })
      .catch((err) => {
        if (thisRequest === requestId.current) setError(err.message || "Failed to load matches");
      })
      .finally(() => {
        if (thisRequest === requestId.current) setLoading(false);
      });
  }, [status, sport]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  useEffect(() => {
    if (status !== "live") return undefined;

    const socket = getSocket();
    socket.connect();

    function handleUpdate({ matches: updated }) {
      setMatches((current) => {
        const byId = new Map(current.map((m) => [m.id, m]));
        let changed = false;
        for (const match of updated) {
          if (match.status === "live") {
            byId.set(match.id, match);
            changed = true;
          } else if (byId.has(match.id)) {
            // Match just finished — drop it from the live list.
            byId.delete(match.id);
            changed = true;
          }
        }
        return changed ? Array.from(byId.values()) : current;
      });
    }

    socket.on("matches:update", handleUpdate);
    return () => {
      socket.off("matches:update", handleUpdate);
      socket.disconnect();
    };
  }, [status]);

  return { matches, loading, error, refetch: fetchMatches };
}
