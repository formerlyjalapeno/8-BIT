import React, { useState, useEffect } from "react";
import { saveGameStarted, loadGameStarted } from "../utils/storage.js";
import "../styles/main.scss"; // Ensure this SCSS file exists

const LoadingBar = () => {
  const [progress, setProgress] = useState(0);
  const [gameStarted, setGameStarted] = useState(loadGameStarted());

  useEffect(() => {
    saveGameStarted(gameStarted);
  }, [gameStarted]);

  useEffect(() => {
    const totalDuration = 6000; // 6 seconds
    const intervalDuration = 500; // update every 500ms
    const totalIntervals = totalDuration / intervalDuration;

    let currentInterval = 0;
    const interval = setInterval(() => {
      currentInterval++;

      if (currentInterval < totalIntervals) {
        const randomIncrement = Math.floor(Math.random() * 14) + 2;
        setProgress((prev) => Math.min(prev + randomIncrement, 100));
      } else {
        setProgress(100);
        clearInterval(interval);
        setTimeout(() => {
          setGameStarted(true);
          window.location.href = "/room"; // Redirect to the game
        }, 1200);
      }
    }, intervalDuration);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-screen">
      <div className="loading-text">
        <span className="loading-text__main">Redirecting... {progress}%</span>
        <span className="loading-text__sub">bringing you to your mission</span>
      </div>
      <div className="loading-bar">
        <div className="loading-bar__fill" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
};

export default LoadingBar;
