import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  delay: number;
  color: string;
  type: 'atom' | 'molecule' | 'energy';
  rotation: number;
  rotationSpeed: number;
}

const EnhancedParticleSystem = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles: Particle[] = [];
      const colors = [
        'hsl(165 100% 45%)', // Primary
        'hsl(45 95% 55%)',   // Secondary  
        'hsl(200 100% 50%)', // Blue
        'hsl(300 100% 50%)', // Purple
      ];
      
      const types: Array<'atom' | 'molecule' | 'energy'> = ['atom', 'molecule', 'energy'];
      
      for (let i = 0; i < 80; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 6 + 2,
          speed: Math.random() * 15 + 8,
          delay: Math.random() * 10,
          color: colors[Math.floor(Math.random() * colors.length)],
          type: types[Math.floor(Math.random() * types.length)],
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 4
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  const renderParticle = (particle: Particle) => {
    const baseStyle = {
      left: `${particle.x}%`,
      animationDuration: `${particle.speed}s`,
      animationDelay: `${particle.delay}s`,
      transform: `rotate(${particle.rotation}deg)`,
    };

    switch (particle.type) {
      case 'atom':
        return (
          <div
            key={particle.id}
            className="absolute particle-float pointer-events-none"
            style={baseStyle}
          >
            <div
              className="rounded-full animate-pulse"
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                backgroundColor: particle.color,
                boxShadow: `0 0 ${particle.size * 3}px ${particle.color}40`,
              }}
            />
          </div>
        );
        
      case 'molecule':
        return (
          <div
            key={particle.id}
            className="absolute particle-float pointer-events-none"
            style={baseStyle}
          >
            <svg width={particle.size * 2} height={particle.size * 2} className="molecular-spin">
              <circle cx={particle.size} cy={particle.size} r={particle.size / 3} fill={particle.color} opacity="0.6" />
              <circle cx={particle.size * 0.5} cy={particle.size * 0.5} r={particle.size / 5} fill="white" opacity="0.8" />
              <circle cx={particle.size * 1.5} cy={particle.size * 0.5} r={particle.size / 5} fill="white" opacity="0.8" />
            </svg>
          </div>
        );
        
      case 'energy':
        return (
          <div
            key={particle.id}
            className="absolute particle-float pointer-events-none"
            style={baseStyle}
          >
            <div
              className="animate-ping"
              style={{
                width: `${particle.size}px`,
                height: `${particle.size / 2}px`,
                backgroundColor: particle.color,
                borderRadius: '50%',
                opacity: 0.4,
              }}
            />
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map(renderParticle)}
      
      {/* Neural Network Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        <defs>
          <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(165 100% 45%)" stopOpacity="0.8" />
            <stop offset="50%" stopColor="hsl(200 100% 50%)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="hsl(165 100% 45%)" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        
        {/* Animated connection lines */}
        <g className="animate-pulse" style={{ animationDuration: '4s' }}>
          <line x1="10%" y1="20%" x2="90%" y2="30%" stroke="url(#neuralGradient)" strokeWidth="1" />
          <line x1="20%" y1="50%" x2="80%" y2="60%" stroke="url(#neuralGradient)" strokeWidth="1" />
          <line x1="15%" y1="80%" x2="85%" y2="70%" stroke="url(#neuralGradient)" strokeWidth="1" />
        </g>
      </svg>
      
      {/* Atmospheric Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent animate-pulse" 
           style={{ animationDuration: '6s' }} />
      
      {/* Corner Energy Effects */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-radial from-primary/20 to-transparent animate-pulse" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-radial from-secondary/20 to-transparent animate-pulse" 
           style={{ animationDelay: '2s' }} />
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-radial from-accent/15 to-transparent animate-pulse"
           style={{ animationDelay: '4s' }} />
      
      {/* Scanning Lines */}
      <div className="absolute inset-0">
        <div 
          className="absolute w-full h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
          style={{
            top: '30%',
            animation: 'scan-vertical 8s linear infinite'
          }}
        />
        <div 
          className="absolute w-px h-full bg-gradient-to-b from-transparent via-secondary/40 to-transparent"
          style={{
            left: '70%',
            animation: 'scan-horizontal 10s linear infinite',
            animationDelay: '2s'
          }}
        />
      </div>
    </div>
  );
};

export default EnhancedParticleSystem;