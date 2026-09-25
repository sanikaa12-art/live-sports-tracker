import { initials } from "../utils/format.js";

export default function TeamBadge({ team, size = 36 }) {
  return (
    <span
      className="team-badge"
      style={{ width: size, height: size, fontSize: size * 0.34 }}
      aria-hidden="true"
    >
      {team.short ?? initials(team.name)}
    </span>
  );
}
