// QuestionOverlay.jsx
import React, { useState } from "react";

const QuestionOverlay = ({ activeQuestion, onClose, questions, onPuzzleSolved }) => {
  if (activeQuestion === null) return null; // No question selected, no overlay

  const currentQuestion = questions.find((q) => q.id === activeQuestion);

  if (!currentQuestion) return null; // Safety check

  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState({ message: "", type: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentQuestion.requiresAnswer) {
      setIsSubmitting(true);
      if (
        userAnswer.trim().toUpperCase() ===
        currentQuestion.correctAnswer.toUpperCase()
      ) {
        setFeedback({ message: "Correct!", type: "success" });
        // Notify Room.jsx that the puzzle is solved
        onPuzzleSolved(currentQuestion.id);
        // Automatically close the overlay after a short delay
        setTimeout(() => {
          setFeedback({ message: "", type: "" });
          onClose();
        }, 1000); // 1-second delay
      } else {
        setFeedback({ message: "Incorrect, please try again.", type: "error" });
        setIsSubmitting(false);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div
      className="room__container__question__overlay"
      onKeyDown={handleKeyDown}
      tabIndex={-1} // Make div focusable to capture key events
    >
      <div className="room__container__question__overlay__content">
        <h2>READY TO ANSWER?</h2>
        <h3>{currentQuestion.title}</h3>
        <p>{currentQuestion.text}</p>

        {currentQuestion.requiresAnswer ? (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Enter your answer"
              required
            />
            <div className="buttons-container">
              <button
                type="button"
                onClick={onClose}
                className="close-button"
                disabled={isSubmitting}
              >
                MORE TIME...
              </button>
              <button type="submit" disabled={isSubmitting}>
                SUBMIT?
              </button>
            </div>
          </form>
        ) : (
          <button onClick={onClose} className="close-button">
            Close
          </button>
        )}

        {feedback.message && (
          <p className={`feedback ${feedback.type}`}>{feedback.message}</p>
        )}
      </div>
    </div>
  );
};

export default QuestionOverlay;
