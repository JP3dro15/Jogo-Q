import { motion } from 'framer-motion';
import { questionDatabase } from './QuestionDatabase';
import InteractiveArea from './InteractiveArea';

interface Position {
  x: number;
  y: number;
}

interface GameWorldProps {
  playerPosition: Position;
  completedQuestions: Set<string>;
  activeQuestionId: string | null;
  onQuestionTrigger: (questionId: string) => void;
}

const GameWorld = ({
  playerPosition,
  completedQuestions,
  activeQuestionId,
  onQuestionTrigger
}: GameWorldProps) => {

  // Define areas where questions appear
  const gameAreas = [
    {
      id: 'area-1',
      position: { x: 200, y: 150 },
      size: { width: 150, height: 100 },
      questionIndex: 0,
      environment: 'toxic-water'
    },
    {
      id: 'area-2', 
      position: { x: 600, y: 200 },
      size: { width: 120, height: 120 },
      questionIndex: 1,
      environment: 'gas-leak'
    },
    {
      id: 'area-3',
      position: { x: 300, y: 400 },
      size: { width: 140, height: 90 },
      questionIndex: 2,
      environment: 'acid-spill'
    },
    {
      id: 'area-4',
      position: { x: 700, y: 450 },
      size: { width: 130, height: 110 },
      questionIndex: 3,
      environment: 'contaminated-air'
    }
  ];

  const getEnvironmentElements = (type: string, position: Position, index: number) => {
    const elements = [];
    
    switch (type) {
      case 'toxic-water':
        // Toxic pools
        for (let i = 0; i < 3; i++) {
          elements.push(
            <motion.div
              key={`water-${index}-${i}`}
              className="absolute rounded-full bg-gradient-to-br from-green-400/30 to-green-600/50"
              style={{
                left: position.x - 50 + (i * 30),
                top: position.y + 50 + (i * 10),
                width: 20 + (i * 5),
                height: 15 + (i * 3)
              }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5
              }}
            />
          );
        }
        break;
        
      case 'gas-leak':
        // Gas clouds
        for (let i = 0; i < 4; i++) {
          elements.push(
            <motion.div
              key={`gas-${index}-${i}`}
              className="absolute rounded-full bg-gradient-to-br from-yellow-400/20 to-orange-500/30 blur-sm"
              style={{
                left: position.x - 30 + (i * 25),
                top: position.y - 20 + (i * 15),
                width: 30 + (i * 8),
                height: 25 + (i * 6)
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, Math.sin(i) * 10, 0],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.3
              }}
            />
          );
        }
        break;
        
      case 'acid-spill':
        // Acid puddles
        elements.push(
          <motion.div
            key={`acid-${index}`}
            className="absolute rounded-lg bg-gradient-to-br from-red-500/40 to-orange-600/50"
            style={{
              left: position.x - 20,
              top: position.y + 60,
              width: 80,
              height: 40
            }}
            animate={{
              opacity: [0.4, 0.7, 0.4]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
          />
        );
        break;
        
      case 'contaminated-air':
        // Floating particles
        for (let i = 0; i < 6; i++) {
          elements.push(
            <motion.div
              key={`particle-${index}-${i}`}
              className="absolute w-2 h-2 bg-purple-400/60 rounded-full"
              style={{
                left: position.x + (i * 20),
                top: position.y - 30 + (i % 3) * 20
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          );
        }
        break;
    }
    
    return elements;
  };

  const renderBackground = () => {
    const backgroundElements = [];
    
    // Destroyed buildings silhouettes
    const buildings = [
      { x: 100, y: 100, width: 60, height: 120 },
      { x: 800, y: 80, width: 80, height: 150 },
      { x: 500, y: 50, width: 40, height: 80 },
      { x: 900, y: 120, width: 50, height: 100 }
    ];
    
    buildings.forEach((building, index) => {
      backgroundElements.push(
        <motion.div
          key={`building-${index}`}
          className="absolute bg-gradient-to-t from-gray-700/40 to-gray-600/20 border-l border-gray-500/30"
          style={{
            left: building.x,
            top: building.y,
            width: building.width,
            height: building.height,
            clipPath: `polygon(0 100%, 0 ${30 + Math.random() * 40}%, ${50 + Math.random() * 50}% ${20 + Math.random() * 30}%, 100% ${40 + Math.random() * 30}%, 100% 100%)`
          }}
          animate={{
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: index * 2
          }}
        />
      );
    });
    
    // Debris scattered around
    for (let i = 0; i < 15; i++) {
      backgroundElements.push(
        <div
          key={`debris-${i}`}
          className="absolute bg-gray-600/30 rounded"
          style={{
            left: Math.random() * window.innerWidth,
            top: Math.random() * window.innerHeight,
            width: 10 + Math.random() * 20,
            height: 5 + Math.random() * 15,
            transform: `rotate(${Math.random() * 360}deg)`
          }}
        />
      );
    }
    
    return backgroundElements;
  };

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Background elements */}
      {renderBackground()}
      
      {/* Environmental effects for each area */}
      {gameAreas.map((area, index) => (
        <div key={`env-${area.id}`}>
          {getEnvironmentElements(area.environment, area.position, index)}
        </div>
      ))}
      
      {/* Interactive question areas */}
      {gameAreas.map((area) => {
        const question = questionDatabase[area.questionIndex];
        if (!question) return null;
        
        return (
          <InteractiveArea
            key={area.id}
            id={area.id}
            position={area.position}
            size={area.size}
            question={question}
            isActive={!completedQuestions.has(question.id)}
            isCompleted={completedQuestions.has(question.id)}
            onTrigger={() => onQuestionTrigger(question.id)}
            playerPosition={playerPosition}
          />
        );
      })}
      
      {/* World boundaries */}
      <div className="absolute inset-0 border-4 border-primary/30 pointer-events-none" />
      
      {/* Instructions overlay */}
      <motion.div
        className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm border border-primary/30 rounded-lg p-4 max-w-sm"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2 }}
      >
        <h3 className="text-lg font-bold text-primary mb-2">🎮 Controles</h3>
        <div className="text-sm text-accent space-y-1">
          <div><kbd className="bg-primary/20 px-1 rounded">WASD</kbd> ou <kbd className="bg-primary/20 px-1 rounded">↑↓←→</kbd> - Mover</div>
          <div>🎯 Explore as áreas marcadas</div>
          <div>🧪 Resolva os desafios químicos</div>
        </div>
      </motion.div>
    </div>
  );
};

export default GameWorld;