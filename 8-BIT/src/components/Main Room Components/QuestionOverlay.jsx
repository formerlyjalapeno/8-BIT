// QuestionOverlay.jsx (overlay component)
import React from "react";

const QuestionOverlay = ({ activeQuestion, onClose, questions }) => {
  if (activeQuestion === null) return null; // No question selected, no overlay

  const currentQuestion = questions.find((q) => q.id === activeQuestion);

  if (!currentQuestion) return null; // Safety check

  return (
    <div className="room__container__question__overlay">
      <div className="room__container__question__overlay__content">
        <h2>{currentQuestion.title}</h2>
        <p>{currentQuestion.text}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default QuestionOverlay;
