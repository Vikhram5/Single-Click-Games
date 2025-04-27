import { useEffect, useState } from "react";
import { SpriteAnimator } from "react-sprite-animator";

const Zombie = ({ zombieHealth, position, targetPosition, isDead }) => {
  const [zombiePosition, setZombiePosition] = useState(position);
  const [lastPosition, setLastPosition] = useState(position); // 🔥 Store last position before death
  const [showZombie, setShowZombie] = useState(true);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    if (!isDead) {
      const moveInterval = setInterval(() => {
        setZombiePosition((prev) => {
          const speed = 0.5;
          const dx = targetPosition.x - prev.x;
          const dy = targetPosition.y - prev.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 5) return prev;

          return {
            x: prev.x + (dx / distance) * speed,
            y: prev.y + (dy / distance) * speed,
          };
        });
      }, 50);

      return () => clearInterval(moveInterval);
    }
  }, [isDead, targetPosition]);

  useEffect(() => {
    if (isDead) {
      console.log("Zombie Died! Playing Death Animation...");
      setLastPosition(zombiePosition);

      setTimeout(() => {
        setAnimate(false);
        console.log("Hiding zombie after death animation...");
        setShowZombie(false);
      }, 2000);
    }
  }, [isDead]);

  if (!showZombie) {
    console.log("Zombie Removed from Render!");
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        left: isDead ? lastPosition.x : zombiePosition.x, // 🔥 Keep position after death
        bottom: isDead ? lastPosition.y : zombiePosition.y,
        transform: "scaleX(-1)",
        transition: "left 0.05s linear, bottom 0.05s linear",
      }}
    >
      {!isDead && (
        <div
          style={{
            position: "absolute",
            top: -30,
            left: "50%",
            transform: "translateX(-50%) scaleX(-1)",
            background: "red",
            color: "white",
            padding: "5px 10px",
            borderRadius: "5px",
            fontSize: "14px",
          }}
        >
          🧟 {zombieHealth} HP
        </div>
      )}

      {isDead ? (
        <SpriteAnimator
          key="dead"
          sprite="/ninja_images/ninja_sprites/Zombie-Dead2.png"
          width={629}
          height={519}
          frameCount={12}
          fps={6}
          scale={2.5}
          shouldAnimate={animate}
        />
      ) : (
        <SpriteAnimator
          key="alive"
          sprite="/ninja_images/ninja_sprites/ZombieIdle.png"
          width={430}
          height={519}
          frameCount={6}
          fps={10}
          scale={2.5}
        />
      )}
    </div>
  );
};

export default Zombie;
