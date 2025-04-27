import React, { useEffect, useState } from "react";
import { Card, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import "./Game.css";

const games = [
  {
    title: "Ninja Hunt",
    image: "/game_images/ninja.png",
    route: "/ninja-start",
  },
  {
    title: "Bird Thrust",
    image: "/game_images/bird.png",
    route: "/bird-start",
  },
  {
    title: "Word Collect",
    image: "/game_images/word.png",
    route: "/word-start",
  },
  {
    title: "Car Race",
    image: "/game_images/car.png",
    route: "/car-start",
  },
  {
    title: "Flight Shoot",
    image: "/game_images/plane.png",
    route: "/plane-start",
  },
];

const Games = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTraversalStarted, setTraversalStarted] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (isTraversalStarted) {
      interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % games.length);
      }, 5000);
    }

    const handleDoubleClick = () => {
      if (!isTraversalStarted) {
        setTraversalStarted(true);
      } else {
        navigateToGame();
      }
    };

    document.addEventListener("click", handleDoubleClick);

    return () => {
      clearInterval(interval);
      document.removeEventListener("click", handleDoubleClick);
    };
  }, [isTraversalStarted, activeIndex]);

  const navigateToGame = () => {
    if (!isTraversalStarted) return;
    setLoading(true);
    setTimeout(() => {
      navigate(games[activeIndex].route);
      setLoading(false);
    }, 3000);
  };

  if (isLoading) {
    return (
      <div className="start-loader-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="start-container">
      <Row gutter={[24, 24]} justify="center">
        {games.map((game, index) => (
          <Col
            key={index}
            xs={24}
            sm={12}
            md={8}
            lg={6}
            xl={5}
          >
            <Card
              hoverable
              className={`start-card ${activeIndex === index ? "start-active" : ""}`}
              onClick={() => navigateToGame()}
              cover={
                <img
                  alt={game.title}
                  src={game.image}
                  className="start-game-image"
                />
              }
            >
              <Card.Meta
                title={game.title}
                className="game-title" // Applying the updated class name for title
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Games;
