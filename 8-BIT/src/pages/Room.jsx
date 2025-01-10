// Room.jsx
import { useState, useEffect } from "react";
import roomsData from "../components/Main Room Components/scripts/roomsData";
// Local Storage Helpers
import {
  loadRoomState,
  saveRoomState,
  loadPlayerInventory,
  savePlayerInventory,
} from "../utils/storage.js";
// Dev Reset
import DevResetButton from "../components/DevResetButton.jsx";

// Puzzles
import BinaryPuzzle from "../components/Puzzle Components/Binary Puzzle Components/BinaryPuzzle";
import CassettePuzzle from "../components/Puzzle Components/Cassette Puzzle Components/CassettePuzzle";

import Items from "../components/Main Room Components/scripts/items";

const Room = () => {
  // 1) CURRENT ROOM ID (persisted)
  const [currentRoomId, setCurrentRoomId] = useState(() => {
    const savedRoomId = localStorage.getItem("currentRoomId");
    return savedRoomId ? parseInt(savedRoomId, 10) : 0;
  });
  const currentRoom = roomsData.find((r) => r.id === currentRoomId);

  // 2) Room states
  const [roomItemIds, setRoomItemIds] = useState(currentRoom?.items || []);
  const [roomQuestionIds, setRoomQuestionIds] = useState(
    currentRoom?.questions || []
  );
  const [isPuzzleSolved, setIsPuzzleSolved] = useState(false);

  // 3) Global Inventory
  const [playerInventory, setPlayerInventory] = useState([]);

  // 4) Overlays
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [activeItemId, setActiveItemId] = useState(null);

  // 5) itemPresent
  const [itemPresent, setItemPresent] = useState(roomItemIds.length > 0);

  // ─────────────────────────────────────────────────────────────────────────────
  // 6) LOAD from localStorage
  // ─────────────────────────────────────────────────────────────────────────────
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

  // 7) SAVE room
  useEffect(() => {
    const currentRoomState = {
      items: roomItemIds,
      questions: roomQuestionIds,
      isPuzzleSolved,
    };
    saveRoomState(currentRoomId, currentRoomState);
  }, [currentRoomId, roomItemIds, roomQuestionIds, isPuzzleSolved]);

  // 8) SAVE inventory
  useEffect(() => {
    savePlayerInventory(playerInventory);
  }, [playerInventory]);

  // 9) collectItem
  const collectItem = (id) => {
    const collectedItem = Items.find((itm) => itm.id === id);
    if (!collectedItem) return;
    setPlayerInventory((prev) => [...prev, collectedItem]);
    setRoomItemIds((prev) => prev.filter((itemId) => itemId !== id));
    if (roomItemIds.length <= 1) {
      setItemPresent(false);
    }
  };

  // 10) puzzleCompletion
  const handlePuzzleCompletion = () => {
    setIsPuzzleSolved(true);
    closeQuestion();
  };

  // Overlays
  const openQuestion = (id) => setActiveQuestion(id);
  const closeQuestion = () => setActiveQuestion(null);
  const onInspectItem = (id) => setActiveItemId(id);
  const closeItemOverlay = () => setActiveItemId(null);

  // Background logic
  const containerClass = itemPresent
    ? "room__container room__container__item-present"
    : "room__container room__container__item-gone";
  const { class: nextRoomButtonClass } = currentRoom;

  // 13) goToNextRoom
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

  // 14) RENDER
  return (
    <main
      className={containerClass}
      style={{
        backgroundImage: itemPresent
          ? `url(${currentRoom.backgroundWithItem})`
          : `url(${currentRoom.backgroundWithoutItem})`,
      }}
    >
      {/* If we are in Room 0 => Binary Puzzle */}
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
        />
      )}

      {/* If we are in Room 1 => CassettePuzzle */}
      {currentRoomId === 1 && (
        <CassettePuzzle
          isPuzzleSolved={isPuzzleSolved}
          setIsPuzzleSolved={setIsPuzzleSolved}
          onPuzzleCompletion={handlePuzzleCompletion}
        />
      )}

      {/* Show "Go to Next Room" if puzzle is solved */}
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
