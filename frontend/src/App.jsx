import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import MatchDetails from "./pages/MatchDetails.jsx";
import Favorites from "./pages/Favorites.jsx";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="app-shell">
      <Navigation onSearch={setSearchQuery} />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Dashboard searchQuery={searchQuery} />} />
          <Route path="/match/:id" element={<MatchDetails />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="*" element={<p className="not-found">Page not found.</p>} />
        </Routes>
      </main>
    </div>
  );
}
