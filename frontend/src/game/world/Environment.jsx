import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sky, Stars, Cloud } from '@react-three/drei';
import * as THREE from 'three';

// Procedural ground plane
export function Ground({ size = 80, color = '#c8a96e' }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.01, 0]}>
      <planeGeometry args={[size, size]} />
      <meshStandardMaterial color={color} roughness={0.9} metalness={0} />
    </mesh>
  );
}

// Marigold flower — procedural
export function Marigold({ position = [0, 0, 0], color = '#ff8c00', scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      {/* Stem */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.3, 6]} />
        <meshStandardMaterial color="#2d5a27" />
      </mesh>
      {/* Petals */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 0.12, 0.31, Math.sin(angle) * 0.12]}
            rotation={[0, angle, Math.PI / 6]}
          >
            <sphereGeometry args={[0.08, 5, 5]} />
            <meshStandardMaterial color={color} />
          </mesh>
        );
      })}
      {/* Center */}
      <mesh position={[0, 0.33, 0]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshStandardMaterial color="#ffd700" />
      </mesh>
    </group>
  );
}

// Diya lamp — procedural
export function Diya({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      {/* Clay bowl */}
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.1, 0.06, 0.08, 12]} />
        <meshStandardMaterial color="#c4722a" roughness={0.8} />
      </mesh>
      {/* Flame */}
      <pointLight position={[0, 0.18, 0]} color="#ff6600" intensity={0.6} distance={2} />
      <mesh position={[0, 0.16, 0]}>
        <coneGeometry args={[0.025, 0.08, 6]} />
        <meshStandardMaterial color="#ffdd44" emissive="#ff8800" emissiveIntensity={2} transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

// Festival banner / torana
export function Banner({ position = [0, 3, 0], width = 4, color = '#dc143c' }) {
  const flags = Array.from({ length: 7 });
  return (
    <group position={position}>
      {/* Rope */}
      <mesh>
        <cylinderGeometry args={[0.02, 0.02, width, 4]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      {flags.map((_, i) => {
        const x = (i / 6) * width - width / 2;
        const c = i % 3 === 0 ? '#dc143c' : i % 3 === 1 ? '#ffd700' : '#ff8c00';
        return (
          <mesh key={i} position={[x, -0.2, 0]}>
            <boxGeometry args={[0.35, 0.4, 0.01]} />
            <meshStandardMaterial color={c} />
          </mesh>
        );
      })}
    </group>
  );
}

// Festival light string
export function FestivalLights({ points = [], color = '#ffdd00' }) {
  if (points.length < 2) return null;
  return (
    <group>
      {points.map((pt, i) => (
        <group key={i} position={pt}>
          <pointLight color={color} intensity={0.4} distance={3} />
          <mesh>
            <sphereGeometry args={[0.06, 6, 6]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Rangoli pattern — procedural circles
export function Rangoli({ position = [0, 0.01, 0], radius = 1.2 }) {
  const colors = ['#dc143c', '#ffd700', '#ff8c00', '#ff69b4', '#9370db'];
  return (
    <group position={position} rotation={[-Math.PI / 2, 0, 0]}>
      {colors.map((c, i) => (
        <mesh key={i} position={[0, 0, i * 0.001]}>
          <ringGeometry args={[(i / colors.length) * radius, ((i + 0.7) / colors.length) * radius, 32]} />
          <meshStandardMaterial color={c} side={THREE.DoubleSide} />
        </mesh>
      ))}
      {/* Dots */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        return (
          <mesh key={'d' + i} position={[Math.cos(angle) * radius * 0.85, Math.sin(angle) * radius * 0.85, 0.01]}>
            <circleGeometry args={[0.05, 8]} />
            <meshStandardMaterial color="#ffd700" />
          </mesh>
        );
      })}
    </group>
  );
}

// Tree — procedural palm/tree
export function Tree({ position = [0, 0, 0], height = 3 }) {
  return (
    <group position={position}>
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[0.12, 0.18, height, 7]} />
        <meshStandardMaterial color="#8b6914" />
      </mesh>
      {[0, 1, 2, 3].map((i) => {
        const angle = (i / 4) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 0.5, height + 0.3, Math.sin(angle) * 0.5]}
            rotation={[0.4, angle, 0]}
          >
            <coneGeometry args={[0.8, 1.8, 5]} />
            <meshStandardMaterial color="#2d8b2d" />
          </mesh>
        );
      })}
    </group>
  );
}

// Animated particle float (marigold petals etc)
export function FloatingPetals({ count = 20, area = 30 }) {
  const meshRef = useRef();
  const positions = useRef(
    Float32Array.from(
      Array.from({ length: count * 3 }, () => (Math.random() - 0.5) * area)
    )
  );
  const speeds = useRef(Array.from({ length: count }, () => 0.003 + Math.random() * 0.005));

  useFrame(() => {
    if (!meshRef.current) return;
    const pos = meshRef.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      pos.array[i * 3 + 1] += speeds.current[i];
      if (pos.array[i * 3 + 1] > 8) pos.array[i * 3 + 1] = 0;
      pos.array[i * 3] += Math.sin(Date.now() * 0.0005 + i) * 0.005;
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions.current}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#ff8c00" size={0.08} transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

// Scene lighting setup
export function SceneLighting({ quality = 'medium', timeOfDay = 'day' }) {
  const isEvening = timeOfDay === 'evening';
  const skyColor = isEvening ? '#ff6b35' : '#87ceeb';
  const ambientInt = quality === 'low' ? 0.6 : 0.5;

  return (
    <>
      <ambientLight intensity={ambientInt} color={isEvening ? '#ffaa66' : '#ffffff'} />
      <directionalLight
        position={isEvening ? [5, 8, -5] : [10, 15, 10]}
        intensity={quality === 'low' ? 0.8 : 1.2}
        color={isEvening ? '#ff9944' : '#fffaf0'}
        castShadow={quality !== 'low'}
        shadow-mapSize={[quality === 'ultra' ? 2048 : 1024, quality === 'ultra' ? 2048 : 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={60}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />
      <hemisphereLight skyColor={skyColor} groundColor="#8b6914" intensity={0.3} />
      {quality !== 'low' && (
        <Sky
          sunPosition={isEvening ? [0.5, 0.1, -1] : [1, 0.5, 0]}
          turbidity={isEvening ? 8 : 4}
          rayleigh={isEvening ? 3 : 1}
        />
      )}
      {isEvening && quality !== 'low' && <Stars radius={60} depth={30} count={1000} fade />}
    </>
  );
}
