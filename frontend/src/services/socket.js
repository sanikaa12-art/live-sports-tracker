import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Lazily created so importing this module never opens a connection by
// itself — only the first call to getSocket() does, and callers are
// responsible for disconnecting when no longer needed (see useLiveMatches).
let socket = null;

export function getSocket() {
  if (!socket) {
    socket = io(API_URL, { autoConnect: false, reconnectionDelay: 1000, reconnectionAttempts: 5 });
  }
  return socket;
}
