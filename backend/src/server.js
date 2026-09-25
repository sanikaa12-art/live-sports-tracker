import "dotenv/config";
import { createServer } from "http";
import { Server } from "socket.io";
import { createApp } from "./app.js";
import { attachLiveUpdates } from "./sockets/liveUpdates.js";
import { activeProviderName } from "./services/dataProvider.js";

const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

const app = createApp();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: CLIENT_ORIGIN } });

attachLiveUpdates(io);

httpServer.listen(PORT, () => {
  console.log(`Sports Tracker API listening on :${PORT} (data provider: ${activeProviderName})`);
});
