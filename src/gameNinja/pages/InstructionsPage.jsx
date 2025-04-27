import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const InstructionsPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleGlobalClick = () => {
      navigate("/ninja-game");
    };

    window.addEventListener("click", handleGlobalClick);

    return () => {
      window.removeEventListener("click", handleGlobalClick);
    };
  }, [navigate]);

  return (
    <div
      style={{
        background: `url('/ninja_images/Ninja.jpg') no-repeat center center/cover`,
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        textAlign: "center",
      }}
    >
      {/* Dark Overlay for better readability */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
        }}
      ></div>

      {/* Heading */}
      <h2
        style={{
          color: "white",
          fontSize: "3rem",
          textShadow: "2px 2px 10px rgba(255, 215, 0, 0.8)",
          zIndex: 2,
        }}
      >
        🕹️ How to Play
      </h2>

      {/* Instructions */}
      <div style={{ zIndex: 2, color: "white", fontSize: "1.5rem" }}>
        <p>🧟 <b>Answer correctly:</b> Kill the zombie!</p>
        <p>💀 <b>Wrong answer:</b> You lose health!</p>
      </div>

      {/* Play Button */}
      <button
        style={{
          padding: "15px 30px",
          fontSize: "1.8rem",
          fontWeight: "bold",
          color: "white",
          background: "linear-gradient(45deg, blue, cyan)",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          marginTop: "20px",
          transition: "transform 0.2s, box-shadow 0.3s",
          zIndex: 2,
          textShadow: "2px 2px 8px rgba(0, 0, 0, 0.8)",
          boxShadow: "0px 4px 10px rgba(0, 0, 255, 0.7)",
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = "scale(1.1)";
          e.target.style.boxShadow = "0px 6px 15px rgba(0, 255, 255, 0.8)";
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "scale(1)";
          e.target.style.boxShadow = "0px 4px 10px rgba(0, 0, 255, 0.7)";
        }}
      >
        🎮 Play Game
      </button>
    </div>
  );
};

export default InstructionsPage;
