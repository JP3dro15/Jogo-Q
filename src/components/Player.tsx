import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

interface Position {
  x: number;
  y: number;
}

interface PlayerProps {
  position: Position;
  onMove: (position: Position) => void;
  size?: number;
}

const Player = ({ position, onMove, size = 40 }: PlayerProps) => {
  const [keys, setKeys] = useState<Set<string>>(new Set());
  const [direction, setDirection] = useState<'up' | 'down' | 'left' | 'right'>('down');
  const [isMoving, setIsMoving] = useState(false);

  const moveSpeed = 3;

  // Mobile touch controls
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchMove, setTouchMove] = useState<{ x: number; y: number } | null>(null);

  // Expose setKeys for external control
  useEffect(() => {
    (window as any).setPlayerKeys = setKeys;
    return () => {
      delete (window as any).setPlayerKeys;
    };
  }, []);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!touchStart) return;
    const touch = e.touches[0];
    setTouchMove({ x: touch.clientX, y: touch.clientY });
  }, [touchStart]);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchMove) {
      setTouchStart(null);
      setTouchMove(null);
      return;
    }

    const deltaX = touchMove.x - touchStart.x;
    const deltaY = touchMove.y - touchStart.y;
    const minSwipeDistance = 30;

    if (Math.abs(deltaX) > minSwipeDistance || Math.abs(deltaY) > minSwipeDistance) {
      const swipeKeys = new Set<string>();
      
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 0) swipeKeys.add('d');
        else swipeKeys.add('a');
      } else {
        // Vertical swipe
        if (deltaY > 0) swipeKeys.add('s');
        else swipeKeys.add('w');
      }
      
      setKeys(swipeKeys);
      setTimeout(() => setKeys(new Set()), 200);
    }

    setTouchStart(null);
    setTouchMove(null);
  }, [touchStart, touchMove]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
      e.preventDefault();
      setKeys(prev => new Set([...prev, key]));
    }
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    setKeys(prev => {
      const newKeys = new Set(prev);
      newKeys.delete(key);
      return newKeys;
    });
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleKeyDown, handleKeyUp, handleTouchStart, handleTouchMove, handleTouchEnd]);

  useEffect(() => {
    if (keys.size === 0) {
      setIsMoving(false);
      return;
    }

    setIsMoving(true);
    const interval = setInterval(() => {
      let deltaX = 0;
      let deltaY = 0;
      let newDirection = direction;

      // Handle movement
      if (keys.has('w') || keys.has('arrowup')) {
        deltaY -= moveSpeed;
        newDirection = 'up';
      }
      if (keys.has('s') || keys.has('arrowdown')) {
        deltaY += moveSpeed;
        newDirection = 'down';
      }
      if (keys.has('a') || keys.has('arrowleft')) {
        deltaX -= moveSpeed;
        newDirection = 'left';
      }
      if (keys.has('d') || keys.has('arrowright')) {
        deltaX += moveSpeed;
        newDirection = 'right';
      }

      // Diagonal movement adjustment
      if (deltaX !== 0 && deltaY !== 0) {
        deltaX *= 0.707; // cos(45°)
        deltaY *= 0.707;
      }

      setDirection(newDirection);

      const newPosition = {
        x: Math.max(0, Math.min(window.innerWidth - size, position.x + deltaX)),
        y: Math.max(0, Math.min(window.innerHeight - size, position.y + deltaY))
      };

      if (newPosition.x !== position.x || newPosition.y !== position.y) {
        onMove(newPosition);
      }
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [keys, position, onMove, size, moveSpeed, direction]);

  const getPlayerSprite = () => {
    const baseStyle = "relative flex items-center justify-center rounded-full border-2 border-primary/50 shadow-lg";
    
    return (
      <div className={`${baseStyle} w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm`}>
        {/* Character body */}
        <div className="w-6 h-8 bg-primary rounded-sm relative">
          {/* Head */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-accent rounded-full border border-primary/50" />
          
          {/* Arms */}
          <div className="absolute top-1 -left-1 w-2 h-3 bg-primary/80 rounded-sm" style={{
            transform: isMoving ? 'rotate(15deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s'
          }} />
          <div className="absolute top-1 -right-1 w-2 h-3 bg-primary/80 rounded-sm" style={{
            transform: isMoving ? 'rotate(-15deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s'
          }} />
          
          {/* Legs */}
          <div className="absolute -bottom-1 left-0 w-2 h-3 bg-primary/80 rounded-sm" style={{
            transform: isMoving ? 'rotate(10deg)' : 'rotate(0deg)',
            transition: 'transform 0.1s'
          }} />
          <div className="absolute -bottom-1 right-0 w-2 h-3 bg-primary/80 rounded-sm" style={{
            transform: isMoving ? 'rotate(-10deg)' : 'rotate(0deg)',
            transition: 'transform 0.1s'
          }} />
        </div>

        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-md animate-pulse" />
      </div>
    );
  };

  return (
    <motion.div
      className="absolute z-20"
      style={{
        left: position.x,
        top: position.y,
        width: size,
        height: size,
      }}
      animate={{
        scale: isMoving ? 1.1 : 1,
      }}
      transition={{ duration: 0.2 }}
    >
      {getPlayerSprite()}
      
      {/* Movement indicator */}
      {isMoving && (
        <motion.div
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-accent font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          ⚡
        </motion.div>
      )}
    </motion.div>
  );
};

export default Player;