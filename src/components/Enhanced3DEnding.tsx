import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Stars, Float } from '@react-three/drei';
import { Suspense } from 'react';
import Scene3D from "./Scene3D";
import Molecule3D from "./Molecule3D";
import { HolographicUI, HolographicPanel, HolographicButton, TypingText } from "./HolographicUI";
import { useSound } from "./SoundSystem";

interface Enhanced3DEndingProps {
  score: number;
  total: number;
  timeBonus: number;
  onRestart: () => void;
}

// Ending scenarios based on performance
const getEndingScenario = (score: number, total: number) => {
  const percentage = (score / total) * 100;
  
  if (percentage >= 90) {
    return {
      type: "perfect",
      title: "PROTOCOLO PHOENIX: SUCESSO TOTAL",
      subtitle: "RENASCIMENTO DA HUMANIDADE",
      description: "Seus conhecimentos em química salvaram a humanidade! As águas foram purificadas, o ar limpo, e uma nova era de prosperidade começou. Comunidades florescem nos antigos desertos tóxicos.",
      scene: "renaissance",
      color: "#00ff88",
      molecules: ['H2O', 'O2', 'CO2', 'NH3']
    };
  } else if (percentage >= 70) {
    return {
      type: "success",
      title: "PROTOCOLO PHOENIX: MISSÃO CUMPRIDA", 
      subtitle: "SOBREVIVÊNCIA ASSEGURADA",
      description: "Você conseguiu estabelecer colônias seguras! Embora desafios ainda existam, sua expertise química criou bases sólidas para a reconstrução. Pequenas comunidades prosperam sob sua proteção.",
      scene: "recovery",
      color: "#00aaff",
      molecules: ['H2O', 'NaCl', 'O2']
    };
  } else if (percentage >= 50) {
    return {
      type: "partial",
      title: "PROTOCOLO PHOENIX: SOBREVIVÊNCIA CRÍTICA",
      subtitle: "RECURSOS ESCASSOS",
      description: "Você sobreviveu, mas os recursos continuam perigosamente escassos. Suas decisões químicas permitiram sobrevivência básica, mas muito trabalho ainda precisa ser feito para garantir o futuro.",
      scene: "struggle", 
      color: "#ffaa00",
      molecules: ['H2O', 'CO2']
    };
  } else {
    return {
      type: "failure",
      title: "PROTOCOLO PHOENIX: FALHA CRÍTICA",
      subtitle: "CONHECIMENTO PERDIDO",
      description: "As decisões incorretas custaram vidas preciosas. O conhecimento químico se perdeu, e a humanidade enfrenta um futuro ainda mais sombrio. Mas há sempre uma segunda chance...",
      scene: "desolation",
      color: "#ff4444", 
      molecules: ['CO2', 'SO2']
    };
  }
};

// 3D Environmental effects based on ending
function EndingEnvironment({ scene, color }: { scene: string; color: string }) {
  const particleCount = scene === 'renaissance' ? 300 : scene === 'desolation' ? 50 : 150;
  const particleColor = color;
  
  return (
    <group>
      {/* Environmental particles */}
      {Array.from({ length: particleCount }).map((_, i) => (
        <Float 
          key={i} 
          speed={scene === 'renaissance' ? 2 : 0.5} 
          rotationIntensity={0.3} 
          floatIntensity={scene === 'renaissance' ? 1 : 0.3}
        >
          <mesh position={[
            (Math.random() - 0.5) * 60,
            Math.random() * 40 + 5,
            (Math.random() - 0.5) * 50
          ]}>
            <sphereGeometry args={[
              scene === 'renaissance' ? 0.1 + Math.random() * 0.2 : 0.05 + Math.random() * 0.1, 
              8, 8
            ]} />
            <meshStandardMaterial 
              color={particleColor}
              emissive={particleColor}
              emissiveIntensity={scene === 'renaissance' ? 0.6 : 0.2}
              transparent
              opacity={scene === 'renaissance' ? 0.8 : 0.4}
            />
          </mesh>
        </Float>
      ))}
      
      {/* Special effects for perfect ending */}
      {scene === 'renaissance' && (
        <group>
          {/* Growing trees/life representation */}
          {Array.from({ length: 8 }).map((_, i) => (
            <Float key={`tree-${i}`} speed={1} rotationIntensity={0.1} floatIntensity={0.5}>
              <mesh position={[
                (i - 4) * 8 + Math.random() * 4,
                Math.random() * 3 + 2,
                -20 - Math.random() * 10
              ]}>
                <coneGeometry args={[0.5, 6 + Math.random() * 4, 8]} />
                <meshStandardMaterial 
                  color="#228B22"
                  emissive="#228B22"
                  emissiveIntensity={0.3}
                />
              </mesh>
            </Float>
          ))}
        </group>
      )}
    </group>
  );
}

const Enhanced3DEnding = ({ score, total, timeBonus, onRestart }: Enhanced3DEndingProps) => {
  const [showContent, setShowContent] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showRestart, setShowRestart] = useState(false);
  const { playTransition, playCorrect, playAmbient } = useSound();
  
  const ending = getEndingScenario(score, total);
  const finalScore = score + Math.floor(timeBonus / 10);
  const percentage = Math.round((score / total) * 100);

  useEffect(() => {
    // Play ending sound based on performance
    if (percentage >= 70) {
      playCorrect();
    }
    
    playAmbient();

    // Staged reveal of content
    const contentTimer = setTimeout(() => setShowContent(true), 1000);
    const statsTimer = setTimeout(() => setShowStats(true), 4000);
    const restartTimer = setTimeout(() => setShowRestart(true), 7000);

    return () => {
      clearTimeout(contentTimer);
      clearTimeout(statsTimer);
      clearTimeout(restartTimer);
    };
  }, [percentage, playCorrect, playAmbient]);

  return (
    <HolographicUI className="min-h-screen relative overflow-hidden">
      {/* 3D Scene Background */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 8, 15], fov: 60 }}>
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            autoRotate 
            autoRotateSpeed={ending.type === 'perfect' ? 1 : 0.3}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 6}
          />
          
          {/* Dynamic lighting based on ending */}
          <ambientLight intensity={0.3} color={ending.color} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={ending.type === 'perfect' ? 1 : 0.5} 
            color="#ffffff"
          />
          <pointLight 
            position={[-10, 5, -10]} 
            intensity={0.4} 
            color={ending.color} 
          />

          <Suspense fallback={null}>
            <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade />
            <Environment preset={ending.type === 'perfect' ? 'dawn' : 'night'} />
            
            {/* Base scene */}
            <Scene3D stage="ending" />
            
            {/* Ending-specific environment */}
            <EndingEnvironment scene={ending.scene} color={ending.color} />
            
            {/* 3D Molecules representing the outcome */}
            {showStats && ending.molecules.map((molecule, index) => (
              <Molecule3D
                key={`ending-${molecule}-${index}`}
                type={molecule as any}
                position={[
                  (index - (ending.molecules.length - 1) / 2) * 4,
                  3 + Math.sin(Date.now() * 0.001 + index) * 2,
                  -10
                ]}
                scale={1 + Math.sin(Date.now() * 0.001 + index) * 0.3}
                selected={true}
                showLabel={true}
              />
            ))}
          </Suspense>
        </Canvas>
      </div>

      {/* Cinematic overlay */}
      <div 
        className="absolute inset-0 transition-all duration-3000 pointer-events-none"
        style={{ 
          background: `linear-gradient(135deg, ${ending.color}15 0%, transparent 50%, ${ending.color}10 100%)`
        }}
      />

      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-4">
        
        {/* Main ending content */}
        <AnimatePresence>
          {showContent && (
            <motion.div
              className="max-w-4xl space-y-8 mb-12"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5 }}
            >
              {/* Title */}
              <motion.h1 
                className="text-4xl md:text-6xl font-orbitron font-black tracking-wider mb-4"
                style={{ color: ending.color, textShadow: `0 0 30px ${ending.color}` }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                {ending.title}
              </motion.h1>
              
              {/* Subtitle */}
              <motion.h2 
                className="text-xl md:text-2xl font-rajdhani font-bold text-secondary mb-8"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 1 }}
              >
                {ending.subtitle}
              </motion.h2>
              
              {/* Description */}
              <motion.div
                className="holographic-panel p-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 1.5 }}
              >
                <TypingText 
                  text={ending.description}
                  speed={30}
                  className="text-lg md:text-xl font-space text-foreground leading-relaxed"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Statistics Panel */}
        <AnimatePresence>
          {showStats && (
            <motion.div
              className="w-full max-w-2xl mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <HolographicPanel 
                title="RELATÓRIO DE MISSÃO"
                variant={percentage >= 70 ? "success" : percentage >= 50 ? "warning" : "danger"}
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-orbitron font-bold text-primary mb-2">
                      {score}/{total}
                    </div>
                    <div className="text-sm text-muted-foreground font-space">
                      DECISÕES CORRETAS
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-3xl font-orbitron font-bold text-secondary mb-2">
                      {percentage}%
                    </div>
                    <div className="text-sm text-muted-foreground font-space">
                      PRECISÃO
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-3xl font-orbitron font-bold text-accent mb-2">
                      +{timeBonus}
                    </div>
                    <div className="text-sm text-muted-foreground font-space">
                      BÔNUS TEMPO
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-3xl font-orbitron font-bold text-primary mb-2">
                      {finalScore}
                    </div>
                    <div className="text-sm text-muted-foreground font-space">
                      PONTUAÇÃO FINAL
                    </div>
                  </div>
                </div>
              </HolographicPanel>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Restart button */}
        <AnimatePresence>
          {showRestart && (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <HolographicButton
                onClick={() => {
                  playTransition();
                  onRestart();
                }}
                variant="primary"
                size="lg"
                className="px-12 py-4"
              >
                🔄 REINICIAR PROTOCOLO PHOENIX
              </HolographicButton>
              
              <p className="text-sm text-muted-foreground font-space">
                A química ainda tem muito a ensinar...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Performance badge */}
        <AnimatePresence>
          {showStats && (
            <motion.div
              className="fixed top-8 right-8"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <div 
                className="px-6 py-3 rounded-full border-2 font-orbitron font-bold text-sm"
                style={{ 
                  borderColor: ending.color, 
                  color: ending.color,
                  boxShadow: `0 0 20px ${ending.color}60`
                }}
              >
                {ending.type.toUpperCase()} GRADE
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </HolographicUI>
  );
};

export default Enhanced3DEnding;