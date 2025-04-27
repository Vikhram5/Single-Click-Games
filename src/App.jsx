import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login.jsx";
import Game from "./Game.jsx";
import WordStart from "./gameWord/components/Start.jsx";
import WordGame from "./gameWord/components/Game.jsx";
import WordGameEnd from "./gameWord/components/GameEnd.jsx";
import NinjaStart from "./gameNinja/pages/StartPage.jsx";
import NinjaInstructions from "./gameNinja/pages/InstructionsPage.jsx";
import NinjaGame from "./gameNinja/pages/GamePage.jsx";
import NinjaGameEnd from "./gameNinja/pages/EndGamePage.jsx";
import CarStart from "./gameCar/Home.jsx";
import CarGame from "./gameCar/Racing.jsx";
import PlaneStart from "./gameFlight/StartGame.jsx";
import PlaneInstructions from "./gameFlight/Instructions.jsx";
import PlaneGame from "./gameFlight/Game.jsx";
import PlaneGameEnd from "./gameFlight/EndGame.jsx";
import BirdStart from "./gameBird/components/Start.jsx";
import BirdInstructions from "./gameBird/components/Instructions.jsx";
import BirdGame from "./gameBird/components/Game.jsx";
import BirdQuestions from "./gameBird/components/Questions.jsx";
import BirdGameEnd from "./gameBird/components/GameEnd.jsx";

import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Start Games */}
        <Route path="/" element={<Login />} />  
        <Route path="/game" element={<Game />} />  
      
        {/* Word Games */}
        <Route path="/word-start" element={<WordStart />} />
        <Route path="/word-game" element={<WordGame />} />
        <Route path="/word-end" element={<WordGameEnd />} />

        {/* Ninja Games */}
        <Route path="/ninja-start" element={<NinjaStart />} />
        <Route path="/ninja-instructions" element={<NinjaInstructions />} />
        <Route path="/ninja-game" element={<NinjaGame />} />
        <Route path="/ninja-end" element={<NinjaGameEnd />} />

        {/* Car Games */}
        <Route path="/car-start" element={<CarStart />} />
        <Route path="/car-game" element={<CarGame />} />

        {/* Plane Games */}
        <Route path="/plane-start" element={<PlaneStart />} />
        <Route path="/plane-instructions" element={<PlaneInstructions />} />
        <Route path="/plane-game" element={<PlaneGame />} />
        <Route path="/plane-end" element={<PlaneGameEnd />} />

        {/* Bird Game */}
        <Route path="/bird-start" element={<BirdStart />} />
        <Route path="/bird-instructions" element={<BirdInstructions />} />
        <Route path="/bird-game" element={<BirdGame />} />
        <Route path="/bird-questions" element={<BirdQuestions />} />
        <Route path="/bird-end" element={<BirdGameEnd />} />

      </Routes>
    </Router>
  );
}

export default App;
