import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Character from "./Character";
import Molecule from "./Molecule";
import { Trophy, Award, Zap, Clock } from "lucide-react";

interface EndingProps {
  score: number;
  total: number;
  timeBonus: number;
  onRestart: () => void;
}

const EnhancedEnding = ({ score, total, timeBonus, onRestart }: EndingProps) => {
  const [frame, setFrame] = useState(0);
  const [showStats, setShowStats] = useState(false);
  const [showRank, setShowRank] = useState(false);

  useEffect(() => {
    const frameInterval = setInterval(() => {
      setFrame(f => f + 1);
    }, 50);

    // Staggered animations
    setTimeout(() => setShowStats(true), 1000);
    setTimeout(() => setShowRank(true), 2000);

    return () => clearInterval(frameInterval);
  }, []);

  const percentage = Math.round((score / total) * 100);
  const finalScore = score + timeBonus;
  
  const getRank = () => {
    if (percentage >= 90) return { title: "QUÍMICO LENDÁRIO", color: "text-yellow-400", icon: Trophy };
    if (percentage >= 75) return { title: "ESPECIALISTA ELITE", color: "text-blue-400", icon: Award };
    if (percentage >= 60) return { title: "SOBREVIVENTE HÁBIL", color: "text-green-400", icon: Zap };
    if (percentage >= 40) return { title: "APRENDIZ CORAJOSO", color: "text-purple-400", icon: Clock };
    return { title: "NOVATO DETERMINADO", color: "text-orange-400", icon: Clock };
  };

  const getEndingStory = () => {
    if (percentage >= 90) {
      return {
        title: "VICTORIA ABSOLUTA!",
        story: "Seus conhecimentos salvaram não apenas você, mas estabeleceram as bases para reconstruir a civilização. Laboratórios seguros foram criados, água pura está disponível, e a humanidade tem uma segunda chance.",
        effect: "gradient-terminal"
      };
    }
    if (percentage >= 75) {
      return {
        title: "SUCESSO HEROICO!",
        story: "Você conseguiu purificar recursos essenciais e criar um ambiente seguro. Pequenas comunidades começam a se formar ao redor de seu refúgio, confiando em sua expertise química.",
        effect: "terminal-glow"
      };
    }
    if (percentage >= 50) {
      return {
        title: "SOBREVIVÊNCIA GARANTIDA",
        story: "Com conhecimento suficiente, você consegue se manter vivo e ajudar alguns outros sobreviventes. Os recursos são escassos, mas há esperança no horizonte.",
        effect: "lab-glow"
      };
    }
    return {
      title: "LIÇÕES APRENDIDAS",
      story: "Embora a sobrevivência tenha sido difícil, cada erro ensinou lições valiosas sobre química. Você está mais preparado para os desafios que virão.",
      effect: "danger-glow"
    };
  };

  const rank = getRank();
  const ending = getEndingStory();
  const RankIcon = rank.icon;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className={`absolute inset-0 opacity-20 ${ending.effect}`} />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      
      {/* Floating Molecules */}
      <div className="absolute top-20 left-20">
        <Molecule type="H2O" size="lg" className="molecular-spin opacity-30" />
      </div>
      <div className="absolute bottom-20 right-20">
        <Molecule type="CO2" size="lg" className="molecular-spin opacity-30" />
      </div>
      <div className="absolute top-1/2 right-10">
        <Molecule type="NH3" className="molecular-spin opacity-20" />
      </div>

      <Card className={`w-full max-w-4xl p-8 ${ending.effect} bg-card/95 backdrop-blur-sm relative z-10`}>
        <div className="text-center space-y-8">
          {/* Character */}
          <div className="flex justify-center">
            <Character scale={2} frame={frame} className="character-animated" />
          </div>
          
          {/* Rank Badge */}
          <div className={`
            transition-all duration-1000 transform
            ${showRank ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          `}>
            <div className="flex justify-center mb-4">
              <Badge className={`px-6 py-3 ${rank.color} bg-background/50 border-2 text-lg font-orbitron font-bold`}>
                <RankIcon className="w-5 h-5 mr-2" />
                {rank.title}
              </Badge>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-orbitron font-black text-primary mb-6">
            {ending.title}
          </h1>

          {/* Stats */}
          <div className={`
            transition-all duration-1000 delay-300 transform
            ${showStats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          `}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="terminal-glow bg-card/50 p-4 rounded-lg">
                <div className="text-2xl font-orbitron font-bold text-primary">
                  {score}
                </div>
                <div className="text-sm font-space text-muted-foreground">
                  Pontos Base
                </div>
              </div>
              
              <div className="lab-glow bg-card/50 p-4 rounded-lg">
                <div className="text-2xl font-orbitron font-bold text-secondary">
                  +{timeBonus}
                </div>
                <div className="text-sm font-space text-muted-foreground">
                  Bônus Tempo
                </div>
              </div>
              
              <div className="holographic-glow bg-card/50 p-4 rounded-lg">
                <div className="text-2xl font-orbitron font-bold text-foreground">
                  {finalScore}
                </div>
                <div className="text-sm font-space text-muted-foreground">
                  Total Final
                </div>
              </div>
            </div>
            
            <div className="text-center mb-6">
              <div className="text-6xl font-orbitron font-black text-primary mb-2">
                {percentage}%
              </div>
              <div className="text-lg font-rajdhani text-muted-foreground">
                Taxa de Sobrevivência
              </div>
            </div>
          </div>

          {/* Story */}
          <div className="max-w-3xl mx-auto mb-8">
            <p className="text-lg md:text-xl font-rajdhani leading-relaxed text-foreground">
              {ending.story}
            </p>
          </div>

          {/* Achievements */}
          {percentage >= 75 && (
            <div className="mb-6">
              <h3 className="text-xl font-orbitron text-primary mb-4">🏆 CONQUISTAS DESBLOQUEADAS</h3>
              <div className="flex justify-center gap-4 flex-wrap">
                {percentage >= 90 && (
                  <Badge className="terminal-glow bg-yellow-500/20 text-yellow-400 border-yellow-400">
                    🧬 Mestre da Química
                  </Badge>
                )}
                {timeBonus > 500 && (
                  <Badge className="lab-glow bg-blue-500/20 text-blue-400 border-blue-400">
                    ⚡ Reflexos Rápidos
                  </Badge>
                )}
                {percentage === 100 && (
                  <Badge className="holographic-glow bg-purple-500/20 text-purple-400 border-purple-400">
                    🎯 Perfeição Absoluta
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-4">
            <Button 
              onClick={onRestart}
              className="terminal-glow gradient-terminal border-2 border-primary px-8 py-3 text-lg font-orbitron font-bold"
            >
              🔄 NOVA MISSÃO
            </Button>
            
            <div className="text-sm font-space text-muted-foreground">
              "A química é a chave para a sobrevivência da humanidade"
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EnhancedEnding;