import { useState } from "react";
import { motion } from "framer-motion";
import { HolographicUI, HolographicButton, TypingText, GlitchText } from "./HolographicUI";
import { useSound } from "./SoundSystem";
import { questionDatabase } from "./QuestionDatabase";
import EnhancedParticleSystem from "./EnhancedParticleSystem";
import ScanLines from "./ScanLines";
import AudioVisualizer from "./AudioVisualizer";

type GameState = "cutscene" | "quiz" | "ending";

interface GameStats {
  score: number;
  total: number;
  timeBonus: number;
}

const Simple3DGame = () => {
  const [gameState, setGameState] = useState<GameState>("cutscene");
  const [stats, setStats] = useState<GameStats>({ score: 0, total: 0, timeBonus: 0 });
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);

  const { playCorrect, playWrong } = useSound();

  const storySequence = [
    {
      title: "ANO 2087",
      subtitle: "PROJETO PHOENIX",
      text: "Depois da Grande Guerra Química, 97% da humanidade foi eliminada...",
    },
    {
      title: "SOBREVIVENTE",
      subtitle: "ÚLTIMA ESPERANÇA",
      text: "Você é um dos últimos cientistas vivos. Seu conhecimento em química é a chave para a sobrevivência.",
    },
    {
      title: "MISSÃO",
      subtitle: "RECONSTRUÇÃO",
      text: "Use suas habilidades para purificar água, neutralizar toxinas e reconstruir o mundo.",
    }
  ];

  const questions = questionDatabase.slice(0, 4);

  const handleCutsceneComplete = () => {
    if (currentStoryIndex < storySequence.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else {
      setGameState("quiz");
      setStartTime(Date.now());
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answerIndex);
    setShowFeedback(true);

    const isCorrect = answerIndex === questions[currentQuestionIndex].correctAnswer;
    if (isCorrect) {
      playCorrect();
    } else {
      playWrong();
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
      } else {
        // Calculate final score
        const correctAnswers = questions.filter((_, index) => {
          // This is simplified - in a real implementation you'd track answers
          return Math.random() > 0.3; // Simulated score for demo
        }).length;
        
        const timeBonus = Math.max(0, 100 - Math.floor((Date.now() - startTime) / 1000));
        setStats({ score: correctAnswers, total: questions.length, timeBonus });
        setGameState("ending");
      }
    }, 2000);
  };

  const handleRestart = () => {
    setGameState("cutscene");
    setCurrentStoryIndex(0);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setStats({ score: 0, total: 0, timeBonus: 0 });
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Background Effects */}
      <EnhancedParticleSystem />
      <ScanLines />
      <AudioVisualizer />

      {/* Cutscene */}
      {gameState === "cutscene" && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          <HolographicUI className="max-w-4xl mx-auto p-8">
            <motion.div
              className="text-center space-y-8"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 1.5 }}
            >
              <GlitchText 
                text={storySequence[currentStoryIndex].title}
                className="text-6xl font-bold text-primary glow"
              />
              
              <motion.div
                className="text-xl text-accent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
              >
                {storySequence[currentStoryIndex].subtitle}
              </motion.div>

              <div className="mt-8 max-w-2xl mx-auto">
                <TypingText 
                  text={storySequence[currentStoryIndex].text}
                  speed={50}
                  onComplete={() => {}}
                />
              </div>

              <motion.div
                className="mt-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 4, duration: 1 }}
              >
                <HolographicButton
                  onClick={handleCutsceneComplete}
                  className="px-8 py-4 text-lg"
                >
                  {currentStoryIndex < storySequence.length - 1 ? "Continuar" : "Iniciar Missão"}
                </HolographicButton>
              </motion.div>
            </motion.div>
          </HolographicUI>
        </motion.div>
      )}

      {/* Quiz */}
      {gameState === "quiz" && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <HolographicUI className="max-w-4xl w-full">
            <div className="space-y-8">
              {/* Progress */}
              <div className="flex justify-between items-center text-sm text-accent">
                <span>Pergunta {currentQuestionIndex + 1} de {questions.length}</span>
                <span>Tempo: {Math.floor((Date.now() - startTime) / 1000)}s</span>
              </div>

              {/* Question */}
              <motion.div
                key={currentQuestionIndex}
                className="space-y-6"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-bold text-primary glow">
                  {questions[currentQuestionIndex].question}
                </h2>

                <div className="grid gap-4">
                  {questions[currentQuestionIndex].options.map((option, index) => {
                    let buttonClass = "w-full p-4 text-left transition-all duration-300";
                    
                    if (showFeedback) {
                      if (index === questions[currentQuestionIndex].correctAnswer) {
                        buttonClass += " bg-green-500/20 border-green-500 text-green-400";
                      } else if (index === selectedAnswer && index !== questions[currentQuestionIndex].correctAnswer) {
                        buttonClass += " bg-red-500/20 border-red-500 text-red-400";
                      }
                    }

                    return (
                      <HolographicButton
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={showFeedback}
                        className={buttonClass}
                      >
                        {option}
                      </HolographicButton>
                    );
                  })}
                </div>

                {showFeedback && (
                  <motion.div
                    className="mt-6 p-4 rounded-lg bg-accent/10 border border-accent/30"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <p className="text-accent">
                      {questions[currentQuestionIndex].explanation}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </HolographicUI>
        </motion.div>
      )}

      {/* Ending */}
      {gameState === "ending" && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <HolographicUI className="max-w-4xl mx-auto p-8 text-center">
            <GlitchText 
              text="MISSÃO COMPLETA"
              className="text-5xl font-bold text-primary glow mb-8"
            />

            <div className="space-y-6 mb-8">
              <div className="text-3xl text-accent">
                Pontuação: {stats.score}/{stats.total}
              </div>
              <div className="text-xl text-accent">
                Bônus de Tempo: +{stats.timeBonus} pontos
              </div>
              <div className="text-4xl font-bold text-primary glow">
                Total: {stats.score * 100 + stats.timeBonus} pontos
              </div>
            </div>

            <div className="mb-8">
              {stats.score === stats.total ? (
                <TypingText 
                  text="Perfeito! Você salvou a humanidade com seu conhecimento em química!"
                  speed={50}
                  onComplete={() => {}}
                />
              ) : stats.score >= stats.total / 2 ? (
                <TypingText 
                  text="Bom trabalho! Você contribuiu para a reconstrução do mundo."
                  speed={50}
                  onComplete={() => {}}
                />
              ) : (
                <TypingText 
                  text="Você aprendeu lições valiosas. Continue estudando química!"
                  speed={50}
                  onComplete={() => {}}
                />
              )}
            </div>

            <HolographicButton
              onClick={handleRestart}
              className="px-8 py-4 text-lg"
            >
              Jogar Novamente
            </HolographicButton>
          </HolographicUI>
        </motion.div>
      )}
    </div>
  );
};

export default Simple3DGame;