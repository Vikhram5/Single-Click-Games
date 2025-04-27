import { useState, useEffect } from "react";
import { SpriteAnimator } from "react-sprite-animator";

const NinjaCharacter = ({ setNinjaHealth, ninjaHealth, addKunai }) => {
  const [action, setAction] = useState("idle");
  const [position, setPosition] = useState({ x: 50, y: 120 });
  const [isAttacking, setIsAttacking] = useState(false);
  const [facingRight, setFacingRight] = useState(true);

  const takeDamage = (damage) => {
    setNinjaHealth((prevHealth) => Math.max(prevHealth - damage, 0));
  };

  const handleKeyDown = (event) => {
    if (event.code === "ArrowRight") {
      setFacingRight(true);
      setPosition((prev) => ({
        ...prev,
        x: Math.min(prev.x + 15, window.innerWidth - 100),
      }));
      setAction("run");
    } else if (event.code === "ArrowLeft") {
      setFacingRight(false);
      setPosition((prev) => ({ ...prev, x: Math.max(prev.x - 15, 0) }));
      setAction("run");
    } else if (event.code === "Space" && !isAttacking) {
      setAction("attack");
      setIsAttacking(true);
      setTimeout(() => {
        setIsAttacking(false);
        setAction("idle");
      }, 500);
    } else if (event.code === "KeyK") {
      setAction("throw");
      addKunai({
        id: Date.now(),
        x: position.x + 50,
        y: position.y + 80,
        direction: facingRight ? 1 : -1,
      });
      setTimeout(() => setAction("idle"), 300);
    }
  };

  const handleKeyUp = (event) => {
    if (event.code === "ArrowRight" || event.code === "ArrowLeft") {
      setAction("idle");
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        left: position.x,
        bottom: position.y,
        transform: `scaleX(${facingRight ? 1 : -1})`,
        transformOrigin: "center",
      }}
    >
      {/* Ninja Health Display */}
      <div
        style={{
          position: "absolute",
          top: -30,
          left: "50%",
          transform: "translateX(-50%) scaleX(1)",
          background: "red",
          color: "white",
          padding: "5px 10px",
          borderRadius: "5px",
          fontSize: "14px",
        }}
      >
        ❤️ {ninjaHealth} HP
      </div>

      <SpriteAnimator
        sprite={`/ninja_images/ninja_sprites/${
          action === "run"
            ? "NinjaRun.png"
            : action === "attack"
            ? "NinjaAttack.png"
            : action === "throw"
            ? "NinjaThrow.png"
            : "NinjaIdle.png"
        }`}
        width={524}
        height={565}
        frameCount={6}
        fps={10}
        scale={2.5}
      />
    </div>
  );
};

export default NinjaCharacter;
