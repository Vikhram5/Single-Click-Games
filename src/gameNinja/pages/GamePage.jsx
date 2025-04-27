import { useState, useEffect } from "react";
import NinjaCharacter from "../components/NinjaCharacter";
import Zombie from "../components/Zombie";
import { useNavigate } from "react-router-dom";
import "./styles.css";

const GamePage = () => {
  const [kunais, setKunais] = useState([]);
  const [ninjaHealth, setNinjaHealth] = useState(100);
  const [zombieHealth, setZombieHealth] = useState(5);
  const [zombiePosition, setZombiePosition] = useState({ x: 1200, y: 120 });
  const [targetPosition, setTargetPosition] = useState({ x: 400, y: 120 });
  const [isDead, setIsDead] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questionsData, setQuestionsData] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [displayedEmoji, setDisplayedEmoji] = useState("");
  const [showWinPopup, setShowWinPopup] = useState(false);
  const [score, setScore] = useState(0);


  const navigate = useNavigate();

  useEffect(() => {
    fetch("/ninja_images/ninja_questions.json")
      .then((response) => response.json())
      .then((data) => {
        setQuestionsData(data);
        if (data.length > 0) {
          setCurrentQuestion(data[0]);
        }
      })
      .catch((error) => console.error("Error fetching questions:", error));
  }, []);

  useEffect(() => {
    if (zombieHealth <= 0 && !isDead) {
      console.log("Zombie defeated! 🎉");

      setIsDead(true);
      setShowWinPopup(true);

      setTimeout(() => {
        setShowWinPopup(false);
        navigate("/ninja-end", { state: { score } });;
      }, 3000);
    }
  }, [zombieHealth, isDead, navigate]);

  useEffect(() => {
    if (questionsData.length > 0 && answeredCorrectly) {
      setCurrentQuestion(questionsData[questionIndex]);
      setAnsweredCorrectly(false);
    }
  }, [questionIndex, questionsData, answeredCorrectly]);

  useEffect(() => {
    const interval = setInterval(() => {
      setKunais((prevKunais) =>
        prevKunais
          .map((kunai) => ({
            ...kunai,
            x: kunai.x + 15 * kunai.direction,
          }))
          .filter((kunai) => kunai.x >= 0 && kunai.x < window.innerWidth)
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    kunais.forEach((kunai) => {
      const isColliding =
        kunai.x + 50 >= zombiePosition.x &&
        kunai.x <= zombiePosition.x + 100 &&
        Math.abs(kunai.y - zombiePosition.y) < 250;

      if (isColliding) {
        console.log("Kunai hit the zombie! 🏹💥");
        setZombieHealth((prevHealth) => Math.max(prevHealth - 1, 0));
        setKunais((prevKunais) => prevKunais.filter((k) => k.id !== kunai.id));
      }
    });
  }, [kunais, zombiePosition]);

  useEffect(() => {
    if (zombieHealth <= 0 && !isDead) {
      console.log("Zombie defeated! 🎉");

      setIsDead(true);

      setTimeout(() => {
        setZombiePosition({ x: -1000, y: 200 });
        setIsDead(false);
        setZombieHealth(5);
      }, 3000);
    }
  }, [zombieHealth]);

  const addKunai = (kunai) => {
    setKunais((prev) => [...prev, kunai]);
  };

  const handleAnswerSelection = (selectedAnswer) => {
    if (selectedAnswer === currentQuestion.correctAnswer) {
      console.log("Correct Answer! Simulating 'K' key press!");
      setAnsweredCorrectly(true);
      setDisplayedEmoji(currentQuestion.emoji);
  
      // ✅ Increase score for correct answer
      setScore((prev) => prev + 10);
  
      setTimeout(() => setDisplayedEmoji(null), 10000);
  
      const event = new KeyboardEvent("keydown", { code: "KeyK" });
      window.dispatchEvent(event);
  
      if (questionIndex < questionsData.length - 1) {
        setQuestionIndex((prev) => prev + 1);
      } else {
        console.log("No more questions left!");
      }
    } else {
      console.log("Wrong Answer! Ninja loses health.");
      setNinjaHealth((prev) => Math.max(prev - 10, 0));
  
      // ❌ Optional: Deduct score on wrong answer
      setScore((prev) => Math.max(prev - 5, 0));
    }
  };
  
  useEffect(() => {
    if (ninjaHealth <= 0) {
      console.log("Ninja is dead! Navigating to end page...");
      navigate("/ninja-end", { state: { score } });
    }
  }, [ninjaHealth, navigate]);

  useEffect(() => {
    if (!currentQuestion) return;

    const highlightInterval = setInterval(() => {
      setHighlightedIndex((prevIndex) =>
        prevIndex === currentQuestion.options.length - 1 ? 0 : prevIndex + 1
      );
    }, 2000);

    return () => clearInterval(highlightInterval);
  }, [currentQuestion]);

  useEffect(() => {
    const handleGlobalClick = () => {
      if (currentQuestion) {
        handleAnswerSelection(currentQuestion.options[highlightedIndex]);
      }
    };

    document.addEventListener("click", handleGlobalClick);
    return () => document.removeEventListener("click", handleGlobalClick);
  }, [highlightedIndex, currentQuestion]);

  useEffect(() => {
    let direction = -1;
    const zombieMoveInterval = setInterval(() => {
      setZombiePosition((prev) => {
        let newX = prev.x + direction * 10;
        if (newX <= 400 || newX >= 1200) {
          direction *= -1;
        }
        return { ...prev, x: newX };
      });
    }, 500);

    return () => clearInterval(zombieMoveInterval);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        backgroundImage: "url('/ninja_images/NinjaTheme.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed", // <--- important for locking the background
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 10,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "20px",
          background: "rgba(0, 0, 0, 0.7)",
          padding: "10px 20px",
          borderRadius: "10px",
          color: "white",
        }}
      >
        <div>Ninja Health: {ninjaHealth} ❤️</div>
        <div>Zombie Health: {zombieHealth} 🧟</div>
        <div>Score: {score} 🏆</div>
      </div>

      <button
        onClick={() => navigate("/ninja-end", { state: { score } })}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          padding: "10px 20px",
          fontSize: "18px",
          cursor: "pointer",
        }}
      >
        End Game
      </button>

      {displayedEmoji ? (
        <div className="emoji-container">{displayedEmoji}</div>
      ) : (
        currentQuestion && (
          <div
            style={{
              position: "absolute",
              bottom: 400,
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(255, 255, 255, 0.9)",
              padding: "20px",
              borderRadius: "10px",
              textAlign: "center",
              width: "60%",
            }}
          >
            <h3 style={{ color: "black", fontSize: "35px" }}>
              {currentQuestion.question}
            </h3>
            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "10px",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelection(option)}
                  style={{
                    padding: "12px 20px",
                    background: highlightedIndex === index ? "red" : "white",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "5px",
                    fontSize: "25px",
                    transition: "background 0.3s",
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )
      )}

      <NinjaCharacter
        setNinjaHealth={setNinjaHealth}
        ninjaHealth={ninjaHealth}
        addKunai={addKunai}
      />
      {kunais.map((kunai) => (
        <img
          key={kunai.id}
          src="/ninja_images/ninja_sprites/Kunai.png"
          alt="Kunai"
          style={{
            position: "absolute",
            left: kunai.x,
            bottom: kunai.y,
            width: 100,
            height: 30,
          }}
        />
      ))}
      {(zombieHealth > 0 || isDead) && (
        <Zombie
          zombieHealth={zombieHealth}
          position={zombiePosition}
          isDead={isDead}
          targetPosition={targetPosition}
        />
      )}
    </div>
  );
};

export default GamePage;
