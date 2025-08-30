import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Character from "./Character";
import ParticleSystem from "./ParticleSystem";

interface CutsceneProps {
  onComplete: () => void;
}

const storySequence = [
  {
    text: "ANO 2087 - PROJETO PHOENIX",
    subtitle: "Depois da Grande Guerra Química...",
    duration: 4000
  },
  {
    text: "97% da humanidade foi eliminada",
    subtitle: "Armas bioquímicas devastaram o planeta",
    duration: 4000
  },
  {
    text: "Você é Dr. Morgan Chen",
    subtitle: "Último químico do Bunker 7",
    duration: 4000
  },
  {
    text: "Seus conhecimentos são a última esperança",
    subtitle: "Use a QUÍMICA para reconstruir o mundo",
    duration: 4000
  },
  {
    text: "MISSÃO: PROTOCOLO DE SOBREVIVÊNCIA",
    subtitle: "Cada decisão pode salvar ou condenar vidas...",
    duration: 5000
  }
];

const EnhancedCutscene = ({ onComplete }: CutsceneProps) => {
  const [currentSequence, setCurrentSequence] = useState(0);
  const [showText, setShowText] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const frameInterval = setInterval(() => {
      setFrame(f => f + 1);
    }, 50);

    // Show skip button after 3 seconds
    const skipTimer = setTimeout(() => {
      setShowSkip(true);
    }, 3000);

    return () => {
      clearInterval(frameInterval);
      clearTimeout(skipTimer);
    };
  }, []);

  useEffect(() => {
    // Reset text animation for each sequence
    setShowText(false);
    const textTimer = setTimeout(() => setShowText(true), 500);
    
    // Auto-advance to next sequence
    const sequenceTimer = setTimeout(() => {
      if (currentSequence < storySequence.length - 1) {
        setCurrentSequence(prev => prev + 1);
      } else {
        // End cutscene
        setTimeout(onComplete, 1000);
      }
    }, storySequence[currentSequence].duration);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(sequenceTimer);
    };
  }, [currentSequence, onComplete]);

  const currentStory = storySequence[currentSequence];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ParticleSystem />
      
      {/* Dynamic background based on sequence */}
      <div className={`
        absolute inset-0 transition-all duration-2000
        ${currentSequence === 0 ? 'bg-gradient-to-b from-orange-900/40 to-red-900/60' : ''}
        ${currentSequence === 1 ? 'bg-gradient-to-b from-red-900/60 to-gray-900/80' : ''}
        ${currentSequence === 2 ? 'bg-gradient-to-b from-blue-900/40 to-cyan-900/60' : ''}
        ${currentSequence >= 3 ? 'bg-gradient-to-b from-green-900/40 to-emerald-900/60' : ''}
      `} />
      
      {/* Neural network background effect */}
      <div className="absolute inset-0 opacity-30">
        <div className="w-full h-full bg-gradient-to-r from-primary/10 via-transparent to-secondary/10 animate-pulse" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 text-center">
        {/* Character */}
        <div className="mb-12">
          <Character scale={2.5} frame={frame} className="character-animated" />
        </div>
        
        {/* Story Content */}
        <div className="max-w-4xl space-y-8">
          {/* Main Text */}
          <div className={`
            transition-all duration-1000 transform
            ${showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          `}>
            <h1 className="text-4xl md:text-6xl font-orbitron font-black text-primary mb-4 tracking-wider">
              {currentStory.text}
            </h1>
          </div>
          
          {/* Subtitle */}
          <div className={`
            transition-all duration-1000 delay-500 transform
            ${showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          `}>
            <p className="text-xl md:text-2xl font-rajdhani text-foreground/90 font-medium">
              {currentStory.subtitle}
            </p>
          </div>
          
          {/* Progress Indicator */}
          <div className="flex justify-center mt-12">
            <div className="flex space-x-2">
              {storySequence.map((_, index) => (
                <div
                  key={index}
                  className={`
                    w-3 h-3 rounded-full transition-all duration-500
                    ${index <= currentSequence ? 'bg-primary terminal-glow' : 'bg-muted'}
                  `}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Skip Button */}
        {showSkip && (
          <div className={`
            fixed bottom-8 right-8 transition-all duration-500
            ${showSkip ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}
          `}>
            <Button 
              onClick={onComplete}
              variant="outline"
              className="terminal-glow font-space bg-card/80 backdrop-blur-sm hover:bg-primary/20"
            >
              <span className="mr-2">⏩</span>
              Pular Introdução
            </Button>
          </div>
        )}
        
        {/* Click to continue hint */}
        {showText && currentSequence < storySequence.length - 1 && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="animate-pulse text-muted-foreground font-space text-sm">
              Aguarde ou clique para pular...
            </div>
          </div>
        )}
        
        {/* Audio visualization bars */}
        <div className="fixed bottom-4 left-4 flex items-end space-x-1">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-primary/60 rounded-full animate-pulse"
              style={{ 
                height: `${Math.random() * 20 + 10}px`,
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnhancedCutscene;