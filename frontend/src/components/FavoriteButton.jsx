import { useFavorites } from "../context/FavoritesContext.jsx";

export default function FavoriteButton({ team, size = "sm" }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(team.id);

  return (
    <button
      type="button"
      className={`favorite-button favorite-button--${size} ${active ? "is-active" : ""}`}
      aria-pressed={active}
      aria-label={active ? `Remove ${team.name} from favorites` : `Add ${team.name} to favorites`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(team);
      }}
    >
      <svg viewBox="0 0 24 24" width="1em" height="1em" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3-5.4 3 1.3-6-4.6-4.1 6.1-.6z" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
