import { useEffect, useState } from "react";
import { api } from "../services/api.js";
import MatchCard from "../components/MatchCard.jsx";
import LoadingState from "../components/LoadingState.jsx";
import ErrorState from "../components/ErrorState.jsx";
import EmptyState from "../components/EmptyState.jsx";

export default function SearchResults({ query }) {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) {
      setResults(null);
      return;
    }
    setLoading(true);
    setError(null);
    api
      .search(query)
      .then((data) => setResults(data.matches))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [query]);

  if (loading) return <LoadingState count={3} />;
  if (error) return <ErrorState message={error} />;
  if (!results) return null;

  if (results.length === 0) {
    return <EmptyState icon="🔍" title={`No results for "${query}"`} body="Try a team, player, or tournament name." />;
  }

  return (
    <div className="match-grid">
      {results.map((m) => (
        <MatchCard key={m.id} match={m} />
      ))}
    </div>
  );
}
