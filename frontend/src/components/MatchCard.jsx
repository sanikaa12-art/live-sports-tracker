import { Link } from "react-router-dom";
import TeamBadge from "./TeamBadge.jsx";
import ScoreDisplay from "./ScoreDisplay.jsx";
import MatchStatusBadge from "./MatchStatusBadge.jsx";
import FavoriteButton from "./FavoriteButton.jsx";
import { formatKickoff } from "../utils/format.js";

export default function MatchCard({ match }) {
  return (
    <Link to={`/match/${match.id}`} className={`match-card match-card--${match.status}`}>
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

        <ScoreDisplay match={match} />

        <div className="match-card__team match-card__team--away">
          <FavoriteButton team={match.away} />
          <span className="match-card__team-name">{match.away.name}</span>
          <TeamBadge team={match.away} />
        </div>
      </div>

      <div className="match-card__footer">
        <span>{match.venue}</span>
        {match.status === "upcoming" && <span>{formatKickoff(match.startTime)}</span>}
      </div>
    </Link>
  );
}
