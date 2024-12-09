<<<<<<< HEAD
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
=======
import React, { useState, useEffect } from 'react';
import {
    getAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
    getCharacters,
    createCharacter,
    getScores,
    createScore,
} from './services/api';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import './App.css';

const App = () => {
    const [accounts, setAccounts] = useState([]);
    const [characters, setCharacters] = useState([]);
    const [scores, setScores] = useState([]);
    const [newAccount, setNewAccount] = useState({ username: '', email: '' });
    const [newCharacter, setNewCharacter] = useState({ class_id: '' });
    const [newScore, setNewScore] = useState({ reward_score: '' });
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const [rankings, setRankings] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    // Fetch Rankings
    const fetchRankings = async () => {
      setLoading(true);
      setError(null);
      try {
          const response = await fetch(`http://localhost:5001/api/rankings?search=${searchTerm}`);
          const { data } = await response.json();
          setRankings(data || []); // Ensure data is an array
      } catch (err) {
          setError('Failed to load rankings.');
          setRankings([]);
      } finally {
          setLoading(false);
      }
  };
  
    // Fetch Accounts
    useEffect(() => {
        const fetchAccounts = async () => {
            setLoading(true);
            setError(null);
            try {
                const { data: accounts, pagination } = await getAccounts(currentPage, searchTerm);
                setAccounts(accounts);
                setTotalPages(pagination.totalPages);
            } catch (err) {
                setError('Failed to load accounts.');
            } finally {
                setLoading(false);
            }
        };
        fetchAccounts();
    }, [currentPage, searchTerm]);

    // Fetch Characters for Selected Account
    const fetchCharacters = async (accountId) => {
        setLoading(true);
        setError(null);
        try {
            const { data: characters } = await getCharacters(accountId);
            setCharacters(characters);
            setSelectedAccount(accountId);
            setScores([]); // Reset scores when changing accounts
        } catch (err) {
            setError('Failed to load characters.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch Scores for Selected Character
    const fetchScores = async (characterId) => {
        setLoading(true);
        setError(null);
        try {
            const { data: scores } = await getScores(characterId);
            setScores(scores);
            setSelectedCharacter(characterId);
        } catch (err) {
            setError('Failed to load scores.');
        } finally {
            setLoading(false);
        }
    };

    // Create Account
    const handleCreateAccount = async (e) => {
        e.preventDefault();
        if (!newAccount.username.trim() || !newAccount.email.trim()) {
            alert('Username and Email are required.');
            return;
        }
        try {
            const createdAccount = await createAccount(newAccount);
            setAccounts([...accounts, createdAccount]);
            setNewAccount({ username: '', email: '' }); // Reset form fields
        } catch (err) {
            alert('Failed to create account.');
        }
    };

    // Add Character
    const handleAddCharacter = async () => {
        if (!newCharacter.class_id) {
            alert('Class ID is required.');
            return;
        }
        try {
            const { data: character } = await createCharacter(selectedAccount, newCharacter);
            setCharacters([...characters, character]);
            setNewCharacter({ class_id: '' });
        } catch (err) {
            alert('Failed to create character.');
        }
    };

    // Add Score
    const handleAddScore = async () => {
        if (!newScore.reward_score) {
            alert('Reward Score is required.');
            return;
        }
        try {
            const { data: score } = await createScore(selectedCharacter, newScore);
            setScores([...scores, score]);
            setNewScore({ reward_score: '' });
        } catch (err) {
            alert('Failed to create score.');
        }
    };

    // Pagination
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <div className="container">
            <h1>WIRA Dashboard</h1>

            {/* Error Message */}
            {error && <div className="error">{error}</div>}

            <form
               onSubmit={(e) => {
                 e.preventDefault();
                fetchRankings(); // Trigger the fetch with the search term
                }}
            >
                <input
                    type="text"
                    placeholder="Search by username"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit">Search</button>
            </form>

            {/* Create Account Form */}
            <h2>Create a New Account</h2>
            <form onSubmit={handleCreateAccount}>
                <input
                    type="text"
                    placeholder="Username"
                    value={newAccount.username}
                    onChange={(e) => setNewAccount({ ...newAccount, username: e.target.value })}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={newAccount.email}
                    onChange={(e) => setNewAccount({ ...newAccount, email: e.target.value })}
                    required
                />
                <button type="submit">Create Account</button>
            </form>

            {/* Accounts Section */}
            <h2>Accounts</h2>
            <ul>
                {accounts.map((account) => (
                    <li key={account.acc_id}>
                        {account.username} - {account.email}
                        <button onClick={() => fetchCharacters(account.acc_id)}>View Characters</button>
                    </li>
                ))}
            </ul>

            {/* Pagination */}
            <div className="pagination">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    Previous
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>

            {/* Characters Section */}
            {selectedAccount && (
                <>
                    <h2>Characters</h2>
                    <ul>
                        {characters.map((character) => (
                            <li key={character.char_id}>
                                Class ID: {character.class_id}
                                <button onClick={() => fetchScores(character.char_id)}>View Scores</button>
                            </li>
                        ))}
                    </ul>
                    <input
                        type="number"
                        placeholder="Class ID"
                        value={newCharacter.class_id}
                        onChange={(e) => setNewCharacter({ class_id: e.target.value })}
                    />
                    <button onClick={handleAddCharacter}>Add Character</button>
                </>
            )}

            {/* Scores Section */}
            {selectedCharacter && (
                <>
                    <h2>Scores</h2>
                    <ul>
                        {scores.map((score) => (
                            <li key={score.score_id}>Reward Score: {score.reward_score}</li>
                        ))}
                    </ul>
                    <input
                        type="number"
                        placeholder="Reward Score"
                        value={newScore.reward_score}
                        onChange={(e) => setNewScore({ reward_score: e.target.value })}
                    />
                    <button onClick={handleAddScore}>Add Score</button>
                </>
            )}

            {/* Rankings Chart */}
            <h2>Player Rankings</h2>
            {loading ? (
                <p>Loading...</p>
            ) : rankings && rankings.length > 0 ? (
                <Bar
                    data={{
                        labels: rankings.map((r) => r.username || 'Unknown'),
                        datasets: [
                            {
                                label: 'Total Score',
                                data: rankings.map((r) => r.total_score || 0),
                                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                                borderColor: 'rgba(54, 162, 235, 1)',
                                borderWidth: 1,
                            },
                        ],
                    }}
                />
            ) : (
                <p>No rankings available.</p>
            )}
        </div>
    );
};

export default App;
>>>>>>> origin/main
