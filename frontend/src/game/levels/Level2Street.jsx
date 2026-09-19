import { useState } from 'react';
import { Ground, Marigold, Diya, Banner, Tree, FestivalLights, SceneLighting } from '../world/Environment';
import Collectible from '../interaction/Collectible';
import NPC from '../npc/NPC';
import { useRegisterInteractable } from '../interaction/InteractionSystem';
import useGameStore from '../../store/useGameStore';

function CleanSpot({ id, position, missionId }) {
  const [cleaned, setCleaned] = useState(false);
  const pos3 = { x: position[0], y: 0, z: position[2] };

  useRegisterInteractable({
    id, type: 'clean', displayName: '🧹 Clean Area',
    interactionLabel: 'CLEAN', position: pos3,
    onInteract: () => {
      if (cleaned) return;
      setCleaned(true);
      const store = useGameStore.getState();
      store.addScore(20, '+20 ⭐ Cleaned!');
      store.addEcoScore(20);
      if (missionId) store.advanceMission(missionId, 1);
    },
    active: !cleaned,
  });

  if (cleaned) return null;
  return (
    <mesh position={[position[0], 0.02, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[0.8, 0.8]} />
      <meshStandardMaterial color="#888" transparent opacity={0.4} />
    </mesh>
  );
}

function InviteSpot({ id, position, npcName, outfit, missionId }) {
  const [invited, setInvited] = useState(false);

  const handleTalk = () => {
    if (invited) return;
    setInvited(true);
    const store = useGameStore.getState();
    store.addScore(20, `+20 ⭐ ${npcName} invited!`);
    if (missionId) store.advanceMission(missionId, 1);
  };

  return (
    <NPC
      id={id}
      position={position}
      name={npcName}
      outfit={outfit}
      dialogue={invited
        ? [{ text: `We'll be there! Jai Ganesh! 🐘` }]
        : [
            { text: `Hello! Are you preparing for Vinayaka Chavithi?` },
            { text: `We'd love to join the celebration!`, action: 'invite' },
          ]
      }
      missionId={missionId}
      onTalk={handleTalk}
    />
  );
}

export default function Level2Street() {
  const flowers = [
    [-6, 0, -3], [6, 0, -3], [-4, 0, 2], [4, 0, 2],
    [-7, 0, 1], [7, 0, 1], [0, 0, 4], [-3, 0, -5],
    [3, 0, -5], [-5, 0, 3], [5, 0, 3],
  ];

  const cleanSpots = [
    [-5, 0, 0], [5, 0, 0], [0, 0, -4], [-3, 0, 3], [3, 0, 3],
  ];

  return (
    <group>
      <SceneLighting quality="medium" timeOfDay="day" />
      <Ground size={80} color="#c8a96e" />

      {/* Street road */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, 50]} />
        <meshStandardMaterial color="#888" roughness={0.9} />
      </mesh>

      {/* Sidewalks */}
      <mesh position={[-4, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2, 50]} />
        <meshStandardMaterial color="#b8a88a" roughness={0.9} />
      </mesh>
      <mesh position={[4, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2, 50]} />
        <meshStandardMaterial color="#b8a88a" roughness={0.9} />
      </mesh>

      {/* Houses left side */}
      {[-12, -4, 4, 12].map((z, i) => (
        <group key={`lh_${i}`} position={[-9, 0, z]}>
          <mesh position={[0, 1.2, 0]} castShadow>
            <boxGeometry args={[5, 2.4, 5]} />
            <meshStandardMaterial color={['#f5deb3', '#ffe4b5', '#ffd9b3', '#f5e6d3'][i]} />
          </mesh>
          <mesh position={[0, 2.7, 0]}>
            <coneGeometry args={[3.2, 1.5, 4]} />
            <meshStandardMaterial color={['#dc143c', '#ff8c00', '#9370db', '#dc143c'][i]} />
          </mesh>
        </group>
      ))}

      {/* Houses right side */}
      {[-12, -4, 4, 12].map((z, i) => (
        <group key={`rh_${i}`} position={[9, 0, z]}>
          <mesh position={[0, 1.2, 0]} castShadow>
            <boxGeometry args={[5, 2.4, 5]} />
            <meshStandardMaterial color={['#ffe4b5', '#f5deb3', '#f5e6d3', '#ffd9b3'][i]} />
          </mesh>
          <mesh position={[0, 2.7, 0]}>
            <coneGeometry args={[3.2, 1.5, 4]} />
            <meshStandardMaterial color={['#ff8c00', '#dc143c', '#dc143c', '#9370db'][i]} />
          </mesh>
        </group>
      ))}

      {/* Street banners */}
      <Banner position={[-2.5, 5, -10]} width={5} color="#dc143c" />
      <Banner position={[2.5, 5, -5]} width={5} color="#ffd700" />
      <Banner position={[-2.5, 5, 0]} width={5} color="#ff8c00" />
      <Banner position={[2.5, 5, 5]} width={5} color="#9370db" />

      {/* Festival lights along street */}
      <FestivalLights
        points={[[-2, 5, -14], [-1, 5.5, -7], [0, 5.8, 0], [1, 5.5, 7], [2, 5, 14]]}
        color="#ffdd00"
      />

      {/* Trees */}
      {[-12, -4, 4, 12].map((z, i) => <Tree key={i} position={[-6, 0, z]} height={3.5} />)}
      {[-12, -4, 4, 12].map((z, i) => <Tree key={i + 10} position={[6, 0, z]} height={3.5} />)}

      {/* Marigolds along path */}
      {[-10, -6, -2, 2, 6, 10].map((z, i) => (
        <Marigold key={i} position={[-5, 0, z]} color={['#ff8c00', '#ffd700', '#ff69b4', '#ff8c00', '#ffd700', '#ff69b4'][i]} />
      ))}
      {[-10, -6, -2, 2, 6, 10].map((z, i) => (
        <Marigold key={i + 20} position={[5, 0, z]} color={['#ffd700', '#ff8c00', '#ff69b4', '#ffd700', '#ff8c00', '#ff69b4'][i]} />
      ))}

      {/* Flower collectibles */}
      {flowers.map((pos, i) => (
        <Collectible
          key={`sf_${i}`}
          id={`street_flower_${i}`}
          type="flower"
          position={pos}
          missionId="l2_collect_flowers"
        />
      ))}

      {/* Clean spots */}
      {cleanSpots.map((pos, i) => (
        <CleanSpot key={i} id={`clean_${i}`} position={pos} missionId="l2_clean_street" />
      ))}

      {/* NPCs to invite */}
      <InviteSpot id="family_1" position={[-7, 0, -6]} npcName="Ramu Family" outfit={0} missionId="l2_invite_people" />
      <InviteSpot id="family_2" position={[7, 0, -6]} npcName="Sita Family" outfit={1} missionId="l2_invite_people" />
      <InviteSpot id="family_3" position={[-7, 0, 2]} npcName="Gopal Family" outfit={2} missionId="l2_invite_people" />
      <InviteSpot id="family_4" position={[7, 0, 2]} npcName="Meena Family" outfit={3} missionId="l2_invite_people" />
      <InviteSpot id="family_5" position={[0, 0, -8]} npcName="Arjun Family" outfit={4} missionId="l2_invite_people" />

      {/* Children NPCs */}
      <NPC
        id="child_1" position={[-3, 0, 1]} name="Raju" outfit={1}
        dialogue={[
          { text: "Can you help me hang these flowers? 🌺" },
          { text: "Thank you! Ganesh blessings to you! 🐘" },
        ]}
        onTalk={() => useGameStore.getState().advanceMission('l2_help_children', 1)}
      />
      <NPC
        id="child_2" position={[3, 0, 1]} name="Priya" outfit={3}
        dialogue={[
          { text: "I need help decorating our doorway!" },
          { text: "The festival is so exciting!" },
        ]}
        onTalk={() => useGameStore.getState().advanceMission('l2_help_children', 1)}
      />
      <NPC
        id="child_3" position={[0, 0, -2]} name="Kiran" outfit={5}
        dialogue={[
          { text: "Please help me clean this area for the procession!" },
          { text: "Thank you so much!" },
        ]}
        onTalk={() => useGameStore.getState().advanceMission('l2_help_children', 1)}
      />
    </group>
  );
}
