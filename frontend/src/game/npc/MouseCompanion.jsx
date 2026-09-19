import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

const STATES = { idle: 'idle', follow: 'follow', celebrate: 'celebrate', hint: 'hint' };

export default function MouseCompanion({ playerPositionRef, hint = null }) {
  const groupRef = useRef();
  const [showHint, setShowHint] = useState(!!hint);
  const stateRef = useRef(STATES.follow);
  const timeRef = useRef(0);
  const targetRef = useRef(new THREE.Vector3(1.5, 0, 1.5));

  useFrame((_, delta) => {
    if (!groupRef.current || !playerPositionRef?.current) return;
    timeRef.current += delta;
    const playerPos = playerPositionRef.current;

    // Follow player at an offset
    const offset = new THREE.Vector3(
      1.2 * Math.sin(timeRef.current * 0.5),
      0,
      1.2 * Math.cos(timeRef.current * 0.5)
    );
    targetRef.current.set(playerPos.x + offset.x, 0, playerPos.z + offset.z);
    groupRef.current.position.lerp(targetRef.current, 0.05);

    // Bob up and down
    groupRef.current.position.y = 0.1 + Math.abs(Math.sin(timeRef.current * 3)) * 0.12;

    // Face player
    const dir = new THREE.Vector3(playerPos.x, 0, playerPos.z)
      .sub(new THREE.Vector3(groupRef.current.position.x, 0, groupRef.current.position.z));
    if (dir.lengthSq() > 0.01) {
      const angle = Math.atan2(dir.x, dir.z);
      groupRef.current.rotation.y = angle;
    }

    // Tail wag
    if (groupRef.current.children[4]) {
      groupRef.current.children[4].rotation.y = Math.sin(timeRef.current * 6) * 0.5;
    }
  });

  return (
    <group ref={groupRef} position={[1.5, 0.1, 1.5]}>
      {/* Body */}
      <mesh castShadow>
        <sphereGeometry args={[0.18, 10, 10]} />
        <meshStandardMaterial color="#c8a882" />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.1, 0.15]} castShadow>
        <sphereGeometry args={[0.13, 10, 10]} />
        <meshStandardMaterial color="#c8a882" />
      </mesh>
      {/* Ears */}
      <mesh position={[-0.08, 0.22, 0.15]}>
        <sphereGeometry args={[0.05, 6, 6]} />
        <meshStandardMaterial color="#e8c8a0" />
      </mesh>
      <mesh position={[0.08, 0.22, 0.15]}>
        <sphereGeometry args={[0.05, 6, 6]} />
        <meshStandardMaterial color="#e8c8a0" />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.05, 0.12, 0.27]}>
        <sphereGeometry args={[0.025, 6, 6]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[0.05, 0.12, 0.27]}>
        <sphereGeometry args={[0.025, 6, 6]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      {/* Tail */}
      <mesh position={[0, 0.05, -0.22]} rotation={[0.4, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.01, 0.25, 6]} />
        <meshStandardMaterial color="#c8a882" />
      </mesh>
      {/* Hint bubble */}
      {(showHint || hint) && (
        <Html position={[0, 0.5, 0]} center style={{ pointerEvents: 'none' }}>
          <div style={{
            background: 'rgba(255,255,255,0.95)',
            border: '2px solid #ff8c00',
            borderRadius: 12,
            padding: '4px 10px',
            fontSize: 11,
            fontWeight: 'bold',
            color: '#333',
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}>
            💡 {hint || 'Follow me!'}
          </div>
        </Html>
      )}
    </group>
  );
}
