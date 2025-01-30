// src/components/TicTacToe.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  calculatingMessages,
  tauntsAfterMove,
  tauntsOnAIWin,
  tauntsOnPlayerAttemptWin,
  tauntsOnAIMoveCorner,
  tauntsOnAIBlock,
  tauntsOnAIMoveCenter
} from './scripts/messages';
import { getRandomMessage } from './scripts/messageUtils';

const TicTacToe = () => {
  const navigate = useNavigate();
  const [board, setBoard] = useState(Array(9).fill(''));
  const [aiMessage, setAiMessage] = useState('');
  const [loseCount, setLoseCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const AI_SYMBOL = 'X';
  const PLAYER_SYMBOL = 'O';

  // Refs to track used messages
  const usedCalculating = useRef([]);
  const usedTauntsAfter = useRef([]);
  const usedTauntsOnAIMoveCorner = useRef([]);
  const usedTauntsOnAIBlock = useRef([]);
  const usedTauntsOnAIWin = useRef([]);
  const usedTauntsOnAIMoveCenter = useRef([]);

  useEffect(() => {
    const storedLoseCount = parseInt(localStorage.getItem('loseCount'), 10);
    if (!isNaN(storedLoseCount)) setLoseCount(storedLoseCount);
  }, []);

  useEffect(() => {
    localStorage.setItem('loseCount', loseCount);
    if (loseCount >= 6) navigate('/epilogue');
  }, [loseCount, navigate]);

  useEffect(() => {
    if (board.every(cell => cell === '') && !gameOver) aiMove(board);
    // eslint-disable-next-line
  }, []);

  const checkGameOver = (currentBoard) => {
    const winner = getWinner(currentBoard);
    if (winner === AI_SYMBOL) {
      setAiMessage(getRandomMessage(tauntsOnAIWin, usedTauntsOnAIWin.current));
      setLoseCount(prev => prev + 1);
      setGameOver(true);
      setTimeout(resetGame, 1500);
      return true;
    } else if (winner === PLAYER_SYMBOL) {
      setAiMessage(getRandomMessage(tauntsOnPlayerAttemptWin, []));
      setGameOver(true);
      setTimeout(resetGame, 1500);
      return true;
    } else if (currentBoard.every(cell => cell !== '')) {
      setAiMessage(getRandomMessage(tauntsAfterMove, usedTauntsAfter.current));
      setGameOver(true);
      setTimeout(resetGame, 1500);
      return true;
    }
    return false;
  };

  const getWinner = (currentBoard) => {
    const winPatterns = [
      [0,1,2], [3,4,5], [6,7,8],
      [0,3,6], [1,4,7], [2,5,8],
      [0,4,8], [2,4,6]
    ];
    for (let pattern of winPatterns) {
      const [a,b,c] = pattern;
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return currentBoard[a];
      }
    }
    return null;
  };

  const handleClick = (index) => {
    if (board[index] !== '' || gameOver) return;
    const newBoard = [...board];
    newBoard[index] = PLAYER_SYMBOL;
    setBoard(newBoard);
    setAiMessage(getRandomMessage(tauntsAfterMove, usedTauntsAfter.current));
    if (checkGameOver(newBoard)) return;
    aiMove(newBoard);
  };

  const aiMove = async (currentBoard) => {
    setAiMessage(getRandomMessage(calculatingMessages, usedCalculating.current));
    await new Promise(resolve => setTimeout(resolve, 1000));
    const move = determineAIMove(currentBoard);
    if (move === -1) {
      setAiMessage(getRandomMessage(tauntsAfterMove, usedTauntsAfter.current));
      setGameOver(true);
      setTimeout(resetGame, 1500);
      return;
    }
    const newBoard = [...currentBoard];
    newBoard[move] = AI_SYMBOL;
    setBoard(newBoard);

    // Specific taunts
    if (isCorner(move)) {
      setAiMessage(getRandomMessage(tauntsOnAIMoveCorner, usedTauntsOnAIMoveCorner.current));
    } else if (isBlockingMove(currentBoard, move)) {
      setAiMessage(getRandomMessage(tauntsOnAIBlock, usedTauntsOnAIBlock.current));
    } else if (isCenter(move)) {
      setAiMessage(getRandomMessage(tauntsOnAIMoveCenter, usedTauntsOnAIMoveCenter.current));
    } else {
      setAiMessage(getRandomMessage(tauntsAfterMove, usedTauntsAfter.current));
    }

    checkGameOver(newBoard);
  };

  const determineAIMove = (currentBoard) => {
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
          return pattern[line.indexOf('')];
        }
      }
      return -1;
    };

    // 1. Win if possible
    let move = findMove(AI_SYMBOL);
    if (move !== -1) return move;

    // 2. Block player
    move = findMove(PLAYER_SYMBOL);
    if (move !== -1) return move;

    // 3. Take corner
    const corners = [0,2,6,8].filter(i => currentBoard[i] === '');
    if (corners.length) return corners[Math.floor(Math.random() * corners.length)];

    // 4. Take center
    if (currentBoard[4] === '') return 4;

    // 5. Take edge
    const edges = [1,3,5,7].filter(i => currentBoard[i] === '');
    if (edges.length) return edges[Math.floor(Math.random() * edges.length)];

    return -1;
  };

  const isCorner = (index) => [0,2,6,8].includes(index);
  const isCenter = (index) => index === 4;
  const isBlockingMove = (currentBoard, aiMoveIndex) => {
    const tempBoard = [...currentBoard];
    tempBoard[aiMoveIndex] = AI_SYMBOL;
    return getWinner(tempBoard) === AI_SYMBOL;
  };

  const resetGame = () => {
    setBoard(Array(9).fill(''));
    setGameOver(false);
    setAiMessage('');
    aiMove(Array(9).fill(''));
  };

  return (
    <div className="tic-tac-toe">
      {/* <h2 className="tic-tac-toe__title">Lose-Lose-Lose</h2> */}
      
      {/* Lose Words */}
      <div className="lose-words" style={{ marginTop: '10px' }}>
        {[...Array(loseCount)].map((_, index) => (
          <span 
            key={index} 
            style={{ 
              fontSize: `${20 - index * 3.5}px`, 
              marginRight: '5px', 
              transition: 'font-size 0.3s' 
            }}
          >
            Lose
          </span>
        ))}
      </div>
      
      <div className="tic-tac-toe__board">
        {board.map((cell, index) => (
          <div
            key={index}
            className={`tic-tac-toe__cell ${
              cell === PLAYER_SYMBOL ? "tic-tac-toe__cell--lose" : cell === AI_SYMBOL ? "tic-tac-toe__cell--win" : ""
            }`}
            onClick={() => handleClick(index)}
            role="button"
            aria-label={`Cell ${index + 1} ${cell ? (cell === PLAYER_SYMBOL ? 'occupied by you' : 'occupied by AI') : 'empty'}`}
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleClick(index);
            }}
          >
            {cell}
          </div>
        ))}
      </div>
      <p className="tic-tac-toe__status">{aiMessage}</p>
      <button className="tic-tac-toe__reset-button" onClick={resetGame}>
        Reset Game
      </button>
    </div>
  );
};

export default TicTacToe;
