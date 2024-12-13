import { useState } from "react";
import Items from "../components/Inventory Components/scripts/items";
import Inventory from "../components/Inventory Components/Inventory";
import Questions from "../components/Main Room Components/scripts/questions";
import QuestionOverlay from "../components/Main Room Components/QuestionOverlay";
import ItemOverlay from "../components/Inventory Components/ItemOverlay";

// Suppose you have these images imported or have URLs:
// import roomWithItemImage from '../assets/room-with-item.png';
// import roomWithoutItemImage from '../assets/room-without-item.png';

const Room = () => {
  // IDs of items and questions in the room
  const [roomItemIds, setRoomItemIds] = useState([0]);
  const [playerInventory, setPlayerInventory] = useState([]);
  const [roomQuestionIds] = useState([0]);
  const [activeQuestion, setActiveQuestion] = useState(null);

  // Item inspection state
  const [activeItemId, setActiveItemId] = useState(null);

  // Track if item is still present to display correct background
  const [itemPresent, setItemPresent] = useState(true);

  const collectItem = (id) => {
    const collectedItem = Items.find((itm) => itm.id === id);
    setPlayerInventory((prevInv) => [...prevInv, collectedItem]);
    setRoomItemIds((prevRoomIds) =>
      prevRoomIds.filter((itemId) => itemId !== id)
    );

    // Once the item is collected, the room no longer has that item
    setItemPresent(false);
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

  // Choose background image based on whether the item is present
  // If using imported images:
  // const backgroundImage = itemPresent ? `url(${roomWithItemImage})` : `url(${roomWithoutItemImage})`;

  // If using a CSS class approach, define two classes in SCSS:
  // .room__container--item-present { background-image: url(...); }
  // .room__container--item-gone { background-image: url(...); }

  const containerClass = itemPresent
    ? "room__container room__container__item-present"
    : "room__container room__container__item-gone";

  return (
    <main className={containerClass}>
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

      <QuestionOverlay
        activeQuestion={activeQuestion}
        onClose={closeQuestion}
        questions={Questions}
      />
      <ItemOverlay activeItemId={activeItemId} onClose={closeItemOverlay} />

      <Inventory items={playerInventory} onInspectItem={onInspectItem} />
    </main>
  );
};

export default Room;
