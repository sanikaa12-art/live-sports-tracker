import { useEffect, useMemo, useState } from "react";
import { useFavorites } from "../context/FavoritesContext.jsx";
import { api } from "../services/api.js";
import MatchCard from "../components/MatchCard.jsx";
import LiveMatchCard from "../components/LiveMatchCard.jsx";
import LoadingState from "../components/LoadingState.jsx";
import ErrorState from "../components/ErrorState.jsx";
import EmptyState from "../components/EmptyState.jsx";

export default function Favorites() {
  const { favorites, loaded } = useFavorites();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!loaded) return;
    setLoading(true);
    setError(null);
    api
      .getMatches()
      .then(setMatches)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [loaded]);

  const favoriteMatches = useMemo(
    () => matches.filter((m) => favorites.includes(m.home.id) || favorites.includes(m.away.id)),
    [matches, favorites]
  );

  if (loading) return <LoadingState count={3} />;
  if (error) return <ErrorState message={error} />;

  if (favorites.length === 0) {
    return (
      <EmptyState
        icon="⭐"
        title="No favorites yet"
        body="Tap the star on any team to follow their matches here."
      />
    );
  }

  if (favoriteMatches.length === 0) {
    return <EmptyState icon="🔭" title="No matches for your favorites right now" body="Check back closer to their next fixture." />;
  }

  return (
    <div className="match-grid">
      {favoriteMatches.map((m) => (m.status === "live" ? <LiveMatchCard key={m.id} match={m} /> : <MatchCard key={m.id} match={m} />))}
    </div>
  );
}
