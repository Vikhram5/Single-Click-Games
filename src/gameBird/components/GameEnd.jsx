import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./GameEnd.css";

const GameEnd = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const score = location.state?.score || 0;
  const hasSentScore = useRef(false);

  // useEffect(() => {
  //   if (hasSentScore.current) return;
  //   hasSentScore.current = true;

  //   const sendScore = async () => {
  //     try {
  //       const response = await fetch("http://localhost:5000/api/gamescore", {
  //         method: "POST",
  //         credentials: "include",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           game_id: "bird", // <-- you can dynamically change this if needed
  //           score: score,
  //           date: new Date().toISOString().split("T")[0],
  //         }),
  //       });

  //       const result = await response.json();
  //       console.log("✅ Score saved:", result);
  //     } catch (error) {
  //       console.error("❌ Failed to send score:", error);
  //     }
  //   };

  //   sendScore();
  // }, [score]);

  const handlePlayAgain = () => {
    navigate("/game", { state: { finalScore: 0 } });
  };

  useEffect(() => {
    const handleGlobalClick = () => {
      handlePlayAgain();
    };
    window.addEventListener("click", handleGlobalClick);

    return () => {
      window.removeEventListener("click", handleGlobalClick);
    };
  }, []);

  return (
    <div className="game-over-container">
      <div className="game-over-content">
        <h1>Game Over!</h1>
        <p>
          Your Score: <span className="score-bird">{score}</span>
        </p>
        <button className="play-again-btn" onClick={handlePlayAgain}>
          Play Again
        </button>
      </div>
    </div>
  );
};

export default GameEnd;
