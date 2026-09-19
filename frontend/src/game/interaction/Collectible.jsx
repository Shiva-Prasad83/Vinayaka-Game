import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useRegisterInteractable } from './InteractionSystem';
import useGameStore from '../../store/useGameStore';

const ITEM_CONFIGS = {
  flower:     { emoji: '🌺', label: 'COLLECT', color: '#ff69b4', scoreLabel: '+10 ⭐', score: 10, inventoryKey: 'flowers',     size: 0.15 },
  diya:       { emoji: '🪔', label: 'COLLECT', color: '#ff8c00', scoreLabel: '+10 ⭐', score: 10, inventoryKey: 'diyas',        size: 0.14 },
  decoration: { emoji: '🎊', label: 'COLLECT', color: '#9370db', scoreLabel: '+50 ⭐', score: 50, inventoryKey: 'decorations',  size: 0.16 },
  modak:      { emoji: '🍬', label: 'COLLECT', color: '#f4d03f', scoreLabel: '+10 ⭐', score: 10, inventoryKey: 'modaks',       size: 0.14 },
  leaf:       { emoji: '🍃', label: 'COLLECT', color: '#2ecc71', scoreLabel: '+5 ⭐',  score: 5,  inventoryKey: 'leaves',       size: 0.13 },
  ecoItem:    { emoji: '♻️', label: 'COLLECT', color: '#27ae60', scoreLabel: '+100 ⭐',score: 100, inventoryKey: 'ecoMaterials', size: 0.16, ecoReward: 100 },
};

export default function Collectible({
  id, type = 'flower', position = [0, 0, 0],
  missionId, collected: externalCollected = false,
  onCollect,
}) {
  const [collected, setCollected] = useState(externalCollected);
  const meshRef = useRef();
  const timeRef = useRef(Math.random() * 10);
  const config = ITEM_CONFIGS[type] ?? ITEM_CONFIGS.flower;

  const pos3 = { x: position[0], y: position[1] ?? 0, z: position[2] };

  const handleInteract = () => {
    if (collected) return;
    setCollected(true);
    const store = useGameStore.getState();
    store.addToInventory(config.inventoryKey, 1);
    store.addScore(config.score, config.scoreLabel);
    if (config.ecoReward) store.addEcoScore(config.ecoReward);
    if (missionId) store.advanceMission(missionId, 1);
    onCollect?.();
  };

  useRegisterInteractable({
    id,
    type: 'collectible',
    displayName: `${config.emoji} ${type.charAt(0).toUpperCase() + type.slice(1)}`,
    interactionLabel: config.label,
    position: pos3,
    onInteract: handleInteract,
    active: !collected,
  });

  useFrame((_, delta) => {
    if (!meshRef.current || collected) return;
    timeRef.current += delta;
    meshRef.current.rotation.y += delta * 1.5;
    meshRef.current.position.y = 0.4 + Math.sin(timeRef.current * 2) * 0.1;
  });

  if (collected) return null;

  return (
    <group position={[position[0], 0, position[2]]}>
      <mesh ref={meshRef} position={[0, 0.4, 0]} castShadow>
        <sphereGeometry args={[config.size, 10, 10]} />
        <meshStandardMaterial
          color={config.color}
          emissive={config.color}
          emissiveIntensity={0.3}
          metalness={0.1}
          roughness={0.6}
        />
      </mesh>
      {/* Glow ring */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[config.size * 1.5, config.size * 2.2, 16]} />
        <meshStandardMaterial color={config.color} transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
      {/* Label */}
      <Html position={[0, 0.7, 0]} center style={{ pointerEvents: 'none' }}>
        <div style={{
          background: 'rgba(0,0,0,0.75)',
          color: '#fff',
          padding: '2px 7px',
          borderRadius: 6,
          fontSize: 10,
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
          border: `1px solid ${config.color}`,
        }}>
          {config.emoji}
        </div>
      </Html>
    </group>
  );
}
