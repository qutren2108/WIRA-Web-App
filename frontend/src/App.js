import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AccountsPage from "./pages/AccountsPage";
import RankingsPage from "./pages/RankingsPage";

import "./App.css";

function App() {
  return (
    <Router>
      <div className="navbar">
        <div className="menu">
          <Link to="/">Home</Link>
          <Link to="/accounts">Accounts</Link>
          <Link to="/rankings">Rankings</Link>
        </div>
      </div>
      <div className="content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/rankings" element={<RankingsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
