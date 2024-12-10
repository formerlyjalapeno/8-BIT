import React, { useState, useEffect } from "react";

const LoadingBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalDuration = 6000; // 6 seconds total
    const intervalDuration = 500; // update every 500ms
    const totalIntervals = totalDuration / intervalDuration; // 12 intervals

    let currentInterval = 0;

    const interval = setInterval(() => {
      currentInterval++;

      if (currentInterval < totalIntervals) {
        // Random increment logic:
        // Let's pick a random increment to give it a slow and random feel.
        // For example: random increments between 2% and 15%.
        const randomIncrement = Math.floor(Math.random() * 14) + 2;
        setProgress((prev) => {
          let newProgress = prev + randomIncrement;
          if (newProgress > 100) {
            newProgress = 100;
          }
          return newProgress;
        });
      } else {
        // On the final interval, set progress exactly to 100%
        setProgress(100);
        clearInterval(interval);
        setTimeout(() => {
          window.location.href = "/room";
        }, 1200);
      }
    }, intervalDuration);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-bar">
      <div className="loading-bar__text">Loading... {progress}%</div>
      <div className="loading-bar__container">
        <div
          className="loading-bar__progress"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default LoadingBar;
