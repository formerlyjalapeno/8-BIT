// src/components/Room.jsx

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // Hook for programmatic navigation
import roomsData from "../components/Main Room Components/scripts/roomsData"; // Importing data for all rooms
import {
  loadRoomState,
  saveRoomState,
  loadPlayerInventory,
  savePlayerInventory,
} from "../utils/storage.js"; // Utility functions for interacting with localStorage
import DevResetButton from "../components/DevResetButton.jsx"; // Development tool for resetting game state

// Importing Puzzle Components
import BinaryPuzzle from "../components/Puzzle Components/Binary Puzzle Components/BinaryPuzzle";
import CassettePuzzle from "../components/Puzzle Components/Cassette Puzzle Components/CassettePuzzle";
import BlackJackPuzzle from "../components/Puzzle Components/Blackjack Puzzle Components/BlackJackPuzzle.jsx";
import TicTacToe from "../components/Puzzle Components/Tic Tac Toe Puzzle Components/TicTacToe";

// Importing the updated Cutscene Component
import Cutscene from "../components/Interim Components/Cutscene.jsx";

// Importing Messages
import {
  generalTaunts,
  roomSpecificTaunts,
  generalTopMessages,
  roomSpecificTopMessages
} from "../components/Main Room Components/scripts/cutsceneMessages.js"; // Adjust the path based on your project structure

import Items from "../components/Main Room Components/scripts/items"; // Importing data for collectible items

/**
 * Room Component
 * 
 * Manages the rendering and state of the current game room.
 * Handles room-specific items, puzzles, player inventory, timers, and transitions
 * to the next room via a cutscene.
 */
const Room = () => {
  const navigate = useNavigate(); // Hook for programmatic navigation

  // Initialize currentRoomId from localStorage or default to 0 if not set
  const [currentRoomId, setCurrentRoomId] = useState(() => {
    const savedRoomId = localStorage.getItem("currentRoomId");
    return savedRoomId ? parseInt(savedRoomId, 10) : 0;
  });

  // Find the current room's data based on currentRoomId
  const currentRoom = roomsData.find((r) => r.id === currentRoomId);

  // State variables for managing room items, questions, and puzzle status
  const [roomItemIds, setRoomItemIds] = useState(currentRoom?.items || []);
  const [roomQuestionIds, setRoomQuestionIds] = useState(
    currentRoom?.questions || []
  );
  const [isPuzzleSolved, setIsPuzzleSolved] = useState(false);

  // State variable for managing the player's inventory
  const [playerInventory, setPlayerInventory] = useState([]);

  // State variables for managing active questions and items (e.g., for inspection overlays)
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [activeItemId, setActiveItemId] = useState(null);
  const [itemPresent, setItemPresent] = useState(roomItemIds.length > 0); // Indicates if items are present in the room

  // State variable to control the display of the Cutscene component
  const [showCutscene, setShowCutscene] = useState(false);

  // Arrays for taunts and top messages
  const taunts = generalTaunts;
  const roomTaunts = roomSpecificTaunts[currentRoomId] || [];

  const topMessages = generalTopMessages;
  const roomTopMessages = roomSpecificTopMessages[currentRoomId] || [];

  // State to keep track of the last used taunt and top message
  const [lastTauntIndex, setLastTauntIndex] = useState(null);
  const [lastTopMessageIndex, setLastTopMessageIndex] = useState(null);

  // State to hold the current messages to display
  const [currentTaunt, setCurrentTaunt] = useState("");
  const [currentTopMessage, setCurrentTopMessage] = useState("");

  /**
   * useEffect Hook: Load room and player data when currentRoomId or currentRoom changes
   */
  useEffect(() => {
    // Load the saved state for the current room from localStorage
    const savedRoomState = loadRoomState(currentRoomId);
    if (savedRoomState) {
      // If a saved state exists, use it to set room items, questions, and puzzle status
      setRoomItemIds(savedRoomState.items || currentRoom.items);
      setRoomQuestionIds(savedRoomState.questions || currentRoom.questions);
      setIsPuzzleSolved(savedRoomState.isPuzzleSolved || false);
      setItemPresent(
        savedRoomState.items && savedRoomState.items.length > 0 ? true : false
      );
    } else {
      // If no saved state exists, initialize with default room data
      setRoomItemIds(currentRoom.items);
      setRoomQuestionIds(currentRoom.questions);
      setIsPuzzleSolved(false);
      setItemPresent(currentRoom.items.length > 0);
    }

    // Load the player's inventory from localStorage
    const savedInventory = loadPlayerInventory();
    setPlayerInventory(savedInventory);

    // Special handling for BlackjackGame's chips to set puzzle as solved if chips >= 150
    try {
      const blackjackDataRaw = localStorage.getItem("blackjackGameData_chips150");
      if (blackjackDataRaw) {
        const blackjackData = JSON.parse(blackjackDataRaw);
        if (blackjackData.chips >= 150) {
          setIsPuzzleSolved(true);
        }
      }
    } catch (error) {
      console.error("Error loading BlackjackGame data:", error);
    }

    // Reset active question and item inspections when room changes
    setActiveQuestion(null);
    setActiveItemId(null);
  }, [currentRoomId, currentRoom]);

  /**
   * useEffect Hook: Save room state to localStorage whenever relevant state changes
   */
  useEffect(() => {
    const currentRoomState = {
      items: roomItemIds,
      questions: roomQuestionIds,
      isPuzzleSolved,
    };
    saveRoomState(currentRoomId, currentRoomState);
  }, [currentRoomId, roomItemIds, roomQuestionIds, isPuzzleSolved]);

  /**
   * useEffect Hook: Save player inventory to localStorage whenever it changes
   */
  useEffect(() => {
    savePlayerInventory(playerInventory);
  }, [playerInventory]);

  /**
   * collectItem Function
   * 
   * Handles the logic for collecting an item:
   * - Adds the item to the player's inventory
   * - Removes the item from the room's item list
   * - Updates the itemPresent state based on remaining items
   * 
   * @param {number} id - The ID of the item to collect
   */
  const collectItem = (id) => {
    const collectedItem = Items.find((itm) => itm.id === id);
    if (!collectedItem) return; // If item not found, do nothing
    setPlayerInventory((prev) => [...prev, collectedItem]); // Add item to inventory
    setRoomItemIds((prev) => prev.filter((itemId) => itemId !== id)); // Remove item from room
    if (roomItemIds.length <= 1) {
      setItemPresent(false); // If no more items, update itemPresent
    }
  };

  /**
   * handlePuzzleCompletion Function
   * 
   * Sets the puzzle as solved and closes any active questions
   */
  const handlePuzzleCompletion = () => {
    setIsPuzzleSolved(true);
    closeQuestion();
  };

  // Functions to manage active questions and item inspections
  const openQuestion = (id) => setActiveQuestion(id);
  const closeQuestion = () => setActiveQuestion(null);
  const onInspectItem = (id) => setActiveItemId(id);
  const closeItemOverlay = () => setActiveItemId(null);

  /**
   * preloadImages Function
   * 
   * Preloads a list of image URLs to ensure smoother transitions and reduce lag
   * 
   * @param {string[]} urls - Array of image URLs to preload
   */
  const preloadImages = (urls) => {
    urls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  };
  
  // useEffect Hook: Preload necessary images on component mount
  useEffect(() => {
    preloadImages([
      "/room-1-with-item.png",
      "/room-1-without-item.png",
      "/room1_hoverframe1.png",
      "/room1_hoverframe2.png",
      "/room1_hoverframe3.png",
      "/room1_hoverframe4.png",
      "/room-2.png",
      "/room1_finito.png",
    ]);
  }, []);

  // Hover states for room background changes
  const [Hover1, setHover1] = useState(false);
  const [Hover2, setHover2] = useState(false);
  const [Hover3, setHover3] = useState(false);
  const [Hover4, setHover4] = useState(false);

  /**
   * Handlers for mouse enter and leave events to manage hover states
   */
  const handleHover1MouseEnter = () => {
    if (!itemPresent && !isPuzzleSolved) setHover1(true);
  };
  const handleHover1MouseLeave = () => {
    setHover1(false);
  };
  const handleHover2MouseEnter = () => {
    if (!itemPresent && !isPuzzleSolved) setHover2(true);
  };
  const handleHover2MouseLeave = () => {
    setHover2(false);
  };
  const handleHover3MouseEnter = () => {
    if (!itemPresent && !isPuzzleSolved) setHover3(true);
  };
  const handleHover3MouseLeave = () => {
    setHover3(false);
  };
  const handleHover4MouseEnter = () => {
    if (!itemPresent && !isPuzzleSolved) setHover4(true);
  };
  const handleHover4MouseLeave = () => {
    setHover4(false);
  };

  /**
   * Determines the appropriate CSS class for the room container based on the current state
   * 
   * This affects the background image and other styles specific to each room state
   */
  const containerClass =
    (currentRoomId === 0) & isPuzzleSolved
      ? "room__container room__container__finito-background-image" // Room 0, puzzle solved
      : (currentRoomId === 0) & Hover1
      ? "room__container room__container__hover1-background-image" // Room 0, Hover1 active
      : (currentRoomId === 0) & Hover2
      ? "room__container room__container__hover2-background-image" // Room 0, Hover2 active
      : (currentRoomId === 0) & Hover3
      ? "room__container room__container__hover3-background-image" // Room 0, Hover3 active
      : (currentRoomId === 0) & Hover4
      ? "room__container room__container__hover4-background-image" // Room 0, Hover4 active
      : currentRoomId === 2
      ? "room__container" // Room 2
      : currentRoomId === 3
      ? "room__container" // Room 3
      : currentRoomId === 1
      ? "room__container room__container__room2" // Room 1
      : (currentRoomId === 0) & itemPresent
      ? "room__container room__container__item-present" // Room 0, items present
      : "room__container room__container__item-gone"; // Default: Room 0, items gone

  // Destructure the 'class' property from currentRoom for button styling
  const { class: nextRoomButtonClass } = currentRoom;

  /**
   * getRandomIndex Function
   * 
   * Generates a random index for an array, ensuring it's different from the last used index.
   * 
   * @param {number} arrayLength - The length of the array to select from.
   * @param {number|null} lastIndex - The index that was last used.
   * @returns {number|null} - A new random index or null if the array is empty.
   */
  const getRandomIndex = (arrayLength, lastIndex) => {
    if (arrayLength === 0) return null;
    if (arrayLength === 1) return 0; // Only one element, return its index

    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * arrayLength);
    } while (newIndex === lastIndex);
    
    return newIndex;
  };

  /**
   * goToNextRoom Function
   * 
   * Initiates the transition to the next room by showing the Cutscene
   * and selecting new messages.
   */
  const goToNextRoom = () => {
    const roomId = currentRoomId; // Current room ID before transitioning
    
    // Determine if room-specific taunts are available for the current room
    const roomTaunts = roomSpecificTaunts[roomId] || [];
    const roomTopMessages = roomSpecificTopMessages[roomId] || [];
    
    // Decide whether to use a room-specific taunt (e.g., 30% chance)
    const useRoomTaunt = roomTaunts.length > 0 && Math.random() < 0.3;
    
    let selectedTaunt;
    
    if (useRoomTaunt) {
      // Select a room-specific taunt
      const selectedTauntIndex = getRandomIndex(roomTaunts.length, lastTauntIndex);
      setLastTauntIndex(selectedTauntIndex);
      selectedTaunt = roomTaunts[selectedTauntIndex];
    } else {
      // Select a general taunt
      const selectedTauntIndex = getRandomIndex(generalTaunts.length, lastTauntIndex);
      setLastTauntIndex(selectedTauntIndex);
      selectedTaunt = generalTaunts[selectedTauntIndex];
    }
    
    // Similarly, decide whether to use a room-specific top message
    const useRoomTopMessage = roomTopMessages.length > 0 && Math.random() < 0.3;
    
    let selectedTopMessage;
    
    if (useRoomTopMessage) {
      // Select a room-specific top message
      const selectedTopMessageIndex = getRandomIndex(roomTopMessages.length, lastTopMessageIndex);
      setLastTopMessageIndex(selectedTopMessageIndex);
      selectedTopMessage = roomTopMessages[selectedTopMessageIndex];
    } else {
      // Select a general top message
      const selectedTopMessageIndex = getRandomIndex(generalTopMessages.length, lastTopMessageIndex);
      setLastTopMessageIndex(selectedTopMessageIndex);
      selectedTopMessage = generalTopMessages[selectedTopMessageIndex];
    }
    
    // Set the current messages
    setCurrentTaunt(selectedTaunt);
    setCurrentTopMessage(selectedTopMessage);
    
    setShowCutscene(true); // Show the cutscene
  };

  /**
   * handleCutsceneEnd Function
   * 
   * Handles the logic after the Cutscene has finished displaying:
   * - Updates currentRoomId and relevant localStorage entries
   * - Hides the Cutscene component
   */
  const handleCutsceneEnd = useCallback(() => {
    console.log("handleCutsceneEnd called.");
    const nextRoomId = currentRoomId + 1;
    const nextExists = roomsData.some((rr) => rr.id === nextRoomId);
    if (!nextExists) {
      alert("You have completed all rooms!");
      return;
    }
    
    // Update localStorage with the new room ID
    localStorage.setItem("currentRoomId", nextRoomId.toString());
    localStorage.removeItem("roomsState");
    localStorage.removeItem("playerInventory");
    // Remove BlackjackGame's data if moving to next room
    localStorage.removeItem("blackjackGameData_chips150");
    localStorage.removeItem("blackjackHasWon");

    setCurrentRoomId(nextRoomId);
    console.log(`Transitioned to room ${nextRoomId}.`);
    setShowCutscene(false); // Hide the cutscene after transitioning
  }, [currentRoomId, roomsData]);

  // ───────────────────────────────────────────────────────────
  // TIMER & PAUSE: Add states and effects for the 10-minute timer
  // ───────────────────────────────────────────────────────────
  const [timeLeft, setTimeLeft] = useState(600); // 600 seconds = 10 minutes
  const [isPaused, setIsPaused] = useState(false); // State to track if the timer is paused

  /**
   * useEffect Hook: Decrement the timer every second if not paused
   */
  useEffect(() => {
    // If timeLeft is already 0, do nothing
    if (timeLeft <= 0) return;

    // Set up an interval to decrement timeLeft every second
    const intervalId = setInterval(() => {
      if (!isPaused) {
        setTimeLeft((prev) => {
          const nextVal = prev - 1;
          // If time reaches 0, clear the interval
          if (nextVal <= 0) {
            clearInterval(intervalId);
            return 0;
          }
          return nextVal;
        });
      }
    }, 1000);

    // Cleanup the interval when the component unmounts or re-renders
    return () => clearInterval(intervalId);
  }, [isPaused, timeLeft]);

  /**
   * formatTime Function
   * 
   * Converts seconds into a "MM:SS" format string
   * 
   * @param {number} seconds - The number of seconds to format
   * @returns {string} - Formatted time string
   */
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  /**
   * handleExitToMenu Function
   * 
   * Navigates the player back to the main menu or welcome screen
   * 
   * This function is called when the player chooses to exit the game from the pause menu
   */
  const handleExitToMenu = () => {
    // Perform any necessary cleanup here before navigating
    navigate("/welcome"); // Navigate to the welcome screen (adjust route as needed)
  };

  // ───────────────────────────────────────────────────────────
  // RENDER
  // ───────────────────────────────────────────────────────────
  return (
    <main className={containerClass}>
      {/* 
        TIMER & PAUSE UI: Displays the remaining time and a pause button.
        Positioned at the top of the room.
      */}
      <div className="room__timer">
        <span className="room__timer__text">
          Time Left: {formatTime(timeLeft)} {/* Display the formatted time */}
        </span>
        <button
          onClick={() => setIsPaused(true)} // Pause the timer when clicked
          className="room__timer__pause-button"
        >
          Pause
        </button>
      </div>

      {/* 
        Pause Overlay: Displays a pause menu when the game is paused.
        Includes options to continue or exit to the main menu.
      */}
      {isPaused && (
        <div className="room__pause-overlay">
          <div className="room__pause-overlay__menu">
            <h2 className="room__pause-overlay__menu__heading">Paused</h2>
            <button
              className="room__pause-overlay__menu__button"
              onClick={() => setIsPaused(false)} // Resume the game when clicked
            >
              Continue
            </button>
            <button
              className="room__pause-overlay__menu__button"
              onClick={handleExitToMenu} // Exit to main menu when clicked
            >
              Exit
            </button>
          </div>
        </div>
      )}

      {/* 
        Renders the appropriate puzzle component based on the currentRoomId.
        Each puzzle component receives props to manage room items, questions, inventory, and puzzle status.
      */}
      {currentRoomId === 0 && (
        <BinaryPuzzle
          roomItemIds={roomItemIds}
          setRoomItemIds={setRoomItemIds}
          roomQuestionIds={roomQuestionIds}
          setRoomQuestionIds={setRoomQuestionIds}
          isPuzzleSolved={isPuzzleSolved}
          setIsPuzzleSolved={setIsPuzzleSolved}
          playerInventory={playerInventory}
          setPlayerInventory={setPlayerInventory}
          activeQuestion={activeQuestion}
          setActiveQuestion={setActiveQuestion}
          activeItemId={activeItemId}
          setActiveItemId={setActiveItemId}
          itemPresent={itemPresent}
          setItemPresent={setItemPresent}
          collectItem={collectItem}
          onPuzzleCompletion={handlePuzzleCompletion}
          closeQuestion={closeQuestion}
          onInspectItem={onInspectItem}
          closeItemOverlay={closeItemOverlay}
          Hover1Enter={handleHover1MouseEnter}
          Hover1Leave={handleHover1MouseLeave}
          Hover2Enter={handleHover2MouseEnter}
          Hover2Leave={handleHover2MouseLeave}
          Hover3Enter={handleHover3MouseEnter}
          Hover3Leave={handleHover3MouseLeave}
          Hover4Enter={handleHover4MouseEnter}
          Hover4Leave={handleHover4MouseLeave}
        />
      )}

      {currentRoomId === 1 && (
        <CassettePuzzle
          isPuzzleSolved={isPuzzleSolved}
          setIsPuzzleSolved={setIsPuzzleSolved}
          onPuzzleCompletion={handlePuzzleCompletion}
        />
      )}

      {currentRoomId === 2 && (
        <BlackJackPuzzle onWin={() => setIsPuzzleSolved(true)} />
      )}

      {currentRoomId === 3 && (
        <TicTacToe
          onWin={() => setIsPuzzleSolved(true)}
          onReset={() => setIsPuzzleSolved(false)}
        />
      )}

      {/* 
        "Go to Next Room" Button: Displayed only if the puzzle is solved and the Cutscene is not showing.
        When clicked, it triggers the display of the Cutscene.
      */}
      {isPuzzleSolved && !showCutscene && (
        <button
          className={nextRoomButtonClass}
          onClick={goToNextRoom} // Initiates the Cutscene
          aria-label="Go to Next Room"
        >
          Go to Next Room
        </button>
      )}

      {/* 
        Cutscene Component: Displayed when showCutscene is true.
        Shows an AI taunt with a glitch effect and automatically transitions to the next room.
      */}
      {showCutscene && (
        <Cutscene
          topMessage={currentTopMessage}
          tauntMessage={currentTaunt}
          duration={3000} // Duration before transitioning (3 seconds)
          onCutsceneEnd={handleCutsceneEnd} // Callback function after Cutscene ends
        />
      )}

      <DevResetButton /> {/* Development tool for resetting the game state */}
    </main>
  );
};

export default Room;
