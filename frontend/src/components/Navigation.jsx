import { NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.jsx";
import SearchBar from "./SearchBar.jsx";

export default function Navigation({ onSearch }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="app-header">
      <div className="app-header__row">
        <div className="app-header__brand">
          <span className="app-header__logo" aria-hidden="true">
            ▲
          </span>
          <span className="app-header__name">Scoreboard</span>
        </div>

        <nav className="app-header__nav" aria-label="Primary">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "is-active" : "")}>
            Dashboard
          </NavLink>
          <NavLink to="/favorites" className={({ isActive }) => (isActive ? "is-active" : "")}>
            Favorites
          </NavLink>
        </nav>

        <div className="app-header__search">
          <SearchBar onSearch={onSearch} />
        </div>

        <button
          type="button"
          className="theme-toggle"
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          onClick={toggleTheme}
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>
    </header>
  );
}
