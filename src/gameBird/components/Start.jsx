import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Start.css";

const Start = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleGlobalClick = () => {
      navigate("/bird-instructions");
    };

    document.addEventListener("click", handleGlobalClick);
    return () => {
      document.removeEventListener("click", handleGlobalClick);
    };
  }, [navigate]);

  return (
    <div className="birdstart-container">
      <div className="birdoverlay">
        <h1>Bird Thrust</h1>
        <button onClick={() => navigate("/bird-instructions")}>Start Game</button>
      </div>
    </div>
  );
};

export default Start;
