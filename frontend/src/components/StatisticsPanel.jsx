function StatRow({ label, home, away }) {
  const total = Number(home) + Number(away) || 1;
  return (
    <div className="stat-row">
      <span className="stat-row__value">{home}</span>
      <div className="stat-row__bar">
        <div className="stat-row__bar-fill stat-row__bar-fill--home" style={{ width: `${(home / total) * 100}%` }} />
        <div className="stat-row__bar-fill stat-row__bar-fill--away" style={{ width: `${(away / total) * 100}%` }} />
      </div>
      <span className="stat-row__value">{away}</span>
      <span className="stat-row__label">{label}</span>
    </div>
  );
}

export default function StatisticsPanel({ match }) {
  const { sport, sportData, home, away } = match;

  if (sport === "football" && sportData.stats) {
    const s = sportData.stats;
    return (
      <div className="stats-panel">
        <h3>Match statistics</h3>
        <StatRow label="Possession %" home={s.possession[0]} away={s.possession[1]} />
        <StatRow label="Shots" home={s.shots[0]} away={s.shots[1]} />
        <StatRow label="Shots on target" home={s.shotsOnTarget[0]} away={s.shotsOnTarget[1]} />
        <StatRow label="Corners" home={s.corners[0]} away={s.corners[1]} />
      </div>
    );
  }

  if (sport === "cricket") {
    return (
      <div className="stats-panel">
        <h3>Match details</h3>
        <dl className="stat-list">
          <div>
            <dt>Run rate</dt>
            <dd>{sportData.runRate}</dd>
          </div>
          {sportData.requiredRunRate && (
            <div>
              <dt>Required run rate</dt>
              <dd>{sportData.requiredRunRate}</dd>
            </div>
          )}
          {sportData.currentBowler && (
            <div>
              <dt>Current bowler</dt>
              <dd>
                {sportData.currentBowler.name} — {sportData.currentBowler.overs} ov, {sportData.currentBowler.wickets}/
                {sportData.currentBowler.runs}
              </dd>
            </div>
          )}
        </dl>
        {sportData.currentBatsmen && (
          <>
            <h4>At the crease</h4>
            <ul className="plain-list">
              {sportData.currentBatsmen.map((b) => (
                <li key={b.name}>
                  {b.name} — {b.runs} ({b.balls})
                </li>
              ))}
            </ul>
          </>
        )}
        {sportData.fallOfWickets && (
          <>
            <h4>Fall of wickets</h4>
            <p className="stat-inline">{sportData.fallOfWickets.join(", ")}</p>
          </>
        )}
      </div>
    );
  }

  if (sport === "basketball" && sportData.teamStats) {
    const s = sportData.teamStats;
    return (
      <div className="stats-panel">
        <h3>Team statistics</h3>
        <StatRow label="Rebounds" home={s.rebounds[0]} away={s.rebounds[1]} />
        <StatRow label="Assists" home={s.assists[0]} away={s.assists[1]} />
        <StatRow label="Turnovers" home={s.turnovers[0]} away={s.turnovers[1]} />
        <StatRow label="Fouls" home={sportData.fouls.home} away={sportData.fouls.away} />
        {sportData.topScorers && (
          <>
            <h4>Top scorers</h4>
            <ul className="plain-list">
              {sportData.topScorers.map((p) => (
                <li key={p.name}>
                  {p.name} ({p.team === "home" ? home.short : away.short}) — {p.points} pts
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    );
  }

  if (sport === "tennis" && sportData.stats) {
    const s = sportData.stats;
    return (
      <div className="stats-panel">
        <h3>Match statistics</h3>
        <StatRow label="Aces" home={s.aces[0]} away={s.aces[1]} />
        <StatRow label="Double faults" home={s.doubleFaults[0]} away={s.doubleFaults[1]} />
        <StatRow label="Winners" home={s.winners[0]} away={s.winners[1]} />
        {sportData.sets && (
          <>
            <h4>Sets</h4>
            <p className="stat-inline">
              {sportData.sets.map((set, i) => `${set.home}-${set.away}`).join("  ·  ")}
            </p>
          </>
        )}
      </div>
    );
  }

  return null;
}
