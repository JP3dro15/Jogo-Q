import { useFrame } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

interface Molecule3DProps {
  type: 'H2O' | 'CO2' | 'NH3' | 'CH4' | 'NaCl' | 'O2' | 'N2';
  position: [number, number, number];
  scale?: number;
  interactive?: boolean;
  selected?: boolean;
  onClick?: () => void;
  showLabel?: boolean;
}

const moleculeData = {
  H2O: { 
    atoms: [
      { element: 'O', position: [0, 0, 0], color: '#ff4757' },
      { element: 'H', position: [-0.8, 0.6, 0], color: '#ffffff' },
      { element: 'H', position: [0.8, 0.6, 0], color: '#ffffff' }
    ],
    bonds: [
      { from: [0, 0, 0], to: [-0.8, 0.6, 0] },
      { from: [0, 0, 0], to: [0.8, 0.6, 0] }
    ]
  },
  CO2: {
    atoms: [
      { element: 'C', position: [0, 0, 0], color: '#2f3542' },
      { element: 'O', position: [-1.2, 0, 0], color: '#ff4757' },
      { element: 'O', position: [1.2, 0, 0], color: '#ff4757' }
    ],
    bonds: [
      { from: [0, 0, 0], to: [-1.2, 0, 0] },
      { from: [0, 0, 0], to: [1.2, 0, 0] }
    ]
  },
  NH3: {
    atoms: [
      { element: 'N', position: [0, 0, 0], color: '#3742fa' },
      { element: 'H', position: [-0.8, 0.8, 0.4], color: '#ffffff' },
      { element: 'H', position: [0.8, 0.8, 0.4], color: '#ffffff' },
      { element: 'H', position: [0, 0.8, -0.8], color: '#ffffff' }
    ],
    bonds: [
      { from: [0, 0, 0], to: [-0.8, 0.8, 0.4] },
      { from: [0, 0, 0], to: [0.8, 0.8, 0.4] },
      { from: [0, 0, 0], to: [0, 0.8, -0.8] }
    ]
  },
  CH4: {
    atoms: [
      { element: 'C', position: [0, 0, 0], color: '#2f3542' },
      { element: 'H', position: [-0.8, 0.8, 0.8], color: '#ffffff' },
      { element: 'H', position: [0.8, 0.8, 0.8], color: '#ffffff' },
      { element: 'H', position: [-0.8, -0.8, -0.8], color: '#ffffff' },
      { element: 'H', position: [0.8, -0.8, -0.8], color: '#ffffff' }
    ],
    bonds: [
      { from: [0, 0, 0], to: [-0.8, 0.8, 0.8] },
      { from: [0, 0, 0], to: [0.8, 0.8, 0.8] },
      { from: [0, 0, 0], to: [-0.8, -0.8, -0.8] },
      { from: [0, 0, 0], to: [0.8, -0.8, -0.8] }
    ]
  },
  NaCl: {
    atoms: [
      { element: 'Na', position: [-0.6, 0, 0], color: '#ffa502' },
      { element: 'Cl', position: [0.6, 0, 0], color: '#2ed573' }
    ],
    bonds: [
      { from: [-0.6, 0, 0], to: [0.6, 0, 0] }
    ]
  },
  O2: {
    atoms: [
      { element: 'O', position: [-0.6, 0, 0], color: '#ff4757' },
      { element: 'O', position: [0.6, 0, 0], color: '#ff4757' }
    ],
    bonds: [
      { from: [-0.6, 0, 0], to: [0.6, 0, 0] }
    ]
  },
  N2: {
    atoms: [
      { element: 'N', position: [-0.6, 0, 0], color: '#3742fa' },
      { element: 'N', position: [0.6, 0, 0], color: '#3742fa' }
    ],
    bonds: [
      { from: [-0.6, 0, 0], to: [0.6, 0, 0] }
    ]
  }
};

function Atom({ element, position, color }: { element: string; position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.rotation.y += 0.01;
    }
  });

  const radius = element === 'H' ? 0.15 : element === 'C' ? 0.25 : element === 'N' ? 0.22 : element === 'O' ? 0.2 : 0.18;

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[radius, 16, 16]} />
      <meshStandardMaterial 
        color={color}
        metalness={0.3}
        roughness={0.2}
        emissive={color}
        emissiveIntensity={0.1}
      />
      <Text
        position={[0, radius + 0.3, 0]}
        fontSize={0.15}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
      >
        {element}
      </Text>
    </mesh>
  );
}

function Bond({ from, to }: { from: [number, number, number]; to: [number, number, number] }) {
  const fromVec = new THREE.Vector3(...from);
  const toVec = new THREE.Vector3(...to);
  const direction = toVec.clone().sub(fromVec);
  const length = direction.length();
  const midpoint = fromVec.clone().add(direction.clone().multiplyScalar(0.5));
  
  // Calculate rotation to align cylinder with bond direction
  const up = new THREE.Vector3(0, 1, 0);
  const quaternion = new THREE.Quaternion();
  quaternion.setFromUnitVectors(up, direction.normalize());
  
  return (
    <mesh position={midpoint.toArray()} quaternion={quaternion.toArray()}>
      <cylinderGeometry args={[0.02, 0.02, length, 8]} />
      <meshStandardMaterial 
        color="#00ffff" 
        emissive="#00ffff" 
        emissiveIntensity={0.2}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

const Molecule3D = ({ 
  type, 
  position, 
  scale = 1, 
  interactive = false, 
  selected = false, 
  onClick, 
  showLabel = true 
}: Molecule3DProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const molecule = moleculeData[type];

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += selected ? 0.02 : 0.005;
      if (selected) {
        groupRef.current.scale.setScalar(scale * (1 + Math.sin(state.clock.elapsedTime * 3) * 0.1));
      }
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.3}>
      <group
        ref={groupRef}
        position={position}
        scale={hovered ? scale * 1.2 : scale}
        onPointerEnter={interactive ? () => setHovered(true) : undefined}
        onPointerLeave={interactive ? () => setHovered(false) : undefined}
        onClick={interactive ? onClick : undefined}
      >
        {/* Holographic glow effect */}
        {(selected || hovered) && (
          <mesh>
            <sphereGeometry args={[2, 16, 16]} />
            <meshBasicMaterial 
              color="#00ffff" 
              transparent 
              opacity={0.1}
              side={THREE.BackSide}
            />
          </mesh>
        )}
        
        {/* Render atoms */}
        {molecule.atoms.map((atom, index) => (
          <Atom
            key={index}
            element={atom.element}
            position={atom.position as [number, number, number]}
            color={atom.color}
          />
        ))}
        
        {/* Render bonds */}
        {molecule.bonds.map((bond, index) => (
          <Bond
            key={index}
            from={bond.from as [number, number, number]}
            to={bond.to as [number, number, number]}
          />
        ))}
        
        {/* Label */}
        {showLabel && (
          <Text
            position={[0, -1.5, 0]}
            fontSize={0.3}
            color={selected ? "#00ff88" : "#00ffff"}
            anchorX="center"
            anchorY="middle"
            font="/fonts/orbitron-bold.woff"
          >
            {type}
          </Text>
        )}
      </group>
    </Float>
  );
};

export default Molecule3D;