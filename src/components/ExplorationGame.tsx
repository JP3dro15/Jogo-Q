import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Player from "./Player";
import GameWorld from "./GameWorld";
import { HolographicUI, HolographicButton, TypingText, GlitchText } from "./HolographicUI";
import { useSound } from "./SoundSystem";
import { questionDatabase, Question } from "./QuestionDatabase";
import EnhancedParticleSystem from "./EnhancedParticleSystem";
import ScanLines from "./ScanLines";
import AudioVisualizer from "./AudioVisualizer";

interface Position {
  x: number;
  y: number;
}

type GameState = "intro" | "playing" | "question" | "ending";

const ExplorationGame = () => {
  const [gameState, setGameState] = useState<GameState>("intro");
  const [playerPosition, setPlayerPosition] = useState<Position>({ x: 100, y: 300 });
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [completedQuestions, setCompletedQuestions] = useState<Set<string>>(new Set());
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);

  const { playCorrect, playWrong, playTransition } = useSound();

  const totalQuestions = Math.min(4, questionDatabase.length);

  useEffect(() => {
    if (gameState === "playing" && startTime === 0) {
      setStartTime(Date.now());
    }
  }, [gameState, startTime]);

  const handleQuestionTrigger = (questionId: string) => {
    if (completedQuestions.has(questionId) || currentQuestion) return;
    
    const question = questionDatabase.find(q => q.id === questionId);
    if (!question) return;

    setCurrentQuestion(question);
    setGameState("question");
    playTransition();
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null || !currentQuestion) return;

    setSelectedAnswer(answerIndex);
    setShowFeedback(true);

    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      playCorrect();
    } else {
      playWrong();
    }

    setTimeout(() => {
      setCompletedQuestions(prev => new Set([...prev, currentQuestion.id]));
      setSelectedAnswer(null);
      setShowFeedback(false);
      setCurrentQuestion(null);
      setGameState("playing");

      // Check if all questions completed
      if (completedQuestions.size + 1 >= totalQuestions) {
        setTimeout(() => setGameState("ending"), 1000);
      }
    }, 3000);
  };

  const handleRestart = () => {
    setGameState("intro");
    setPlayerPosition({ x: 100, y: 300 });
    setCurrentQuestion(null);
    setCompletedQuestions(new Set());
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
    setStartTime(0);
  };

  const calculateTimeBonus = () => {
    if (startTime === 0) return 0;
    const timeElapsed = (Date.now() - startTime) / 1000;
    return Math.max(0, Math.floor(300 - timeElapsed)); // 5 minutes max time
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background Effects */}
      <EnhancedParticleSystem />
      <ScanLines />
      <AudioVisualizer />

      {/* Intro */}
      {gameState === "intro" && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <HolographicUI className="max-w-4xl mx-auto p-8 text-center">
            <GlitchText 
              text="QUÍMICA QUEST 2087"
              className="text-6xl font-bold text-primary glow mb-8"
            />
            
            <div className="space-y-6 mb-8">
              <TypingText 
                text="Ano 2087: A Grande Catástrofe Química devastou a Terra..."
                speed={50}
                onComplete={() => {}}
              />
              <TypingText 
                text="Você é Dr. Alex Chen, químico sobrevivente. Sua missão: neutralizar as zonas tóxicas e salvar a humanidade!"
                speed={40}
                onComplete={() => {}}
              />
              <TypingText 
                text="Use seus conhecimentos em química para purificar o ambiente, criar antídotos e restaurar a vida no planeta."
                speed={35}
                onComplete={() => {}}
              />
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 5 }}
            >
              <HolographicButton
                onClick={() => setGameState("playing")}
                className="px-8 py-4 text-xl"
              >
                Iniciar Exploração
              </HolographicButton>
            </motion.div>
          </HolographicUI>
        </motion.div>
      )}

      {/* Game World */}
      {gameState === "playing" && (
        <>
          <GameWorld
            playerPosition={playerPosition}
            completedQuestions={completedQuestions}
            activeQuestionId={currentQuestion?.id || null}
            onQuestionTrigger={handleQuestionTrigger}
            onPlayerMove={(keys) => {
              if ((window as any).setPlayerKeys) {
                (window as any).setPlayerKeys(keys);
              }
            }}
          />
          
          <Player
            position={playerPosition}
            onMove={setPlayerPosition}
          />

          {/* Game HUD */}
          <motion.div
            className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm border border-primary/30 rounded-lg p-4"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="text-center space-y-2">
              <div className="text-lg font-bold text-primary">
                {completedQuestions.size}/{totalQuestions}
              </div>
              <div className="text-sm text-accent">Áreas Exploradas</div>
              <div className="text-xs text-accent">
                Tempo: {Math.floor((Date.now() - startTime) / 1000)}s
              </div>
            </div>
          </motion.div>
        </>
      )}

      {/* Question Modal */}
      <AnimatePresence>
        {gameState === "question" && currentQuestion && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-4xl my-8"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <HolographicUI className="w-full">
                <div className="space-y-4">
                  {/* Scenario */}
                  <div className="text-center">
                    <motion.div
                      className="inline-block bg-primary/20 px-3 py-2 rounded-full border border-primary/40 mb-3"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <span className="text-xs md:text-sm font-bold text-primary">
                        {currentQuestion.scenario}
                      </span>
                    </motion.div>
                  </div>

                  {/* Question */}
                  <motion.h2
                    className="text-lg md:text-xl font-bold text-primary glow text-center px-2"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {currentQuestion.question}
                  </motion.h2>

                  {/* Options */}
                  <div className="grid gap-3 mt-4">
                    {currentQuestion.options.map((option, index) => {
                      let buttonClass = "w-full p-3 text-left transition-all duration-300 text-sm md:text-base";
                      
                      if (showFeedback) {
                        if (index === currentQuestion.correctAnswer) {
                          buttonClass += " bg-green-500/20 border-green-500 text-green-400";
                        } else if (index === selectedAnswer && index !== currentQuestion.correctAnswer) {
                          buttonClass += " bg-red-500/20 border-red-500 text-red-400";
                        }
                      }

                      return (
                        <motion.div
                          key={index}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                        >
                          <HolographicButton
                            onClick={() => handleAnswerSelect(index)}
                            disabled={showFeedback}
                            className={buttonClass}
                          >
                            <span className="font-semibold mr-2 text-primary">
                              {String.fromCharCode(65 + index)})
                            </span>
                            <span className="break-words">{option}</span>
                          </HolographicButton>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Feedback */}
                  <AnimatePresence>
                    {showFeedback && (
                      <motion.div
                        className="mt-4 p-4 rounded-lg bg-accent/10 border border-accent/30"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className="text-center mb-3">
                          {selectedAnswer === currentQuestion.correctAnswer ? (
                            <div className="text-green-400 text-xl font-bold">
                              ✅ Correto!
                            </div>
                          ) : (
                            <div className="text-red-400 text-xl font-bold">
                              ❌ Incorreto
                            </div>
                          )}
                        </div>
                        <p className="text-accent text-center text-sm md:text-base">
                          {currentQuestion.explanation}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </HolographicUI>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ending */}
      {gameState === "ending" && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <HolographicUI className="max-w-4xl mx-auto p-8 text-center">
            <GlitchText 
              text="EXPLORAÇÃO COMPLETA"
              className="text-5xl font-bold text-primary glow mb-8"
            />

            <div className="space-y-6 mb-8">
              <div className="text-3xl text-accent">
                Áreas Exploradas: {completedQuestions.size}/{totalQuestions}
              </div>
              <div className="text-3xl text-accent">
                Questões Corretas: {score}/{totalQuestions}
              </div>
              <div className="text-xl text-accent">
                Bônus de Tempo: +{calculateTimeBonus()} pontos
              </div>
              <div className="text-4xl font-bold text-primary glow">
                Pontuação Final: {(score * 100) + calculateTimeBonus()}
              </div>
            </div>

            <div className="mb-8">
              {score === totalQuestions ? (
                <TypingText 
                  text="Excelente! Você domina a química e salvou o mundo pós-apocalíptico!"
                  speed={50}
                  onComplete={() => {}}
                />
              ) : score >= totalQuestions / 2 ? (
                <TypingText 
                  text="Bom trabalho, explorador! Suas habilidades químicas estão se desenvolvendo."
                  speed={50}
                  onComplete={() => {}}
                />
              ) : (
                <TypingText 
                  text="Continue estudando química para ser um melhor sobrevivente!"
                  speed={50}
                  onComplete={() => {}}
                />
              )}
            </div>

            <HolographicButton
              onClick={handleRestart}
              className="px-8 py-4 text-lg"
            >
              Nova Exploração
            </HolographicButton>
          </HolographicUI>
        </motion.div>
      )}
    </div>
  );
};

export default ExplorationGame;