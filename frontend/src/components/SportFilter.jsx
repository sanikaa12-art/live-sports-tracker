export default function SportFilter({ sports, selected, onSelect }) {
  return (
    <div className="sport-filter" role="tablist" aria-label="Filter by sport">
      <button
        type="button"
        role="tab"
        aria-selected={!selected}
        className={`sport-pill ${!selected ? "is-active" : ""}`}
        onClick={() => onSelect(null)}
      >
        All sports
      </button>
      {sports.map((sport) => (
        <button
          key={sport.id}
          type="button"
          role="tab"
          aria-selected={selected === sport.id}
          className={`sport-pill ${selected === sport.id ? "is-active" : ""}`}
          onClick={() => onSelect(sport.id)}
        >
          <span aria-hidden="true">{sport.icon}</span> {sport.name}
        </button>
      ))}
    </div>
  );
}
