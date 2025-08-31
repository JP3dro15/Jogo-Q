import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Stars } from '@react-three/drei';
import { Suspense } from 'react';
import Scene3D from "./Scene3D";
import Molecule3D from "./Molecule3D";
import { HolographicUI, HolographicPanel, HolographicButton, TypingText } from "./HolographicUI";
import { useSound } from "./SoundSystem";
import { questionDatabase, shuffleQuestions, type Question } from "./QuestionDatabase";

interface Enhanced3DQuizProps {
  onComplete: (score: number, total: number, timeBonus: number) => void;
}

const Enhanced3DQuiz = ({ onComplete }: Enhanced3DQuizProps) => {
  const [questions] = useState(() => shuffleQuestions(questionDatabase.slice(0, 8)));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [startTime] = useState(Date.now());
  const [isAnswered, setIsAnswered] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const { playCorrect, playWrong, playClick, playTransition, playMolecule } = useSound();

  const currentQuestion = questions[currentQuestionIndex];

  // Timer effect
  useEffect(() => {
    if (showResult || showExplanation) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, showResult, showExplanation]);

  const handleTimeUp = useCallback(() => {
    if (!isAnswered) {
      setSelectedAnswer(-1); // Indicates timeout
      setIsAnswered(true);
      setShowResult(true);
      playWrong();
      
      setTimeout(() => {
        nextQuestion();
      }, 3000);
    }
  }, [isAnswered, playWrong]);

  const handleAnswerSelect = async (answerIndex: number) => {
    if (isAnswered) return;
    
    playClick();
    setSelectedAnswer(answerIndex);
    setIsAnswered(true);
    
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    setShowResult(true);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      playCorrect();
    } else {
      playWrong();
    }

    // Show explanation
    setTimeout(() => {
      setShowExplanation(true);
    }, 1500);
    
    // Auto-advance after explanation
    setTimeout(() => {
      nextQuestion();
    }, 6000);
  };

  const nextQuestion = () => {
    playTransition();
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setShowExplanation(false);
      setIsAnswered(false);
      setTimeLeft(currentQuestion?.timeLimit || 60);
    } else {
      // Quiz complete
      const totalTime = (Date.now() - startTime) / 1000;
      const timeBonus = Math.max(0, Math.floor((questions.length * 60 - totalTime) / 10));
      onComplete(score, questions.length, timeBonus);
    }
  };

  const getAnswerVariant = (index: number) => {
    if (!showResult) return 'primary';
    if (index === currentQuestion.correctAnswer) return 'success';
    if (index === selectedAnswer && selectedAnswer !== currentQuestion.correctAnswer) return 'danger';
    return 'primary';
  };

  return (
    <HolographicUI className="min-h-screen relative">
      {/* 3D Background Scene */}
      <Scene3D stage="quiz">
        {/* 3D Molecules floating in the background */}
        <Suspense fallback={null}>
          {currentQuestion?.molecules.slice(0, 3).map((molecule, index) => (
            <Molecule3D
              key={`bg-${molecule}-${index}`}
              type={molecule as any}
              position={[
                (index - 1) * 8 + Math.sin(Date.now() * 0.001 + index) * 2,
                Math.cos(Date.now() * 0.0008 + index) * 3 + 2,
                -15 + index * 2
              ]}
              scale={0.5 + Math.sin(Date.now() * 0.001 + index) * 0.2}
              showLabel={false}
            />
          ))}
        </Suspense>
      </Scene3D>

      {/* UI Overlay */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header with progress and timer */}
        <motion.div 
          className="p-6 flex justify-between items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center space-x-4">
            <span className="font-orbitron text-primary text-xl">
              MISSÃO {currentQuestionIndex + 1}/{questions.length}
            </span>
            <div className="flex space-x-1">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index < currentQuestionIndex ? 'bg-primary terminal-glow' :
                    index === currentQuestionIndex ? 'bg-secondary lab-glow animate-pulse' :
                    'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <span className="font-space text-accent">
              PONTOS: {score}/{questions.length}
            </span>
            <div className={`font-mono text-xl ${timeLeft <= 10 ? 'text-destructive animate-pulse' : 'text-primary'}`}>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
          </div>
        </motion.div>

        {/* Main content area */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-4xl w-full">
            {/* Scenario Panel */}
            <motion.div
              key={`scenario-${currentQuestionIndex}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8"
            >
              <HolographicPanel 
                title={currentQuestion.scenario}
                variant="danger"
                className="text-center"
              >
                <TypingText 
                  text={currentQuestion.question}
                  speed={30}
                  className="text-lg text-foreground leading-relaxed"
                />
              </HolographicPanel>
            </motion.div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <AnimatePresence>
                {currentQuestion.options.map((option, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                  >
                    <HolographicButton
                      onClick={() => handleAnswerSelect(index)}
                      variant={getAnswerVariant(index)}
                      disabled={isAnswered}
                      className={`w-full p-6 text-left transition-all duration-300 ${
                        selectedAnswer === index ? 'scale-105' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="font-orbitron font-bold text-lg">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="flex-1">{option}</span>
                      </div>
                    </HolographicButton>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Result and Explanation */}
            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-6"
                >
                  <HolographicPanel 
                    title={selectedAnswer === currentQuestion.correctAnswer ? "PROTOCOLO EXECUTADO COM SUCESSO!" : "FALHA NO PROTOCOLO"}
                    variant={selectedAnswer === currentQuestion.correctAnswer ? "success" : "danger"}
                  >
                    <p className="text-foreground leading-relaxed">
                      {currentQuestion.explanation}
                    </p>
                    
                    {/* Show related molecules */}
                    <div className="mt-4 flex justify-center">
                      <div className="h-32">
                        <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
                          <ambientLight intensity={0.5} />
                          <pointLight position={[10, 10, 10]} />
                          <Suspense fallback={null}>
                            {currentQuestion.molecules.slice(0, 2).map((molecule, index) => (
                              <Molecule3D
                                key={molecule}
                                type={molecule as any}
                                position={[(index - 0.5) * 3, 0, 0]}
                                scale={0.8}
                                interactive={false}
                                showLabel={true}
                              />
                            ))}
                          </Suspense>
                          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={2} />
                        </Canvas>
                      </div>
                    </div>
                  </HolographicPanel>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Next button (appears after explanation) */}
            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center"
                >
                  <HolographicButton
                    onClick={nextQuestion}
                    variant="primary"
                    size="lg"
                  >
                    {currentQuestionIndex < questions.length - 1 ? 'PRÓXIMA MISSÃO' : 'FINALIZAR PROTOCOLO'}
                  </HolographicButton>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </HolographicUI>
  );
};

export default Enhanced3DQuiz;