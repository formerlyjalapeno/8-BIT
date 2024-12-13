import { useState } from "react";
import Items from "../components/Inventory Components/scripts/items"; // Adjust the import path as needed
import Inventory from "../components/Inventory Components/Inventory";
import Questions from "../components/Main Room Components/scripts/questions";
import QuestionOverlay from "../components/Main Room Components/QuestionOverlay";

const Room = () => {
  // Store IDs of items available in this room
  const [roomItemIds, setRoomItemIds] = useState([0]);
  const [playerInventory, setPlayerInventory] = useState([]);

  // Store IDs of questions available in this room
  const [roomQuestionIds] = useState([0]);
  const [activeQuestion, setActiveQuestion] = useState(null);

  const collectItem = (id) => {
    const collectedItem = Items.find((itm) => itm.id === id);

    // Add the found item to the player's inventory
    setPlayerInventory((prevInv) => [...prevInv, collectedItem]);

    // Remove the item ID from the room's item list
    setRoomItemIds((prevRoomIds) =>
      prevRoomIds.filter((itemId) => itemId !== id)
    );
  };

  const openQuestion = (id) => {
    setActiveQuestion(id);
  };

  const closeQuestion = () => {
    setActiveQuestion(null);
  };

  return (
    <main className="room__container">
      <p className="room__container__temp-text">This is a room</p>

      {/* Render a button for each item in the room */}
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

      {/* Render a button for each question in the room */}
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

      {/* Overlay for the active question */}
      <QuestionOverlay
        activeQuestion={activeQuestion}
        onClose={closeQuestion}
        questions={Questions}
      />

      {/* Display the player's inventory */}
      <Inventory items={playerInventory} />
    </main>
  );
};

export default Room;
