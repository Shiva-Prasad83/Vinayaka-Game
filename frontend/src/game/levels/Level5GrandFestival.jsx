import { useState } from 'react';
import { Html } from '@react-three/drei';
import { Ground, Marigold, Diya, Banner, Rangoli, Tree, FestivalLights, SceneLighting, FloatingPetals } from '../world/Environment';
import GaneshaIdol from '../world/GaneshaIdol';
import NPC from '../npc/NPC';
import { useRegisterInteractable } from '../interaction/InteractionSystem';
import useGameStore from '../../store/useGameStore';

function FestivalLight({ position, color }) {
  const spotKey = `festlight_${position.join('_')}`;
  const lit = !!useGameStore(s => s.missionProgress[spotKey]);
  const pos3 = { x: position[0], y: 0, z: position[2] };

  useRegisterInteractable({
    id: spotKey, type: 'place',
    displayName: '✨ Festival Light', interactionLabel: 'LIGHT IT',
    position: pos3,
    onInteract: () => {
      const s = useGameStore.getState();
      if (s.missionProgress[spotKey]) return;
      useGameStore.setState(prev => ({
        missionProgress: { ...prev.missionProgress, [spotKey]: 1 },
      }));
      s.addScore(20, '+20 ⭐ Light lit!');
      s.advanceMission('l5_light_stage', 1);
    },
    active: !lit,
  });

  return (
    <group position={position}>
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 1.6, 6]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      <mesh position={[0, 1.65, 0]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial
          color={lit ? color : '#888'}
          emissive={lit ? color : '#000'}
          emissiveIntensity={lit ? 2 : 0}
        />
      </mesh>
      {lit && <pointLight position={[0, 1.65, 0]} color={color} intensity={0.8} distance={4} />}
    </group>
  );
}

function CelebrationSpot({ position }) {
  const spotKey = `celebrate_${position.join('_')}`;
  const celebrating = !!useGameStore(s => s.missionProgress[spotKey]);
  const pos3 = { x: position[0], y: 0, z: position[2] };

  useRegisterInteractable({
    id: spotKey, type: 'celebrate',
    displayName: '🎉 Celebrate!', interactionLabel: 'CELEBRATE',
    position: pos3,
    onInteract: () => {
      const s = useGameStore.getState();
      if (s.missionProgress[spotKey]) return;
      useGameStore.setState(prev => ({
        missionProgress: { ...prev.missionProgress, [spotKey]: 1 },
      }));
      s.advanceMission('l5_celebrate', 1);
      s.addScore(200, '+200 ⭐ Celebration!');
      s.addEcoScore(50);
    },
    active: !celebrating,
  });

  return (
    <group position={position}>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.5, 12]} />
        <meshStandardMaterial color="#ffd700" transparent opacity={celebrating ? 0 : 0.4} />
      </mesh>
      {celebrating && (
        <>
          <Diya position={[0, 0, 0]} />
          <Marigold position={[0.4, 0, 0]} color="#ff8c00" />
          <Marigold position={[-0.4, 0, 0]} color="#ffd700" />
        </>
      )}
    </group>
  );
}

function FestivalStage() {
  return (
    <group position={[0, 0, -12]}>
      {/* Main stage platform */}
      <mesh position={[0, 0.4, 0]} receiveShadow castShadow>
        <boxGeometry args={[16, 0.8, 8]} />
        <meshStandardMaterial color="#d4a86a" roughness={0.6} />
      </mesh>
      {/* Stage backdrop */}
      <mesh position={[0, 3.5, -3.8]}>
        <boxGeometry args={[16, 6.2, 0.3]} />
        <meshStandardMaterial color="#dc143c" roughness={0.5} />
      </mesh>
      {/* Stage backdrop decoration */}
      <mesh position={[0, 5.5, -3.7]}>
        <boxGeometry args={[14, 1.5, 0.1]} />
        <meshStandardMaterial color="#ffd700" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Arch pillars */}
      {[-7, 7].map((x, i) => (
        <mesh key={i} position={[x, 3.5, -1]}>
          <cylinderGeometry args={[0.4, 0.45, 7, 12]} />
          <meshStandardMaterial color="#f5deb3" roughness={0.6} />
        </mesh>
      ))}
      {/* Arch top */}
      <mesh position={[0, 7.2, -1]}>
        <boxGeometry args={[14.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#ff8c00" metalness={0.4} roughness={0.3} />
      </mesh>
      {/* Stage floor decorative tiles */}
      {[[-4, 0, 0], [0, 0, 0], [4, 0, 0]].map((p, i) => (
        <Rangoli key={i} position={[p[0], 0.81, p[2]]} radius={1.5} />
      ))}
    </group>
  );
}

function InviteMusicianSpot({ id, position, name, missionId }) {
  const [invited, setInvited] = useState(false);
  return (
    <NPC
      id={id} position={position} name={name} outfit={Math.floor(Math.random() * 6)}
      dialogue={invited
        ? [{ text: '🎵 Let the music play! Jai Ganesh!' }]
        : [
          { text: `I'm ${name}. Ready to perform for Ganesha!` },
          { text: 'Please invite me to the stage!' },
        ]
      }
      onTalk={() => {
        if (invited) return;
        setInvited(true);
        const store = useGameStore.getState();
        store.advanceMission(missionId, 1);
        store.addScore(25, `+25 ⭐ ${name} invited!`);
      }}
    />
  );
}

function DecorationSpot({ id, position, missionId }) {
  const spotKey = `spot_${id}`;
  const done = !!useGameStore(s => s.missionProgress[spotKey]);
  const pos3 = { x: position[0], y: 0, z: position[2] };

  useRegisterInteractable({
    id, type: 'decorate', displayName: '🎊 Festival Decoration',
    interactionLabel: 'DECORATE', position: pos3,
    onInteract: () => {
      const s = useGameStore.getState();
      if (s.missionProgress[spotKey]) return;
      useGameStore.setState(prev => ({
        missionProgress: { ...prev.missionProgress, [spotKey]: 1 },
      }));
      s.addScore(50, '+50 ⭐ Decorated!');
      s.addEcoScore(20);
      if (missionId) s.advanceMission(missionId, 1);
    },
    active: !done,
  });

  return done ? (
    <group position={position}>
      <Marigold position={[0, 0, 0]} color="#ff8c00" />
      <Diya position={[0.4, 0, 0.3]} />
      <Diya position={[-0.4, 0, 0.3]} />
    </group>
  ) : (
    <mesh position={[position[0], 0.02, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[0.3, 10]} />
      <meshStandardMaterial color="#ffd700" transparent opacity={0.3} />
    </mesh>
  );
}

function GrandIdolPlatform({ position }) {
  const placed = useGameStore(s => s.completedMissions.includes('l5_place_centerpiece'));
  const selectedGanesha = useGameStore(s => s.selectedGanesha);
  const pos3 = { x: position[0], y: 0, z: position[2] };

  useRegisterInteractable({
    id: 'grand_idol_platform',
    type: 'place',
    displayName: '🐘 Grand Idol Platform',
    interactionLabel: 'PLACE GRAND IDOL',
    position: pos3,
    onInteract: () => {
      const s = useGameStore.getState();
      if (s.completedMissions.includes('l5_place_centerpiece')) return;
      s.advanceMission('l5_place_centerpiece', 1);
      s.addScore(200, '+200 ⭐ Grand Idol Placed!');
    },
    active: !placed,
  });

  return (
    <group position={position}>
      {/* Ornate base platform */}
      <mesh position={[0, 0.15, 0]} receiveShadow castShadow>
        <boxGeometry args={[3, 0.3, 2.5]} />
        <meshStandardMaterial color="#d4a86a" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.32, 0]}>
        <boxGeometry args={[2.6, 0.08, 2.1]} />
        <meshStandardMaterial color="#ffd700" metalness={0.6} roughness={0.3} />
      </mesh>
      <Rangoli position={[0, 0.34, 0]} radius={1} />

      {!placed ? (
        <>
          {/* Glowing ring prompt */}
          <mesh position={[0, 0.36, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.5, 0.75, 20]} />
            <meshStandardMaterial color="#ffd700" transparent opacity={0.7} emissive="#ffd700" emissiveIntensity={0.5} />
          </mesh>
          {/* Floating label */}
          <Html position={[0, 1.8, 0]} center style={{ pointerEvents: 'none' }}>
            <div style={{
              background: 'rgba(0,0,0,0.78)',
              color: '#ffd700',
              padding: '4px 12px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              whiteSpace: 'nowrap',
              border: '1px solid rgba(255,215,0,0.5)',
            }}>
              🐘 Place Grand Idol here
            </div>
          </Html>
        </>
      ) : (
        <GaneshaIdol
          position={[0, 0.36, 0]}
          variant={selectedGanesha === 'golden' ? 'golden' : 'divine'}
          size={1.8}
          showGlow
        />
      )}
    </group>
  );
}

const lightColors = ['#ff8c00', '#ffd700', '#ff69b4', '#dc143c', '#9370db', '#00bcd4'];

const lightPositions = [
  [-8, 0, -5], [-5, 0, -5], [0, 0, -5], [5, 0, -5], [8, 0, -5], [3, 0, -8],
];

const decSpots = [
  [-10, 0, 2], [-7, 0, 4], [-4, 0, 6], [4, 0, 6], [7, 0, 4], [10, 0, 2], [-10, 0, -2], [10, 0, -2],
];

export default function Level5GrandFestival() {
  return (
    <group>
      <SceneLighting quality="high" timeOfDay="evening" />
      <Ground size={120} color="#b8956a" />
      <FloatingPetals count={30} area={40} />

      {/* Festival grounds */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#c8a870" roughness={0.8} />
      </mesh>

      {/* Grand stage */}
      <FestivalStage />

      {/* Grand Ganesha centerpiece on stage — walk up and press E to place */}
      <GrandIdolPlatform position={[0, 0.85, -13]} />

      {/* Grand Rangoli around idol platform */}
      <Rangoli position={[0, 0.86, -10]} radius={3} />

      {/* Festival lights */}
      {lightPositions.map((pos, i) => (
        <FestivalLight key={i} position={pos} color={lightColors[i % lightColors.length]} />
      ))}

      {/* Decoration spots */}
      {decSpots.map((pos, i) => (
        <DecorationSpot key={i} id={`gdec_${i}`} position={pos} missionId="l5_final_decoration" />
      ))}

      {/* Celebration spots */}
      <CelebrationSpot position={[-3, 0, 3]} />
      <CelebrationSpot position={[3, 0, 3]} />

      {/* Musician NPCs to invite */}
      <InviteMusicianSpot id="mus_1" position={[-6, 0, 2]} name="Tabla Player" missionId="l5_invite_musicians" />
      <InviteMusicianSpot id="mus_2" position={[6, 0, 2]} name="Veena Player" missionId="l5_invite_musicians" />
      <InviteMusicianSpot id="mus_3" position={[-4, 0, 5]} name="Flute Player" missionId="l5_invite_musicians" />
      <InviteMusicianSpot id="mus_4" position={[4, 0, 5]} name="Dhol Player" missionId="l5_invite_musicians" />

      {/* Crowd NPCs */}
      {[
        { id: 'crowd_f1', pos: [-8, 0, 3], name: 'Family', outfit: 0 },
        { id: 'crowd_f2', pos: [8, 0, 3], name: 'Devotee', outfit: 1 },
        { id: 'crowd_c1', pos: [-5, 0, 6], name: 'Child', outfit: 3 },
        { id: 'crowd_c2', pos: [5, 0, 6], name: 'Volunteer', outfit: 4 },
        { id: 'crowd_e1', pos: [0, 0, 7], name: 'Elder', outfit: 2 },
      ].map((n) => (
        <NPC key={n.id} id={n.id} position={n.pos} name={n.name} outfit={n.outfit}
          dialogue={[
            { text: 'Ganesh Chaturthi ki jai! 🐘🎉' },
            { text: 'This festival brings such joy to our hearts!' },
          ]}
        />
      ))}

      {/* Main banner */}
      <Banner position={[0, 9, -15.8]} width={16} color="#dc143c" />
      <Banner position={[-7.5, 7, -14]} width={6} color="#ffd700" />
      <Banner position={[7.5, 7, -14]} width={6} color="#ffd700" />

      {/* Side banners */}
      <Banner position={[-15, 5, 0]} width={6} color="#9370db" />
      <Banner position={[15, 5, 0]} width={6} color="#9370db" />

      {/* Festival string lights */}
      <FestivalLights
        points={[[-12, 6, -15], [-6, 7, -15], [0, 7.5, -15], [6, 7, -15], [12, 6, -15]]}
        color="#ffdd00"
      />
      <FestivalLights
        points={[[-10, 5, 0], [-5, 5.5, 0], [0, 6, 0], [5, 5.5, 0], [10, 5, 0]]}
        color="#ff8c00"
      />

      {/* Trees around festival ground */}
      {[-16, -10, 10, 16].map((x, i) => <Tree key={i} position={[x, 0, -8]} height={5} />)}
      {[-16, -10, 10, 16].map((x, i) => <Tree key={i + 10} position={[x, 0, 5]} height={4} />)}

      {/* Marigold rows */}
      {[-12, -8, -4, 0, 4, 8, 12].map((x, i) => (
        <Marigold key={i} position={[x, 0, -4]} color={['#ff8c00', '#ffd700', '#ff69b4', '#ff8c00', '#ffd700', '#ff69b4', '#ff8c00'][i]} />
      ))}
      {[-12, -8, -4, 0, 4, 8, 12].map((x, i) => (
        <Marigold key={i + 20} position={[x, 0, 8]} color={['#ffd700', '#ff8c00', '#ff69b4', '#ffd700', '#ff8c00', '#ff69b4', '#ffd700'][i]} />
      ))}
    </group>
  );
}
