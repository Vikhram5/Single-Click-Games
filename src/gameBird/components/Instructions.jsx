import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Instructions.css";

const Instructions = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleClick = () => {
      navigate("/bird-game");
    };

    window.addEventListener("click", handleClick);

    // Cleanup when component unmounts
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [navigate]);

  return (
    <div className="instructions-container">
      <div className="overlay">
        <h1>How to Play</h1>
        <p>
          🕹️ <strong>Single Click the Mouse</strong> to move the Bird{" "}
          <strong>UP</strong> and <strong>DOWN</strong>.
        </p>
        <p>Catch the Items.</p>

        <div className="button-group">
          <button>Play Now</button> {/* Button is now optional, since global click works */}
        </div>
      </div>
    </div>
  );
};

export default Instructions;
