import { Ground, Marigold, Banner, SceneLighting, Tree } from '../world/Environment';
import Collectible from '../interaction/Collectible';
import NPC from '../npc/NPC';
import useGameStore from '../../store/useGameStore';

function MarketStall({ position, color, label, children }) {
  return (
    <group position={position}>
      {/* Stall frame */}
      <mesh position={[0, 1.4, 0]}>
        <boxGeometry args={[2.5, 0.1, 1.5]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Canopy posts */}
      {[[-1.1, 0, -0.6], [1.1, 0, -0.6], [-1.1, 0, 0.6], [1.1, 0, 0.6]].map((p, i) => (
        <mesh key={i} position={[p[0], 0.7, p[2]]}>
          <cylinderGeometry args={[0.06, 0.06, 1.4, 6]} />
          <meshStandardMaterial color="#8b4513" />
        </mesh>
      ))}
      {/* Counter */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[2.2, 0.6, 1.2]} />
        <meshStandardMaterial color="#d4a86a" roughness={0.7} />
      </mesh>
      {/* Back wall */}
      <mesh position={[0, 1.0, -0.7]}>
        <boxGeometry args={[2.5, 2.0, 0.1]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {children}
    </group>
  );
}

export default function Level3Market() {
  const flowerItems = [
    [-5, 0, -3], [-4.5, 0, -1], [-5.5, 0, 1],
    [-3, 0, -4], [-6, 0, -5],
  ];
  const diyaItems = [
    [0, 0, -5], [0.5, 0, -3], [-0.5, 0, -4],
  ];
  const decorItems = [
    [5, 0, -3], [5.5, 0, -1], [4.5, 0, -5],
  ];
  const modakItems = [
    [0, 0, 3], [1, 0, 4], [-1, 0, 3], [0.5, 0, 5], [-0.5, 0, 5],
  ];

  return (
    <group>
      <SceneLighting quality="medium" timeOfDay="day" />
      <Ground size={80} color="#c8a96e" />

      {/* Market ground */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#d4b896" roughness={0.9} />
      </mesh>

      {/* Market stalls */}
      <MarketStall position={[-5, 0, -2]} color="#ff69b4" label="Flowers">
        {[[-0.6, 0.85, 0], [0, 0.85, 0], [0.6, 0.85, 0]].map((p, i) => (
          <Marigold key={i} position={p} scale={0.5} color={['#ff8c00', '#ffd700', '#ff69b4'][i]} />
        ))}
      </MarketStall>

      <MarketStall position={[0, 0, -5]} color="#ff8c00" label="Diyas">
        {[[-0.5, 0.82, 0], [0, 0.82, 0], [0.5, 0.82, 0]].map((p, i) => (
          <mesh key={i} position={p}>
            <cylinderGeometry args={[0.1, 0.07, 0.08, 8]} />
            <meshStandardMaterial color="#c4722a" />
          </mesh>
        ))}
      </MarketStall>

      <MarketStall position={[5, 0, -2]} color="#9370db" label="Decorations">
        {[[-0.5, 0.85, 0], [0, 0.85, 0], [0.5, 0.85, 0]].map((p, i) => (
          <mesh key={i} position={p}>
            <boxGeometry args={[0.2, 0.2, 0.1]} />
            <meshStandardMaterial color={['#ffd700', '#dc143c', '#ff8c00'][i]} />
          </mesh>
        ))}
      </MarketStall>

      <MarketStall position={[0, 0, 2]} color="#f4d03f" label="Modaks">
        {[[-0.5, 0.85, 0], [0, 0.85, 0], [0.5, 0.85, 0]].map((p, i) => (
          <mesh key={i} position={p}>
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshStandardMaterial color="#f4d03f" />
          </mesh>
        ))}
      </MarketStall>

      {/* Collectibles at stalls */}
      {flowerItems.map((pos, i) => (
        <Collectible key={`mf_${i}`} id={`mkt_flower_${i}`} type="flower" position={pos} missionId="l3_buy_flowers" />
      ))}
      {diyaItems.map((pos, i) => (
        <Collectible key={`md_${i}`} id={`mkt_diya_${i}`} type="diya" position={pos} missionId="l3_buy_diyas" />
      ))}
      {decorItems.map((pos, i) => (
        <Collectible key={`mdc_${i}`} id={`mkt_dec_${i}`} type="decoration" position={pos} missionId="l3_buy_decorations" />
      ))}
      {modakItems.map((pos, i) => (
        <Collectible key={`mm_${i}`} id={`mkt_modak_${i}`} type="modak" position={pos} missionId="l3_buy_modaks" />
      ))}

      {/* Seller NPCs */}
      <NPC
        id="flower_seller" position={[-5, 0, -0.5]} name="Flower Seller" outfit={3}
        dialogue={[
          { text: "Welcome! Fresh marigolds for Ganesha! 🌺" },
          { text: "Take some flowers for your decoration!" },
        ]}
        onTalk={() => useGameStore.getState().advanceMission('l3_talk_seller', 1)}
      />
      <NPC
        id="diya_seller" position={[0, 0, -3.5]} name="Diya Seller" outfit={1}
        dialogue={[
          { text: "Beautiful handmade diyas! 🪔" },
          { text: "Light them for Ganesha's blessings!" },
        ]}
        onTalk={() => useGameStore.getState().advanceMission('l3_talk_seller', 1)}
      />
      <NPC
        id="modak_seller" position={[0, 0, 3.5]} name="Modak Seller" outfit={2}
        dialogue={[
          { text: "Fresh modaks, Ganesha's favorite sweet! 🍬" },
          { text: "Made with jaggery and coconut. Delicious!" },
        ]}
        onTalk={() => useGameStore.getState().advanceMission('l3_talk_seller', 1)}
      />

      {/* Decoration + eco items */}
      <Collectible id="eco_1" type="ecoItem" position={[3, 0, 3]} missionId={null} />
      <Collectible id="eco_2" type="ecoItem" position={[-3, 0, 3]} missionId={null} />

      {/* Banners */}
      <Banner position={[0, 5, -12]} width={8} color="#ff8c00" />
      <Banner position={[-8, 4, 0]} width={5} color="#dc143c" />
      <Banner position={[8, 4, 0]} width={5} color="#9370db" />

      {/* Trees and flowers */}
      <Tree position={[-12, 0, -8]} height={4} />
      <Tree position={[12, 0, -8]} height={4} />
      <Tree position={[-12, 0, 5]} height={3.5} />
      <Tree position={[12, 0, 5]} height={3.5} />

      {[[-9, 0, -6], [9, 0, -6], [-9, 0, 0], [9, 0, 0]].map((p, i) => (
        <Marigold key={i} position={p} color={['#ff8c00', '#ffd700', '#ff69b4', '#ff8c00'][i]} />
      ))}

      {/* Crowd ambience NPCs */}
      <NPC id="crowd_1" position={[-3, 0, 0]} name="Visitor" outfit={4}
        dialogue={[{ text: "What a wonderful festival market! 🎉" }]} />
      <NPC id="crowd_2" position={[3, 0, -1]} name="Festival-Goer" outfit={5}
        dialogue={[{ text: "Jai Ganesh! Have you tried the modaks?" }]} />
    </group>
  );
}
