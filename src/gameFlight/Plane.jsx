import React, { Component } from "react";
import { SpriteAnimator } from "react-sprite-animator";

class Plane extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animation: "fly",
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.shooting !== this.props.shooting && this.props.shooting) {
      this.setState({ animation: "shoot" });
      setTimeout(() => this.setState({ animation: "fly" }), 200);
    }

    if (this.props.isDead && this.state.animation !== "dead") {
      this.setState({ animation: "dead" });
    }
  }

  render() {
    const { x, y } = this.props.position;
    const { animation } = this.state;
    let sprite = "/plane_images/PlaneFly.png";

    if (animation === "shoot") {
      sprite = "/plane_images/PlaneShoot.png";
    } else if (animation === "dead") {
      sprite = "/plane_images/PlaneDead.png";
    }

    return (
      <div
        className="player-container"
        style={{ left: `${x}%`, top: `${y}%`, position: "absolute" }}
      >
        <SpriteAnimator
          sprite={sprite}
          width={443}
          height={302}
          frameCount={6}
          fps={10}
          scale={2}
        />
      </div>
    );
  }
}

export default Plane;
