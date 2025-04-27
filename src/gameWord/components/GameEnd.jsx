import React from "react";
import { Link } from "react-router-dom";
import "./GameEnd.css";

const GameEnd = () => {
  return (
    <div className="wordgame-end-container">
      <div className="game-end-card">
        <h1 className="wordgame-over-title">Game Over!</h1>
        <p className="wordgame-end-text">The game has ended. Would you like to try again?</p>
        <Link to="/">
          <button className="wordrestart-button">Go to Start</button>
        </Link>
      </div>
      <div className="wordparticle-bg"></div>
    </div>
  );
};

export default GameEnd;
