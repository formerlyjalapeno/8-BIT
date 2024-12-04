import { Link } from "react-router-dom";
import { useRef } from "react";
import Error from "../components/Error";

const Welcome = () => {
  const elementRef = useRef(null);

  const ActivateErrorOverlay = () => {
    if (elementRef.current) {
      elementRef.current.classList.add("Error__Box__Visible");
      elementRef.current.classList.remove("Error__Box__Invisible");
      console.log("activate");
    }
  };

  const DeactivateErrorOverlay = () => {
    if (elementRef.current) {
      elementRef.current.classList.add("Error__Box__Invisible");
      elementRef.current.classList.remove("Error__Box__Visible");
      console.log("deactivate");
    }
  };

  return (
    <main className="welcome__Container">
      <article className="welcome__Message">
        <div className="home">
          <h1>WELCOME</h1>
        </div>
        <div className="double__Text">
          <div className="to">
            <h2>TO</h2>
          </div>
          <div className="bit">
            <h2>8-BIT</h2>
          </div>
        </div>
      </article>
      <article className="play__Buttons">
        <h4 className="pink__Gradient"  onClick={ActivateErrorOverlay}>EXIT</h4>
        <div className="separation__line"></div>
        <Link to="/loading" style={{ textDecoration: "none" }}>
          <h4 className="blue__Gradient">PLAY</h4>
        </Link>
      </article>
      <Link to="/morecredits" style={{ textDecoration: "none" }}>
        <div className="more__Button">
          <h4>MORE</h4>
        </div>
      </Link>
      <Error onClick={DeactivateErrorOverlay} ref={elementRef} />
    </main>
  );
};

export default Welcome;

