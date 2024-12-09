const API_URL = 'http://localhost:5001/api';

/**
 * Fetch accounts with pagination and search.
 * @param {number} page - Current page number.
 * @param {string} search - Search query for filtering accounts.
 * @returns {Promise<Object>} - Accounts data with pagination info.
 */
export const getAccounts = async (page = 1, search = '') => {
    try {
        const response = await fetch(`${API_URL}/accounts?page=${page}&limit=10&search=${search}`);
        if (!response.ok) {
            throw new Error('Failed to fetch accounts');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching accounts:', error);
        throw error;
    }
};

/**
 * Create a new account in the backend.
 * @param {Object} account - The account data to create (username and email).
 * @returns {Promise<Object>} - The created account.
 */
export const createAccount = async (account) => {
    try {
        const response = await fetch(`${API_URL}/accounts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(account),
        });
        if (!response.ok) {
            throw new Error('Failed to create account');
        }
        return await response.json();
    } catch (error) {
        console.error('Error creating account:', error);
        throw error;
    }
};

/**
 * Update an existing account in the backend.
 * @param {number} id - The ID of the account to update.
 * @param {Object} account - The updated account data (username and email).
 * @returns {Promise<Object>} - The updated account.
 */
export const updateAccount = async (id, account) => {
    try {
        const response = await fetch(`${API_URL}/accounts/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(account),
        });
        if (!response.ok) {
            throw new Error('Failed to update account');
        }
        return await response.json();
    } catch (error) {
        console.error('Error updating account:', error);
        throw error;
    }
};

/**
 * Delete an account in the backend.
 * @param {number} id - The ID of the account to delete.
 */
export const deleteAccount = async (id) => {
    try {
        const response = await fetch(`${API_URL}/accounts/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete account');
        }
    } catch (error) {
        console.error('Error deleting account:', error);
        throw error;
    }
};

/**
 * Fetch all characters for a specific account.
 * @param {number} accountId - The ID of the account.
 * @returns {Promise<Object>} - Characters data.
 */
export const getCharacters = async (accountId) => {
    try {
        const response = await fetch(`${API_URL}/accounts/${accountId}/characters`);
        if (!response.ok) {
            throw new Error('Failed to fetch characters');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching characters:', error);
        throw error;
    }
};

/**
 * Create a new character for an account.
 * @param {number} accountId - The ID of the account.
 * @param {Object} character - The character data to create (class_id).
 * @returns {Promise<Object>} - The created character.
 */
export const createCharacter = async (accountId, character) => {
    try {
        const response = await fetch(`${API_URL}/accounts/${accountId}/characters`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(character),
        });
        if (!response.ok) {
            throw new Error('Failed to create character');
        }
        return await response.json();
    } catch (error) {
        console.error('Error creating character:', error);
        throw error;
    }
};

/**
 * Fetch scores for a specific character.
 * @param {number} characterId - The ID of the character.
 * @returns {Promise<Object>} - Scores data.
 */
export const getScores = async (characterId) => {
    try {
        const response = await fetch(`${API_URL}/characters/${characterId}/scores`);
        if (!response.ok) {
            throw new Error('Failed to fetch scores');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching scores:', error);
        throw error;
    }
};

/**
 * Add a new score for a character.
 * @param {number} characterId - The ID of the character.
 * @param {Object} score - The score data to add (reward_score).
 * @returns {Promise<Object>} - The added score.
 */
export const createScore = async (characterId, score) => {
    try {
        const response = await fetch(`${API_URL}/characters/${characterId}/scores`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(score),
        });
        if (!response.ok) {
            throw new Error('Failed to add score');
        }
        return await response.json();
    } catch (error) {
        console.error('Error adding score:', error);
        throw error;
    }
};

/**
 * Fetch rankings.
 * @returns {Promise<Object>} - Rankings data.
 */
export const getRankings = async () => {
    try {
        const response = await fetch(`${API_URL}/rankings`);
        if (!response.ok) {
            throw new Error('Failed to fetch rankings');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching rankings:', error);
        throw error;
    }
};
