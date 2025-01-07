// Room.jsx
import { useState, useEffect } from "react";
import Items from "../components/Main Room Components/scripts/items";
import Inventory from "../components/Inventory Components/Inventory";
import Questions from "../components/Main Room Components/scripts/questions";
import QuestionOverlay from "../components/Main Room Components/QuestionOverlay";
import ItemOverlay from "../components/Main Room Components/ItemOverlay";
import roomsData from "../components/Main Room Components/scripts/roomsData"; // Ensure this path is correct

const Room = () => {
  // State to track the current room ID
  const [currentRoomId, setCurrentRoomId] = useState(0);

  // Find the current room data based on currentRoomId
  const currentRoom = roomsData.find((room) => room.id === currentRoomId);

  // Initialize states based on the current room
  const [roomItemIds, setRoomItemIds] = useState(currentRoom.items);
  const [playerInventory, setPlayerInventory] = useState([]);
  const [roomQuestionIds, setRoomQuestionIds] = useState(currentRoom.questions);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [activeItemId, setActiveItemId] = useState(null);
  const [itemPresent, setItemPresent] = useState(currentRoom.items.length > 0);

  // useEffect to handle state reset when currentRoomId changes
  useEffect(() => {
    // Update the current room data
    const newRoom = roomsData.find((room) => room.id === currentRoomId);

    // Reset room items, questions, and inventory
    setRoomItemIds(newRoom.items);
    setRoomQuestionIds(newRoom.questions);
    setPlayerInventory([]); // Reset inventory here
    setActiveQuestion(null);
    setActiveItemId(null);
    setItemPresent(newRoom.items.length > 0);
  }, [currentRoomId]);

  // Function to collect an item
  const collectItem = (id) => {
    const collectedItem = Items.find((itm) => itm.id === id);
    setPlayerInventory((prevInv) => [...prevInv, collectedItem]);
    setRoomItemIds((prevRoomIds) =>
      prevRoomIds.filter((itemId) => itemId !== id)
    );

    // Update item presence based on remaining items
    if (roomItemIds.length <= 1) {
      setItemPresent(false);
    }
  };

  // Function to open a question
  const openQuestion = (id) => {
    setActiveQuestion(id);
  };

  // Function to close the question overlay
  const closeQuestion = () => {
    setActiveQuestion(null);
  };

  // Function to inspect an item
  const onInspectItem = (id) => {
    setActiveItemId(id);
  };

  // Function to close the item overlay
  const closeItemOverlay = () => {
    setActiveItemId(null);
  };

  // Determine the container class based on item presence
  const containerClass = itemPresent
    ? "room__container room__container__item-present"
    : "room__container room__container__item-gone";

  return (
    <main
      className={containerClass}
      style={{
        backgroundImage: itemPresent
          ? `url(${currentRoom.backgroundWithItem})`
          : `url(${currentRoom.backgroundWithoutItem})`,
      }}
    >
      {/* Render item buttons */}
      {roomItemIds.map((itemId) => {
        const currentItem = Items.find((itm) => itm.id === itemId);
        return (
          <button
            className={currentItem.class}
            key={currentItem.id}
            onClick={() => collectItem(currentItem.id)}
          >
            Collect {currentItem.name}
          </button>
        );
      })}

      {/* Render question buttons */}
      {roomQuestionIds.map((questionId) => {
        const currentQuestion = Questions.find((q) => q.id === questionId);
        return (
          <button
            className={currentQuestion.class}
            key={currentQuestion.id}
            onClick={() => openQuestion(currentQuestion.id)}
          >
            Open {currentQuestion.title}
          </button>
        );
      })}

      {/* Overlays */}
      <QuestionOverlay
        activeQuestion={activeQuestion}
        onClose={closeQuestion}
        questions={Questions}
      />
      <ItemOverlay activeItemId={activeItemId} onClose={closeItemOverlay} />

      {/* Inventory */}
      <Inventory items={playerInventory} onInspectItem={onInspectItem} />

      {/* "Go to Next Room" Button with Custom Class */}
      <button
        className={currentRoom.class}
        onClick={() => {
          // Logic to determine the next room ID
          const nextRoomId = currentRoomId + 1;
          // Check if the next room exists
          const nextRoomExists = roomsData.some(
            (room) => room.id === nextRoomId
          );
          if (nextRoomExists) {
            setCurrentRoomId(nextRoomId);
          } else {
            alert("You have completed all rooms!");
          }
        }}
      >
        Go to Next Room
      </button>
    </main>
  );
};

export default Room;
