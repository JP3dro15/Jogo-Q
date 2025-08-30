import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  delay: number;
}

const ParticleSystem = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles: Particle[] = [];
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 2,
          speed: Math.random() * 8 + 4,
          delay: Math.random() * 8
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-primary/20 particle-float"
          style={{
            left: `${particle.x}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDuration: `${particle.speed}s`,
            animationDelay: `${particle.delay}s`,
            boxShadow: `0 0 ${particle.size * 2}px hsl(165 100% 45% / 0.3)`
          }}
        />
      ))}
      
      {/* Additional atmospheric effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent animate-pulse" />
      
      {/* Floating molecules */}
      <div className="absolute top-1/4 left-1/4 animate-bounce" style={{ animationDuration: "6s" }}>
        <div className="w-3 h-3 bg-secondary/40 rounded-full" />
      </div>
      <div className="absolute top-3/4 right-1/3 animate-bounce" style={{ animationDuration: "8s", animationDelay: "2s" }}>
        <div className="w-2 h-2 bg-accent/40 rounded-full" />
      </div>
      <div className="absolute bottom-1/3 left-1/2 animate-bounce" style={{ animationDuration: "10s", animationDelay: "4s" }}>
        <div className="w-4 h-4 bg-primary/30 rounded-full" />
      </div>
    </div>
  );
};

export default ParticleSystem;