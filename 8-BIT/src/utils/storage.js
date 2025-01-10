// src/utils/storage.js

// Save a room's state to localStorage
export function saveRoomState(roomId, roomState) {
  // roomState might look like { items: [...], questions: [...], isPuzzleSolved: true, etc. }
  const existingState = JSON.parse(localStorage.getItem("roomsState")) || {};
  existingState[roomId] = roomState;
  localStorage.setItem("roomsState", JSON.stringify(existingState));
}

// Load a room's state from localStorage
export function loadRoomState(roomId) {
  const allRoomsState = JSON.parse(localStorage.getItem("roomsState")) || {};
  // Return the state for the room if it exists, or `null` if it does not
  return allRoomsState[roomId] || null;
}
