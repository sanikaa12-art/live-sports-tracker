export default function LoadingState({ count = 4 }) {
  return (
    <div className="match-grid" aria-busy="true" aria-label="Loading matches">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="match-card match-card--skeleton">
          <div className="skeleton" style={{ height: 16, width: "40%", marginBottom: 14 }} />
          <div className="skeleton" style={{ height: 40, width: "100%", marginBottom: 14 }} />
          <div className="skeleton" style={{ height: 14, width: "60%" }} />
        </div>
      ))}
    </div>
  );
}
