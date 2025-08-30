import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import EnhancedCutscene from "./EnhancedCutscene";
import EnhancedQuiz from "./EnhancedQuiz";
import EnhancedEnding from "./EnhancedEnding";
import EnhancedParticleSystem from "./EnhancedParticleSystem";
import ScanLines from "./ScanLines";
import AudioVisualizer from "./AudioVisualizer";

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
    <div className="min-h-screen relative overflow-hidden">
      <EnhancedParticleSystem />
      <ScanLines />
      
      {/* Audio Visualizer */}
      <div className="fixed bottom-4 left-4 z-50">
        <AudioVisualizer 
          isActive={true}
          intensity={gameState === "quiz" ? "high" : "medium"}
        />
      </div>
      
      <div className="relative z-10">
        {gameState === "cutscene" && (
          <EnhancedCutscene onComplete={handleCutsceneComplete} />
        )}
        
        {gameState === "quiz" && (
          <EnhancedQuiz onComplete={handleQuizComplete} />
        )}
        
        {gameState === "ending" && (
          <EnhancedEnding 
            score={stats.score}
            total={stats.total}
            timeBonus={stats.timeBonus}
            onRestart={handleRestart}
          />
        )}
      </div>
    </div>
  );
};

export default ChemistryQuest;