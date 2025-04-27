import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Plane from "./Plane";
import "./Game.css";

const enemyImages = [
  "MonsterFlying1.gif",
  "MonsterFlying3.gif",
  "MonsterFlying4.gif",
];

const Enemy = ({ position }) => {
  return (
    <img
      src={`/plane_images/${position.image}`}
      alt="Enemy"
      className="enemy"
      style={{
        position: "absolute",
        left: `${position.x}%`,
        top: `${position.y}%`,
        width: "250px",
        height: "150px",
        transform: "scaleX(-1)",
      }}
    />
  );
};

const Game = () => {
  const [planeX, setPlaneX] = useState(10);
  const [planeY, setPlaneY] = useState(50);
  const [bullets, setBullets] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [bgPositionX, setBgPositionX] = useState(0);

  const navigate = useNavigate();
  const gameRef = useRef(null);
  const planePositionsY = [50, 30, 50, 70, 50];
  const [planeIndex, setPlaneIndex] = useState(0);

  const handleClick = () => {
    setPlaneIndex((prev) => (prev + 1) % planePositionsY.length);
    setPlaneY(planePositionsY[(planeIndex + 1) % planePositionsY.length]);
  };

  useEffect(() => {
    const shootInterval = setInterval(() => {
      setBullets((prev) => [
        ...prev,
        {
          x: planeX + 5,
          y: planeY + 8,
          id: Date.now(),
        },
      ]);
    }, 1000);
    return () => clearInterval(shootInterval);
  }, [planeY]);

  useEffect(() => {
    const spawnEnemy = () => {
      const randomY =
        planePositionsY[Math.floor(Math.random() * planePositionsY.length)];
      const randomImage =
        enemyImages[Math.floor(Math.random() * enemyImages.length)];

      setEnemies((prev) => [
        ...prev,
        { x: 100, y: randomY, id: Date.now(), image: randomImage },
      ]);
    };

    const interval = setInterval(spawnEnemy, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const bulletInterval = setInterval(() => {
      setBullets((prev) =>
        prev.map((b) => ({ ...b, x: b.x + 2 })).filter((b) => b.x <= 100)
      );
    }, 50);
    return () => clearInterval(bulletInterval);
  }, []);

  useEffect(() => {
    const enemyInterval = setInterval(() => {
      setEnemies((prev) =>
        prev.map((e) => ({ ...e, x: e.x - 1 })).filter((e) => e.x >= 0)
      );
    }, 100);
    return () => clearInterval(enemyInterval);
  }, []);

  useEffect(() => {
    setEnemies((prevEnemies) =>
      prevEnemies.filter((enemy) => {
        const hit = bullets.some((bullet) => {
          const bulletLeft = bullet.x;
          const bulletTop = bullet.y;
          const bulletRight = bullet.x + 2;
          const bulletBottom = bullet.y + 1;

          const enemyLeft = enemy.x;
          const enemyTop = enemy.y;
          const enemyRight = enemy.x + 10;
          const enemyBottom = enemy.y + 15;

          return (
            bulletRight > enemyLeft &&
            bulletLeft < enemyRight &&
            bulletBottom > enemyTop &&
            bulletTop < enemyBottom
          );
        });

        if (hit) setScore((prev) => prev + 1);
        return !hit;
      })
    );
  }, [bullets]);

  useEffect(() => {
    enemies.forEach((enemy) => {
      if (Math.abs(enemy.x - planeX) < 5 && Math.abs(enemy.y - planeY) < 10) {
        setGameOver(true);
        setTimeout(() => {
          navigate("/plane-end", {
            state: {
              finalScore: score,
              game: "plane",
            },
          });
        }, 2000);
      }
    });
  }, [enemies, planeX, planeY, navigate, score]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgPositionX((prev) => (prev - 0.3) % 100);
    }, 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={gameRef}
      className="flightgame"
      style={{
        backgroundPositionX: `${bgPositionX}%`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
      onClick={handleClick}
    >
      <Plane position={{ x: planeX, y: planeY }} />

      {bullets.map((bullet) => (
        <div
          key={bullet.id}
          className="bullet"
          style={{
            position: "absolute",
            left: `${bullet.x}%`,
            top: `${bullet.y}%`,
            width: "10px",
            height: "4px",
            backgroundColor: "yellow",
            borderRadius: "2px",
          }}
        />
      ))}

      {enemies.map((enemy) => (
        <Enemy key={enemy.id} position={enemy} />
      ))}

      <div className="score-plane">Score: {score}</div>
    </div>
  );
};

export default Game;
