// DevResetButton.jsx – you can place this inline or in a separate component
const DevResetButton = () => {
  const handleDevReset = () => {
    localStorage.clear();
    window.location.reload(); // Refresh the page to see all data cleared
  };

  return (
    <button
      style={{
        position: "absolute",
        bottom: "1rem",
        right: "1rem",
        background: "red",
        color: "white",
        padding: "0.5rem",
        border: "none",
        borderRadius: "0.25rem",
        cursor: "pointer",
        zIndex: 9999, // So it stays on top of other elements
      }}
      onClick={handleDevReset}
    >
      DEV RESET
    </button>
  );
};

export default DevResetButton;
