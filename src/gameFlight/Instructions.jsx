import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Instructions.css";

const Instructions = () => {
  const navigate = useNavigate();
  const instructionsRef = useRef(null);

  useEffect(() => {
    const handleGlobalClick = (event) => {
      console.log("Global click detected outside the instructions container");
      // Start the game if clicked outside the instructions container
      navigate("/plane-game");
    };

    // Add the event listener when the component mounts
    document.addEventListener("click", handleGlobalClick);

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleGlobalClick);
    };
  }, [navigate]);

  return (
    <div className="flightinstructions-container" ref={instructionsRef}>
      <div className="flightinstructions-content">
        <h2 className="flightinstructions-title">How to Play</h2>
        <p className="flightinstructions-text">
          One-Click To Move the Plane UP and DOWN
        </p>
        <button
          className="flightinstructions-btn"
          onClick={() => navigate("/plane-game")}
        >
          Start Flight
        </button>
      </div>
    </div>
  );
};

export default Instructions;
