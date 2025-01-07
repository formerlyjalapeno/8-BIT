import { useState, useEffect } from "react";
import Items from "../components/Main Room Components/scripts/items";
import Inventory from "../components/Inventory Components/Inventory";
import Questions from "../components/Main Room Components/scripts/questions";
import QuestionOverlay from "../components/Main Room Components/QuestionOverlay";
import ItemOverlay from "../components/Main Room Components/ItemOverlay";
import roomsData from "../components/Main Room Components/scripts/roomsData"; // Adjust path as needed

const Room = () => {
  const [currentRoomId, setCurrentRoomId] = useState(0);
  const currentRoom = roomsData.find((r) => r.id === currentRoomId);

  const [roomItemIds, setRoomItemIds] = useState(currentRoom.items);
  const [playerInventory, setPlayerInventory] = useState([]);
  const [roomQuestionIds, setRoomQuestionIds] = useState(currentRoom.questions);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [activeItemId, setActiveItemId] = useState(null);
  const [itemPresent, setItemPresent] = useState(currentRoom.items.length > 0);

  useEffect(() => {
    // When room changes, re-initialize states if necessary:
    setRoomItemIds(currentRoom.items);
    setRoomQuestionIds(currentRoom.questions);
    setPlayerInventory([]);
    setActiveQuestion(null);
    setActiveItemId(null);
    setItemPresent(currentRoom.items.length > 0);
  }, [currentRoomId, currentRoom]);

  const collectItem = (id) => {
    const collectedItem = Items.find((itm) => itm.id === id);
    setPlayerInventory((prevInv) => [...prevInv, collectedItem]);
    setRoomItemIds((prevRoomIds) =>
      prevRoomIds.filter((itemId) => itemId !== id)
    );

    // If no more items in the room, switch to the "item gone" background
    if (roomItemIds.length <= 1) {
      setItemPresent(false);
    }
  };

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
      {roomItemIds.map((itemId) => {
        const currentItem = Items.find((itm) => itm.id === itemId);
        return (
          <button
            className={currentItem.class}
            key={currentItem.id}
            onClick={() => collectItem(currentItem.id)}
          >
            collect {currentItem.name}
          </button>
        );
      })}

      {roomQuestionIds.map((questionId) => {
        const currentQuestion = Questions.find((q) => q.id === questionId);
        return (
          <button
            className={currentQuestion.class}
            key={currentQuestion.id}
            onClick={() => openQuestion(currentQuestion.id)}
          >
            open {currentQuestion.title}
          </button>
        );
      })}

      <QuestionOverlay
        activeQuestion={activeQuestion}
        onClose={closeQuestion}
        questions={Questions}
      />
      <ItemOverlay activeItemId={activeItemId} onClose={closeItemOverlay} />
      <Inventory items={playerInventory} onInspectItem={onInspectItem} />

      {/* Example button to switch rooms (in a real game you might do this when the player passes through a door) */}
      <button onClick={() => setCurrentRoomId((prev) => (prev === 0 ? 1 : 0))}>
        Go to Next Room
      </button>
    </main>
  );
};

export default Room;
