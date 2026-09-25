import { useEffect, useState } from "react";
import { useDebounce } from "../hooks/useDebounce.js";

export default function SearchBar({ onSearch, placeholder = "Search teams, players, tournaments" }) {
  const [value, setValue] = useState("");
  const debounced = useDebounce(value, 350);

  useEffect(() => {
    onSearch(debounced.trim());
  }, [debounced, onSearch]);

  return (
    <div className="search-bar">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label="Search"
      />
      {value && (
        <button type="button" className="search-clear" aria-label="Clear search" onClick={() => setValue("")}>
          ×
        </button>
      )}
    </div>
  );
}
