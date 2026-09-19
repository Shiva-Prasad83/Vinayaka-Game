import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useRegisterInteractable } from '../interaction/InteractionSystem';
import useGameStore from '../../store/useGameStore';

const NPC_COLORS = ['#ff8c00', '#dc143c', '#9370db', '#2196f3', '#4caf50', '#ff69b4'];

export default function NPC({
  id, position = [0, 0, 0], name = 'Villager',
  outfit = 0, dialogue = [], onTalk, missionId,
}) {
  const groupRef = useRef();
  const timeRef = useRef(Math.random() * 10);
  const [isNearby, setIsNearby] = useState(false);

  const pos3 = { x: position[0], y: position[1] ?? 0, z: position[2] };

  const handleInteract = () => {
    const store = useGameStore.getState();
    if (dialogue.length > 0) {
      store.openDialogue({ npcName: name, lines: dialogue, missionId, onComplete: onTalk });
    } else {
      onTalk?.();
    }
  };

  useRegisterInteractable({
    id,
    type: 'npc',
    displayName: name,
    interactionLabel: 'TALK',
    position: pos3,
    onInteract: handleInteract,
  });

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    timeRef.current += delta;
    // Gentle idle sway
    groupRef.current.rotation.y = Math.sin(timeRef.current * 0.4) * 0.15;
    groupRef.current.children[0].position.y = Math.sin(timeRef.current * 1.2) * 0.01;
  });

  const color = NPC_COLORS[outfit % NPC_COLORS.length];
  const skinColor = '#d4956a';

  return (
    <group ref={groupRef} position={position}>
      <group>
        {/* Body */}
        <mesh position={[0, 0.6, 0]} castShadow>
          <boxGeometry args={[0.32, 0.48, 0.18]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {/* Head */}
        <mesh position={[0, 1.0, 0]} castShadow>
          <sphereGeometry args={[0.16, 10, 10]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>
        {/* Eyes */}
        <mesh position={[0.05, 1.02, 0.14]}>
          <sphereGeometry args={[0.025, 6, 6]} />
          <meshStandardMaterial color="#222" />
        </mesh>
        <mesh position={[-0.05, 1.02, 0.14]}>
          <sphereGeometry args={[0.025, 6, 6]} />
          <meshStandardMaterial color="#222" />
        </mesh>
        {/* Arms */}
        <mesh position={[-0.2, 0.65, 0]} rotation={[0, 0, 0.25]}>
          <capsuleGeometry args={[0.055, 0.28, 4, 8]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[0.2, 0.65, 0]} rotation={[0, 0, -0.25]}>
          <capsuleGeometry args={[0.055, 0.28, 4, 8]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {/* Legs */}
        <mesh position={[-0.09, 0.17, 0]}>
          <capsuleGeometry args={[0.065, 0.28, 4, 8]} />
          <meshStandardMaterial color="#5d3a1a" />
        </mesh>
        <mesh position={[0.09, 0.17, 0]}>
          <capsuleGeometry args={[0.065, 0.28, 4, 8]} />
          <meshStandardMaterial color="#5d3a1a" />
        </mesh>
      </group>
      {/* Name label (appears when nearby) */}
      <Html position={[0, 1.4, 0]} center style={{ pointerEvents: 'none' }}>
        <div style={{
          background: 'rgba(0,0,0,0.7)',
          color: '#ffd700',
          padding: '2px 8px',
          borderRadius: 8,
          fontSize: 11,
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
          border: '1px solid #ffd700',
        }}>
          👤 {name}
        </div>
      </Html>
    </group>
  );
}
