// src/components/Interim Components/Cutscene.jsx

import React, { useEffect } from 'react';
import '../../styles/main.scss'; // Import the SCSS file for styling
import PropTypes from 'prop-types'; // For prop type validation

/**
 * Cutscene Component
 * 
 * Displays an AI taunt with a glitch effect and a top message.
 * Automatically calls a callback function after a specified duration to handle room transition.
 * 
 * Props:
 * - topMessage: The top message to display.
 * - tauntMessage: The taunt message to display.
 * - duration: Time in milliseconds before triggering the callback.
 * - onCutsceneEnd: Callback function to handle actions after cutscene ends.
 */
const Cutscene = ({ topMessage, tauntMessage, duration = 3000, onCutsceneEnd }) => {
  useEffect(() => {
    console.log("Cutscene started.");
    const timer = setTimeout(() => {
      console.log("Cutscene ended. Triggering onCutsceneEnd.");
      if (onCutsceneEnd) {
        onCutsceneEnd(); // Call the callback to handle room transition
      }
    }, duration);

    // Cleanup the timer when the component unmounts
    return () => {
      console.log("Cutscene unmounted. Clearing timer.");
      clearTimeout(timer);
    };
  }, [duration, onCutsceneEnd]);

  return (
    <div className="cutscene">
      <div className="cutscene__overlay"></div> {/* Overlay for better text readability */}
      
      {/* Top Message */}
      {topMessage && (
        <h3 className="cutscene__top-message" data-text={topMessage}>
          {topMessage}
        </h3>
      )}
      
      {/* Taunt Message */}
      {tauntMessage && (
        <h2 className="cutscene__taunt-message" data-text={tauntMessage}>
          {tauntMessage}
        </h2>
      )}
    </div>
  );
};

// Prop type validation
Cutscene.propTypes = {
  topMessage: PropTypes.string.isRequired,
  tauntMessage: PropTypes.string.isRequired,
  duration: PropTypes.number,
  onCutsceneEnd: PropTypes.func.isRequired
};

export default Cutscene;
