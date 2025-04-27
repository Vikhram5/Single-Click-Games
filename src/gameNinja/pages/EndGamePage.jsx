import { useRef,useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const EndGamePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { score, game = "ninja" } = location.state || {};

  const sentRef = useRef(false);

  // useEffect(() => {
  //   if (sentRef.current) return;
  //   sentRef.current = true;

  //   const sendScore = async () => {
  //     try {
  //       const response = await fetch("http://localhost:5000/api/gamescore", {
  //         method: "POST",
  //         credentials: "include",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           game_id: game,
  //           score,
  //           date: new Date().toISOString().split("T")[0],
  //         }),
  //       });

  //       const result = await response.json();
  //       console.log("✅ Score sent:", result);
  //     } catch (err) {
  //       console.error("❌ Error sending score:", err);
  //     }
  //   };

  //   sendScore();
  // }, [game, score]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: `url('/ninja_images/NinjaTower.jpg') no-repeat center center/cover`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          padding: "30px 50px",
          borderRadius: "15px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h1
          style={{
            color: "#fff",
            fontSize: "3rem",
            fontWeight: "bold",
            textShadow: "2px 2px 10px rgba(0,0,0,0.7)",
          }}
        >
          Game Over
        </h1>
        <p
          style={{
            color: "#fff",
            fontSize: "1.5rem",
            marginTop: "10px",
            textShadow: "1px 1px 5px rgba(0,0,0,0.6)",
          }}
        >
          Your Score in <strong>{game}</strong>: <strong>{score}</strong>
        </p>
      </div>

      <button
        onClick={() => navigate("/game")}
        style={{
          marginTop: "30px",
          padding: "15px 30px",
          fontSize: "1.5rem",
          fontWeight: "bold",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          background: "linear-gradient(45deg, #ff416c, #ff4b2b)",
          color: "white",
          transition: "0.3s ease-in-out",
          boxShadow: "0px 5px 15px rgba(255, 65, 108, 0.3)",
        }}
        onMouseOver={(e) => (e.target.style.transform = "scale(1.1)")}
        onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
      >
        🔄 Restart
      </button>
    </div>
  );
};

export default EndGamePage;
