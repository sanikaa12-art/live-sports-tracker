// Static seed data used by the mock provider. Shaped so swapping in a real
// sports API later only requires changing services/dataProvider.js.

export const sports = [
  { id: "football", name: "Football", icon: "⚽" },
  { id: "cricket", name: "Cricket", icon: "🏏" },
  { id: "basketball", name: "Basketball", icon: "🏀" },
  { id: "tennis", name: "Tennis", icon: "🎾" },
];

export const teams = {
  football: [
    { id: "fc-mumbai", name: "Mumbai City FC", short: "MCFC" },
    { id: "fc-kerala", name: "Kerala Blasters", short: "KBFC" },
    { id: "fc-bengaluru", name: "Bengaluru FC", short: "BFC" },
    { id: "fc-goa", name: "FC Goa", short: "FCG" },
  ],
  cricket: [
    { id: "cr-mumbai", name: "Mumbai Warriors", short: "MW" },
    { id: "cr-pune", name: "Pune Strikers", short: "PS" },
    { id: "cr-chennai", name: "Chennai Kings", short: "CK" },
    { id: "cr-delhi", name: "Delhi Capitals XI", short: "DCX" },
  ],
  basketball: [
    { id: "bb-hyderabad", name: "Hyderabad Hawks", short: "HYD" },
    { id: "bb-jaipur", name: "Jaipur Jaguars", short: "JAI" },
    { id: "bb-nagpur", name: "Nagpur Ninjas", short: "NAG" },
    { id: "bb-indore", name: "Indore Titans", short: "IND" },
  ],
  tennis: [
    { id: "tn-1", name: "A. Sharma", short: "SHA" },
    { id: "tn-2", name: "R. Verma", short: "VER" },
    { id: "tn-3", name: "K. Iyer", short: "IYE" },
    { id: "tn-4", name: "N. Rao", short: "RAO" },
  ],
};

// `buildMatch` gives every match a consistent envelope; sportData carries
// the sport-specific shape (goals/overs/quarters/sets etc).
function buildMatch({ id, sport, status, league, venue, startTime, home, away, sportData }) {
  return { id, sport, status, league, venue, startTime, home, away, sportData };
}

const now = Date.now();
const min = 60 * 1000;

export const initialMatches = [
  buildMatch({
    id: "m-live-football-1",
    sport: "football",
    status: "live",
    league: "Indian Super League",
    venue: "DY Patil Stadium, Mumbai",
    startTime: new Date(now - 55 * min).toISOString(),
    home: teams.football[0],
    away: teams.football[1],
    sportData: {
      clockMinute: 54,
      period: "2nd Half",
      score: { home: 2, away: 1 },
      events: [
        { minute: 12, type: "goal", team: "home", detail: "Diaz opens the scoring" },
        { minute: 38, type: "yellow-card", team: "away", detail: "Roy booked for a late tackle" },
        { minute: 47, type: "goal", team: "away", detail: "Costa equalises early in 2nd half" },
        { minute: 52, type: "goal", team: "home", detail: "Diaz with a brace" },
      ],
      stats: { possession: [58, 42], shots: [11, 7], shotsOnTarget: [5, 3], corners: [6, 2] },
    },
  }),
  buildMatch({
    id: "m-live-cricket-1",
    sport: "cricket",
    status: "live",
    league: "Regional T20 Trophy",
    venue: "MCA Stadium, Pune",
    startTime: new Date(now - 90 * min).toISOString(),
    home: teams.cricket[0],
    away: teams.cricket[1],
    sportData: {
      innings: 2,
      overs: 14.3,
      target: 176,
      score: { home: { runs: 168, wickets: 4, overs: 20 }, away: { runs: 129, wickets: 3, overs: 14.3 } },
      currentBatsmen: [
        { name: "R. Pandit", runs: 47, balls: 32 },
        { name: "S. Nair", runs: 18, balls: 14 },
      ],
      currentBowler: { name: "V. Kulkarni", overs: 2.3, runs: 19, wickets: 1 },
      runRate: 8.91,
      requiredRunRate: 8.36,
      fallOfWickets: ["1-24", "2-58", "3-101"],
    },
  }),
  buildMatch({
    id: "m-live-basketball-1",
    sport: "basketball",
    status: "live",
    league: "National Basketball Circuit",
    venue: "Gachibowli Arena, Hyderabad",
    startTime: new Date(now - 70 * min).toISOString(),
    home: teams.basketball[0],
    away: teams.basketball[1],
    sportData: {
      quarter: 4,
      clock: "06:12",
      score: { home: 88, away: 91 },
      quarterScores: { home: [22, 20, 24, 22], away: [18, 25, 23, 25] },
      topScorers: [
        { name: "D. Malhotra", team: "home", points: 24 },
        { name: "A. Khan", team: "away", points: 27 },
      ],
      fouls: { home: 12, away: 9 },
      teamStats: { rebounds: [38, 34], assists: [19, 22], turnovers: [10, 7] },
    },
  }),
  buildMatch({
    id: "m-live-tennis-1",
    sport: "tennis",
    status: "live",
    league: "Open Championship — Round 3",
    venue: "RK Khanna Complex, Delhi",
    startTime: new Date(now - 40 * min).toISOString(),
    home: teams.tennis[0],
    away: teams.tennis[1],
    sportData: {
      currentSet: 3,
      sets: [
        { home: 6, away: 4 },
        { home: 4, away: 6 },
        { home: 3, away: 2 },
      ],
      games: { home: 3, away: 2 },
      server: "home",
      stats: { aces: [8, 5], doubleFaults: [2, 3], winners: [24, 19] },
    },
  }),
];

export const upcomingMatches = [
  buildMatch({
    id: "m-up-football-1",
    sport: "football",
    status: "upcoming",
    league: "Indian Super League",
    venue: "Fatorda Stadium, Goa",
    startTime: new Date(now + 3 * 60 * min).toISOString(),
    home: teams.football[2],
    away: teams.football[3],
    sportData: {},
  }),
  buildMatch({
    id: "m-up-cricket-1",
    sport: "cricket",
    status: "upcoming",
    league: "Regional T20 Trophy",
    venue: "Chinnaswamy Stadium, Bengaluru",
    startTime: new Date(now + 26 * 60 * min).toISOString(),
    home: teams.cricket[2],
    away: teams.cricket[3],
    sportData: {},
  }),
  buildMatch({
    id: "m-up-basketball-1",
    sport: "basketball",
    status: "upcoming",
    league: "National Basketball Circuit",
    venue: "Rajiv Gandhi Sports Complex, Jaipur",
    startTime: new Date(now + 5 * 60 * min).toISOString(),
    home: teams.basketball[2],
    away: teams.basketball[3],
    sportData: {},
  }),
  buildMatch({
    id: "m-up-tennis-1",
    sport: "tennis",
    status: "upcoming",
    league: "Open Championship — Round 4",
    venue: "RK Khanna Complex, Delhi",
    startTime: new Date(now + 24 * 60 * min).toISOString(),
    home: teams.tennis[2],
    away: teams.tennis[3],
    sportData: {},
  }),
];

export const completedMatches = [
  buildMatch({
    id: "m-done-football-1",
    sport: "football",
    status: "completed",
    league: "Indian Super League",
    venue: "Kanteerava Stadium, Bengaluru",
    startTime: new Date(now - 2 * 24 * 60 * min).toISOString(),
    home: teams.football[3],
    away: teams.football[0],
    sportData: {
      score: { home: 1, away: 3 },
      summary: "Mumbai City FC cruised past FC Goa with a dominant second-half display.",
    },
  }),
  buildMatch({
    id: "m-done-cricket-1",
    sport: "cricket",
    status: "completed",
    league: "Regional T20 Trophy",
    venue: "Wankhede Stadium, Mumbai",
    startTime: new Date(now - 1 * 24 * 60 * min).toISOString(),
    home: teams.cricket[3],
    away: teams.cricket[0],
    sportData: {
      score: { home: { runs: 154, wickets: 8, overs: 20 }, away: { runs: 158, wickets: 5, overs: 19.2 } },
      summary: "Mumbai Warriors chased down 155 with 4 balls to spare.",
    },
  }),
  buildMatch({
    id: "m-done-basketball-1",
    sport: "basketball",
    status: "completed",
    league: "National Basketball Circuit",
    venue: "Sports Authority Hall, Indore",
    startTime: new Date(now - 3 * 24 * 60 * min).toISOString(),
    home: teams.basketball[3],
    away: teams.basketball[1],
    sportData: {
      score: { home: 96, away: 102 },
      summary: "Jaipur Jaguars edged a close fourth quarter to seal the win.",
    },
  }),
];
