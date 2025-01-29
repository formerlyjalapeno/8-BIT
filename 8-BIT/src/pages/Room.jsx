// Room.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // <-- for "Exit to main menu"
import roomsData from "../components/Main Room Components/scripts/roomsData";
import {
  loadRoomState,
  saveRoomState,
  loadPlayerInventory,
  savePlayerInventory,
} from "../utils/storage.js";
import DevResetButton from "../components/DevResetButton.jsx";

// Puzzles
import BinaryPuzzle from "../components/Puzzle Components/Binary Puzzle Components/BinaryPuzzle";
import CassettePuzzle from "../components/Puzzle Components/Cassette Puzzle Components/CassettePuzzle";
import BlackJackPuzzle from "../components/Puzzle Components/Blackjack Puzzle Components/BlackJackPuzzle.jsx";

import Items from "../components/Main Room Components/scripts/items";

const Room = () => {
  const navigate = useNavigate(); // <-- For exiting to main menu

  // -- Existing code (room states, inventory, puzzle logic, etc.) --
  const [currentRoomId, setCurrentRoomId] = useState(() => {
    const savedRoomId = localStorage.getItem("currentRoomId");
    return savedRoomId ? parseInt(savedRoomId, 10) : 0;
  });
  const currentRoom = roomsData.find((r) => r.id === currentRoomId);

  const [roomItemIds, setRoomItemIds] = useState(currentRoom?.items || []);
  const [roomQuestionIds, setRoomQuestionIds] = useState(
    currentRoom?.questions || []
  );
  const [isPuzzleSolved, setIsPuzzleSolved] = useState(false);

  const [playerInventory, setPlayerInventory] = useState([]);

  const [activeQuestion, setActiveQuestion] = useState(null);
  const [activeItemId, setActiveItemId] = useState(null);
  const [itemPresent, setItemPresent] = useState(roomItemIds.length > 0);

  useEffect(() => {
    localStorage.setItem("currentRoomId", currentRoomId.toString());

    const savedInventory = loadPlayerInventory();
    setPlayerInventory(savedInventory);

    const savedRoomState = loadRoomState(currentRoomId);
    if (savedRoomState) {
      setRoomItemIds(savedRoomState.items || currentRoom.items);
      setRoomQuestionIds(savedRoomState.questions || currentRoom.questions);
      setIsPuzzleSolved(savedRoomState.isPuzzleSolved || false);
      setItemPresent(
        savedRoomState.items && savedRoomState.items.length > 0 ? true : false
      );
    } else {
      setRoomItemIds(currentRoom.items);
      setRoomQuestionIds(currentRoom.questions);
      setIsPuzzleSolved(false);
      setItemPresent(currentRoom.items.length > 0);
    }

    setActiveQuestion(null);
    setActiveItemId(null);
  }, [currentRoomId, currentRoom]);

  useEffect(() => {
    const currentRoomState = {
      items: roomItemIds,
      questions: roomQuestionIds,
      isPuzzleSolved,
    };
    saveRoomState(currentRoomId, currentRoomState);
  }, [currentRoomId, roomItemIds, roomQuestionIds, isPuzzleSolved]);

  useEffect(() => {
    savePlayerInventory(playerInventory);
  }, [playerInventory]);

  const collectItem = (id) => {
    const collectedItem = Items.find((itm) => itm.id === id);
    if (!collectedItem) return;
    setPlayerInventory((prev) => [...prev, collectedItem]);
    setRoomItemIds((prev) => prev.filter((itemId) => itemId !== id));
    if (roomItemIds.length <= 1) {
      setItemPresent(false);
    }
  };

  const handlePuzzleCompletion = () => {
    setIsPuzzleSolved(true);
    closeQuestion();
  };

  const openQuestion = (id) => setActiveQuestion(id);
  const closeQuestion = () => setActiveQuestion(null);
  const onInspectItem = (id) => setActiveItemId(id);
  const closeItemOverlay = () => setActiveItemId(null);

  const preloadImages = (urls) => {
    urls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  };
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

  const [Hover1, setHover1] = useState(false);
  const [Hover2, setHover2] = useState(false);
  const [Hover3, setHover3] = useState(false);
  const [Hover4, setHover4] = useState(false);

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

  const containerClass =
    (currentRoomId === 0) & isPuzzleSolved
      ? "room__container room__container__finito-background-image"
      : (currentRoomId === 0) & Hover1
      ? "room__container room__container__hover1-background-image"
      : (currentRoomId === 0) & Hover2
      ? "room__container room__container__hover2-background-image"
      : (currentRoomId === 0) & Hover3
      ? "room__container room__container__hover3-background-image"
      : (currentRoomId === 0) & Hover4
      ? "room__container room__container__hover4-background-image"
      : currentRoomId === 2
      ? "room__container"
      : currentRoomId === 1
      ? "room__container room__container__room2"
      : (currentRoomId === 0) & itemPresent
      ? "room__container room__container__item-present"
      : "room__container room__container__item-gone";

  const { class: nextRoomButtonClass } = currentRoom;

  const goToNextRoom = () => {
    const nextRoomId = currentRoomId + 1;
    const nextExists = roomsData.some((rr) => rr.id === nextRoomId);
    if (!nextExists) {
      alert("You have completed all rooms!");
      return;
    }
    localStorage.setItem("currentRoomId", nextRoomId.toString());
    localStorage.removeItem("roomsState");
    localStorage.removeItem("playerInventory");
    setCurrentRoomId(nextRoomId);
  };

  // ───────────────────────────────────────────────────────────
  // TIMER & PAUSE: Add states and effects for the 10-min timer
  // ───────────────────────────────────────────────────────────
  const [timeLeft, setTimeLeft] = useState(600); // 600 seconds = 10 minutes
  const [isPaused, setIsPaused] = useState(false);

  // Decrement the timer once per second, if not paused
  useEffect(() => {
    // If timeLeft is already 0, do nothing.
    if (timeLeft <= 0) return;

    const intervalId = setInterval(() => {
      if (!isPaused) {
        setTimeLeft((prev) => {
          const nextVal = prev - 1;
          // If it hits 0, we stop the interval
          if (nextVal <= 0) {
            clearInterval(intervalId);
            return 0;
          }
          return nextVal;
        });
      }
    }, 1000);

    // Cleanup interval on unmount or re-render
    return () => clearInterval(intervalId);
  }, [isPaused, timeLeft]);

  // Helper function: convert seconds -> "MM:SS"
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Called when the user clicks "Exit" from the pause menu
  const handleExitToMenu = () => {
    // If you want to do any cleanup before navigating, do it here
    navigate("/welcome"); // or navigate("/mainmenu") if that's your main menu route
  };

  // ───────────────────────────────────────────────────────────
  // RENDER
  // ───────────────────────────────────────────────────────────
  return (
    <main className={containerClass}>
      {/* TIMER & PAUSE UI: Displays at top (or wherever you like) */}
      <div className="room__timer">
        <span className="room__timer__text">
          Time Left: {formatTime(timeLeft)}
        </span>
        <button
          onClick={() => setIsPaused(true)}
          className="room__timer__pause-button"
        >
          Pause
        </button>
      </div>

      {/* Pause Overlay */}
      {isPaused && (
        <div className="room__pause-overlay">
          <div className="room__pause-overlay__menu">
            <h2 className="room__pause-overlay__menu__heading">Paused</h2>
            <button
              className="room__pause-overlay__menu__button"
              onClick={() => setIsPaused(false)}
            >
              Continue
            </button>
            <button
              className="room__pause-overlay__menu__button"
              onClick={handleExitToMenu}
            >
              Exit
            </button>
          </div>
        </div>
      )}
      {/* Existing puzzle rendering code */}
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

      {isPuzzleSolved && (
        <button
          className={nextRoomButtonClass}
          onClick={goToNextRoom}
          aria-label="Go to Next Room"
        >
          Go to Next Room
        </button>
      )}

      <DevResetButton />
    </main>
  );
};

export default Room;
