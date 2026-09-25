import { getPrimaryScore, getWinner } from "../utils/matchDisplay.js";

export default function ScoreDisplay({ match, size = "md" }) {
  const { home, away } = getPrimaryScore(match);
  const winner = getWinner(match);
  const hasScore = match.status !== "upcoming";

  return (
    <div className={`score-display score-display--${size}`}>
      <span className={`scoreboard-digits score-value ${winner === "away" ? "score-value--muted" : ""}`}>
        {hasScore ? home : "–"}
      </span>
      <span className="score-sep">:</span>
      <span className={`scoreboard-digits score-value ${winner === "home" ? "score-value--muted" : ""}`}>
        {hasScore ? away : "–"}
      </span>
    </div>
  );
}
