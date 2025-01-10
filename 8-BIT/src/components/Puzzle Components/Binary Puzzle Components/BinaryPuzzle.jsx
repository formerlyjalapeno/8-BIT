// src/puzzles/binary/BinaryPuzzle.jsx
import Items from "../../Main Room Components/scripts/items";
import Questions from "../../Main Room Components/scripts/questions";
import QuestionOverlay from "../../Main Room Components/QuestionOverlay";
import ItemOverlay from "../../Main Room Components/ItemOverlay";
import Inventory from "../../Inventory Components/Inventory";
import "../../../styles/binarypuzzle.scss";

/**
 * PROPS we expect from Room.jsx:
 *  - roomItemIds, setRoomItemIds
 *  - roomQuestionIds, setRoomQuestionIds
 *  - isPuzzleSolved, setIsPuzzleSolved
 *  - playerInventory, setPlayerInventory
 *  - activeQuestion, setActiveQuestion
 *  - activeItemId, setActiveItemId
 *  - itemPresent, setItemPresent
 *  - onPuzzleCompletion()   // callback if puzzle is solved
 *  - collectItem(id)        // logic to pick up an item
 *  - closeQuestion()        // logic to close question
 *  - onInspectItem(id)      // logic to inspect item
 *  - closeItemOverlay()     // logic to close item overlay
 */
export default function BinaryPuzzle(props) {
  const {
    roomItemIds,
    roomQuestionIds,
    isPuzzleSolved,
    playerInventory,
    activeQuestion,
    activeItemId,
    itemPresent,

    setRoomItemIds,
    setRoomQuestionIds,
    setIsPuzzleSolved,
    setPlayerInventory,
    setActiveQuestion,
    setActiveItemId,
    setItemPresent,

    collectItem,
    onPuzzleCompletion,
    closeQuestion,
    onInspectItem,
    closeItemOverlay,
  } = props;

  // If puzzle is solved, we won't show question buttons;
  // but you can decide how you want to handle it.

  return (
    <div className="binary-puzzle">
      {/* ITEM BUTTONS */}
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
              onClick={() => setActiveQuestion(q.id)}
              aria-label={`Open ${q.title}`}
            >
              Open {q.title}
            </button>
          );
        })}

      {/* QUESTION OVERLAY & ITEM OVERLAY */}
      <QuestionOverlay
        activeQuestion={activeQuestion}
        onClose={closeQuestion}
        questions={Questions}
        onPuzzleSolved={() => {
          // Mark puzzle as solved in Room state
          setIsPuzzleSolved(true);
          // Also call parent's callback
          onPuzzleCompletion();
        }}
      />
      <ItemOverlay activeItemId={activeItemId} onClose={closeItemOverlay} />

      {/* GLOBAL INVENTORY */}
      <Inventory items={playerInventory} onInspectItem={onInspectItem} />
    </div>
  );
}
