import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SpriteAnimator } from "react-sprite-animator";
import { UpOutlined, DownOutlined } from "@ant-design/icons";
import "./Game.css";

const yPositions = [150, 200, 250, 300, 350, 400, 450];

const Game = () => {
  const navigate = useNavigate();

  const [characterX, setCharacterX] = useState(600);
  const [characterY, setCharacterY] = useState(yPositions[1]);
  const [gameOver, setGameOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [collectedEmojis, setCollectedEmojis] = useState([]);
  const [emojiPositions, setEmojiPositions] = useState([]);
  const [obstacles, setObstacles] = useState([]);
  const [forceLoading, setForceLoading] = useState(true);
  const [emojiData, setEmojiData] = useState({});
  const [fruitEmojis, setFruitEmojis] = useState(['🪙', '🪽']);
  const [activeButton, setActiveButton] = useState("up");
  const [isInvincible, setIsInvincible] = useState(false);
  const [invincibleTimer, setInvincibleTimer] = useState(0);

  const getClosestYPosition = (gapY) => {
    return yPositions.reduce((prev, curr) =>
      Math.abs(curr - gapY) < Math.abs(prev - gapY) ? curr : prev
    );
  };

  const getFlappyObstaclePair = () => {
    const gap = 250;
    const topHeight = 150 + Math.random() * 150;
    const x = window.innerWidth + 100;
    const gapY = topHeight + gap / 2;
    const emojiChar =
      fruitEmojis[Math.floor(Math.random() * fruitEmojis.length)];
    return {
      obstacles: [
        {
          image: "/bird_images/moss_obstacle_2.png",
          x,
          y: 0,
          height: topHeight,
          width: 100,
        },
        {
          image: "/bird_images/moss_obstacle_2.png",
          x,
          y: topHeight + gap,
          height: window.innerHeight - (topHeight + gap),
          width: 100,
        },
      ],
      emoji: {
        emoji: emojiChar,
        x: x + 60,
        y: getClosestYPosition(gapY),
      },
    };
  };

  useEffect(() => {
    if (gameOver) {
      setLoading(true);
      setTimeout(() => {
        navigate("/bird-end", { state: { score, collectedEmojis } });
      }, 2000);
    }
  }, [gameOver, navigate, score, collectedEmojis]);

  useEffect(() => {
    const interval = setInterval(() => {
      const { obstacles: newObs, emoji: newEmoji } = getFlappyObstaclePair();
      setObstacles((prev) => [...prev, ...newObs]);
      if (Math.random() < 0.5) {
        setEmojiPositions((prev) => [...prev, newEmoji]);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [fruitEmojis]);

  useEffect(() => {
    const interval = setInterval(() => {
      setEmojiPositions((prev) =>
        prev
          .map((emoji) => {
            const newX = emoji.x - 6;
            const isCollided =
              Math.abs(characterX - newX) < 50 && characterY === emoji.y;

            if (isCollided) {
              if (emoji.emoji === "🪽") {
                setIsInvincible(true);
                setInvincibleTimer(15);
              } else {
                setScore((prev) => prev + 5);
                setCollectedEmojis((prev) => [
                  ...new Set([...prev, emoji.emoji]),
                ]);
              }
              return null;
            }

            return newX > 0 ? { ...emoji, x: newX } : null;
          })
          .filter(Boolean)
      );
      setObstacles((prev) => prev.map((obs) => ({ ...obs, x: obs.x - 6 })));
    }, 100);
    return () => clearInterval(interval);
  }, [characterX, characterY]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") {
        setCharacterX((prev) => Math.min(prev + 80, window.innerWidth - 100));
      } else if (event.key === "ArrowLeft") {
        setCharacterX((prev) => Math.max(prev - 80, 0));
      } else if (event.key === "ArrowUp") {
        setCharacterY(
          (prev) => yPositions[Math.max(0, yPositions.indexOf(prev) - 1)]
        );
      } else if (event.key === "ArrowDown") {
        setCharacterY(
          (prev) =>
            yPositions[
              Math.min(yPositions.indexOf(prev) + 1, yPositions.length - 1)
            ]
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const characterBox = {
      left: characterX,
      right: characterX + 40,
      top: characterY,
      bottom: characterY + 60,
    };
    for (const obs of obstacles) {
      const obsBox = {
        left: obs.x,
        right: obs.x + obs.width,
        top: obs.y,
        bottom: obs.y + obs.height,
      };
      const collided =
        characterBox.right > obsBox.left &&
        characterBox.left < obsBox.right &&
        characterBox.bottom > obsBox.top &&
        characterBox.top < obsBox.bottom;

      if (collided) {
        if (!isInvincible) {
          setGameOver(true);
        }
        break;
      }
    }
  }, [characterX, characterY, obstacles, isInvincible]);

  useEffect(() => {
    if (isInvincible) {
      const invTimer = setInterval(() => {
        setInvincibleTimer((prev) => {
          if (prev <= 1) {
            setIsInvincible(false);
            clearInterval(invTimer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(invTimer);
    }
  }, [isInvincible]);

  useEffect(() => {
    setTimeout(() => setForceLoading(false), 3000);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveButton((prev) => (prev === "up" ? "down" : "up"));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClick = () => {
      if (activeButton === "up") {
        setCharacterY(
          (prev) => yPositions[Math.max(0, yPositions.indexOf(prev) - 1)]
        );
      } else {
        setCharacterY(
          (prev) =>
            yPositions[
              Math.min(yPositions.indexOf(prev) + 1, yPositions.length - 1)
            ]
        );
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [activeButton]);

  if (loading || forceLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="birdgame-container">
      <div className="birdgame-area">
        <div
          className="birdcharacter"
          style={{
            left: characterX,
            top: characterY,
            border: isInvincible ? "3px solid gold" : "none",
            borderRadius: "10px",
            boxShadow: isInvincible ? "0 0 20px gold" : "none",
          }}
        >
          <SpriteAnimator
            sprite="/bird_images/BirdFly.png"
            width={706}
            height={576}
            frameCount={6}
            fps={10}
            scale={6.5}
          />
        </div>

        {emojiPositions.map((emoji, index) => (
          <div
            key={`emoji-${index}`}
            className="birdemoji"
            style={{ left: emoji.x, top: emoji.y, fontSize: "3rem" }}
          >
            {emoji.emoji}
          </div>
        ))}

        {obstacles.map((obs, index) => (
          <img
            key={`obs-${index}`}
            src={obs.image}
            className="birdobstacle"
            alt="obstacle"
            style={{
              left: obs.x,
              top: obs.y,
              width: obs.width,
              height: obs.height,
              position: "absolute",
              objectFit: "cover",
            }}
          />
        ))}
      </div>

      <div className="birdgame-info">
        <p>Score: {score}</p>
        {isInvincible && <p>Invincible: {invincibleTimer}s</p>}
      </div>

      <div className="birdgame-buttons">
        <button
          className={`circle-button ${activeButton === "up" ? "active" : ""}`}
        >
          <UpOutlined />
        </button>
        <button
          className={`circle-button ${activeButton === "down" ? "active" : ""}`}
        >
          <DownOutlined />
        </button>
      </div>
    </div>
  );
};

export default Game;
