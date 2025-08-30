import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Character from "./Character";

interface CutsceneProps {
  onComplete: () => void;
}

const messages = [
  "Ano 2087...",
  "O mundo foi devastado por guerras químicas...",
  "Você é um dos últimos sobreviventes.",
  "Use seu conhecimento de QUÍMICA para sobreviver!"
];

const Cutscene = ({ onComplete }: CutsceneProps) => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [showSkip, setShowSkip] = useState(false);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const frameInterval = setInterval(() => {
      setFrame(f => f + 1);
    }, 50);

    const timer = setTimeout(() => {
      setShowSkip(true);
    }, 2000);

    const messageTimer = setInterval(() => {
      setCurrentMessage(prev => {
        if (prev < messages.length - 1) {
          return prev + 1;
        } else {
          setTimeout(onComplete, 3000);
          return prev;
        }
      });
    }, 3000);

    return () => {
      clearInterval(frameInterval);
      clearTimeout(timer);
      clearInterval(messageTimer);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="gradient-danger absolute inset-0 opacity-20 animate-pulse" />
      
      <div className="relative z-10 space-y-8 max-w-4xl">
        <div className="flex justify-center mb-8">
          <Character scale={2} frame={frame} />
        </div>
        
        <div className="h-20 flex items-center justify-center">
          <h1 className="text-3xl md:text-4xl font-bold text-primary typing-animation">
            {messages[currentMessage]}
          </h1>
        </div>
        
        {showSkip && (
          <Button 
            onClick={onComplete}
            variant="outline"
            className="terminal-glow mt-8"
          >
            Pular Introdução
          </Button>
        )}
      </div>
    </div>
  );
};

export default Cutscene;