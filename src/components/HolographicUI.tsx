import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface HolographicUIProps {
  children: React.ReactNode;
  className?: string;
  glitch?: boolean;
}

interface HolographicPanelProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'danger' | 'success' | 'warning';
}

interface HolographicButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

interface TypingTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
}

interface GlitchTextProps {
  text: string;
  intensity?: number;
  className?: string;
}

// Scanline overlay effect
const ScanlineOverlay = () => (
  <div className="absolute inset-0 pointer-events-none z-50">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent animate-scan-vertical" />
    <div 
      className="absolute inset-0 opacity-20"
      style={{
        background: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          hsl(var(--primary) / 0.1) 2px,
          hsl(var(--primary) / 0.1) 4px
        )`
      }}
    />
  </div>
);

// Holographic distortion effect
const HolographicDistortion = ({ glitch }: { glitch?: boolean }) => {
  const [distort, setDistort] = useState(false);

  useEffect(() => {
    if (!glitch) return;
    
    const interval = setInterval(() => {
      setDistort(true);
      setTimeout(() => setDistort(false), 150);
    }, 2000 + Math.random() * 3000);

    return () => clearInterval(interval);
  }, [glitch]);

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none z-40"
      animate={{
        opacity: distort ? 1 : 0,
        x: distort ? Math.random() * 4 - 2 : 0,
        scaleX: distort ? 1 + Math.random() * 0.02 : 1,
      }}
      transition={{ duration: 0.1 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-transparent to-cyan-500/20" />
    </motion.div>
  );
};

// Main holographic container
export const HolographicUI = ({ children, className = '', glitch = true }: HolographicUIProps) => {
  return (
    <div className={`relative ${className}`}>
      <ScanlineOverlay />
      <HolographicDistortion glitch={glitch} />
      {children}
    </div>
  );
};

// Holographic panel component
export const HolographicPanel = ({ 
  title, 
  children, 
  className = '', 
  variant = 'primary' 
}: HolographicPanelProps) => {
  const variantClasses = {
    primary: 'border-primary/30 bg-background/80',
    danger: 'border-destructive/30 bg-destructive/5',
    success: 'border-accent/30 bg-accent/5',
    warning: 'border-secondary/30 bg-secondary/5'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={`
        relative backdrop-blur-xl border-2 rounded-lg p-6
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {/* Corner accents */}
      <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-primary" />
      <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-primary" />
      <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-primary" />
      <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-primary" />
      
      {title && (
        <motion.h3
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg font-orbitron font-bold text-primary mb-4 terminal-glow"
        >
          {title}
        </motion.h3>
      )}
      
      {children}
    </motion.div>
  );
};

// Enhanced holographic button
export const HolographicButton = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false,
  className = '',
  size = 'md'
}: HolographicButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);
  
  const variantClasses = {
    primary: 'bg-primary/20 border-primary text-primary hover:bg-primary/30 hover:shadow-[0_0_30px_hsl(var(--primary)/0.6)]',
    secondary: 'bg-secondary/20 border-secondary text-secondary hover:bg-secondary/30',
    danger: 'bg-destructive/20 border-destructive text-destructive hover:bg-destructive/30',
    success: 'bg-accent/20 border-accent text-accent hover:bg-accent/30'
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onMouseDown={() => !disabled && setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`
        relative font-orbitron font-bold border-2 rounded-lg
        backdrop-blur-sm transition-all duration-300
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {/* Pulse effect when pressed */}
      <AnimatePresence>
        {isPressed && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 rounded-lg border-2 border-current"
          />
        )}
      </AnimatePresence>
      
      {children}
    </motion.button>
  );
};

// Typing text effect
export const TypingText = ({ 
  text, 
  speed = 50, 
  onComplete, 
  className = '' 
}: TypingTextProps) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, speed);
      
      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  return (
    <span className={`font-space ${className}`}>
      {displayText}
      {currentIndex < text.length && (
        <span className="animate-pulse text-primary">|</span>
      )}
    </span>
  );
};

// Glitch text effect
export const GlitchText = ({ text, intensity = 1, className = '' }: GlitchTextProps) => {
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 100 * intensity);
    }, 2000 + Math.random() * 3000);

    return () => clearInterval(interval);
  }, [intensity]);

  return (
    <span className={`relative inline-block ${className}`}>
      <span
        className={`
          ${glitchActive ? 'animate-pulse' : ''}
          ${glitchActive ? 'text-destructive' : ''}
        `}
        style={{
          textShadow: glitchActive ? 
            '2px 0 #ff0000, -2px 0 #00ffff, 0 2px #ff00ff' : 
            'none'
        }}
      >
        {text}
      </span>
      
      {glitchActive && (
        <>
          <span 
            className="absolute top-0 left-0 text-red-500 opacity-70"
            style={{ transform: 'translate(2px, 0)' }}
          >
            {text}
          </span>
          <span 
            className="absolute top-0 left-0 text-cyan-500 opacity-70"
            style={{ transform: 'translate(-2px, 0)' }}
          >
            {text}
          </span>
        </>
      )}
    </span>
  );
};