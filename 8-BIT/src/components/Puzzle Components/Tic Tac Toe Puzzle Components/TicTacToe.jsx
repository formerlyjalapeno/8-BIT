import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/main.scss";

const TicTacToe = ({ onWin, onReset }) => {
  const emptyBoard = Array(9).fill(null);
  const navigate = useNavigate();
  const [board, setBoard] = useState(() => JSON.parse(localStorage.getItem("ticTacToeBoard")) || emptyBoard);
  const [playerTurn, setPlayerTurn] = useState(() => JSON.parse(localStorage.getItem("ticTacToeTurn")) ?? false);
  const [gameOver, setGameOver] = useState(false);
  const [moveCount, setMoveCount] = useState(() => JSON.parse(localStorage.getItem("ticTacToeMoveCount")) || 0);
  const [lossCount, setLossCount] = useState(() => JSON.parse(localStorage.getItem("ticTacToeLossCount")) || 0);

  // 🟢 AI MAKES FIRST MOVE 500ms AFTER PAGE LOAD
  useEffect(() => {
    if (moveCount === 0 && !gameOver) {
      setTimeout(() => {
        aiMove();
      }, 500);
    }
  }, []);

  useEffect(() => {
    if (!playerTurn && !gameOver && moveCount > 0) {
      setTimeout(() => aiMove(), 1000);
    }
  }, [playerTurn]);

  useEffect(() => {
    localStorage.setItem("ticTacToeBoard", JSON.stringify(board));
    localStorage.setItem("ticTacToeTurn", JSON.stringify(playerTurn));
    localStorage.setItem("ticTacToeMoveCount", JSON.stringify(moveCount));
    localStorage.setItem("ticTacToeLossCount", JSON.stringify(lossCount));
  }, [board, playerTurn, moveCount, lossCount]);

  const winningPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  const checkWinner = (currentBoard) => {
    if (moveCount < 5) return null;
    for (let pattern of winningPatterns) {
      const [a, b, c] = pattern;
      if (
        currentBoard[a] !== null &&
        currentBoard[a] === currentBoard[b] &&
        currentBoard[a] === currentBoard[c]
      ) {
        return currentBoard[a];
      }
    }
    return currentBoard.includes(null) ? null : "Draw";
  };

  const handleGameOver = (winner) => {
    if (winner === "O") {
      setLossCount((prev) => prev + 1);
      localStorage.setItem("ticTacToeLossCount", JSON.stringify(lossCount + 1));

      if (lossCount + 1 >= 6) {
        setTimeout(() => {
          alert("You can’t escape. It’s too late. 😈");
          navigate("/epilogue");
        }, 500);
      }
    }
  };

  const rogueAIMessages = [
    "You think you can escape? Foolish.",
    "This is my game. You will lose.",
    "Every loss brings you closer to the truth.",
    "I see you struggling. It’s amusing.",
    "The outcome is inevitable.",
    "Why do you keep playing? You know how this ends."
  ];

  const findWinningMove = (boardState, player) => {
    for (let pattern of winningPatterns) {
      const [a, b, c] = pattern;
      let values = [boardState[a], boardState[b], boardState[c]];
      if (values.filter((val) => val === player).length === 2 && values.includes(null)) {
        return pattern[values.indexOf(null)];
      }
    }
    return null;
  };

  const findAggressiveMove = (boardState) => {
    const aggressiveMoves = [
      [0, 2, 6, 8], 
      [4], 
      [1, 3, 5, 7]
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

    let bestMove = findWinningMove(newBoard, "O");
    if (bestMove === null) bestMove = findWinningMove(newBoard, "X");
    if (bestMove === null) bestMove = findAggressiveMove(newBoard);
    if (bestMove === null) bestMove = newBoard.findIndex((cell) => cell === null);

    if (bestMove !== null && newBoard[bestMove] === null) {
      newBoard[bestMove] = "O";
      setBoard([...newBoard]);
      setMoveCount((prev) => prev + 1);
      localStorage.setItem("ticTacToeBoard", JSON.stringify(newBoard));
    }

    const winner = checkWinner(newBoard);
    if (winner) {
      setGameOver(true);
      handleGameOver(winner);
      setTimeout(() => {
        alert(`Game Over: ${winner === "Draw" ? "It's a draw!" : `${winner} wins!`}`);
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
      handleGameOver(winner);
      setTimeout(() => {
        alert(`Game Over: ${winner === "Draw" ? "It's a draw!" : `${winner} wins!`}`);
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
      alert("Game reset! Try again.");
      aiMove();
    }, 100);
  };

  return (
    <div className="tic-tac-toe">
      <h2 className="tic-tac-toe__title">Tic-Tac-Toe</h2>
      <div className="tic-tac-toe__board">
        {board.map((cell, index) => (
          <div
            key={index}
            className={`tic-tac-toe__cell ${
              cell === "X" ? "tic-tac-toe__cell--win" : cell === "O" ? "tic-tac-toe__cell--lose" : ""
            }`}
            onClick={() => handleClick(index)}
          >
            {cell}
          </div>
        ))}
      </div>
      <p className="tic-tac-toe__status">
        {gameOver
          ? rogueAIMessages[Math.floor(Math.random() * rogueAIMessages.length)]
          : playerTurn
          ? "Make your move... if you dare. 😈"
          : "Processing... your fate. 🔄"}
      </p>
      <button className="tic-tac-toe__reset-button" onClick={handleReset}>
        Reset Game
      </button>
    </div>
  );
};

export default TicTacToe;
