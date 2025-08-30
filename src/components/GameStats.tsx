import { Zap, Clock, Trophy } from "lucide-react";

interface GameStatsProps {
  score: number;
  total: number;
  timeBonus: number;
  currentQuestion: number;
  timeLeft: number;
}

const GameStats = ({ score, total, timeBonus, currentQuestion, timeLeft }: GameStatsProps) => {
  const percentage = Math.round((score / (total || 1)) * 100);
  
  return (
    <div className="fixed top-4 left-4 right-4 z-50">
      <div className="flex justify-between items-center">
        {/* Left Stats */}
        <div className="holographic-glow bg-card/95 backdrop-blur-sm px-4 py-2 rounded-lg">
          <div className="flex items-center gap-4 text-sm font-space">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-primary" />
              <span className="text-foreground font-bold">{score + timeBonus}</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-secondary" />
              <span className="text-secondary">{percentage}%</span>
            </div>
          </div>
        </div>
        
        {/* Right Timer */}
        <div className={`
          px-4 py-2 rounded-lg font-orbitron font-bold
          ${timeLeft <= 5 
            ? 'danger-glow bg-destructive/20 text-destructive animate-pulse' 
            : 'terminal-glow bg-primary/10 text-primary'
          }
        `}>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{timeLeft}s</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameStats;