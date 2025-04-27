import React, { Component } from "react";
import { SpriteAnimator } from "react-sprite-animator";
import "./Player.css";

const MOVEMENT_SPEED = 5;
const LEFT_BOUNDARY = 50;
const RIGHT_BOUNDARY = 3800;

class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatarDirection: "right",
      position: { x: 50, y: 1200 },
    };
    this.movementInterval = null;
  }

  componentDidMount() {
    this.startAutoMovement();
    window.addEventListener("resize", this.handleResize);
  }

  componentWillUnmount() {
    clearInterval(this.movementInterval);
    window.removeEventListener("resize", this.handleResize);
  }

  startAutoMovement = () => {
    this.movementInterval = setInterval(() => {
      this.setState((prevState) => {
        let newX = prevState.position.x;
        let newDirection = prevState.avatarDirection;

        if (newDirection === "right") {
          newX += MOVEMENT_SPEED;
          if (newX >= RIGHT_BOUNDARY) {
            newDirection = "left";
          }
        } else {
          newX -= MOVEMENT_SPEED;
          if (newX <= LEFT_BOUNDARY) {
            newDirection = "right";
          }
        }

        this.props.setPlayerPosition(newX);

        return {
          avatarDirection: newDirection,
          position: { x: newX, y: prevState.position.y },
        };
      });
    }, 100);
  };

  handleResize = () => {
    this.setState((prevState) => {
      const newX = Math.min(
        prevState.position.x,
        window.innerWidth - RIGHT_BOUNDARY
      );
      this.props.setPlayerPosition(newX);
      return { position: { x: newX, y: prevState.position.y } };
    });
  };

  render() {
    const { x, y } = this.state.position;
    const spritePath = this.props.sprite || "spritesheet.png";
    const spriteConfig = {
      "spritesheet.png": { width: 414, height: 454, scale: 1, fps: 40 },
      "Ninja-Jump.png": { width: 524, height: 565, scale: 1, fps: 20 },
      "spritesheetcat.png": { width: 499, height: 348, scale: 1, fps: 10 },
    };
    const config = spriteConfig[spritePath];

    return (
      <div
        className={`word-player-container ${this.state.avatarDirection}`}
        style={{ left: `${x}px`, top: `${y}px` }}
      >
        <SpriteAnimator
          sprite={`/word_images/word_sprites/${spritePath}`}
          width={config.width}
          height={config.height}
          scale={config.scale}
          fps={config.fps}
          shouldAnimate={true}
          frameCount={20}
        />
      </div>
    );
  }
}

export default Player;
