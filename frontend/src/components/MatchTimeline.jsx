const ICONS = {
  goal: "⚽",
  "yellow-card": "🟨",
  "red-card": "🟥",
  substitution: "🔁",
};

export default function MatchTimeline({ match }) {
  const events = match.sportData.events;
  if (!events || events.length === 0) return null;

  return (
    <div className="timeline">
      <h3>Match events</h3>
      <ol className="timeline__list">
        {events.map((event, i) => (
          <li key={i} className={`timeline__item timeline__item--${event.team}`}>
            <span className="timeline__minute">{event.minute}'</span>
            <span className="timeline__icon" aria-hidden="true">
              {ICONS[event.type] ?? "•"}
            </span>
            <span className="timeline__detail">{event.detail}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
