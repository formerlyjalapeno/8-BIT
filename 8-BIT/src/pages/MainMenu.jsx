import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Error from "../components/Additional Components/Error";
import { saveGameStarted, loadGameStarted } from "../utils/storage.js";

const Welcome = () => {
  const elementRef = useRef(null);
  
  // Initialize local state with the stored value from local storage
  const [gameStarted, setGameStarted] = useState(loadGameStarted());

  // Whenever the local `gameStarted` state changes, save to local storage
  useEffect(() => {
    saveGameStarted(gameStarted);
  }, [gameStarted]);

  const handleStart = () => {
    setGameStarted(true);
  };

  const ActivateErrorOverlay = () => {
    if (elementRef.current) {
      elementRef.current.classList.remove("error__box__invisible");
      elementRef.current.classList.add("error__box__visible");
      console.log("activate");
    }
  };

  const DeactivateErrorOverlay = () => {
    if (elementRef.current) {
      elementRef.current.classList.remove("error__box__visible");
      elementRef.current.classList.add("error__box__invisible");
      console.log("deactivate");
    }
  };

  return (
    <main className="mainmenu">
      <article className="mainmenu__message">
        <div className="mainmenu__message__single-text">
          <h1 className="mainmenu__message__single-text__welcome">WELCOME</h1>
        </div>
        <div className="mainmenu__message__double-text">
          <div className="mainmenu__message__double-text__container">
            <h2 className="mainmenu__message__double-text__container__to">
              TO
            </h2>
          </div>
          <div className="mainmenu__message__double-text__container">
            <h2 className="mainmenu__message__double-text__container__bit">
              8-BIT
            </h2>
          </div>
        </div>
      </article>
      <article className="mainmenu__play-buttons">
        <h4
          className="mainmenu__play-buttons__pink-gradient"
          onClick={ActivateErrorOverlay}
        >
          EXIT
        </h4>
        <div className="mainmenu__play-buttons__seperation-line"></div>
        <Link to="/loading" style={{ textDecoration: "none" }}>
          {gameStarted ? (
            <h4 className="mainmenu__play-buttons__blue-gradient">CONTINUE</h4>
          ) : (
            <h4
              className="mainmenu__play-buttons__blue-gradient"
              onClick={handleStart}
            >
              PLAY
            </h4>
          )}
        </Link>
      </article>
      <div className="mainmenu__credits-button">
        <Link to="/credits" style={{ textDecoration: "none" }}>
          <h4>MORE</h4>
        </Link>
      </div>
      <Error onClick={DeactivateErrorOverlay} ref={elementRef} />
    </main>
  );
};

export default Welcome;
