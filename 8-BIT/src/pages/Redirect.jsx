import React, { useState, useEffect } from "react";
import { saveGameStarted, loadGameStarted } from "../utils/storage.js";

const LoadingBar = () => {
  // 1) Define all Hooks (useState, useEffect) at the top level of the component:
  const [progress, setProgress] = useState(0);

  // Track whether the game has started, loading from localStorage initially
  const [gameStarted, setGameStarted] = useState(loadGameStarted());

  // 2) Whenever `gameStarted` changes, save it to local storage
  useEffect(() => {
    saveGameStarted(gameStarted);
  }, [gameStarted]);

  // 3) Handle the progress bar effect and final navigation

  useEffect(() => {
    const totalDuration = 6000; // 6000ms total
    const intervalDuration = 500; // update every 500ms
    const totalIntervals = totalDuration / intervalDuration; // 12 intervals

    let currentInterval = 0;
    const interval = setInterval(() => {
      currentInterval++;

      if (currentInterval < totalIntervals) {
        // Random increment logic: random increments between 2% and 15%
        const randomIncrement = Math.floor(Math.random() * 14) + 2;
        setProgress((prev) => {
          let newProgress = prev + randomIncrement;
          return newProgress > 100 ? 100 : newProgress;
        });
      } else {
        // On the final interval, set progress to 100%
        setProgress(100);
        clearInterval(interval);

        // Give a small delay before redirecting
        setTimeout(() => {
          // This will set `gameStarted` to true and store in local storage
          setGameStarted(true);

          // Then redirect
          window.location.href = "/room";
        }, 1200);
      }
    }, intervalDuration);

    // Cleanup when component unmounts or effect re-runs
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-bar">
      <div className="loading-bar__primary-container">
        <div className="loading-bar__primary-container__text">
          Redirecting... {progress}%
        </div>
        <p className="loading-bar__primary-container__extra">
          bringing you to your mission
        </p>
      </div>
      <div className="loading-bar__secondary-container">
        <div
          className="loading-bar__secondary-container__progress"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default LoadingBar;
