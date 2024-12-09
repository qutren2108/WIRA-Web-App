import React, { useState, useEffect } from "react";
import "./AccountsPage.css";

function AccountsPage() {
  const [accounts, setAccounts] = useState([]); // Holds the list of accounts
  const [editingAccount, setEditingAccount] = useState(null); // Tracks the account being edited
  const [updatedUsername, setUpdatedUsername] = useState("");
  const [updatedEmail, setUpdatedEmail] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Tracks the current page
  const [totalPages, setTotalPages] = useState(1); // Tracks total pages
  const [searchTerm, setSearchTerm] = useState(""); // Tracks the search term

  // Fetch accounts from the API
  const fetchAccounts = async (page = 1, search = "") => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/accounts?page=${page}&limit=10&search=${search}`
      );
      const data = await response.json();
      if (data.success) {
        setAccounts(data.data);
        setTotalPages(data.pagination.totalPages);
        setCurrentPage(data.pagination.currentPage);
      } else {
        console.error("Failed to fetch accounts:", data.message);
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  // Initial fetch on page load and when currentPage or searchTerm changes
  useEffect(() => {
    fetchAccounts(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  // Handle delete
  const deleteAccount = async (id) => {
    try {
      const response = await fetch(`http://localhost:5001/api/accounts/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result.success) {
        setAccounts(accounts.filter((account) => account.acc_id !== id));
      } else {
        console.error("Failed to delete account:", result.message);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  // Handle edit
  const startEditing = (account) => {
    setEditingAccount(account);
    setUpdatedUsername(account.username);
    setUpdatedEmail(account.email);
  };

  const saveEdit = async () => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/accounts/${editingAccount.acc_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: updatedUsername,
            email: updatedEmail,
          }),
        }
      );
      const result = await response.json();
      if (result.success) {
        setAccounts(
          accounts.map((account) =>
            account.acc_id === editingAccount.acc_id
              ? result.data
              : account
          )
        );
        setEditingAccount(null);
      } else {
        console.error("Failed to update account:", result.message);
      }
    } catch (error) {
      console.error("Error updating account:", error);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to the first page for a new search
  };

  // Handle pagination
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <div className="accounts-page">
      <h2>Accounts Management</h2>
      <div className="form-container">
        <h3>Create New Account</h3>
        <input type="text" placeholder="Username" />
        <input type="email" placeholder="Email" />
        <button>Add</button>
      </div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search username or email..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <ul className="accounts-list">
        {accounts.map((account) => (
          <li key={account.acc_id}>
            {editingAccount?.acc_id === account.acc_id ? (
              <>
                <input
                  type="text"
                  value={updatedUsername}
                  onChange={(e) => setUpdatedUsername(e.target.value)}
                  placeholder="Edit username"
                />
                <input
                  type="email"
                  value={updatedEmail}
                  onChange={(e) => setUpdatedEmail(e.target.value)}
                  placeholder="Edit email"
                />
                <button onClick={saveEdit}>Save</button>
                <button onClick={() => setEditingAccount(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span>
                  <strong>{account.username}</strong> - {account.email}
                </span>
                <button onClick={() => startEditing(account)}>Edit</button>
                <button onClick={() => deleteAccount(account.acc_id)}>
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}

export default AccountsPage;
