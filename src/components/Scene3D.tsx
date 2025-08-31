import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera, Float, Stars } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

interface Scene3DProps {
  stage: 'cutscene' | 'quiz' | 'ending';
  children?: React.ReactNode;
}

// Post-apocalyptic terrain component
function ApocalypticTerrain() {
  const terrainRef = useRef<THREE.Mesh>(null);
  
  return (
    <mesh ref={terrainRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[100, 100, 50, 50]} />
      <meshStandardMaterial
        color="#2a4d3a"
        roughness={0.8}
        metalness={0.2}
        wireframe={false}
      />
    </mesh>
  );
}

// Destroyed buildings in the distance
function DestroyedCity() {
  const buildings = Array.from({ length: 8 }, (_, i) => (
    <Float key={i} speed={0.5} rotationIntensity={0.1} floatIntensity={0.2}>
      <mesh position={[
        (Math.random() - 0.5) * 40,
        Math.random() * 15 + 5,
        -20 - Math.random() * 10
      ]}>
        <boxGeometry args={[
          2 + Math.random() * 3,
          10 + Math.random() * 15,
          2 + Math.random() * 3
        ]} />
        <meshStandardMaterial
          color="#1a1a1a"
          roughness={0.9}
          metalness={0.1}
          transparent
          opacity={0.7}
        />
      </mesh>
    </Float>
  ));

  return <group>{buildings}</group>;
}

// Toxic fog effect
function ToxicFog() {
  return (
    <mesh position={[0, 2, 0]}>
      <sphereGeometry args={[20, 16, 16]} />
      <meshStandardMaterial
        color="#00ff88"
        transparent
        opacity={0.1}
        roughness={0.3}
        metalness={0.7}
      />
    </mesh>
  );
}

// 3D Character for cutscenes
function Character3D() {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group position={[0, 0, 5]}>
        {/* Body */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1, 2, 0.5]} />
          <meshStandardMaterial color="#4a5568" />
        </mesh>
        {/* Head */}
        <mesh position={[0, 1.5, 0]}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshStandardMaterial color="#e2e8f0" />
        </mesh>
        {/* Gas mask */}
        <mesh position={[0, 1.3, 0.3]}>
          <cylinderGeometry args={[0.3, 0.3, 0.2, 8]} />
          <meshStandardMaterial color="#2d3748" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Arms */}
        <mesh position={[-0.75, 0.5, 0]}>
          <boxGeometry args={[0.3, 1.5, 0.3]} />
          <meshStandardMaterial color="#4a5568" />
        </mesh>
        <mesh position={[0.75, 0.5, 0]}>
          <boxGeometry args={[0.3, 1.5, 0.3]} />
          <meshStandardMaterial color="#4a5568" />
        </mesh>
        {/* Legs */}
        <mesh position={[-0.3, -1.5, 0]}>
          <boxGeometry args={[0.3, 1.5, 0.3]} />
          <meshStandardMaterial color="#2d3748" />
        </mesh>
        <mesh position={[0.3, -1.5, 0]}>
          <boxGeometry args={[0.3, 1.5, 0.3]} />
          <meshStandardMaterial color="#2d3748" />
        </mesh>
      </group>
    </Float>
  );
}

const Scene3D = ({ stage, children }: Scene3DProps) => {
  return (
    <motion.div 
      className="absolute inset-0 z-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 5, 10]} />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate={stage === 'cutscene'}
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 6}
        />
        
        {/* Lighting setup */}
        <ambientLight intensity={0.2} color="#00ff88" />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={0.5} 
          color="#ffffff"
          castShadow
        />
        <pointLight position={[-10, 5, -10]} intensity={0.3} color="#ff6b6b" />
        <spotLight
          position={[0, 20, 0]}
          angle={Math.PI / 4}
          penumbra={0.5}
          intensity={0.4}
          color="#00ff88"
        />

        <Suspense fallback={null}>
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
          <Environment preset="night" />
          
          {/* 3D Scene Elements */}
          <ApocalypticTerrain />
          <DestroyedCity />
          <ToxicFog />
          
          {/* Character appears in cutscenes */}
          {stage === 'cutscene' && <Character3D />}
          
          {children}
        </Suspense>
      </Canvas>
    </motion.div>
  );
};

export default Scene3D;