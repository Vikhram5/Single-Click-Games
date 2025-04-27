import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Start.css";

const Start = () => {
  // const [audio] = useState(new Audio("/background-music.mp3"));

  // useEffect(() => {
  //   const playAudio = () => {
  //     audio.loop = true;
  //     audio.play().catch(() => {
  //       console.log("Autoplay blocked, waiting for user interaction.");
  //     });
  //   };

  //   playAudio();

  //   document.addEventListener("click", playAudio, { once: true });

  //   return () => {
  //     document.removeEventListener("click", playAudio);
  //     audio.pause();
  //   };
  // }, [audio]);

  return (
    <div className="wordstart-page">
      <div className="wordstart-content">
        <h1 className="wordstart-title">Word Puzzle Game!</h1>
        <Link to="/word-game">
          <button className="wordstart-button">Start Game</button>
        </Link>
      </div>
    </div>
  );
};

export default Start;
