import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Player from "./Player";
import Letter from "./Letter";
import "./Game.css";

// const walkingSound = new Audio("/walking-sound.mp3");
// const backgroundMusic = new Audio("/background-music.mp3");

const Game = () => {
  const [words, setData] = useState(["BANANA"]);
  const [wordIndex, setWordIndex] = useState(0);
  const [wordEmojis, setWordEmojis] = useState({});
  const [showEmoji, setShowEmoji] = useState(false);
  const [emoji, setEmoji] = useState(null);
  const [spriteImg, setSprite] = useState();

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch("/data.json");
      const data = await response.json();

      if (response.ok) {
        setBackgroundImage(data.selected_image);
        setData(data.words.map((item) => item.word));
        setSprite(data.selected_character);
        setWordEmojis(
          data.words.reduce((acc, item) => {
            acc[item.word] = item.emoji;
            return acc;
          }, {})
        );
      } else {
        console.error("Failed to fetch words:", data.error);
      }
    } catch (error) {
      console.error("Error fetching words:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const TOTAL_WORDS_TO_PLAY = words.length;

  const getShuffledPositions = (totalLetters) => {
    const minX = 1000;
    const maxX = 4500;
    const spacing = (maxX - minX) / totalLetters;

    const positions = Array.from({ length: totalLetters }, (_, index) => ({
      x: minX + index * spacing,
      y: 0,
    }));

    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }

    return positions;
  };

  const [currentWord, setCurrentWord] = useState(words[wordIndex]);
  const [backgroundImage, setBackgroundImage] = useState("");
  const [letters, setLetters] = useState([]);
  const [collectedStack, setCollectedStack] = useState([]);
  const [playerPosition, setPlayerPosition] = useState(800);
  const [gameOver, setGameOver] = useState(false);
  const [collidingLetter, setCollidingLetter] = useState(null);
  const [isAudioAllowed, setIsAudioAllowed] = useState(false);
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const navigate = useNavigate();
  const wordsCompletedRef = useRef(wordsCompleted);

  useEffect(() => {
    if (words.length > 0) {
      setCurrentWord(words[wordIndex]);
    }
  }, [words, wordIndex]);

  // useEffect(() => {
  //   const handleUserInteraction = () => {
  //     setIsAudioAllowed(true);
  //     backgroundMusic.loop = true;
  //     backgroundMusic.play();
  //   };

  //   window.addEventListener("click", handleUserInteraction);
  //   window.addEventListener("keydown", handleUserInteraction);
  //   return () => {
  //     window.removeEventListener("click", handleUserInteraction);
  //     window.removeEventListener("keydown", handleUserInteraction);
  //   };
  // }, []);

  useEffect(() => {
    const letterPositions = getShuffledPositions(currentWord.length);
    const newLetters = currentWord.split("").map((letter, index) => ({
      letter,
      position: letterPositions[index],
      settled: false,
    }));
    setLetters(newLetters);
  }, [currentWord]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLetters((prevLetters) =>
        prevLetters.map((letterObj) =>
          letterObj.settled
            ? letterObj
            : {
                ...letterObj,
                position: {
                  x: letterObj.position.x,
                  y: Math.min(letterObj.position.y + 10, 1400),
                },
              }
        )
      );
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    detectCollision();
  }, [playerPosition, letters]);

  const handleKeyPress = (event) => {
    if (event.key === "e") {
      collectLetter();
    } else if (event.key === "q") {
      releaseLetter();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [collectedStack, playerPosition, letters]);

  const collectLetter = () => {
    const foundLetterIndex = letters.findIndex(
      (letterObj) =>
        letterObj.position.y >= 1350 &&
        Math.abs(letterObj.position.x - playerPosition) < 50
    );

    if (foundLetterIndex !== -1) {
      const foundLetter = letters[foundLetterIndex];
      setCollectedStack((prevStack) => [...prevStack, foundLetter]);
      setLetters((prevLetters) =>
        prevLetters.filter((_, index) => index !== foundLetterIndex)
      );
    }
  };

  const releaseLetter = () => {
    if (collectedStack.length > 0) {
      const poppedLetter = collectedStack[collectedStack.length - 1];
      setCollectedStack((prevStack) => prevStack.slice(0, -1));
      const newPosition = { x: playerPosition, y: 1400 };

      setLetters((prevLetters) => [
        ...prevLetters,
        {
          ...poppedLetter,
          position: newPosition,
          settled: true,
        },
      ]);
    }
  };

  useEffect(() => {
    const wordFormed = collectedStack.map((l) => l.letter).join("");

    const collectedLetterCount = collectedStack.reduce((acc, { letter }) => {
      acc[letter] = (acc[letter] || 0) + 1;
      return acc;
    }, {});

    const targetLetterCount = currentWord.split("").reduce((acc, letter) => {
      acc[letter] = (acc[letter] || 0) + 1;
      return acc;
    }, {});

    const isCorrectCount = Object.keys(targetLetterCount).every(
      (letter) => collectedLetterCount[letter] === targetLetterCount[letter]
    );

    if (wordFormed.length === currentWord.length && isCorrectCount) {
      setEmoji(wordEmojis[currentWord] || "✅");
      setShowEmoji(true);

      setTimeout(() => {
        setShowEmoji(false);
        setEmoji(null);

        setWordsCompleted((prev) => {
          const updatedCount = prev + 1;
          wordsCompletedRef.current = updatedCount;
          return updatedCount;
        });

        if (wordsCompletedRef.current >= TOTAL_WORDS_TO_PLAY - 1) {
          navigate("/word-end");
        }

        setWordIndex((prevIndex) => prevIndex + 1);
        setCollectedStack([]);
      }, 5000);
    }
  }, [collectedStack, currentWord, wordEmojis]);

  const detectCollision = () => {
    const collidedLetter = letters.find(
      (letterObj) =>
        Math.abs(letterObj.position.x - playerPosition) < 50 &&
        letterObj.position.y >= 1350
    );

    if (collidedLetter) {
      setCollidingLetter(collidedLetter.letter);
      speakLetter(collidedLetter.letter);
    } else {
      setCollidingLetter(null);
      stopSpeaking();
    }
  };

  const speakLetter = (letter) => {
    if ("speechSynthesis" in window) {
      stopSpeaking();
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(letter);
        utterance.lang = "en-US";
        utterance.volume = 1;
        utterance.rate = 1;
        window.speechSynthesis.speak(utterance);
      }, 0);
    } else {
      console.warn("Speech synthesis not supported in this browser.");
    }
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  // useEffect(() => {
  //   if (playerPosition !== 800 && isAudioAllowed) {
  //     walkingSound.play();
  //   }
  // }, [playerPosition, isAudioAllowed]);

  const handleGlobalClick = () => {
    const keyDownEvent = new KeyboardEvent("keydown", { key: "e" });
    window.dispatchEvent(keyDownEvent);

    setTimeout(() => {
      const keyUpEvent = new KeyboardEvent("keyup", { key: "e" });
      window.dispatchEvent(keyUpEvent);
    }, 200);
  };

  window.addEventListener("click", handleGlobalClick);

  return (
    <div
      className="word-game-container"
      style={{
        backgroundImage: `url(/word_images/images/${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <h1 className="word-display">
        {currentWord.split("").map((letter, index) => {
          const letterIndexes = currentWord
            .split("")
            .map((l, i) => (l === letter ? i : -1))
            .filter((i) => i !== -1);

          const collectedCount = collectedStack.filter(
            (l) => l.letter === letter
          ).length;

          const shouldFill = collectedCount > letterIndexes.indexOf(index);

          const isFullyCorrect = collectedCount >= letterIndexes.length;

          return (
            <span
              key={index}
              className={`letter-slot ${shouldFill ? "filled" : ""} ${
                isFullyCorrect ? "correct" : ""
              }`}
            >
              {shouldFill ? letter : "_"}
            </span>
          );
        })}
      </h1>

      {showEmoji && <div className="emoji-display">{emoji}</div>}

      {collidingLetter && (
        <h2 className="collision-display">{collidingLetter}</h2>
      )}

      {letters.map((letterObj, index) => (
        <Letter
          key={index}
          letter={letterObj.letter}
          position={letterObj.position}
        />
      ))}

      <Player setPlayerPosition={setPlayerPosition} sprite={spriteImg} />

      {gameOver && (
        <h2 className="game-over">Word Completed! New Word Incoming...</h2>
      )}
    </div>
  );
};

export default Game;
