// src/components/DevResetButton.jsx

import React from "react";

/**
 * DevResetButton Component
 * 
 * A development tool to reset the game state for testing purposes.
 */
const DevResetButton = () => {
  const handleReset = () => {
    // Clear all relevant localStorage entries
    localStorage.removeItem("currentRoomId");
    localStorage.removeItem("roomsState");
    localStorage.removeItem("playerInventory");
    localStorage.removeItem("blackjackGameData_chips150");
    localStorage.removeItem("blackjackHasWon");
    localStorage.removeItem("room0SelectedQuestionId"); // Clear Room 0's selected question

    // Optionally, reload the page or redirect to the start screen
    window.location.reload();
  };

  return (
      
          
    <button onClick={handleReset} style={{
      position: "absolute",
      bottom: "1rem",
      right: "1rem",
      background: "red",
      color: "white",
      padding: "0.5rem",
      border: "none",
      borderRadius: "0.25rem",
      cursor: "pointer",
      zIndex: 9999, // So it stays on top of other elements
    }}>
      Dev Reset
    </button>
  );
};

export default DevResetButton;