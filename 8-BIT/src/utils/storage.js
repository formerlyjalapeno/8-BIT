// src/utils/storage.js

// ROOM STATE
export function saveRoomState(roomId, roomState) {
  const existingRoomsState =
    JSON.parse(localStorage.getItem("roomsState")) || {};
  existingRoomsState[roomId] = roomState;
  localStorage.setItem("roomsState", JSON.stringify(existingRoomsState));
}

export function loadRoomState(roomId) {
  const allRoomsState = JSON.parse(localStorage.getItem("roomsState")) || {};
  return allRoomsState[roomId] || null;
}

// INVENTORY
export function savePlayerInventory(inventory) {
  localStorage.setItem("playerInventory", JSON.stringify(inventory));
}

export function loadPlayerInventory() {
  const stored = localStorage.getItem("playerInventory");
  return stored ? JSON.parse(stored) : [];
}
