import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface Question {
  q: string;
  opts: string[];
  ans: number;
  exp: string;
}

const questions: Question[] = [
  {
    q: "Você encontrou um reservatório de água contaminada por metais pesados. Qual reação você precisa saber para purificá-la?",
    opts: ["Precipitação", "Combustão", "Oxidação de H2", "Neutralização"],
    ans: 0,
    exp: "Usa-se precipitação química para remover metais."
  },
  {
    q: "Você precisa fabricar um gás para sinalizar resgate. Qual composto gera CO2 rapidamente?",
    opts: ["NaHCO3+Ácido", "H2O", "NH3+HCl", "NaCl"],
    ans: 0,
    exp: "NaHCO3+Ácido libera CO2 rapidamente."
  },
  {
    q: "Uma área liberou gases tóxicos. Para proteger a si mesmo, qual molécula de máscara absorve melhor poluentes?",
    opts: ["H2O", "Carvão ativado", "CO2", "O2"],
    ans: 1,
    exp: "Carvão ativado adsorve gases tóxicos."
  },
  {
    q: "Para neutralizar um derramamento ácido, você precisa de um composto básico. Qual usar?",
    opts: ["NaOH", "HCl", "O2", "CH4"],
    ans: 0,
    exp: "Bases como NaOH neutralizam ácidos."
  }
];

interface QuizProps {
  onComplete: (score: number, total: number) => void;
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const Quiz = ({ onComplete }: QuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Shuffle questions and answers on component mount
    const shuffled = shuffleArray(questions).map(q => {
      const optionsWithIndex = q.opts.map((opt, idx) => ({ opt, originalIndex: idx }));
      const shuffledOptions = shuffleArray(optionsWithIndex);
      
      return {
        ...q,
        opts: shuffledOptions.map(item => item.opt),
        ans: shuffledOptions.findIndex(item => item.originalIndex === q.ans)
      };
    });
    setShuffledQuestions(shuffled);
  }, []);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === shuffledQuestions[currentQuestion].ans;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      toast({
        title: "Correto!",
        description: shuffledQuestions[currentQuestion].exp,
        className: "terminal-glow border-primary bg-card"
      });
    } else {
      toast({
        title: "Incorreto!",
        description: shuffledQuestions[currentQuestion].exp,
        variant: "destructive",
        className: "danger-glow"
      });
    }
    
    setShowFeedback(true);
    
    setTimeout(() => {
      if (currentQuestion < shuffledQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
      } else {
        onComplete(isCorrect ? score + 1 : score, shuffledQuestions.length);
      }
    }, 2000);
  };

  if (shuffledQuestions.length === 0) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="terminal-glow text-primary text-xl">Preparando questões...</div>
    </div>;
  }

  const question = shuffledQuestions[currentQuestion];

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-4xl p-8 terminal-glow bg-card/90 backdrop-blur-sm">
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-2">
              Questão {currentQuestion + 1} de {shuffledQuestions.length}
            </div>
            <div className="w-full bg-muted rounded-full h-2 mb-6">
              <div 
                className="gradient-terminal h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentQuestion) / shuffledQuestions.length) * 100}%` }}
              />
            </div>
          </div>
          
          <h2 className="text-xl md:text-2xl font-semibold text-foreground leading-relaxed">
            {question.q}
          </h2>
          
          <div className="grid gap-4">
            {question.opts.map((option, index) => (
              <Button
                key={index}
                onClick={() => !showFeedback && handleAnswerSelect(index)}
                disabled={showFeedback}
                variant="outline"
                className={`
                  p-6 text-left justify-start h-auto text-wrap
                  ${showFeedback && selectedAnswer === index 
                    ? selectedAnswer === question.ans 
                      ? 'border-primary bg-primary/10 terminal-glow' 
                      : 'border-destructive bg-destructive/10 danger-glow'
                    : showFeedback && index === question.ans
                    ? 'border-primary bg-primary/10 terminal-glow'
                    : 'hover:terminal-glow hover:border-primary/50'
                  }
                  transition-all duration-300
                `}
              >
                <span className="text-base">{option}</span>
              </Button>
            ))}
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            Pontuação atual: {score}/{currentQuestion + (showFeedback ? 1 : 0)}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Quiz;