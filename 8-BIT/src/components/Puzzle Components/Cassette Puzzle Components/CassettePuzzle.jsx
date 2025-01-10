// CassettePuzzle.jsx
import { useState, useEffect } from "react";
import "../../../styles/cassettePuzzle.scss";

// Example images for the 5 cassette colors
import GrayImg from "../../../../public/Gray.png";
import RedImg from "../../../../public/Red.png";
import BlueImg from "../../../../public/Blue.png";
import MagentaImg from "../../../../public/Magenta.png";
import YellowImg from "../../../../public/Yellow.png";

/**
 * 1) Mapping color strings to imported image files.
 * 2) If you rename your images, update this object to match.
 */
const COLOR_IMAGES = {
  Gray: GrayImg,
  Red: RedImg,
  Blue: BlueImg,
  Magenta: MagentaImg,
  Yellow: YellowImg,
};

// 5 color strings used in the puzzle
const COLORS = ["Gray", "Red", "Blue", "Magenta", "Yellow"];

// We'll hardcode this puzzle to be for roomId = 1.
// If you want to pass in a `roomId` from Room.jsx, you could do that instead.
const ROOM_ID = 1;

/**
 * Each stack can hold 7 cassettes total:
 *  - We'll place 6 cassettes initially (1 unique bottom + 5 random)
 *  - leaving 1 empty slot
 */
const STACK_CAPACITY = 7;
const NUM_STACKS = 5;

/**
 * Utility to shuffle an array in place
 */
function shuffleArray(array) {
  return array
    .map((val) => ({ val, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ val }) => val);
}

/**
 * Load puzzle data for this room (roomId=1) from localStorage
 */
function loadPuzzleFromStorage() {
  const allRoomsState = JSON.parse(localStorage.getItem("roomsState")) || {};
  const roomState = allRoomsState[ROOM_ID] || {};
  return roomState.cassettePuzzle || null;
}

/**
 * Save puzzle data (stacks + isPuzzleSolved) for this room into localStorage
 */
function savePuzzleToStorage(stacks, isPuzzleSolved) {
  const allRoomsState = JSON.parse(localStorage.getItem("roomsState")) || {};
  const roomState = allRoomsState[ROOM_ID] || {};

  // Store puzzle data under "cassettePuzzle"
  roomState.cassettePuzzle = {
    stacks,
    isPuzzleSolved,
  };

  allRoomsState[ROOM_ID] = roomState;
  localStorage.setItem("roomsState", JSON.stringify(allRoomsState));
}

/**
 * Remove only this puzzle's data from localStorage for roomId=1
 */
function removePuzzleFromStorage() {
  const allRoomsState = JSON.parse(localStorage.getItem("roomsState")) || {};
  if (allRoomsState[ROOM_ID] && allRoomsState[ROOM_ID].cassettePuzzle) {
    delete allRoomsState[ROOM_ID].cassettePuzzle;
  }
  localStorage.setItem("roomsState", JSON.stringify(allRoomsState));
}

/**
 * Initialize stacks so each has:
 *  - 1 unique bottom cassette
 *  - 5 random top cassettes
 * => total 6 cassettes => 1 empty slot left if capacity=7
 */
function initStacksWithUniqueBottom() {
  // We want 5 stacks x 6 cassettes each = 30 total cassettes
  // => 5 colors x 6 copies each = 30
  let allCassettes = [];
  for (let i = 0; i < 6; i++) {
    COLORS.forEach((c) => allCassettes.push(c));
  }
  // e.g. 6 Gray, 6 Red, 6 Blue, 6 Magenta, 6 Yellow => 30 total

  // Shuffle 5 distinct colors for the bottom
  const bottomColors = shuffleArray([...COLORS]);

  // Remove one instance of each bottom color from the pool
  bottomColors.forEach((bc) => {
    const idx = allCassettes.indexOf(bc);
    if (idx !== -1) allCassettes.splice(idx, 1);
  });
  // Now we have 25 cassettes left in the pool

  // Shuffle again
  allCassettes = shuffleArray(allCassettes);

  // Distribute: 1 unique bottom + 5 random => 6 total cassettes per stack
  const newStacks = [];
  for (let i = 0; i < NUM_STACKS; i++) {
    const topFive = allCassettes.slice(i * 5, i * 5 + 5);
    newStacks[i] = [bottomColors[i], ...topFive];
  }
  return newStacks;
}

/**
 * Check if puzzle is solved => each stack is empty or uniform color
 */
function isPuzzleUniform(stacks) {
  return stacks.every((stack) => {
    if (stack.length === 0) return true;
    const first = stack[0];
    return stack.every((c) => c === first);
  });
}

/**
 * CassettePuzzle Component
 *
 * PROPS (from Room.jsx, for example):
 *  - isPuzzleSolved (boolean)
 *  - setIsPuzzleSolved (function)
 *  - onPuzzleCompletion (function) => called when puzzle is solved
 */
export default function CassettePuzzle({
  isPuzzleSolved,
  setIsPuzzleSolved,
  onPuzzleCompletion,
}) {
  // stacks of cassettes in local state
  const [stacks, setStacks] = useState([]);
  // track which stack is selected for pick-up
  const [selectedStackIndex, setSelectedStackIndex] = useState(null);

  // 1) On mount, load from localStorage or init fresh
  useEffect(() => {
    const savedPuzzle = loadPuzzleFromStorage();
    if (savedPuzzle) {
      setStacks(savedPuzzle.stacks);
      setIsPuzzleSolved(savedPuzzle.isPuzzleSolved || false);
    } else {
      const newStacks = initStacksWithUniqueBottom();
      setStacks(newStacks);
      setIsPuzzleSolved(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2) Whenever stacks or puzzle-solved changes, save to localStorage
  useEffect(() => {
    savePuzzleToStorage(stacks, isPuzzleSolved);
  }, [stacks, isPuzzleSolved]);

  // 3) Check puzzle completion each time stacks change
  useEffect(() => {
    if (!isPuzzleSolved && isPuzzleUniform(stacks)) {
      setIsPuzzleSolved(true);
      if (onPuzzleCompletion) onPuzzleCompletion();
    }
  }, [stacks, isPuzzleSolved, setIsPuzzleSolved, onPuzzleCompletion]);

  /**
   * Two-click logic: pick up top from one stack, drop onto another (if capacity)
   */
  function handleStackClick(stackIndex) {
    if (selectedStackIndex === null) {
      // pick up from top
      if (stacks[stackIndex].length === 0) return;
      setSelectedStackIndex(stackIndex);
    } else {
      // drop
      if (stackIndex === selectedStackIndex) {
        setSelectedStackIndex(null);
        return;
      }
      if (stacks[stackIndex].length < STACK_CAPACITY) {
        moveCassette(selectedStackIndex, stackIndex);
      }
      setSelectedStackIndex(null);
    }
  }

  function moveCassette(fromIdx, toIdx) {
    setStacks((prev) => {
      const updated = prev.map((s) => [...s]);
      const cassette = updated[fromIdx].pop();
      updated[toIdx].push(cassette);
      return updated;
    });
  }

  /**
   * Reset puzzle => only for this puzzle's data in localStorage
   */
  function handleResetPuzzle() {
    removePuzzleFromStorage();
    const newStacks = initStacksWithUniqueBottom();
    setStacks(newStacks);
    setIsPuzzleSolved(false);
    setSelectedStackIndex(null);
  }

  return (
    <div className="puzzle-cassette">
      <h2>Welcome to Hell</h2>
      <button
        type="button"
        onClick={handleResetPuzzle}
        style={{
          position: "absolute",
          bottom: "1rem",
          right: "7.5rem",
          background: "red",
          color: "white",
          padding: "0.5rem",
          border: "none",
          borderRadius: "0.25rem",
          cursor: "pointer",
          zIndex: 9999, // So it stays on top of other elements
        }}
      >
        PUZZLE RESET
      </button>

      {isPuzzleSolved && (
        <p className="puzzle-cassette__complete-message">Puzzle Solved!</p>
      )}

      <div className="puzzle-cassette__stacks">
        {stacks.map((stack, idx) => {
          const isSelected = idx === selectedStackIndex;
          const stackClass = `puzzle-cassette__stack${
            isSelected ? " puzzle-cassette__stack--selected" : ""
          }`;

          return (
            <div
              key={idx}
              className={stackClass}
              onClick={() => handleStackClick(idx)}
            >
              {stack.map((color, i2) => (
                <img
                  key={i2}
                  src={COLOR_IMAGES[color]}
                  alt={color}
                  className="puzzle-cassette__cassette-img"
                />
              ))}
              {/* If capacity not filled, show an empty slot */}
              {stack.length < STACK_CAPACITY && (
                <div className="puzzle-cassette__slot puzzle-cassette__slot--empty">
                  Empty
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
