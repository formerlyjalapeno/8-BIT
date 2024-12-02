import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";

const Start = () => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      let hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";

      // Convert to 12-hour format
      hours = hours % 12;
      hours = hours ? hours : 12; // Adjust for 0 (midnight)

      setTime(`${hours}:${minutes} ${ampm}`);
    };

    // Initial time set
    updateTime();

    // Update every minute
    const interval = setInterval(updateTime, 5000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);


  return (
    <>

      <div className="start__button">
        <Link to="/welcome">
          <div className="start__text">
            <button>START</button>
          </div>
        </Link>
        <p>today, at {time}</p>
      </div>
    </>
  );
};

export default Start;
