import React, { useEffect, useState } from "react";
import "./Obstacles.css";

const Obstacles = ({
  carPosition,
  onCollision,
  onMissedCoin,
  isGamePaused,
}) => {
  const [obstacles, setObstacles] = useState([]);

  const generateObstacle = () => {
    const lane = Math.floor(Math.random() * 3); // Random lane 0, 1, or 2 (left, center, right)
    setObstacles((prev) => [
      ...prev,
      {
        id: Date.now(),
        lane: lane,
        position: 0,
      },
    ]);
  };

  useEffect(() => {
    let interval;
    if (!isGamePaused) {
      interval = setInterval(generateObstacle, 7000);
    }

    return () => clearInterval(interval);
  }, [isGamePaused]);

  useEffect(() => {
    const moveObstacles = () => {
      if (!isGamePaused) {
        setObstacles((prev) =>
          prev
            .map((obstacle) => ({
              ...obstacle,
              position: obstacle.position + 5,
            }))
            .filter((obstacle) => {
              const carBottom = window.innerHeight - 150;
              const obstacleBottom = obstacle.position;

              if (
                obstacleBottom >= carBottom &&
                obstacle.lane === carPosition
              ) {
                onCollision();
                return false;
              }

              return obstacleBottom < window.innerHeight;
            })
        );
      }
    };

    const interval = setInterval(moveObstacles, 100);

    return () => clearInterval(interval);
  }, [carPosition, onCollision, onMissedCoin, isGamePaused]);

  return (
    <div>
      {obstacles.map((obstacle) => (
        <div
          key={obstacle.id}
          className={`obstacle ${
            obstacle.lane === 0
              ? "left"
              : obstacle.lane === 1
              ? "center"
              : "right"
          }`}
          style={{ top: `${obstacle.position}px` }}
        />
      ))}
    </div>
  );
};

export default Obstacles;
