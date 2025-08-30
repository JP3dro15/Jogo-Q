interface CharacterProps {
  scale?: number;
  frame: number;
  className?: string;
}

const Character = ({ scale = 1, frame, className = "" }: CharacterProps) => {
  const headOffset = Math.sin(frame / 10) * 3;
  const armOffset = Math.sin(frame / 5) * 8;
  
  return (
    <div className={`relative ${className}`} style={{ transform: `scale(${scale})` }}>
      <svg width="80" height="120" viewBox="0 0 80 120" className="drop-shadow-lg">
        {/* Body */}
        <rect
          x="30"
          y="40"
          width="20"
          height="40"
          fill="hsl(45 95% 55%)"
          rx="4"
          className="animate-pulse"
        />
        
        {/* Head */}
        <circle
          cx="40"
          cy={20 + headOffset}
          r="12"
          fill="hsl(30 100% 80%)"
          className="drop-shadow-md"
        />
        
        {/* Eyes */}
        <circle cx="37" cy={18 + headOffset} r="1.5" fill="black" />
        <circle cx="43" cy={18 + headOffset} r="1.5" fill="black" />
        
        {/* Arms */}
        <line
          x1="30"
          y1="50"
          x2={15}
          y2={60 + armOffset}
          stroke="hsl(45 95% 55%)"
          strokeWidth="4"
          strokeLinecap="round"
          className="drop-shadow-sm"
        />
        <line
          x1="50"
          y1="50"
          x2={65}
          y2={60 - armOffset}
          stroke="hsl(45 95% 55%)"
          strokeWidth="4"
          strokeLinecap="round"
          className="drop-shadow-sm"
        />
        
        {/* Legs */}
        <line
          x1="35"
          y1="80"
          x2="30"
          y2="110"
          stroke="hsl(45 95% 55%)"
          strokeWidth="4"
          strokeLinecap="round"
          className="drop-shadow-sm"
        />
        <line
          x1="45"
          y1="80"
          x2="50"
          y2="110"
          stroke="hsl(45 95% 55%)"
          strokeWidth="4"
          strokeLinecap="round"
          className="drop-shadow-sm"
        />
        
        {/* Radiation protection suit details */}
        <circle
          cx="40"
          cy="55"
          r="3"
          fill="hsl(165 100% 45%)"
          className="terminal-glow animate-pulse"
        />
      </svg>
    </div>
  );
};

export default Character;