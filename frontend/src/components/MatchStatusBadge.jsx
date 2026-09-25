import { getStatusLabel } from "../utils/matchDisplay.js";
import { formatCountdown } from "../utils/format.js";

export default function MatchStatusBadge({ match }) {
  if (match.status === "live") {
    return (
      <span className="status-badge status-badge--live">
        <span className="live-dot" aria-hidden="true" />
        LIVE · {getStatusLabel(match)}
      </span>
    );
  }
  if (match.status === "upcoming") {
    return <span className="status-badge status-badge--upcoming">{formatCountdown(match.startTime)}</span>;
  }
  return <span className="status-badge status-badge--completed">Full time</span>;
}
