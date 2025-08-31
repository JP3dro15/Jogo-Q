import { useState } from "react";
import { motion } from "framer-motion";
import Enhanced3DCutscene from "./Enhanced3DCutscene";
import Enhanced3DQuiz from "./Enhanced3DQuiz";
import Enhanced3DEnding from "./Enhanced3DEnding";
import SoundSystem from "./SoundSystem";

type GameState = "cutscene" | "quiz" | "ending";

interface GameStats {
  score: number;
  total: number;
  timeBonus: number;
}

const ChemistryQuest = () => {
  const [gameState, setGameState] = useState<GameState>("cutscene");
  const [stats, setStats] = useState<GameStats>({ score: 0, total: 0, timeBonus: 0 });

  const handleCutsceneComplete = () => {
    setGameState("quiz");
  };

  const handleQuizComplete = (score: number, total: number, timeBonus: number) => {
    setStats({ score, total, timeBonus });
    setGameState("ending");
  };

  const handleRestart = () => {
    setStats({ score: 0, total: 0, timeBonus: 0 });
    setGameState("cutscene");
  };

  return (
    <motion.div 
      className="min-h-screen relative overflow-hidden bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Sound System */}
      <SoundSystem enabled={true} volume={0.3} />
      
      {/* Game States */}
      {gameState === "cutscene" && (
        <Enhanced3DCutscene onComplete={handleCutsceneComplete} />
      )}
      
      {gameState === "quiz" && (
        <Enhanced3DQuiz onComplete={handleQuizComplete} />
      )}
      
      {gameState === "ending" && (
        <Enhanced3DEnding 
          score={stats.score}
          total={stats.total}
          timeBonus={stats.timeBonus}
          onRestart={handleRestart}
        />
      )}
    </motion.div>
  );
};

export default ChemistryQuest;