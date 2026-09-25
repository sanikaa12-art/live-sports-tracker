import { Link } from "react-router-dom";
import TeamBadge from "./TeamBadge.jsx";
import ScoreDisplay from "./ScoreDisplay.jsx";
import MatchStatusBadge from "./MatchStatusBadge.jsx";
import FavoriteButton from "./FavoriteButton.jsx";
import { getLatestEvent } from "../utils/matchDisplay.js";

export default function LiveMatchCard({ match }) {
  const latestEvent = getLatestEvent(match);

  return (
    <Link to={`/match/${match.id}`} className="match-card match-card--live">
      <div className="match-card__meta">
        <span className="match-card__league">{match.league}</span>
        <MatchStatusBadge match={match} />
      </div>

      <div className="match-card__body">
        <div className="match-card__team">
          <TeamBadge team={match.home} />
          <span className="match-card__team-name">{match.home.name}</span>
          <FavoriteButton team={match.home} />
        </div>

        <ScoreDisplay match={match} size="lg" />

        <div className="match-card__team match-card__team--away">
          <FavoriteButton team={match.away} />
          <span className="match-card__team-name">{match.away.name}</span>
          <TeamBadge team={match.away} />
        </div>
      </div>

      {latestEvent && (
        <div className="match-card__ticker">
          <span className="live-dot live-dot--sm" aria-hidden="true" />
          {latestEvent}
        </div>
      )}
    </Link>
  );
}
