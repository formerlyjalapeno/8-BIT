// src/components/TicTacToe.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation after multiple losses
import {
  calculatingMessages,
  tauntsAfterMove,
  tauntsOnAIWin,
  tauntsOnPlayerAttemptWin,
  tauntsOnAIMoveCorner,
  tauntsOnAIBlock,
  tauntsOnAIMoveCenter
} from './scripts/messages'; // Importing all taunt messages
import { getRandomMessage } from './scripts/messageUtils'; // Utility for non-repeating messages
import '../../../styles/main.scss'; // Importing SCSS for styling

const TicTacToe = () => {
  const navigate = useNavigate(); // Hook for navigation
  const [board, setBoard] = useState(Array(9).fill('')); // Represents the game board
  const [aiMessage, setAiMessage] = useState(''); // Message displayed from the AI
  const [loseCount, setLoseCount] = useState(0); // Tracks number of losses
  const [gameOver, setGameOver] = useState(false); // Indicates if the game has ended

  const AI_SYMBOL = 'X'; // Symbol used by the AI
  const PLAYER_SYMBOL = 'O'; // Symbol used by the player

  // Refs to keep track of used messages to avoid repetition
  const usedCalculating = useRef([]);
  const usedTauntsAfter = useRef([]);
  const usedTauntsOnAIMoveCorner = useRef([]);
  const usedTauntsOnAIBlock = useRef([]);
  const usedTauntsOnAIWin = useRef([]);
  const usedTauntsOnAIMoveCenter = useRef([]);

  // Load the lose count from localStorage when the component mounts
  useEffect(() => {
    const storedLoseCount = parseInt(localStorage.getItem('loseCount'), 10);
    if (!isNaN(storedLoseCount)) setLoseCount(storedLoseCount);
  }, []);

  // Update localStorage and navigate to epilogue after 6 losses
  useEffect(() => {
    localStorage.setItem('loseCount', loseCount);
    if (loseCount >= 6) navigate('/epilogue');
  }, [loseCount, navigate]);

  // AI makes the first move when the board is empty and the game is not over
  useEffect(() => {
    if (board.every(cell => cell === '') && !gameOver) aiMove(board);
    // eslint-disable-next-line
  }, []); // Empty dependency array ensures this runs only once on mount

  /**
   * Checks if the game has been won or is a draw.
   * @param {string[]} currentBoard - The current state of the board.
   * @returns {boolean} - Returns true if the game is over, else false.
   */
  const checkGameOver = (currentBoard) => {
    const winner = getWinner(currentBoard);
    if (winner === AI_SYMBOL) {
      // AI has won the game
      setAiMessage(getRandomMessage(tauntsOnAIWin, usedTauntsOnAIWin.current));
      setLoseCount(prev => prev + 1); // Increment loss count
      setGameOver(true); // End the game
      setTimeout(resetGame, 1500); // Reset the game after a short delay
      return true;
    } else if (winner === PLAYER_SYMBOL) {
      // Player has somehow won the game (shouldn't happen)
      setAiMessage(getRandomMessage(tauntsOnPlayerAttemptWin, []));
      setGameOver(true);
      setTimeout(resetGame, 1500);
      return true;
    } else if (currentBoard.every(cell => cell !== '')) {
      // The board is full and it's a draw
      setAiMessage(getRandomMessage(tauntsAfterMove, usedTauntsAfter.current));
      setGameOver(true);
      setTimeout(resetGame, 1500);
      return true;
    }
    return false; // Game is still ongoing
  };

  /**
   * Determines the winner of the game, if any.
   * @param {string[]} currentBoard - The current state of the board.
   * @returns {string|null} - Returns the symbol of the winner or null if no winner.
   */
  const getWinner = (currentBoard) => {
    const winPatterns = [
      [0,1,2], [3,4,5], [6,7,8], // Rows
      [0,3,6], [1,4,7], [2,5,8], // Columns
      [0,4,8], [2,4,6]           // Diagonals
    ];
    for (let pattern of winPatterns) {
      const [a,b,c] = pattern;
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return currentBoard[a]; // Return the winning symbol
      }
    }
    return null; // No winner found
  };

  /**
   * Handles the player's move when they click on a cell.
   * @param {number} index - The index of the cell clicked.
   */
  const handleClick = (index) => {
    // If the cell is already occupied or the game is over, do nothing
    if (board[index] !== '' || gameOver) return;

    const newBoard = [...board];
    newBoard[index] = PLAYER_SYMBOL; // Player makes a move
    setBoard(newBoard);
    setAiMessage(getRandomMessage(tauntsAfterMove, usedTauntsAfter.current)); // Display a taunt after move

    if (checkGameOver(newBoard)) return; // Check if the game has ended

    aiMove(newBoard); // Let the AI make its move
  };

  /**
   * Handles the AI's move logic.
   * @param {string[]} currentBoard - The current state of the board.
   */
  const aiMove = async (currentBoard) => {
    setAiMessage(getRandomMessage(calculatingMessages, usedCalculating.current)); // Display calculating message
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate thinking time

    const move = determineAIMove(currentBoard); // Determine the best move for AI
    if (move === -1) {
      // No possible moves left
      setAiMessage(getRandomMessage(tauntsAfterMove, usedTauntsAfter.current));
      setGameOver(true);
      setTimeout(resetGame, 1500);
      return;
    }

    const newBoard = [...currentBoard];
    newBoard[move] = AI_SYMBOL; // AI makes a move
    setBoard(newBoard);

    // Determine and display specific taunts based on the move
    if (isCorner(move)) {
      setAiMessage(getRandomMessage(tauntsOnAIMoveCorner, usedTauntsOnAIMoveCorner.current));
    } else if (isBlockingMove(currentBoard, move)) {
      setAiMessage(getRandomMessage(tauntsOnAIBlock, usedTauntsOnAIBlock.current));
    } else if (isCenter(move)) {
      setAiMessage(getRandomMessage(tauntsOnAIMoveCenter, usedTauntsOnAIMoveCenter.current));
    } else {
      setAiMessage(getRandomMessage(tauntsAfterMove, usedTauntsAfter.current));
    }

    checkGameOver(newBoard); // Check if the game has ended
  };

  /**
   * Determines the best move for the AI based on the current board.
   * @param {string[]} currentBoard - The current state of the board.
   * @returns {number} - The index of the cell where AI should move.
   */
  const determineAIMove = (currentBoard) => {
    /**
     * Helper function to find a move that can win or block the opponent.
     * @param {string} player - The player symbol ('X' or 'O').
     * @returns {number} - The index of the winning/blocking move or -1 if none found.
     */
    const findMove = (player) => {
      const winPatterns = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
      ];
      for (let pattern of winPatterns) {
        const [a,b,c] = pattern;
        const line = [currentBoard[a], currentBoard[b], currentBoard[c]];
        if (line.filter(cell => cell === player).length === 2 && line.includes('')) {
          return pattern[line.indexOf('')]; // Return the empty cell to complete the win/block
        }
      }
      return -1; // No winning/blocking move found
    };

    // 1. Check if AI can win in the next move
    let move = findMove(AI_SYMBOL);
    if (move !== -1) return move;

    // 2. Block the player's winning move
    move = findMove(PLAYER_SYMBOL);
    if (move !== -1) return move;

    // 3. Take one of the available corners
    const corners = [0,2,6,8].filter(i => currentBoard[i] === '');
    if (corners.length) return corners[Math.floor(Math.random() * corners.length)];

    // 4. Take the center if available
    if (currentBoard[4] === '') return 4;

    // 5. Take one of the available edges
    const edges = [1,3,5,7].filter(i => currentBoard[i] === '');
    if (edges.length) return edges[Math.floor(Math.random() * edges.length)];

    return -1; // No moves left
  };

  /**
   * Checks if the given index is a corner on the board.
   * @param {number} index - The index to check.
   * @returns {boolean} - True if it's a corner, else false.
   */
  const isCorner = (index) => [0,2,6,8].includes(index);

  /**
   * Checks if the given index is the center of the board.
   * @param {number} index - The index to check.
   * @returns {boolean} - True if it's the center, else false.
   */
  const isCenter = (index) => index === 4;

  /**
   * Determines if the AI's move was to block the player's potential win.
   * @param {string[]} currentBoard - The current state of the board before AI's move.
   * @param {number} aiMoveIndex - The index where AI moved.
   * @returns {boolean} - True if AI blocked a win, else false.
   */
  const isBlockingMove = (currentBoard, aiMoveIndex) => {
    const tempBoard = [...currentBoard];
    tempBoard[aiMoveIndex] = AI_SYMBOL; // Temporarily place AI's symbol
    return getWinner(tempBoard) === AI_SYMBOL; // Check if this move causes AI to win
  };

  /**
   * Resets the game to its initial state.
   */
  const resetGame = () => {
    setBoard(Array(9).fill('')); // Clear the board
    setGameOver(false); // Reset game over status
    setAiMessage(''); // Clear AI message
    aiMove(Array(9).fill('')); // Let AI make the first move
  };

  return (
    <div className="tic-tac-toe">
      
      {/* Display multiple "Lose" texts with decreasing font sizes based on loseCount */}
      <div className="lose-words" style={{ marginTop: '10px' }}>
        {[...Array(loseCount)].map((_, index) => (
          <span 
            key={index} 
            style={{ 
              fontSize: `${20 - index * 2}px`, // Decrease font size for each "Lose"
              marginRight: '5px', 
              transition: 'font-size 0.3s' // Smooth transition for size changes
            }}
          >
            Lose
          </span>
        ))}
      </div>
      
      {/* Game Board */}
      <div className="tic-tac-toe__board">
        {board.map((cell, index) => (
          <div
            key={index}
            className={`tic-tac-toe__cell ${
              cell === PLAYER_SYMBOL ? "tic-tac-toe__cell--lose" : cell === AI_SYMBOL ? "tic-tac-toe__cell--win" : ""
            }`}
            onClick={() => handleClick(index)} // Handle cell click
            role="button" // Accessibility role
            aria-label={`Cell ${index + 1} ${cell ? (cell === PLAYER_SYMBOL ? 'occupied by you' : 'occupied by AI') : 'empty'}`} // Accessibility label
            tabIndex={0} // Make div focusable
            onKeyPress={(e) => {
              // Allow keyboard navigation (Enter or Space to click)
              if (e.key === 'Enter' || e.key === ' ') handleClick(index);
            }}
          >
            {cell} {/* Display the symbol in the cell */}
          </div>
        ))}
      </div>
      
      {/* AI Message */}
      <p className="tic-tac-toe__status">{aiMessage}</p>
      
      {/* Reset Button */}
      <button className="tic-tac-toe__reset-button" onClick={resetGame}>
        Reset Game
      </button>
    </div>
  );
};

export default TicTacToe;
