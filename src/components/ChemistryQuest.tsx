import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Cutscene from "./Cutscene";
import Quiz from "./Quiz";
import Character from "./Character";
import ParticleSystem from "./ParticleSystem";
import Molecule from "./Molecule";

type GameState = "cutscene" | "quiz" | "ending";

interface GameStats {
  score: number;
  total: number;
}

const ChemistryQuest = () => {
  const [gameState, setGameState] = useState<GameState>("cutscene");
  const [stats, setStats] = useState<GameStats>({ score: 0, total: 0 });
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(f => f + 1);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleCutsceneComplete = () => {
    setGameState("quiz");
  };

  const handleQuizComplete = (score: number, total: number) => {
    setStats({ score, total });
    setGameState("ending");
  };

  const handleRestart = () => {
    setStats({ score: 0, total: 0 });
    setGameState("cutscene");
  };

  const getEndingMessage = () => {
    const { score, total } = stats;
    if (score === total) {
      return "Parabéns! Você purificou a água e construiu um abrigo seguro.";
    } else if (score >= total / 2) {
      return "Você sobreviveu, mas os recursos continuam escassos. Continue aprendendo química!";
    } else {
      return "Você não conseguiu sobreviver totalmente, mas aprendeu lições valiosas sobre química.";
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ParticleSystem />
      
      <div className="relative z-10">
        {gameState === "cutscene" && (
          <Cutscene onComplete={handleCutsceneComplete} />
        )}
        
        {gameState === "quiz" && (
          <>
            <div className="fixed top-8 right-8 z-20">
              <Molecule type="H2O" className="molecular-spin" />
            </div>
            <Quiz onComplete={handleQuizComplete} />
          </>
        )}
        
        {gameState === "ending" && (
          <div className="min-h-screen flex items-center justify-center px-4">
            <Card className="p-8 terminal-glow bg-card/90 backdrop-blur-sm max-w-2xl">
              <div className="text-center space-y-6">
                <div className="flex justify-center mb-6">
                  <Character scale={1.5} frame={frame} />
                </div>
                
                <h2 className="text-2xl font-bold text-primary mb-4">
                  Missão Concluída
                </h2>
                
                <div className="text-lg space-y-2">
                  <p className="text-secondary">
                    Pontuação: {stats.score}/{stats.total}
                  </p>
                  <p className="text-foreground">
                    {getEndingMessage()}
                  </p>
                </div>
                
                <Button 
                  onClick={handleRestart}
                  className="terminal-glow gradient-terminal border border-primary"
                >
                  Jogar Novamente
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChemistryQuest;