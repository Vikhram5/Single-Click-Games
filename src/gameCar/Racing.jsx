import React, { useState, useEffect, useRef } from "react";
import { TrophyOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Typography } from "antd";
import Road from "./components/Road.jsx";
import "./Racing.css";

const { Text } = Typography;

const RacingGameWithLearning = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [carPosition, setCarPosition] = useState(0);
  const [isGamePaused, setIsGamePaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(60);
  const [gameEnded, setGameEnded] = useState(false);
  const [activeButton, setActiveButton] = useState("home");
  const [showCongratsModal, setShowCongratsModal] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const hasSentScore = useRef(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown") {
        setHighlightedIndex((prevIndex) => (prevIndex + 1) % 2);
      } else if (e.key === "ArrowUp") {
        setHighlightedIndex((prevIndex) => (prevIndex - 1 + 2) % 2);
      } else if (e.key === "Enter") {
        handleButtonClick();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [highlightedIndex]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    if (!gameEnded || hasSentScore.current) return;
  
    hasSentScore.current = true;
  
    const sendScore = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/gamescore", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            game_id: "car",
            score: score,
            date: new Date().toISOString().split("T")[0],
          }),
        });
  
        const result = await response.json();
        console.log("✅ Score saved:", result);
      } catch (error) {
        console.error("❌ Failed to send score:", error);
      }
    };
  
    sendScore();
  }, [gameEnded, score]);
  

  useEffect(() => {
    let timerInterval;

    if (!isLoading && !isGamePaused && !gameEnded) {
      timerInterval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime > 0) {
            return prevTime - 1;
          } else {
            clearInterval(timerInterval);
            handleGameEnd();
            return 0;
          }
        });
      }, 1000);
    }

    return () => clearInterval(timerInterval);
  }, [isLoading, isGamePaused, gameEnded]);

  const handleClick = () => {
    if (!isGamePaused && !gameEnded) {
      setCarPosition((prevPosition) => {
        if (direction === 1) {
          if (prevPosition === 0) return 1;
          if (prevPosition === 1) return 2;
          if (prevPosition === 2) {
            setDirection(-1);
            return 1;
          }
        } else if (direction === -1) {
          if (prevPosition === 0) {
            setDirection(1);
            return 1;
          }
          if (prevPosition === 1) return 0;
          if (prevPosition === 2) return 1;
        }

        return prevPosition;
      });
    }
  };

  const handleCollision = () => {
    setScore((prevScore) => prevScore + 1);
  };


  const handleGameEnd = () => {
    setGameEnded(true);
    setIsGamePaused(true);
    setShowCongratsModal(true);
  };

  const handleRetry = () => {
    navigate("/car-start");
  };

  const handleGoHome = () => {
    navigate("/game");
  };

  useEffect(() => {
    let shiftTimer;
    if (showCongratsModal) {
      shiftTimer = setInterval(() => {
        setActiveButton((prev) => (prev === "home" ? "retry" : "home"));
      }, 5000);
    }
    return () => clearInterval(shiftTimer);
  }, [showCongratsModal]);

  const handleButtonClick = () => {
    if (activeButton === "home") {
      handleGoHome();
    } else {
      handleRetry();
    }
  };

  useEffect(() => {
    if (showCongratsModal) {
      const globalClickHandler = () => {
        handleButtonClick();
      };

      window.addEventListener("click", globalClickHandler);

      return () => {
        window.removeEventListener("click", globalClickHandler);
      };
    }
  }, [showCongratsModal, handleButtonClick]);


  return (
    <div onClick={handleClick} className="rgl-game">
      <div className="rgl-background"></div>

      <div className="score-timer">
        <div className="score">
          <TrophyOutlined style={{ marginRight: "8px", fontSize: "24px" }} />
          Score: {score}
        </div>
        <div className="timer">
          <ClockCircleOutlined
            style={{ marginRight: "8px", fontSize: "24px" }}
          />
          Time: {time} s
        </div>
      </div>

      <Road
        isGamePaused={isGamePaused}
        carPosition={carPosition}
        onCollision={handleCollision}
      />

      <Modal
        title={
          <span className="modal-title">
            <TrophyOutlined style={{ marginRight: "8px", color: "gold" }} />
            Congratulations!
          </span>
        }
        open={showCongratsModal}
        footer={[
          <Button
            key="home"
            type={activeButton === "home" ? "primary" : "default"}
            onClick={handleButtonClick}
          >
            Home
          </Button>,
          <Button
            key="retry"
            type={activeButton === "retry" ? "primary" : "default"}
            onClick={handleButtonClick}
          >
            Retry
          </Button>,
        ]}
        width={600}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            textAlign: "center",
          }}
        >
          <Text style={{ fontSize: "24px", fontWeight: "bold" }}>
            Your final score is: {score}
          </Text>
          <TrophyOutlined
            style={{ fontSize: "48px", color: "gold", marginTop: "10px" }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default RacingGameWithLearning;
