import React, { useState, useEffect } from "react";
import "../../../styles/TicTacToe.scss";

const TicTacToe = ({ onWin, onReset }) => {
  const emptyBoard = Array(9).fill(null);
  const [board, setBoard] = useState(
    () => JSON.parse(localStorage.getItem("ticTacToeBoard")) || emptyBoard
  );
  const [playerTurn, setPlayerTurn] = useState(
    () => JSON.parse(localStorage.getItem("ticTacToeTurn")) ?? false
  );
  const [gameOver, setGameOver] = useState(false);
  const [moveCount, setMoveCount] = useState(
    () => JSON.parse(localStorage.getItem("ticTacToeMoveCount")) || 0
  );

  useEffect(() => {
    if (!playerTurn && !gameOver && moveCount > 0) {
      setTimeout(() => aiMove(), 1000);
    }
  }, [playerTurn]);

  useEffect(() => {
    localStorage.setItem("ticTacToeBoard", JSON.stringify(board));
    localStorage.setItem("ticTacToeTurn", JSON.stringify(playerTurn));
    localStorage.setItem("ticTacToeMoveCount", JSON.stringify(moveCount));
  }, [board, playerTurn, moveCount]);

  const winningPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Columns
    [0, 4, 8],
    [2, 4, 6], // Diagonals
  ];

  const checkWinner = (currentBoard) => {
    if (moveCount < 5) return null; // Prevents early win detection

    for (let pattern of winningPatterns) {
      const [a, b, c] = pattern;
      if (
        currentBoard[a] !== null &&
        currentBoard[a] === currentBoard[b] &&
        currentBoard[a] === currentBoard[c]
      ) {
        return currentBoard[a]; // Return "X" or "O" if there's a winner
      }
    }
    return currentBoard.includes(null) ? null : "Draw";
  };

  const findWinningMove = (boardState, player) => {
    for (let pattern of winningPatterns) {
      const [a, b, c] = pattern;
      let values = [boardState[a], boardState[b], boardState[c]];
      if (
        values.filter((val) => val === player).length === 2 &&
        values.includes(null)
      ) {
        return pattern[values.indexOf(null)]; // Find and return the empty spot
      }
    }
    return null;
  };

  const findAggressiveMove = (boardState) => {
    const aggressiveMoves = [
      [0, 2, 6, 8], // Prioritize corners (most winning potential)
      [4], // Then center (but not first)
      [1, 3, 5, 7], // Then edges
    ];

    for (let group of aggressiveMoves) {
      for (let move of group) {
        if (boardState[move] === null) {
          return move;
        }
      }
    }
    return null;
  };

  const aiMove = () => {
    if (gameOver || playerTurn) return;

    let newBoard = [...board];

    // 1️⃣ AI wins if possible
    let bestMove = findWinningMove(newBoard, "O");

    // 2️⃣ If no AI win, block player from winning
    if (bestMove === null) bestMove = findWinningMove(newBoard, "X");

    // 3️⃣ If no win/block, play aggressively (favor corners)
    if (bestMove === null) bestMove = findAggressiveMove(newBoard);

    // 4️⃣ If no aggressive move, choose any available spot
    if (bestMove === null)
      bestMove = newBoard.findIndex((cell) => cell === null);

    // 🛑 Ensure AI only makes a valid move
    if (bestMove !== null && newBoard[bestMove] === null) {
      newBoard[bestMove] = "O";
      setBoard([...newBoard]); // Ensure updated board is used
      setMoveCount((prev) => prev + 1);
      localStorage.setItem("ticTacToeBoard", JSON.stringify(newBoard));
    }

    const winner = checkWinner(newBoard);
    if (winner) {
      setGameOver(true);
      setTimeout(() => {
        alert(
          `Game Over: ${winner === "Draw" ? "It's a draw!" : `${winner} wins!`}`
        );
        if (winner === "X") onWin();
      }, 200);
      return;
    }

    setPlayerTurn(true);
    localStorage.setItem("ticTacToeTurn", JSON.stringify(true));
  };

  const handleClick = (index) => {
    if (board[index] !== null || !playerTurn || gameOver) return;

    let newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);
    setMoveCount((prev) => prev + 1);
    setPlayerTurn(false);

    localStorage.setItem("ticTacToeBoard", JSON.stringify(newBoard));
    localStorage.setItem("ticTacToeTurn", JSON.stringify(false));

    const winner = checkWinner(newBoard);
    if (winner) {
      setGameOver(true);
      setTimeout(() => {
        alert(
          `Game Over: ${winner === "Draw" ? "It's a draw!" : `${winner} wins!`}`
        );
        if (winner === "X") onWin();
      }, 200);
      return;
    }

    setTimeout(() => aiMove(), 1000);
  };

  const handleReset = () => {
    setBoard(emptyBoard);
    setPlayerTurn(false);
    setMoveCount(0);
    setGameOver(false);
    onReset();

    localStorage.removeItem("ticTacToeBoard");
    localStorage.removeItem("ticTacToeTurn");
    localStorage.removeItem("ticTacToeMoveCount");

    setTimeout(() => {
      aiMove();
    }, 300);
  };

  return (
    <div className="tic-tac-toe">
      <h2 className="tic-tac-toe__title">Lose-Lose-Lose</h2>
      <div className="tic-tac-toe__board">
        {board.map((cell, index) => (
          <div
            key={index}
            className={`tic-tac-toe__cell ${
              cell === "X"
                ? "tic-tac-toe__cell--win"
                : cell === "O"
                ? "tic-tac-toe__cell--lose"
                : ""
            }`}
            onClick={() => handleClick(index)}
          >
            {cell}
          </div>
        ))}
      </div>
      <p className="tic-tac-toe__status">
        {gameOver
          ? "Game Over!"
          : playerTurn
          ? "Your turn!"
          : "AI is thinking..."}
      </p>
      <button className="tic-tac-toe__reset-button" onClick={handleReset}>
        Reset Game
      </button>
    </div>
  );
};

export default TicTacToe;
