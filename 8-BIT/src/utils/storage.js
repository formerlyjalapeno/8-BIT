// src/utils/storage.js

/**
 * STORAGE UTILITIES
 * 
 * This file handles saving and loading game data using `localStorage`.
 * It stores:
 * - Room state (items, questions, puzzle progress)
 * - Player inventory (collected items)
 * - Whether the game has started or not
 */

/* --------------------- ROOM STATE MANAGEMENT --------------------- */

/**
 * Saves the state of a specific room to localStorage.
 * 
 * @param {number} roomId - The ID of the room to save.
 * @param {object} roomState - The state object of the room (items, questions, puzzle completion).
 */
export function saveRoomState(roomId, roomState) {
  try {
    // Retrieve all saved room states or create an empty object if none exist
    const existingRoomsState = JSON.parse(localStorage.getItem("roomsState")) || {};

    // Update the specific room's state
    existingRoomsState[roomId] = roomState;

    // Save the updated rooms state back to localStorage
    localStorage.setItem("roomsState", JSON.stringify(existingRoomsState));
  } catch (error) {
    console.error(`Error saving state for room ${roomId}:`, error);
  }
}

/**
 * Loads the state of a specific room from localStorage.
 * 
 * @param {number} roomId - The ID of the room to load.
 * @returns {object|null} - The state object of the room or null if no data exists.
 */
export function loadRoomState(roomId) {
  try {
    // Retrieve all room states from localStorage
    const allRoomsState = JSON.parse(localStorage.getItem("roomsState")) || {};

    // Return the state for the specified room or null if not found
    return allRoomsState[roomId] || null;
  } catch (error) {
    console.error(`Error loading state for room ${roomId}:`, error);
    return null;
  }
}

/* --------------------- INVENTORY MANAGEMENT --------------------- */

/**
 * Saves the player's inventory to localStorage.
 * 
 * @param {array} inventory - An array containing the player's collected items.
 */
export function savePlayerInventory(inventory) {
  try {
    // Convert the inventory array into a JSON string and save it
    localStorage.setItem("playerInventory", JSON.stringify(inventory));
  } catch (error) {
    console.error("Error saving player inventory:", error);
  }
}

/**
 * Loads the player's inventory from localStorage.
 * 
 * @returns {array} - An array of collected items, or an empty array if no inventory is found.
 */
export function loadPlayerInventory() {
  try {
    // Retrieve the saved inventory data
    const stored = localStorage.getItem("playerInventory");

    // Parse and return the inventory data, or return an empty array if not found
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading player inventory:", error);
    return [];
  }
}

/* --------------------- GAME START STATUS --------------------- */

/**
 * Saves the game's start status to localStorage.
 * 
 * @param {boolean} isStarted - Indicates whether the game has started.
 */
export function saveGameStarted(isStarted) {
  try {
    // Convert boolean value into a string and save it
    localStorage.setItem("gameStarted", JSON.stringify(isStarted));
  } catch (error) {
    console.error("Error saving game started status:", error);
  }
}

/**
 * Loads the game's start status from localStorage.
 * 
 * @returns {boolean} - Returns true if the game has started, otherwise false.
 */
export function loadGameStarted() {
  try {
    // Retrieve the saved game start status
    const stored = localStorage.getItem("gameStarted");

    // Parse and return the boolean value, or return false if no data is found
    return stored ? JSON.parse(stored) : false;
  } catch (error) {
    console.error("Error loading game started status:", error);
    return false;
  }
}

/**
 * Clears all relevant game data from localStorage for a complete game reset.
 * 
 * This includes room states, player inventory, game start status, selected questions,
 * and any room-specific selections.
 */
export function clearAllGameData() {
  try {
    localStorage.clear(); // Wipes everything
  } catch (error) {
    console.error("Error clearing all game data:", error);
  }
}

/**
 * Saves a game completion flag as a cookie.
 * 
 * This allows the game to recognize if the player has finished,
 * even after restarting the browser.
 */
export function saveGameCompletion() {
  document.cookie = "gameCompleted=true; path=/; max-age=31536000"; // 1-year expiration
}

/**
 * Checks if the player has completed the game.
 * 
 * @returns {boolean} - True if the game was completed, false otherwise.
 */
export function loadGameCompletion() {
  return document.cookie.split("; ").some((cookie) => cookie.startsWith("gameCompleted=true"));
}

/**
 * Clears the game completion cookie (for debugging or game resets).
 */
export function clearGameCompletion() {
  document.cookie = "gameCompleted=; path=/; max-age=0";
}