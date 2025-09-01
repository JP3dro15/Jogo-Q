import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Stars, Float, Text } from '@react-three/drei';
import { Suspense } from 'react';
import Scene3D from "./Scene3D";
import { HolographicUI, HolographicButton, TypingText, GlitchText } from "./HolographicUI";
import { useSound } from "./SoundSystem";

interface Enhanced3DCutsceneProps {
  onComplete: () => void;
}

const storySequence = [
  {
    scene: "intro",
    title: "ANO 2087",
    subtitle: "PROJETO PHOENIX",
    text: "Depois da Grande Guerra Química, 97% da humanidade foi eliminada...",
    duration: 5000,
    cameraPosition: [0, 10, 15],
    bgColor: "#661a00"
  },
  {
    scene: "destruction",
    title: "CATÁSTROFE GLOBAL",
    subtitle: "ARMAS BIOQUÍMICAS",
    text: "Armas bioquímicas devastaram o planeta, deixando apenas desertos tóxicos...",
    duration: 5000,
    cameraPosition: [-5, 5, 10],
    bgColor: "#4a0000"
  },
  {
    scene: "character",
    title: "Dr. MORGAN CHEN",
    subtitle: "ÚLTIMO QUÍMICO",
    text: "Você é o último químico sobrevivente do Bunker 7, guardião do conhecimento perdido...",
    duration: 5000,
    cameraPosition: [2, 3, 8],
    bgColor: "#003d4a"
  },
  {
    scene: "hope",
    title: "ÚLTIMA ESPERANÇA",
    subtitle: "CONHECIMENTO SALVARÁ",
    text: "Seus conhecimentos em química são a única esperança de reconstruir o mundo...",
    duration: 5000,
    cameraPosition: [0, 5, 12],
    bgColor: "#1a4a00"
  },
  {
    scene: "mission",
    title: "PROTOCOLO DE SOBREVIVÊNCIA",
    subtitle: "CADA DECISÃO IMPORTA",
    text: "Use a química para purificar água, neutralizar toxinas e salvar vidas. Cada decisão pode condenar ou salvar a humanidade...",
    duration: 6000,
    cameraPosition: [0, 8, 10],
    bgColor: "#4a3300"
  }
];

// 3D Title component
function Title3D({ text, position }: { text: string; position: [number, number, number] }) {
  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
      <Text
        fontSize={1}
        position={position}
        color="#00ff88"
        anchorX="center"
        anchorY="middle"
      >
        {text}
      </Text>
    </Float>
  );
}

// Cinematic particles
function CinematicParticles({ scene }: { scene: string }) {
  const particleCount = scene === 'destruction' ? 200 : 100;
  const color = scene === 'destruction' ? '#ff4444' : scene === 'hope' ? '#00ff88' : '#00aaff';
  
  return (
    <group>
      {Array.from({ length: particleCount }).map((_, i) => (
        <Float key={i} speed={0.5 + Math.random()} rotationIntensity={0.2} floatIntensity={0.5}>
          <mesh position={[
            (Math.random() - 0.5) * 50,
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 40
          ]}>
            <sphereGeometry args={[0.05 + Math.random() * 0.1, 8, 8]} />
            <meshStandardMaterial 
              color={color}
              emissive={color}
              emissiveIntensity={0.3}
              transparent
              opacity={0.6}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

const Enhanced3DCutscene = ({ onComplete }: Enhanced3DCutsceneProps) => {
  const [currentSequence, setCurrentSequence] = useState(0);
  const [showText, setShowText] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const { playTransition, playAmbient } = useSound();

  const currentStory = storySequence[currentSequence];

  useEffect(() => {
    // Play ambient sound on start
    playAmbient();

    // Show skip button after 3 seconds
    const skipTimer = setTimeout(() => {
      setShowSkip(true);
    }, 3000);

    return () => clearTimeout(skipTimer);
  }, [playAmbient]);

  useEffect(() => {
    // Reset text animation for each sequence
    setShowText(false);
    setIsTypingComplete(false);
    
    const textTimer = setTimeout(() => setShowText(true), 800);
    
    // Auto-advance to next sequence
    const sequenceTimer = setTimeout(() => {
      if (currentSequence < storySequence.length - 1) {
        playTransition();
        setCurrentSequence(prev => prev + 1);
      } else {
        // End cutscene
        setTimeout(onComplete, 1500);
      }
    }, currentStory.duration);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(sequenceTimer);
    };
  }, [currentSequence, onComplete, currentStory.duration, playTransition]);

  const handleSkip = () => {
    playTransition();
    onComplete();
  };

  return (
    <HolographicUI className="min-h-screen relative overflow-hidden" glitch={true}>
      {/* 3D Scene Background */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [currentStory.cameraPosition[0], currentStory.cameraPosition[1], currentStory.cameraPosition[2]], fov: 60 }}>
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.2}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 6}
          />
          
          <ambientLight intensity={0.3} color="#00ff88" />
          <directionalLight position={[10, 10, 5]} intensity={0.4} color="#ffffff" />
          <pointLight position={[-10, 5, -10]} intensity={0.2} color="#ff6b6b" />

          <Suspense fallback={null}>
            <Environment preset="night" />
            <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade />
            
            {/* Background elements from Scene3D */}
            <Scene3D stage="cutscene">
              {/* Story-specific 3D text */}
              {currentStory.scene === "intro" && (
                <Float speed={1} rotationIntensity={0.3} floatIntensity={0.5}>
                  <Text
                    position={[0, 2, -5]}
                    rotation={[0, Math.PI / 6, 0]}
                    fontSize={1}
                    color="#00ff88"
                    anchorX="center"
                    anchorY="middle"
                  >
                    2087
                  </Text>
                </Float>
              )}
            </Scene3D>
          </Suspense>
        </Canvas>
      </div>

      {/* Cinematic overlay gradient */}
      <div 
        className="absolute inset-0 transition-all duration-2000 pointer-events-none"
        style={{ 
          background: `linear-gradient(135deg, ${currentStory.bgColor}20 0%, transparent 50%, ${currentStory.bgColor}10 100%)`
        }}
      />

      {/* UI Content Overlay */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-4">
        {/* Main Story Content */}
        <motion.div 
          key={currentSequence}
          className="max-w-5xl space-y-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 1 }}
        >
          {/* Title */}
          <AnimatePresence>
            {showText && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <GlitchText 
                  text={currentStory.title}
                  className="text-5xl md:text-7xl font-orbitron font-black text-primary mb-4 tracking-wider terminal-glow"
                  intensity={currentStory.scene === 'destruction' ? 2 : 1}
                />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Subtitle */}
          <AnimatePresence>
            {showText && (
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <h2 className="text-2xl md:text-3xl font-rajdhani text-secondary font-bold tracking-wide lab-glow">
                  {currentStory.subtitle}
                </h2>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Main text with typing effect */}
          <AnimatePresence>
            {showText && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="bg-background/60 backdrop-blur-lg border border-primary/30 rounded-lg p-8 holographic-panel"
              >
                <TypingText 
                  text={currentStory.text}
                  speed={40}
                  onComplete={() => setIsTypingComplete(true)}
                  className="text-xl md:text-2xl font-space text-foreground leading-relaxed"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Progress Indicator */}
        <motion.div 
          className="fixed bottom-20 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <div className="flex space-x-3">
            {storySequence.map((_, index) => (
              <div
                key={index}
                className={`
                  w-4 h-4 rounded-full transition-all duration-500
                  ${index <= currentSequence ? 'bg-primary terminal-glow scale-110' : 'bg-muted/50'}
                `}
              />
            ))}
          </div>
        </motion.div>
        
        {/* Skip Button */}
        <AnimatePresence>
          {showSkip && (
            <motion.div
              className="fixed bottom-8 right-8"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
            >
              <HolographicButton 
                onClick={handleSkip}
                variant="secondary"
                className="backdrop-blur-sm"
              >
                <span className="mr-2">⏩</span>
                PULAR INTRODUÇÃO
              </HolographicButton>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Continue hint */}
        {showText && currentSequence < storySequence.length - 1 && (
          <motion.div 
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
          >
            <div className="animate-pulse text-muted-foreground font-space text-sm flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
              <span>Aguarde ou clique para pular...</span>
            </div>
          </motion.div>
        )}
      </div>
    </HolographicUI>
  );
};

export default Enhanced3DCutscene;