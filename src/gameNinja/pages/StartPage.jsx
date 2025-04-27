import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const StartPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleGlobalClick = () => {
      navigate("/ninja-instructions");
    };

    // Attach event listener
    window.addEventListener("click", handleGlobalClick);

    // Clean up event listener on unmount
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
      }}
    >
      {/* Dark Overlay for better visibility */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          zIndex: -1,
        }}
      ></div>

      {/* Game Title */}
      <h1
        style={{
          color: "white",
          fontSize: "4rem",
          textShadow: "3px 3px 10px rgba(255, 0, 0, 0.7)",
          zIndex: 2,
        }}
      >
        Maths Ninja
      </h1>

      {/* Start Button */}
      <button
        style={{
          padding: "15px 30px",
          fontSize: "1.8rem",
          fontWeight: "bold",
          color: "white",
          background: "linear-gradient(45deg, red, orange)",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          marginTop: "20px",
          transition: "transform 0.2s, box-shadow 0.3s",
          zIndex: 2,
          textShadow: "2px 2px 8px rgba(0, 0, 0, 0.8)",
          boxShadow: "0px 4px 10px rgba(255, 0, 0, 0.7)",
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = "scale(1.1)";
          e.target.style.boxShadow = "0px 6px 15px rgba(255, 140, 0, 0.8)";
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "scale(1)";
          e.target.style.boxShadow = "0px 4px 10px rgba(255, 0, 0, 0.7)";
        }}
      >
        Start Game ➜
      </button>
    </div>
  );
};

export default StartPage;
