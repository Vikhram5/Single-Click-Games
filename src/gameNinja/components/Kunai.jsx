import { useEffect, useState } from "react";

const Kunai = ({ startX, startY, onRemove }) => {
  const [position, setPosition] = useState({ x: startX, y: startY });
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    console.log(`🗡️ Kunai created at x=${startX}, y=${startY}`);

    const interval = setInterval(() => {
      setPosition((prev) => {
        const newX = prev.x + 10;
        console.log(`➡️ Kunai moving to x=${newX}`);

        if (newX > window.innerWidth) {
          console.log("❌ Kunai out of bounds, removing...");
          setIsVisible(false);
          clearInterval(interval);
          if (onRemove) onRemove();
        }

        return { ...prev, x: newX };
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <img
      src="/ninja_images/ninja_sprites/Kunai.png"
      alt="Kunai"
      style={{
        position: "absolute",
        left: position.x,
        bottom: position.y,
        width: 100,
        height: 30,
      }}
    />
  );
};

export default Kunai;
