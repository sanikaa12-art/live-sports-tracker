import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "../services/api.js";
import { useToast } from "./ToastContext.jsx";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    api
      .getFavorites()
      .then(setFavorites)
      .catch(() => showToast("Couldn't load your favorites.", "error"))
      .finally(() => setLoaded(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isFavorite = useCallback((teamId) => favorites.includes(teamId), [favorites]);

  const toggleFavorite = useCallback(
    async (team) => {
      const currentlyFavorite = favorites.includes(team.id);
      const previous = favorites;
      setFavorites((f) => (currentlyFavorite ? f.filter((id) => id !== team.id) : [...f, team.id]));
      try {
        const updated = currentlyFavorite ? await api.removeFavorite(team.id) : await api.addFavorite(team.id);
        setFavorites(updated);
        showToast(currentlyFavorite ? `Removed ${team.name} from favorites` : `Added ${team.name} to favorites`);
      } catch {
        setFavorites(previous);
        showToast("Couldn't update favorites. Try again.", "error");
      }
    },
    [favorites, showToast]
  );

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite, loaded }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
