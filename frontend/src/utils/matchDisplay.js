// Every sport stores its score differently (see backend/data/seed.js).
// These pure functions normalize that into what a MatchCard/ScoreDisplay
// needs, so the components themselves stay sport-agnostic.

export function getPrimaryScore(match) {
  switch (match.sport) {
    case "football":
    case "basketball":
      return { home: String(match.sportData.score?.home ?? "-"), away: String(match.sportData.score?.away ?? "-") };
    case "cricket": {
      const home = match.sportData.score?.home;
      const away = match.sportData.score?.away;
      const fmt = (side) => (side ? `${side.runs}/${side.wickets}` : "-");
      return { home: fmt(home), away: fmt(away) };
    }
    case "tennis": {
      const sets = match.sportData.sets ?? [];
      const homeSets = sets.filter((s) => s.home > s.away).length;
      const awaySets = sets.filter((s) => s.away > s.home).length;
      return { home: String(homeSets), away: String(awaySets) };
    }
    default:
      return { home: "-", away: "-" };
  }
}

export function getStatusLabel(match) {
  switch (match.status) {
    case "live":
      return getLiveClockLabel(match);
    case "completed":
      return "Full time";
    case "upcoming":
      return "Upcoming";
    default:
      return match.status;
  }
}

export function getLiveClockLabel(match) {
  switch (match.sport) {
    case "football":
      return `${match.sportData.clockMinute}' — ${match.sportData.period}`;
    case "cricket":
      return `Innings ${match.sportData.innings} · ${match.sportData.overs} ov`;
    case "basketball":
      return `Q${match.sportData.quarter} · ${match.sportData.clock}`;
    case "tennis":
      return `Set ${match.sportData.currentSet}`;
    default:
      return "Live";
  }
}

export function getLatestEvent(match) {
  if (match.sport === "football") {
    const event = match.sportData.events?.[0];
    return event ? event.detail : null;
  }
  if (match.sport === "cricket") {
    const bowler = match.sportData.currentBowler;
    return bowler ? `${bowler.name} bowling — ${bowler.overs} ov, ${bowler.wickets}/${bowler.runs}` : null;
  }
  if (match.sport === "basketball") {
    const scorer = match.sportData.topScorers?.[0];
    return scorer ? `Top scorer: ${scorer.name} (${scorer.points} pts)` : null;
  }
  if (match.sport === "tennis") {
    return match.sportData.server ? `${match.sportData.server === "home" ? match.home?.name : match.away?.name} serving` : null;
  }
  return null;
}

export function getWinner(match) {
  if (match.status !== "completed") return null;
  const { home, away } = getPrimaryScore(match);
  const homeNum = parseFloat(home);
  const awayNum = parseFloat(away);
  if (Number.isNaN(homeNum) || Number.isNaN(awayNum) || homeNum === awayNum) return null;
  return homeNum > awayNum ? "home" : "away";
}
