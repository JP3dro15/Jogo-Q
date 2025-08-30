import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Clock, Zap, Shield, Beaker } from "lucide-react";
import Molecule from "./Molecule";

interface Question {
  id: number;
  q: string;
  opts: string[];
  ans: number;
  exp: string;
  difficulty: "easy" | "medium" | "hard";
  category: "water" | "gas" | "protection" | "reaction";
  timeLimit: number;
}

const enhancedQuestions: Question[] = [
  {
    id: 1,
    q: "EMERGÊNCIA! Reservatório contaminado por chumbo e mercúrio. Qual processo químico você deve usar IMEDIATAMENTE para tornar a água potável?",
    opts: ["Precipitação com sulfetos", "Simples filtração", "Fervura", "Adição de cloro"],
    ans: 0,
    exp: "Sulfetos precipitam metais pesados, removendo-os da solução. Processo essencial para descontaminação!",
    difficulty: "medium",
    category: "water",
    timeLimit: 45
  },
  {
    id: 2,
    q: "Você precisa sinalizar para uma equipe de resgate a 5km. Que reação produz CO2 mais rapidamente para criar um sinal visível?",
    opts: ["CaCO3 + HCl", "NaHCO3 + CH3COOH", "C + O2", "Mg + HCl"],
    ans: 1,
    exp: "Bicarbonato + vinagre reage instantaneamente liberando CO2. Reação segura e eficaz para sinalizações!",
    difficulty: "easy",
    category: "gas",
    timeLimit: 30
  },
  {
    id: 3,
    q: "ALERTA TÓXICO! Vazamento de cloro gasoso se aproxima. Qual substância em sua máscara neutraliza melhor gases halógenos?",
    opts: ["Algodão molhado", "Carvão ativado + KI", "Papel comum", "Tecido seco"],
    ans: 1,
    exp: "Carvão ativado adsorve gases, e iodeto de potássio neutraliza halógenos. Combinação perfeita para proteção!",
    difficulty: "hard",
    category: "protection",
    timeLimit: 20
  },
  {
    id: 4,
    q: "Derramamento de ácido sulfúrico no seu refúgio! Você tem cal (CaO). Qual a primeira ação para neutralizar com segurança?",
    opts: ["Jogar cal diretamente", "Diluir o ácido primeiro", "Misturar cal com água, depois adicionar lentamente", "Cobrir com terra"],
    ans: 2,
    exp: "NUNCA adicione água ao ácido! Prepare leite de cal (cal + água) e adicione lentamente ao ácido para neutralizar.",
    difficulty: "hard",
    category: "reaction",
    timeLimit: 25
  },
  {
    id: 5,
    q: "Você encontrou um laboratório abandonado. Precisa identificar se um líquido incolor é água ou peróxido de hidrogênio. Teste mais seguro?",
    opts: ["Provar uma gota", "Adicionar MnO2 e observar borbulhamento", "Cheirar", "Tocar com o dedo"],
    ans: 1,
    exp: "MnO2 catalisa decomposição de H2O2 em O2 + H2O, criando borbulhamento. Teste seguro e definitivo!",
    difficulty: "medium",
    category: "reaction",
    timeLimit: 35
  },
  {
    id: 6,
    q: "SITUAÇÃO CRÍTICA! Você precisa gerar oxigênio para respirar. Qual reação é mais prática com materiais disponíveis?",
    opts: ["2H2O2 → 2H2O + O2", "2KClO3 → 2KCl + 3O2", "Fotossíntese artificial", "Eletrólise da água"],
    ans: 0,
    exp: "Peróxido de hidrogênio decomposse facilmente com catalisadores simples (MnO2, sangue). Fonte prática de O2!",
    difficulty: "medium",
    category: "gas",
    timeLimit: 30
  },
  {
    id: 7,
    q: "Você precisa preservar alimentos sem refrigeração. Qual sal é mais eficaz para desidratação e conservação?",
    opts: ["NaCl comum", "CaCl2 (cloreto de cálcio)", "KNO3 (salitre)", "MgSO4 (sal amargo)"],
    ans: 1,
    exp: "CaCl2 é altamente higroscópico, remove umidade eficientemente e inibe crescimento bacteriano.",
    difficulty: "easy",
    category: "protection",
    timeLimit: 40
  },
  {
    id: 8,
    q: "EMERGÊNCIA MÉDICA! Alguém ingeriu soda cáustica (NaOH). Qual é o primeiro socorro químico correto?",
    opts: ["Induzir vômito", "Dar vinagre para neutralizar", "Dar leite ou clara de ovo", "Dar água gelada"],
    ans: 2,
    exp: "Proteínas (leite/clara) formam camada protetora. NUNCA neutralize bases ingeridas - pode gerar calor e piorar!",
    difficulty: "hard",
    category: "protection",
    timeLimit: 15
  }
];

const categoryIcons = {
  water: Beaker,
  gas: Zap,
  protection: Shield,
  reaction: Clock
};

const difficultyColors = {
  easy: "text-green-400",
  medium: "text-yellow-400", 
  hard: "text-red-400"
};

interface QuizProps {
  onComplete: (score: number, total: number, timeBonus: number) => void;
}

const EnhancedQuiz = ({ onComplete }: QuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeBonus, setTimeBonus] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Shuffle and select 6 random questions
    const shuffled = [...enhancedQuestions].sort(() => Math.random() - 0.5).slice(0, 6);
    
    // Shuffle each question's options
    const questionsWithShuffledOptions = shuffled.map(q => {
      const optionsWithIndex = q.opts.map((opt, idx) => ({ opt, originalIndex: idx }));
      const shuffledOptions = optionsWithIndex.sort(() => Math.random() - 0.5);
      
      return {
        ...q,
        opts: shuffledOptions.map(item => item.opt),
        ans: shuffledOptions.findIndex(item => item.originalIndex === q.ans)
      };
    });
    
    setShuffledQuestions(questionsWithShuffledOptions);
  }, []);

  useEffect(() => {
    if (shuffledQuestions.length > 0 && !showFeedback) {
      setTimeLeft(shuffledQuestions[currentQuestion].timeLimit);
      setIsTimerActive(true);
    }
  }, [currentQuestion, shuffledQuestions, showFeedback]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerActive && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isTimerActive && timeLeft === 0) {
      // Time's up!
      handleTimeUp();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, isTimerActive]);

  const handleTimeUp = () => {
    setIsTimerActive(false);
    toast({
      title: "⏰ Tempo Esgotado!",
      description: "Você perdeu tempo precioso de sobrevivência...",
      variant: "destructive",
      className: "danger-glow font-orbitron"
    });
    
    setTimeout(() => {
      nextQuestion();
    }, 2000);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showFeedback || !isTimerActive) return;
    
    setIsTimerActive(false);
    setSelectedAnswer(answerIndex);
    const question = shuffledQuestions[currentQuestion];
    const isCorrect = answerIndex === question.ans;
    
    if (isCorrect) {
      const timeScore = Math.max(0, timeLeft * 10); // 10 points per second remaining
      setScore(prev => prev + 100); // Base score
      setTimeBonus(prev => prev + timeScore);
      
      toast({
        title: "🧪 EXCELENTE!",
        description: `${question.exp} (+${100 + timeScore} pts)`,
        className: "terminal-glow font-orbitron border-primary"
      });
    } else {
      toast({
        title: "💀 FALHOU!",
        description: `${question.exp}`,
        variant: "destructive", 
        className: "danger-glow font-orbitron"
      });
    }
    
    setShowFeedback(true);
    setTimeout(() => nextQuestion(), 3500);
  };

  const nextQuestion = () => {
    if (currentQuestion < shuffledQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      onComplete(score, shuffledQuestions.length * 100, timeBonus);
    }
  };

  if (shuffledQuestions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="terminal-glow text-primary text-2xl font-orbitron animate-pulse">
          🧬 INICIALIZANDO PROTOCOLO DE SOBREVIVÊNCIA...
        </div>
      </div>
    );
  }

  const question = shuffledQuestions[currentQuestion];
  const CategoryIcon = categoryIcons[question.category];
  const progress = ((currentQuestion + (showFeedback ? 1 : 0)) / shuffledQuestions.length) * 100;
  const timeProgress = (timeLeft / question.timeLimit) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl space-y-6">
        {/* Header Stats */}
        <div className="flex justify-between items-center">
          <div className="holographic-glow bg-card/90 backdrop-blur-sm px-6 py-3 rounded-lg">
            <div className="flex items-center gap-4 text-sm font-space">
              <span className="text-primary">Questão {currentQuestion + 1}/{shuffledQuestions.length}</span>
              <CategoryIcon className="w-4 h-4 text-secondary" />
              <span className={`font-bold ${difficultyColors[question.difficulty]}`}>
                {question.difficulty.toUpperCase()}
              </span>
            </div>
          </div>
          
          <div className="holographic-glow bg-card/90 backdrop-blur-sm px-6 py-3 rounded-lg">
            <div className="flex items-center gap-4 text-sm font-space">
              <span className="text-foreground">Pontos: {score + timeBonus}</span>
              <Molecule type="CO2" size="sm" className="molecular-spin" />
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-3 terminal-glow" />
          <div className="text-xs text-center text-muted-foreground font-space">
            Progresso de Sobrevivência
          </div>
        </div>

        {/* Timer */}
        <div className="flex justify-center">
          <div className={`
            px-8 py-4 rounded-lg font-orbitron text-2xl font-bold
            ${timeLeft <= 5 ? 'danger-glow bg-destructive/20 text-destructive animate-pulse' : 'terminal-glow bg-primary/10 text-primary'}
          `}>
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6" />
              <span>{timeLeft}s</span>
            </div>
            <Progress 
              value={timeProgress} 
              className={`h-1 mt-2 ${timeLeft <= 5 ? 'bg-destructive/20' : 'bg-primary/20'}`}
            />
          </div>
        </div>

        {/* Question Card */}
        <Card className="terminal-glow bg-card/95 backdrop-blur-sm p-8">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-orbitron font-bold text-foreground leading-relaxed">
                {question.q}
              </h2>
            </div>
            
            <div className="grid gap-4">
              {question.opts.map((option, index) => {
                let cardClass = "question-card p-6 cursor-pointer transition-all duration-300";
                
                if (showFeedback) {
                  if (index === question.ans) {
                    cardClass += " correct";
                  } else if (selectedAnswer === index) {
                    cardClass += " incorrect";
                  }
                } else if (selectedAnswer === index) {
                  cardClass += " selected";
                }

                return (
                  <Card
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={cardClass}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`
                        w-12 h-12 rounded-full flex items-center justify-center font-orbitron font-bold text-lg
                        ${showFeedback && index === question.ans 
                          ? 'bg-primary text-primary-foreground' 
                          : showFeedback && selectedAnswer === index
                          ? 'bg-destructive text-destructive-foreground'
                          : 'bg-muted text-muted-foreground'
                        }
                      `}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="text-lg font-rajdhani font-medium flex-1">
                        {option}
                      </span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Floating Molecules */}
        <div className="fixed top-20 right-20 pointer-events-none">
          <Molecule type="H2O" className="molecular-spin opacity-60" />
        </div>
        <div className="fixed bottom-20 left-20 pointer-events-none">
          <Molecule type="NH3" size="lg" className="molecular-spin opacity-40" />
        </div>
      </div>
    </div>
  );
};

export default EnhancedQuiz;