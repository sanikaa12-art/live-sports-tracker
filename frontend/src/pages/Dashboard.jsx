import { useState, useEffect } from "react";
import { useMatches } from "../hooks/useMatches.js";
import { api } from "../services/api.js";
import SportFilter from "../components/SportFilter.jsx";
import MatchCard from "../components/MatchCard.jsx";
import LiveMatchCard from "../components/LiveMatchCard.jsx";
import LoadingState from "../components/LoadingState.jsx";
import ErrorState from "../components/ErrorState.jsx";
import EmptyState from "../components/EmptyState.jsx";
import SearchResults from "./SearchResults.jsx";

function Section({ title, children }) {
  return (
    <section className="dashboard-section">
      <h2 className="dashboard-section__title">{title}</h2>
      {children}
    </section>
  );
}

export default function Dashboard({ searchQuery }) {
  const [sport, setSport] = useState(null);
  const [sports, setSports] = useState([]);

  useEffect(() => {
    api.getSports().then(setSports).catch(() => {});
  }, []);

  const live = useMatches({ status: "live", sport });
  const upcoming = useMatches({ status: "upcoming", sport });
  const completed = useMatches({ status: "completed", sport });

  if (searchQuery) {
    return <SearchResults query={searchQuery} />;
  }

  const liveMatches = live.matches;
  const upcomingMatches = upcoming.matches;
  const completedMatches = completed.matches;

  return (
    <div className="dashboard">
      <SportFilter sports={sports} selected={sport} onSelect={setSport} />

      <Section title="Live now">
        {live.loading && <LoadingState count={2} />}
        {!live.loading && live.error && <ErrorState message={live.error} onRetry={live.refetch} />}
        {!live.loading && !live.error && liveMatches.length === 0 && (
          <EmptyState icon="📺" title="Nothing live right now" body="Check back soon, or browse upcoming fixtures below." />
        )}
        {!live.loading && !live.error && liveMatches.length > 0 && (
          <div className="match-grid">
            {liveMatches.map((m) => (
              <LiveMatchCard key={m.id} match={m} />
            ))}
          </div>
        )}
      </Section>

      <Section title="Upcoming">
        {upcoming.loading && <LoadingState count={4} />}
        {!upcoming.loading && upcoming.error && <ErrorState message={upcoming.error} onRetry={upcoming.refetch} />}
        {!upcoming.loading && !upcoming.error && upcomingMatches.length === 0 && (
          <EmptyState icon="🗓️" title="No upcoming matches" body="Try a different sport filter." />
        )}
        {!upcoming.loading && !upcoming.error && upcomingMatches.length > 0 && (
          <div className="match-grid">
            {upcomingMatches.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        )}
      </Section>

      <Section title="Recent results">
        {completed.loading && <LoadingState count={3} />}
        {!completed.loading && completed.error && <ErrorState message={completed.error} onRetry={completed.refetch} />}
        {!completed.loading && !completed.error && completedMatches.length === 0 && (
          <EmptyState icon="🏁" title="No recent results" />
        )}
        {!completed.loading && !completed.error && completedMatches.length > 0 && (
          <div className="match-grid">
            {completedMatches.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}
