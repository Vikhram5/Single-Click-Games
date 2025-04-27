import React from "react";
import { Link } from "react-router-dom";
import Typewriter from "typewriter-effect";
import "./Home.css";

const Home = () => {
  const handleDoubleClick = () => {
    document.getElementById("start-button").click();
  };

  return (
    <div className="homec-container" onClick={handleDoubleClick}>
      <div className="homec-content">
        <h1>Drive UP</h1>
        <div className="typewriter1-container">
          <Typewriter
            onInit={(writer) => {
              writer
                .typeString("Fasten your seatbelt !")
                .pauseFor(1000)
                .typeString("<br />Click to start the race")
                .start();
            }}
          />
        </div>
        <Link to="/car-game">
          <button id="start-button" className="startc-button">
            Start Game
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
