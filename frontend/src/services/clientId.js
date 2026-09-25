const STORAGE_KEY = "sports-tracker:client-id";

// A stand-in for a user id until real authentication is added. Every
// favorites API call is scoped by this header (see backend/routes/favorites.js),
// so swapping this for a logged-in user id later is a one-line change.
export function getClientId() {
  let id = window.localStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(STORAGE_KEY, id);
  }
  return id;
}
