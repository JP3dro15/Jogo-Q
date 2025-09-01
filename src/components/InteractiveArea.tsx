import { motion } from 'framer-motion';
import { Question } from './QuestionDatabase';

interface Position {
  x: number;
  y: number;
}

interface InteractiveAreaProps {
  id: string;
  position: Position;
  size: { width: number; height: number };
  question: Question;
  isActive: boolean;
  isCompleted: boolean;
  onTrigger: () => void;
  playerPosition: Position;
}

const InteractiveArea = ({
  id,
  position,
  size,
  question,
  isActive,
  isCompleted,
  onTrigger,
  playerPosition
}: InteractiveAreaProps) => {
  
  // Check if player is near the area
  const playerNear = Math.abs(playerPosition.x - (position.x + size.width / 2)) < 100 &&
                     Math.abs(playerPosition.y - (position.y + size.height / 2)) < 100;

  // Check if player is inside the area  
  const playerInside = playerPosition.x >= position.x && 
                      playerPosition.x <= position.x + size.width &&
                      playerPosition.y >= position.y && 
                      playerPosition.y <= position.y + size.height;

  if (playerInside && isActive && !isCompleted) {
    onTrigger();
  }

  const getAreaStyle = () => {
    if (isCompleted) {
      return "bg-green-500/20 border-green-400/60 shadow-green-400/30";
    } else if (isActive) {
      return "bg-primary/30 border-primary/80 shadow-primary/50";
    } else {
      return "bg-accent/10 border-accent/40 shadow-accent/20";
    }
  };

  const getMoleculeType = () => {
    const molecules = question.molecules || ['H2O'];
    return molecules[0] || 'H2O';
  };

  const renderMolecule = (moleculeType: string, index: number) => {
    const colors = {
      'H2O': '#4FC3F7',
      'CO2': '#66BB6A', 
      'NH3': '#AB47BC',
      'CH4': '#FFB74D',
      'NaCl': '#FF8A65',
      'O2': '#EF5350',
      'N2': '#5C6BC0'
    };

    const color = colors[moleculeType as keyof typeof colors] || '#4FC3F7';
    
    return (
      <motion.div
        key={index}
        className="absolute w-3 h-3 rounded-full"
        style={{ 
          backgroundColor: color,
          left: `${20 + (index * 15)}%`,
          top: `${30 + (index % 2) * 20}%`
        }}
        animate={{
          y: [0, -10, 0],
          opacity: [0.6, 1, 0.6]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: index * 0.3
        }}
      />
    );
  };

  return (
    <>
      {/* Area boundary */}
      <motion.div
        className={`absolute border-2 rounded-lg transition-all duration-300 ${getAreaStyle()}`}
        style={{
          left: position.x,
          top: position.y,
          width: size.width,
          height: size.height,
        }}
        animate={{
          scale: playerNear ? 1.05 : 1,
          boxShadow: playerNear ? `0 0 30px currentColor` : `0 0 15px currentColor`
        }}
      >
        {/* Floating molecules */}
        {question.molecules?.map((molecule, index) => 
          renderMolecule(molecule, index)
        )}

        {/* Area label */}
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-center">
          <motion.div 
            className="text-xs font-bold text-primary px-2 py-1 rounded bg-background/80 backdrop-blur-sm border border-primary/30"
            animate={{ opacity: playerNear ? 1 : 0.7 }}
          >
            {question.scenario.substring(0, 20)}...
          </motion.div>
        </div>

        {/* Status indicator */}
        <div className="absolute top-2 right-2">
          {isCompleted ? (
            <motion.div 
              className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              ✓
            </motion.div>
          ) : isActive ? (
            <motion.div 
              className="w-6 h-6 bg-primary rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          ) : (
            <div className="w-6 h-6 bg-accent/40 rounded-full" />
          )}
        </div>

        {/* Interaction prompt */}
        {playerNear && isActive && !isCompleted && (
          <motion.div
            className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-sm font-bold text-accent bg-background/90 px-3 py-1 rounded-full border border-accent/30 backdrop-blur-sm">
              Entre na área para investigar
            </div>
            <motion.div 
              className="text-xl"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              ⬇️
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </>
  );
};

export default InteractiveArea;