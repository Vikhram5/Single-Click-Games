import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./StartGame.css";

const StartGame = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleGlobalClick = () => {
      // Trigger navigation on any click
      navigate("/plane-instructions");
    };

    // Add the global click listener when the component mounts
    document.addEventListener("click", handleGlobalClick);

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleGlobalClick);
    };
  }, [navigate]);

  return (
    <div className="flightstart">
      <div className="flight-content-container">
        <button
          className="flight-start-btn"
          onClick={(e) => {
            // Prevent event propagation to avoid triggering the global click
            e.stopPropagation();
            navigate("/plane-instructions");
          }}
        >
          Start Flight
        </button>
      </div>
    </div>
  );
};

export default StartGame;
