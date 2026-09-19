import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const VARIANTS = {
  basic:    { bodyColor: '#f5d5a0', ornamentColor: '#c8a822', glowColor: '#ffd700', scale: 1.0 },
  festival: { bodyColor: '#f5d5a0', ornamentColor: '#ff8c00', glowColor: '#ff6600', scale: 1.05 },
  divine:   { bodyColor: '#c5e8ff', ornamentColor: '#9370db', glowColor: '#aa88ff', scale: 1.1 },
  golden:   { bodyColor: '#ffd700', ornamentColor: '#ff8c00', glowColor: '#ffdd00', scale: 1.15 },
};

export default function GaneshaIdol({
  position = [0, 0, 0],
  variant = 'basic',
  size = 1,
  showGlow = false,
  onClick,
}) {
  const groupRef = useRef();
  const glowRef = useRef();
  const timeRef = useRef(0);
  const v = VARIANTS[variant] ?? VARIANTS.basic;

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    timeRef.current += delta;
    // Gentle breathing/glow pulse
    if (showGlow && glowRef.current) {
      glowRef.current.intensity = 0.5 + Math.sin(timeRef.current * 2) * 0.3;
    }
    // Subtle scale pulse
    const sc = (1 + Math.sin(timeRef.current * 1.5) * 0.005) * v.scale * size;
    groupRef.current.scale.setScalar(sc);
  });

  return (
    <group ref={groupRef} position={position} onClick={onClick} scale={v.scale * size}>
      {/* Pedestal */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <boxGeometry args={[1.2, 0.2, 1.0]} />
        <meshStandardMaterial color="#d4a86a" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.22, 0]} receiveShadow>
        <boxGeometry args={[1.0, 0.05, 0.85]} />
        <meshStandardMaterial color={v.ornamentColor} metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Body — seated torso */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.45, 0.7, 12]} />
        <meshStandardMaterial color={v.bodyColor} roughness={0.5} metalness={0.1} />
      </mesh>

      {/* Belly */}
      <mesh position={[0, 0.65, 0.15]}>
        <sphereGeometry args={[0.3, 10, 10]} />
        <meshStandardMaterial color={v.bodyColor} roughness={0.5} />
      </mesh>

      {/* Head — large round */}
      <mesh position={[0, 1.3, 0]} castShadow>
        <sphereGeometry args={[0.38, 14, 14]} />
        <meshStandardMaterial color={v.bodyColor} roughness={0.4} metalness={0.05} />
      </mesh>

      {/* Trunk */}
      <mesh position={[0.18, 1.1, 0.28]} rotation={[0.4, -0.3, 0.5]}>
        <cylinderGeometry args={[0.06, 0.08, 0.45, 8]} />
        <meshStandardMaterial color={v.bodyColor} roughness={0.5} />
      </mesh>
      {/* Trunk tip curl */}
      <mesh position={[0.32, 0.88, 0.3]} rotation={[0.8, 0, 0.6]}>
        <torusGeometry args={[0.1, 0.045, 6, 12, Math.PI * 0.8]} />
        <meshStandardMaterial color={v.bodyColor} roughness={0.5} />
      </mesh>

      {/* Large ears */}
      <mesh position={[-0.42, 1.3, 0]} rotation={[0, 0.3, 0.2]}>
        <sphereGeometry args={[0.28, 8, 8]} />
        <meshStandardMaterial color={v.bodyColor} roughness={0.5} />
      </mesh>
      <mesh position={[0.42, 1.3, 0]} rotation={[0, -0.3, -0.2]}>
        <sphereGeometry args={[0.28, 8, 8]} />
        <meshStandardMaterial color={v.bodyColor} roughness={0.5} />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.12, 1.35, 0.33]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      <mesh position={[0.12, 1.35, 0.33]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      <mesh position={[-0.12, 1.35, 0.37]}>
        <sphereGeometry args={[0.035, 6, 6]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[0.12, 1.35, 0.37]}>
        <sphereGeometry args={[0.035, 6, 6]} />
        <meshStandardMaterial color="#111" />
      </mesh>

      {/* Crown */}
      <mesh position={[0, 1.72, 0]}>
        <cylinderGeometry args={[0.22, 0.28, 0.25, 8]} />
        <meshStandardMaterial color={v.ornamentColor} metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Crown jewels */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const a = (i / 8) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.24, 1.84, Math.sin(a) * 0.24]}>
            <sphereGeometry args={[0.03, 6, 6]} />
            <meshStandardMaterial color="#dc143c" emissive="#dc143c" emissiveIntensity={0.5} />
          </mesh>
        );
      })}

      {/* Right hand — modak */}
      <mesh position={[0.38, 0.9, 0.2]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#f4d03f" />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.36, 0.9, 0.1]} rotation={[0.2, 0, -0.8]}>
        <capsuleGeometry args={[0.07, 0.28, 4, 8]} />
        <meshStandardMaterial color={v.bodyColor} />
      </mesh>
      <mesh position={[0.36, 0.9, 0.1]} rotation={[0.2, 0, 0.8]}>
        <capsuleGeometry args={[0.07, 0.28, 4, 8]} />
        <meshStandardMaterial color={v.bodyColor} />
      </mesh>

      {/* Ornament necklace */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const a = (i / 6) * Math.PI - Math.PI / 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.35, 1.02, Math.sin(a) * 0.18 + 0.1]}>
            <sphereGeometry args={[0.04, 6, 6]} />
            <meshStandardMaterial color={v.ornamentColor} metalness={0.8} roughness={0.2} />
          </mesh>
        );
      })}

      {/* Flowers on idol */}
      {[0, 1, 2].map((i) => {
        const a = (i / 3) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.5, 0.25, Math.sin(a) * 0.42]}>
            <sphereGeometry args={[0.06, 6, 6]} />
            <meshStandardMaterial color="#ff69b4" emissive="#ff69b4" emissiveIntensity={0.3} />
          </mesh>
        );
      })}

      {/* Glow light */}
      {showGlow && (
        <pointLight
          ref={glowRef}
          position={[0, 1, 0]}
          color={v.glowColor}
          intensity={0.8}
          distance={4}
        />
      )}
    </group>
  );
}
