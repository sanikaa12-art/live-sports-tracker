import { mockDataProvider } from "./mockDataProvider.js";
import { liveApiProvider } from "./liveApiProvider.js";

// The rest of the app (routes, sockets) only ever imports `dataProvider`
// from here, never the mock/live modules directly. Flip DATA_PROVIDER in
// .env to swap the whole data layer with zero changes elsewhere.
const providerName = process.env.DATA_PROVIDER === "live" ? "live" : "mock";

export const dataProvider = providerName === "live" ? liveApiProvider : mockDataProvider;
export const activeProviderName = providerName;
