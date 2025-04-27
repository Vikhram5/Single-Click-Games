import React from "react";
import "./Letter.css";

const Letter = ({ letter, position }) => {
  return (
    <div
      className="letter"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      {letter}
    </div>
  );
};

export default Letter;
