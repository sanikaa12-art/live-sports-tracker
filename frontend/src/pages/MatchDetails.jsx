import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../services/api.js";
import { getSocket } from "../services/socket.js";
import TeamBadge from "../components/TeamBadge.jsx";
import ScoreDisplay from "../components/ScoreDisplay.jsx";
import MatchStatusBadge from "../components/MatchStatusBadge.jsx";
import FavoriteButton from "../components/FavoriteButton.jsx";
import StatisticsPanel from "../components/StatisticsPanel.jsx";
import MatchTimeline from "../components/MatchTimeline.jsx";
import LoadingState from "../components/LoadingState.jsx";
import ErrorState from "../components/ErrorState.jsx";
import { formatKickoff } from "../utils/format.js";

export default function MatchDetails() {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function load() {
    setLoading(true);
    setError(null);
    api
      .getMatch(id)
      .then(setMatch)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, [id]);

  useEffect(() => {
    const socket = getSocket();
    socket.connect();
    function handleUpdate({ matches }) {
      const updated = matches.find((m) => m.id === id);
      if (updated) setMatch(updated);
    }
    socket.on("matches:update", handleUpdate);
    return () => {
      socket.off("matches:update", handleUpdate);
      socket.disconnect();
    };
  }, [id]);

  if (loading) return <LoadingState count={1} />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!match) return <ErrorState message="Match not found." />;

  return (
    <div className="match-details">
      <Link to="/" className="back-link">
        ← Back to dashboard
      </Link>

      <div className="match-details__header">
        <span className="match-card__league">{match.league}</span>
        <MatchStatusBadge match={match} />
      </div>

      <div className="match-details__scoreline">
        <div className="match-details__team">
          <TeamBadge team={match.home} size={56} />
          <span>{match.home.name}</span>
          <FavoriteButton team={match.home} size="md" />
        </div>
        <ScoreDisplay match={match} size="xl" />
        <div className="match-details__team">
          <FavoriteButton team={match.away} size="md" />
          <span>{match.away.name}</span>
          <TeamBadge team={match.away} size={56} />
        </div>
      </div>

      <p className="match-details__meta">
        {match.venue} · {formatKickoff(match.startTime)}
      </p>

      {match.sportData?.summary && <p className="match-details__summary">{match.sportData.summary}</p>}

      <div className="match-details__panels">
        <MatchTimeline match={match} />
        <StatisticsPanel match={match} />
      </div>
    </div>
  );
}
