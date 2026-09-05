import { useEffect, useState } from "react";
import Bubble from "@/components/Bubble";
import { emotionConfig } from "@/constants/emotionConfig";
import { spotifyPlaylists } from "@/constants/spotifyPlaylists";
import { motion } from "framer-motion";

type BubbleType = {
  id: number;
  emotion: string;
  x: number;
  y: number;
};

const emotions = Object.keys(emotionConfig);

const EmotionGame = () => {
  const [bubbles, setBubbles] = useState<BubbleType[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [inputTimer, setInputTimer] = useState(30);
  const [detectedEmotion, setDetectedEmotion] = useState("neutral");
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState<"win" | "lose" | null>(null);

  // ✅ Load emotion from localStorage
  useEffect(() => {
    const storedEmotion = localStorage.getItem("detectedEmotion");
    if (storedEmotion) setDetectedEmotion(storedEmotion);
  }, []);

  // ⏱ Timer Logic
  useEffect(() => {
    if (!gameStarted) return;

    if (timeLeft <= 0) {
      setGameStarted(false);
      setBubbles([]);
      setGameOver(score >= 50 ? "win" : "lose");
      return;
    }

    if (score >= 50) {
      setGameStarted(false);
      setBubbles([]);
      setGameOver("win");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, gameStarted, score]);

  // 🫧 Bubble Generator
  useEffect(() => {
    if (!gameStarted) return;

    const interval = setInterval(() => {
      setBubbles(prev => [
        ...prev,
        {
          id: Math.random(),
          emotion: emotions[Math.floor(Math.random() * emotions.length)],
          x: Math.random() * 90,
          y: Math.random() * 80,
        },
      ]);
    }, 300); // fast & intense

    return () => clearInterval(interval);
  }, [gameStarted]);

  const handleBubbleClick = (id: number, emotion: string) => {
    setScore(prev => {
      const newScore =
        emotion === detectedEmotion ? prev + 10 : prev - 5;
      return newScore < 0 ? 0 : newScore;
    });

    setBubbles(prev => prev.filter(b => b.id !== id));
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(inputTimer);
    setBubbles([]);
    setGameOver(null);
    setGameStarted(true);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden text-white
      bg-[radial-gradient(ellipse_at_top_left,_rgba(56,189,248,0.15),transparent_50%),radial-gradient(ellipse_at_bottom_right,_rgba(168,85,247,0.15),transparent_50%),linear-gradient(to_br,#020617,#020617,#020617)]">

      {/* START SCREEN */}
      {!gameStarted && !gameOver && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center space-y-6">
          <h2 className="text-4xl font-bold">

            Detected Emotion:{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent capitalize">
              {detectedEmotion}
            </span>
          </h2>
          {/* RULES */}
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 w-[360px] text-left space-y-2 text-sm">
                <h3 className="text-lg font-bold text-center mb-2">
                        Game Rules
                </h3>

                <ul className="list-disc list-inside space-y-1">
                    <li>
                    Guess the correct colour of your emotion
                    </li>
                    <li>
                    Click the bubble matching your emotion
                    </li>
                    <li>
                    Correct colour → <span className="text-green-400 font-bold">+10 points</span>
                    </li>
                    <li>
                    Wrong colour → <span className="text-red-400 font-bold">−5 points</span>
                    </li>
                    <li>
                    Game ends when the <span className="font-semibold">timer expires</span>
                    </li>
                    <li>
                    Reach <span className="text-yellow-300 font-bold">50 points</span> to win 
                    </li>
                </ul>
                </div>


          <input
            type="number"
            min={5}
            max={300}
            value={inputTimer}
            onChange={e => setInputTimer(Number(e.target.value))}
            className="px-4 py-2 rounded-md text-black w-32 text-center"
          />

          <button
            onClick={startGame}
            className="px-8 py-3 rounded-xl font-bold text-black
              bg-gradient-to-r from-cyan-400 to-purple-500
              hover:scale-105 transition-transform shadow-lg"
          >
            Start Game
          </button>
        </div>
      )}

      {/* BIG HUD */}
      {gameStarted && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40
          flex gap-12 text-3xl font-extrabold tracking-wide">
          <div className="drop-shadow-[0_0_12px_rgba(56,189,248,0.8)]">
            ⏱ {timeLeft}s
          </div>
          <div className="drop-shadow-[0_0_12px_rgba(168,85,247,0.8)]">
            ⭐ {score}
          </div>
        </div>
      )}

      {/* SPOTIFY */}
      {gameStarted && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 w-[720px]">
          <iframe
            src={`https://open.spotify.com/embed/playlist/${spotifyPlaylists[detectedEmotion]}`}
            width="100%"
            height="80"
            allow="encrypted-media"
          />
        </div>
      )}

      {/* BUBBLES */}
      {gameStarted &&
        bubbles.map(b => (
          <Bubble
            key={b.id}
            emotion={b.emotion}
            x={b.x}
            y={b.y}
            onClick={() => handleBubbleClick(b.id, b.emotion)}
          />
        ))}

      {/* GAME OVER SCREENS */}
      {gameOver && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute inset-0 z-50 flex flex-col items-center justify-center
            bg-black/70 backdrop-blur-md space-y-6"
        >
          {gameOver === "win" ? (
            <>
              <h1 className="text-5xl font-extrabold">🎉 CONGRATULATIONS ! YOU WON 🎉</h1>
              <p className="text-2xl">You reached 50 points!</p>
            </>
          ) : (
            <>
              <h1 className="text-5xl font-extrabold">😔 Oops!</h1>
              <p className="text-2xl">Better luck next time</p>
            </>
          )}

          <button
            onClick={startGame}
            className="px-8 py-3 rounded-xl font-bold text-black
              bg-gradient-to-r from-cyan-400 to-purple-500
              hover:scale-105 transition-transform shadow-lg"
          >
            Play Again
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default EmotionGame;
