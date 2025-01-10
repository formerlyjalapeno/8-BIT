import { useState, useEffect } from "react";
import Items from "../components/Main Room Components/scripts/items";
import Inventory from "../components/Inventory Components/Inventory";
import Questions from "../components/Main Room Components/scripts/questions";
import QuestionOverlay from "../components/Main Room Components/QuestionOverlay";
import ItemOverlay from "../components/Main Room Components/ItemOverlay";
import roomsData from "../components/Main Room Components/scripts/roomsData";
// Local Storage Helpers
import {
  loadRoomState,
  saveRoomState,
  loadPlayerInventory,
  savePlayerInventory,
} from "../utils/storage";
import DevResetButton from "../DevResetButton";

const Room = () => {
  // ─────────────────────────────────────────────────────────────────────────────
  // 1) INITIALIZE currentRoomId from localStorage (or default to 0 if none).
  //    This makes sure that if we refresh, we stay in the last visited room.
  // ─────────────────────────────────────────────────────────────────────────────
  const [currentRoomId, setCurrentRoomId] = useState(() => {
    const savedRoomId = localStorage.getItem("currentRoomId");
    return savedRoomId ? parseInt(savedRoomId, 10) : 0;
  });

  // The current room's base data
  const currentRoom = roomsData.find((room) => room.id === currentRoomId);

  // ─────────────────────────────────────────────────────────────────────────────
  // 2) ROOM-SPECIFIC STATE (Loaded from roomsState if it exists)
  // ─────────────────────────────────────────────────────────────────────────────
  const [roomItemIds, setRoomItemIds] = useState(currentRoom?.items || []);
  const [roomQuestionIds, setRoomQuestionIds] = useState(
    currentRoom?.questions || []
  );
  const [isPuzzleSolved, setIsPuzzleSolved] = useState(false);

  // ─────────────────────────────────────────────────────────────────────────────
  // 3) GLOBAL INVENTORY
  // ─────────────────────────────────────────────────────────────────────────────
  const [playerInventory, setPlayerInventory] = useState([]);

  // ─────────────────────────────────────────────────────────────────────────────
  // 4) OVERLAY STATES
  // ─────────────────────────────────────────────────────────────────────────────
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [activeItemId, setActiveItemId] = useState(null);

  // ─────────────────────────────────────────────────────────────────────────────
  // 5) ITEM PRESENCE LOGIC
  // ─────────────────────────────────────────────────────────────────────────────
  // Whether the room still has items. Affects the background class.
  const [itemPresent, setItemPresent] = useState(roomItemIds.length > 0);

  // ─────────────────────────────────────────────────────────────────────────────
  // 6) LOAD PHASE: On mount or when `currentRoomId` changes, load from localStorage
  //    for that particular room + the global inventory. If none found, use defaults.
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    // Store the currentRoomId so we remain here on refresh
    localStorage.setItem("currentRoomId", currentRoomId.toString());

    // Load the inventory
    const savedInventory = loadPlayerInventory();
    setPlayerInventory(savedInventory);

    // Load the saved room state
    const savedRoomState = loadRoomState(currentRoomId);
    if (savedRoomState) {
      setRoomItemIds(savedRoomState.items || currentRoom.items);
      setRoomQuestionIds(savedRoomState.questions || currentRoom.questions);
      setIsPuzzleSolved(savedRoomState.isPuzzleSolved || false);
      setItemPresent(
        savedRoomState.items && savedRoomState.items.length > 0 ? true : false
      );
    } else {
      // Use defaults from roomsData
      setRoomItemIds(currentRoom.items);
      setRoomQuestionIds(currentRoom.questions);
      setIsPuzzleSolved(false);
      setItemPresent(currentRoom.items.length > 0);
    }

    // Reset overlays
    setActiveQuestion(null);
    setActiveItemId(null);
  }, [currentRoomId, currentRoom]);

  // ─────────────────────────────────────────────────────────────────────────────
  // 7) SAVE PHASE (ROOM STATE): Whenever these states change, store them.
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const currentRoomState = {
      items: roomItemIds,
      questions: roomQuestionIds,
      isPuzzleSolved,
    };
    saveRoomState(currentRoomId, currentRoomState);
  }, [currentRoomId, roomItemIds, roomQuestionIds, isPuzzleSolved]);

  // ─────────────────────────────────────────────────────────────────────────────
  // 8) SAVE PHASE (INVENTORY): Whenever the playerInventory changes, store it.
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    savePlayerInventory(playerInventory);
  }, [playerInventory]);

  // ─────────────────────────────────────────────────────────────────────────────
  // 9) COLLECT ITEM
  // ─────────────────────────────────────────────────────────────────────────────
  const collectItem = (id) => {
    const collectedItem = Items.find((itm) => itm.id === id);
    // 1) Add to inventory
    setPlayerInventory((prev) => [...prev, collectedItem]);
    // 2) Remove from room
    setRoomItemIds((prev) => prev.filter((itemId) => itemId !== id));
    // 3) If no more items remain, switch background
    if (roomItemIds.length <= 1) {
      setItemPresent(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 10) PUZZLE COMPLETION
  // ─────────────────────────────────────────────────────────────────────────────
  const handlePuzzleCompletion = () => {
    setIsPuzzleSolved(true);
    closeQuestion();
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 11) OVERLAY HANDLERS
  // ─────────────────────────────────────────────────────────────────────────────
  const openQuestion = (id) => {
    setActiveQuestion(id);
  };
  const closeQuestion = () => {
    setActiveQuestion(null);
  };
  const onInspectItem = (id) => {
    setActiveItemId(id);
  };
  const closeItemOverlay = () => {
    setActiveItemId(null);
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 12) BACKGROUND CLASS
  // ─────────────────────────────────────────────────────────────────────────────
  const containerClass = itemPresent
    ? "room__container room__container__item-present"
    : "room__container room__container__item-gone";

  // Extract custom class for the Next Room button
  const { class: nextRoomButtonClass } = currentRoom;

  // ─────────────────────────────────────────────────────────────────────────────
  // 13) "Go to Next Room" LOGIC:
  //     - Switch to next room
  //     - CLEAR localStorage of roomsState and inventory so next room is fresh
  //     - Keep currentRoomId in localStorage so we remain in that new room on refresh
  // ─────────────────────────────────────────────────────────────────────────────
  const goToNextRoom = () => {
    const nextRoomId = currentRoomId + 1;
    const nextRoomExists = roomsData.some((r) => r.id === nextRoomId);
    if (!nextRoomExists) {
      alert("You have completed all rooms!");
      return;
    }

    // 1) Update localStorage so we remain in the next room on refresh
    localStorage.setItem("currentRoomId", nextRoomId.toString());

    // 2) CLEAR the saved roomsState & inventory so next room starts fresh
    localStorage.removeItem("roomsState");
    localStorage.removeItem("playerInventory");

    // 3) Switch to the next room in React state
    setCurrentRoomId(nextRoomId);
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 14) RENDER
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <main
      className={containerClass}
      style={{
        backgroundImage: itemPresent
          ? `url(${currentRoom.backgroundWithItem})`
          : `url(${currentRoom.backgroundWithoutItem})`,
      }}
    >
      {/* ITEM BUTTONS (for items still in the room) */}
      {roomItemIds.map((itemId) => {
        const itm = Items.find((i) => i.id === itemId);
        return (
          <button
            className={itm.class}
            key={itm.id}
            onClick={() => collectItem(itm.id)}
            aria-label={`Collect ${itm.name}`}
          >
            Collect {itm.name}
          </button>
        );
      })}

      {/* QUESTION BUTTONS (only if puzzle not solved) */}
      {!isPuzzleSolved &&
        roomQuestionIds.map((questionId) => {
          const q = Questions.find((qq) => qq.id === questionId);
          return (
            <button
              className={q.class}
              key={q.id}
              onClick={() => openQuestion(q.id)}
              aria-label={`Open ${q.title}`}
            >
              Open {q.title}
            </button>
          );
        })}

      {/* OVERLAYS: Questions + Items */}
      <QuestionOverlay
        activeQuestion={activeQuestion}
        onClose={closeQuestion}
        questions={Questions}
        onPuzzleSolved={handlePuzzleCompletion}
      />
      <ItemOverlay activeItemId={activeItemId} onClose={closeItemOverlay} />

      {/* GLOBAL INVENTORY */}
      <Inventory items={playerInventory} onInspectItem={onInspectItem} />

      {/* GO TO NEXT ROOM BUTTON (only if puzzle is solved) */}
      {isPuzzleSolved && (
        <button
          className={nextRoomButtonClass}
          onClick={goToNextRoom}
          aria-label="Go to Next Room"
        >
          Go to Next Room
        </button>
      )}
      <DevResetButton/>
    </main>
  );
};

export default Room;


