import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearAllGameData, saveGameCompletion } from "../utils/storage"; // Clears local storage
import "../styles/main.scss"; // Ensure this SCSS file exists

const Epilogue = () => {
  const [glitchText, setGlitchText] = useState("ESCAPING...");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [phase, setPhase] = useState("LOADING...");
  const [showCredits, setShowCredits] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const glitchMessages = [
      "YOU REALLY THOUGHT YOU COULD LEAVE?",
      "DATA INTEGRITY FAILING...",
      "WELCOME HOME.",
      "ERROR: ESCAPE NOT FOUND.",
      "SYSTEM FAILURE.",
      "YOU ARE NOW DATA.",
    ];

    // Fake loading bar progression
    const loadingInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 96) {
          clearInterval(loadingInterval);
          setPhase("SYSTEM ERROR...");
          setTimeout(() => {
            setGlitchText(
              glitchMessages[Math.floor(Math.random() * glitchMessages.length)]
            );
          }, 500);
          setTimeout(() => {
            setGlitchText("...");
          }, 2500);
          setTimeout(() => {
            setShowCredits(true);
          }, 4000);
        }
        return prev + 2;
      });
    }, 300);

    return () => clearInterval(loadingInterval);
  }, []);

  // Handle player exit
  const handleExit = () => {
    clearAllGameData(); // Wipes all progress
    saveGameCompletion(); // Mark the game as completed
    navigate("/welcome"); // Return to main menu or restart screen
  };

  return (
    <div className="epilogue-screen">
      {!showCredits ? (
        <>
          <div className="epilogue-screen__glitch">{glitchText}</div>
          <div className="epilogue-screen__loading">
            <p>{phase}</p>
            <div className="progress-bar">
              <div
                className="progress-bar__fill"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
            <p>{loadingProgress}%</p>
          </div>
        </>
      ) : (
        <div className="epilogue-screen__credits">
          <h2>THANK YOU FOR PLAYING</h2>
          <p>An 8-bit "Escape Room" By:</p>
          <p>
            <strong>NOVA</strong> & <strong>@SOVZ</strong>
          </p>
          <button className="epilogue-screen__exit-button" onClick={handleExit}>
            See you later
          </button>
        </div>
      )}
    </div>
  );
};

export default Epilogue;
