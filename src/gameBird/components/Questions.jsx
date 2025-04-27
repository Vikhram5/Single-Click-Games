import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SpriteAnimator } from "react-sprite-animator";
import "./Questions.css";

const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

const Questions = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { collectedEmojis = [] } = location.state || {};

  const storedScore = parseInt(localStorage.getItem("quizScore"), 10) || 0;
  const [remainingEmojis, setRemainingEmojis] = useState(collectedEmojis);
  const [score, setScore] = useState(storedScore);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [shuffledEmojis, setShuffledEmojis] = useState([]);
  const [questions, setQuestions] = useState({});
  const [loading, setLoading] = useState(true);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [fairyState, setFairyState] = useState("asking");
  const [hasWelcomed, setHasWelcomed] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef(null);
  const clickedRef = useRef(false);

  const speak = (text) => {
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    const selectedVoice = availableVoices.find(
      (voice) =>
        voice.name ===
        "Microsoft Aria Online (Natural) - English (United States)"
    );
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.rate = 0.9;
    utterance.pitch = 1.2;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const speakQuestion = (questionData) => {
    if (!questionData || !questionData.question) return;
    setDisplayedText(questionData.question);
    setFairyState("asking");
    speak(questionData.question);
    setTimeout(() => setFairyState("flying"), 2000);
  };

  useEffect(() => {
    if (collectedEmojis.length > 0) {
      localStorage.setItem("quizScore", "0");
      setScore(0);
    }
  }, [collectedEmojis]);

  useEffect(() => {
    fetch("/bird_images/questions.json")
      .then((response) => response.json())
      .then((data) => {
        setQuestions(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setAvailableVoices(voices);
      } else {
        setTimeout(loadVoices, 100);
      }
    };

    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }

    loadVoices();
  }, []);

  useEffect(() => {
    const readyToWelcome =
      !loading &&
      remainingEmojis.length > 0 &&
      !hasWelcomed &&
      questions[remainingEmojis[0]];

    if (readyToWelcome) {
      setDisplayedText("Hi, welcome!");
      speak("Hi, welcome!");
      setHasWelcomed(true);

      setTimeout(() => {
        const firstEmoji = remainingEmojis[0];
        setDisplayedText(questions[firstEmoji]?.question || "");
        speakQuestion(questions[firstEmoji]);
      }, 3000);
    }
  }, [loading, remainingEmojis, hasWelcomed, availableVoices, questions]);

  useEffect(() => {
    if (!loading && remainingEmojis.length > 0 && hasWelcomed) {
      const shuffled = shuffleArray([...remainingEmojis]);
      setShuffledEmojis(shuffled);
      setActiveIndex(0);
      speakQuestion(questions[remainingEmojis[0]]);

      intervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % shuffled.length);
      }, 2000);
    }

    return () => clearInterval(intervalRef.current);
  }, [remainingEmojis, loading, questions, hasWelcomed]);

  useEffect(() => {
    if (!loading && remainingEmojis.length === 0 && hasWelcomed) {
      const message = "Thank you, see you again!";
      setDisplayedText(message);
      speak(message);
      setTimeout(() => {
        localStorage.setItem("quizScore", score);
        navigate("/bird-end", { state: { finalScore: score } });
      }, 3000);
    }
  }, [remainingEmojis, score, navigate, loading, availableVoices, hasWelcomed]);

  const handleSelectCurrent = () => {
    if (clickedRef.current) return;
    clickedRef.current = true;

    const emoji = shuffledEmojis[activeIndex];
    setSelectedEmoji(emoji);
    window.speechSynthesis.cancel();

    if (emoji === remainingEmojis[0]) {
      const newScore = score + 10;
      setScore(newScore);
      localStorage.setItem("quizScore", newScore);
      setShowAnswer(true);
      speak(`Correct! The answer is ${questions[remainingEmojis[0]]?.answer}`);
      setTimeout(() => {
        setRemainingEmojis((prev) => prev.slice(1));
        setShowAnswer(false);
        setSelectedEmoji(null);
        clickedRef.current = false;
      }, 5000);
    } else {
      speak("Wrong answer. Please try again.");
      setTimeout(() => {
        setSelectedEmoji(null);
        clickedRef.current = false;
      }, 5000);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div class="loading-spinner"></div>
      </div>
    );
  }

  if (remainingEmojis.length === 0 && !displayedText) return null;

  return (
    <div
      className="birdquestions-container"
      onClick={handleSelectCurrent}
      style={{ cursor: "pointer" }}
    >
      {/* Flying Bird */}
      <div className="right-bird">
        <SpriteAnimator
          sprite="/bird_images/BirdFly.png"
          width={706}
          height={576}
          frameCount={6}
          fps={10}
          scale={4.5}
        />
      </div>

      {/* Fairy */}
      <div className="left-fairy flipped">
        {fairyState === "asking" ? (
          <SpriteAnimator
            sprite="/bird_images/FairyAsk.png"
            width={944}
            height={499}
            frameCount={4}
            fps={6}
            scale={1.5}
            loop={true}
          />
        ) : (
          <SpriteAnimator
            sprite="/bird_images/FairyFly.png"
            width={526}
            height={491}
            frameCount={6}
            fps={10}
            scale={1.5}
            loop={true}
          />
        )}
      </div>

      {/* Question */}
      <div className="question-card enlarged-question">
        <h2>{displayedText}</h2>
        {showAnswer && (
          <p>
            Correct! <strong>Answer:</strong>{" "}
            {questions[remainingEmojis[0]]?.answer}
          </p>
        )}
      </div>

      {/* Emoji Options */}
      {remainingEmojis.length > 0 && (
        <div className="emoji-selection large-emojis">
          {shuffledEmojis.map((emoji, index) => (
            <button
              key={index}
              className={`emoji-button ${
                index === activeIndex ? "active" : ""
              } ${selectedEmoji === emoji ? "selected" : ""}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Questions;
