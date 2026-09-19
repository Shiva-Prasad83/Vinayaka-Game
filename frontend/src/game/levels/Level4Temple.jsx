import { Ground, Marigold, Diya, Banner, Rangoli, Tree, FestivalLights, SceneLighting } from '../world/Environment';
import GaneshaIdol from '../world/GaneshaIdol';
import Collectible from '../interaction/Collectible';
import NPC from '../npc/NPC';
import { useRegisterInteractable } from '../interaction/InteractionSystem';
import useGameStore from '../../store/useGameStore';

function FlowerArrangementSpot({ id, position, missionId }) {
  const spotKey = `spot_${id}`;
  const arranged = !!useGameStore(s => s.missionProgress[spotKey]);
  const pos3 = { x: position[0], y: 0, z: position[2] };

  useRegisterInteractable({
    id, type: 'place', displayName: '🌺 Flower Spot',
    interactionLabel: 'ARRANGE FLOWERS', position: pos3,
    onInteract: () => {
      const s = useGameStore.getState();
      if (s.missionProgress[spotKey]) return;
      useGameStore.setState(prev => ({
        missionProgress: { ...prev.missionProgress, [spotKey]: 1 },
      }));
      s.addScore(50, '+50 ⭐ Flowers arranged!');
      if (missionId) s.advanceMission(missionId, 1);
    },
    active: !arranged,
  });

  return arranged ? (
    <group position={position}>
      <Marigold position={[0, 0, 0]} color="#ff8c00" />
      <Marigold position={[0.3, 0, 0.2]} color="#ffd700" />
      <Marigold position={[-0.3, 0, 0.2]} color="#ff69b4" />
    </group>
  ) : (
    <mesh position={[position[0], 0.02, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[0.25, 10]} />
      <meshStandardMaterial color="#ff69b4" transparent opacity={0.4} />
    </mesh>
  );
}

function TempleDecorationSpot({ id, position, missionId }) {
  const completedMissions = useGameStore(s => s.completedMissions);
  const missionProgress = useGameStore(s => s.missionProgress);

  // Derive decorated state from store so it survives re-renders.
  // A spot is considered decorated if missionProgress for this missionId
  // accounts for it — we track per-spot using a unique id key in missionProgress.
  const spotKey = `spot_${id}`;
  const decorated = !!useGameStore(s => s.missionProgress[spotKey]);

  const pos3 = { x: position[0], y: 0, z: position[2] };

  useRegisterInteractable({
    id, type: 'decorate', displayName: '🎊 Temple Decoration',
    interactionLabel: 'DECORATE', position: pos3,
    onInteract: () => {
      const s = useGameStore.getState();
      if (s.missionProgress[spotKey]) return; // already decorated
      // Mark this individual spot
      s.set?.({ missionProgress: { ...s.missionProgress, [spotKey]: 1 } });
      // Use store setter properly
      useGameStore.setState(prev => ({
        missionProgress: { ...prev.missionProgress, [spotKey]: 1 },
      }));
      s.addScore(50, '+50 ⭐ Temple decorated!');
      if (missionId) s.advanceMission(missionId, 1);
    },
    active: !decorated,
  });

  return (
    <group position={position}>
      {decorated ? (
        <>
          <Marigold position={[0, 0, 0]} color="#ff8c00" />
          <Diya position={[0.3, 0, 0]} />
          <Diya position={[-0.3, 0, 0]} />
        </>
      ) : (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.2, 0.35, 10]} />
          <meshStandardMaterial color="#9370db" transparent opacity={0.4} />
        </mesh>
      )}
    </group>
  );
}

// Mini-game trigger spots
function MiniGameTrigger({ id, position, label, icon, missionId, onActivate }) {
  const pos3 = { x: position[0], y: 0, z: position[2] };
  const done = useGameStore(s => s.completedMissions.includes(missionId));

  useRegisterInteractable({
    id, type: 'minigame', displayName: `${icon} ${label}`,
    interactionLabel: 'START', position: pos3,
    onInteract: () => {
      if (done) return;
      onActivate?.();
    },
    active: !done,
  });

  return (
    <group position={position}>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 1, 12]} />
        <meshStandardMaterial color={done ? '#2ecc71' : '#9370db'} emissive={done ? '#1a9b5f' : '#5a1a8a'} emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[0, 1.1, 0]}>
        <sphereGeometry args={[0.2, 10, 10]} />
        <meshStandardMaterial color={done ? '#27ae60' : '#ffd700'} emissive={done ? '#1a7a40' : '#cc9900'} emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}

export default function Level4Temple({ onStartPuzzle, onStartMusic, onStartModak }) {
  return (
    <group>
      <SceneLighting quality="medium" timeOfDay="evening" />
      <Ground size={80} color="#b8956a" />

      {/* ── Temple interior floor ─────────────────────────────────────── */}
      <mesh position={[0, 0.01, -10]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 10]} />
        <meshStandardMaterial color="#e8d5b0" roughness={0.9} />
      </mesh>
      {/* Interior floor tile pattern */}
      {[-4, 0, 4].map((x, i) => (
        <mesh key={i} position={[x, 0.02, -10]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3.5, 9.5]} />
          <meshStandardMaterial color={i % 2 === 0 ? '#e0c898' : '#d4b880'} roughness={0.8} />
        </mesh>
      ))}

      {/* ── Temple walls (open box — no ceiling, open front) ─────────── */}
      {/* Back wall */}
      <mesh position={[0, 2.5, -14.9]} castShadow receiveShadow>
        <boxGeometry args={[14, 5, 0.4]} />
        <meshStandardMaterial color="#f5deb3" roughness={0.7} side={2} />
      </mesh>
      {/* Left wall */}
      <mesh position={[-6.8, 2.5, -10]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 5, 10]} />
        <meshStandardMaterial color="#f0d9b0" roughness={0.7} side={2} />
      </mesh>
      {/* Right wall */}
      <mesh position={[6.8, 2.5, -10]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 5, 10]} />
        <meshStandardMaterial color="#f0d9b0" roughness={0.7} side={2} />
      </mesh>
      {/* Front wall — left section (beside left pillar) */}
      <mesh position={[-5, 2.5, -5]} castShadow receiveShadow>
        <boxGeometry args={[3.6, 5, 0.4]} />
        <meshStandardMaterial color="#f0d9b0" roughness={0.7} side={2} />
      </mesh>
      {/* Front wall — right section */}
      <mesh position={[5, 2.5, -5]} castShadow receiveShadow>
        <boxGeometry args={[3.6, 5, 0.4]} />
        <meshStandardMaterial color="#f0d9b0" roughness={0.7} side={2} />
      </mesh>
      {/* Front wall — top beam over entrance */}
      <mesh position={[0, 4.3, -5]} castShadow>
        <boxGeometry args={[7.2, 1.4, 0.4]} />
        <meshStandardMaterial color="#f0d9b0" roughness={0.7} />
      </mesh>

      {/* ── Ceiling (double-sided so visible from inside) ────────────── */}
      <mesh position={[0, 5.05, -10]}>
        <boxGeometry args={[14, 0.15, 10]} />
        <meshStandardMaterial color="#e8cc98" roughness={0.8} side={2} />
      </mesh>
      {/* Ceiling beams */}
      {[-4, -1.3, 1.3, 4].map((x, i) => (
        <mesh key={i} position={[x, 4.92, -10]}>
          <boxGeometry args={[0.35, 0.25, 10]} />
          <meshStandardMaterial color="#c8a060" roughness={0.7} />
        </mesh>
      ))}

      {/* ── Shikhara (tower) ─────────────────────────────────────────── */}
      <mesh position={[0, 8, -10]}>
        <coneGeometry args={[3.5, 6, 8]} />
        <meshStandardMaterial color="#dc143c" roughness={0.5} />
      </mesh>
      {/* Shikhara base ring */}
      <mesh position={[0, 5.1, -10]}>
        <cylinderGeometry args={[3.8, 4.2, 0.5, 12]} />
        <meshStandardMaterial color="#c81030" roughness={0.5} metalness={0.2} />
      </mesh>

      {/* ── Sub towers ───────────────────────────────────────────────── */}
      {[-4.5, 4.5].map((x, i) => (
        <group key={i} position={[x, 0, -10]}>
          <mesh position={[0, 5.5, 0]}>
            <coneGeometry args={[1.8, 3, 8]} />
            <meshStandardMaterial color="#ff8c00" roughness={0.5} />
          </mesh>
          <mesh position={[0, 4, 0]}>
            <cylinderGeometry args={[2, 2.2, 3, 12]} />
            <meshStandardMaterial color="#f5deb3" roughness={0.7} />
          </mesh>
        </group>
      ))}

      {/* ── Entrance steps ───────────────────────────────────────────── */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, i * 0.15, -4.6 + i * 0.45]} receiveShadow>
          <boxGeometry args={[7, 0.15, 1.1]} />
          <meshStandardMaterial color="#d4b896" roughness={0.8} />
        </mesh>
      ))}

      {/* ── Interior pillars (4 inside) ───────────────────────────────── */}
      {[-2.8, -0.9, 0.9, 2.8].map((x, i) => (
        <group key={i}>
          {/* Pillar shaft */}
          <mesh position={[x, 2.5, -5.3]} castShadow>
            <cylinderGeometry args={[0.22, 0.26, 5, 12]} />
            <meshStandardMaterial color="#f0e0c0" roughness={0.5} />
          </mesh>
          {/* Pillar capital */}
          <mesh position={[x, 5.05, -5.3]}>
            <boxGeometry args={[0.6, 0.25, 0.6]} />
            <meshStandardMaterial color="#c8a050" metalness={0.4} roughness={0.4} />
          </mesh>
          {/* Pillar base */}
          <mesh position={[x, 0.08, -5.3]}>
            <boxGeometry args={[0.55, 0.16, 0.55]} />
            <meshStandardMaterial color="#c8a050" metalness={0.3} roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* ── Back inner pillars ────────────────────────────────────────── */}
      {[-4.5, 4.5].map((x, i) => (
        <group key={i}>
          <mesh position={[x, 2.5, -13.5]} castShadow>
            <cylinderGeometry args={[0.22, 0.26, 5, 12]} />
            <meshStandardMaterial color="#f0e0c0" roughness={0.5} />
          </mesh>
          <mesh position={[x, 5.05, -13.5]}>
            <boxGeometry args={[0.6, 0.25, 0.6]} />
            <meshStandardMaterial color="#c8a050" metalness={0.4} roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* ── Garbhagriha (sanctum) platform ───────────────────────────── */}
      <mesh position={[0, 0.08, -12.5]} receiveShadow castShadow>
        <boxGeometry args={[5, 0.16, 4]} />
        <meshStandardMaterial color="#c8a050" metalness={0.3} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.18, -12.5]}>
        <boxGeometry args={[4.4, 0.06, 3.4]} />
        <meshStandardMaterial color="#ffd700" metalness={0.5} roughness={0.3} />
      </mesh>
      <Rangoli position={[0, 0.2, -12.5]} radius={1.6} />

      {/* ── Interior wall decorations ────────────────────────────────── */}
      {/* Back wall carvings / niches */}
      {[-4, 0, 4].map((x, i) => (
        <mesh key={i} position={[x, 2.5, -14.6]}>
          <boxGeometry args={[2.2, 3, 0.15]} />
          <meshStandardMaterial color="#e8c878" metalness={0.2} roughness={0.6} />
        </mesh>
      ))}
      {/* Side wall relief strips */}
      {[-1.5, 1.5].map((z, i) => (
        <group key={i}>
          <mesh position={[-6.55, 2.5, -10 + z * 2]}>
            <boxGeometry args={[0.12, 3.5, 1.8]} />
            <meshStandardMaterial color="#e8c878" metalness={0.2} roughness={0.6} />
          </mesh>
          <mesh position={[6.55, 2.5, -10 + z * 2]}>
            <boxGeometry args={[0.12, 3.5, 1.8]} />
            <meshStandardMaterial color="#e8c878" metalness={0.2} roughness={0.6} />
          </mesh>
        </group>
      ))}

      {/* ── Interior point lights ─────────────────────────────────────── */}
      <pointLight position={[0, 3.5, -8]} color="#ffdd88" intensity={1.2} distance={12} />
      <pointLight position={[0, 3.5, -12]} color="#ffaa44" intensity={1.0} distance={10} />
      <pointLight position={[-4, 3, -10]} color="#ff8844" intensity={0.6} distance={8} />
      <pointLight position={[4, 3, -10]} color="#ff8844" intensity={0.6} distance={8} />

      {/* ── Temple courtyard (outside) ───────────────────────────────── */}
      <mesh position={[0, 0.02, -2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[16, 8]} />
        <meshStandardMaterial color="#d4b896" roughness={0.9} />
      </mesh>

      {/* Central Ganesha idol on sanctum */}
      <GaneshaIdol position={[0, 0.25, -13]} variant="divine" size={1.2} showGlow />

      {/* Rangoli patterns */}
      <Rangoli position={[0, 0.03, -5.5]} radius={2} />
      <Rangoli position={[-5, 0.03, -2]} radius={1} />
      <Rangoli position={[5, 0.03, -2]} radius={1} />

      {/* Decoration spots */}
      <TempleDecorationSpot id="tdec_1" position={[-3, 0, -6]} missionId="l4_decorate_temple" />
      <TempleDecorationSpot id="tdec_2" position={[3, 0, -6]} missionId="l4_decorate_temple" />
      <TempleDecorationSpot id="tdec_3" position={[-5, 0, -9]} missionId="l4_decorate_temple" />
      <TempleDecorationSpot id="tdec_4" position={[5, 0, -9]} missionId="l4_decorate_temple" />
      <TempleDecorationSpot id="tdec_5" position={[0, 0, -7]} missionId="l4_decorate_temple" />

      {/* Flower arrangement spots */}
      <FlowerArrangementSpot id="far_1" position={[-1.8, 0, -11]} missionId="l4_flower_arrangement" />
      <FlowerArrangementSpot id="far_2" position={[1.8, 0, -11]} missionId="l4_flower_arrangement" />
      <FlowerArrangementSpot id="far_3" position={[0, 0, -10.5]} missionId="l4_flower_arrangement" />

      {/* Mini-game trigger pillars */}
      <MiniGameTrigger
        id="puzzle_trigger" position={[-4, 0, 1]}
        label="Decoration Puzzle" icon="🧩" missionId="l4_puzzle"
        onActivate={() => onStartPuzzle?.()}
      />
      <MiniGameTrigger
        id="music_trigger" position={[4, 0, 1]}
        label="Music Challenge" icon="🥁" missionId="l4_music"
        onActivate={() => onStartMusic?.()}
      />
      <MiniGameTrigger
        id="modak_trigger" position={[0, 0, 1]}
        label="Modak Challenge" icon="🍬" missionId="l4_modak_challenge"
        onActivate={() => onStartModak?.()}
      />

      {/* ── Festival lights ───────────────────────────────────────────── */}
      {/* Inside temple */}
      <FestivalLights
        points={[[-5.5, 4.5, -6], [-2.5, 4.8, -8], [0, 5, -10], [2.5, 4.8, -8], [5.5, 4.5, -6]]}
        color="#ffdd00"
      />
      {/* Outside / entrance */}
      <FestivalLights
        points={[[-6, 4, -4], [-3, 4.5, -4], [0, 4.8, -4], [3, 4.5, -4], [6, 4, -4]]}
        color="#ffd700"
      />
      <FestivalLights
        points={[[-6, 5, -10], [-3, 5.5, -10], [0, 6, -10], [3, 5.5, -10], [6, 5, -10]]}
        color="#ff8c00"
      />

      {/* ── Diyas ─────────────────────────────────────────────────────── */}
      {/* Entrance row */}
      {[-3, -2, -1, 0, 1, 2, 3].map((x, i) => (
        <Diya key={i} position={[x * 0.8, 0, -4.5]} />
      ))}
      {/* Inner sanctum diyas */}
      {[-2, -1, 0, 1, 2].map((x, i) => (
        <Diya key={`inner_${i}`} position={[x * 1.1, 0.22, -10.7]} />
      ))}

      {/* ── Banners ───────────────────────────────────────────────────── */}
      <Banner position={[0, 4.6, -5.15]} width={7} color="#dc143c" />
      <Banner position={[-5.5, 3.5, -9]} width={3} color="#ffd700" />
      <Banner position={[5.5, 3.5, -9]} width={3} color="#ffd700" />
      <Banner position={[0, 4.2, -14.7]} width={10} color="#dc143c" />

      {/* ── Trees ─────────────────────────────────────────────────────── */}
      <Tree position={[-9, 0, -5]} height={5} />
      <Tree position={[9, 0, -5]} height={5} />
      <Tree position={[-9, 0, 3]} height={4} />
      <Tree position={[9, 0, 3]} height={4} />

      {/* ── Marigolds along entrance ──────────────────────────────────── */}
      <Marigold position={[-3.5, 0, -4.8]} color="#ff8c00" />
      <Marigold position={[3.5, 0, -4.8]} color="#ffd700" />
      <Marigold position={[-3.5, 0, -5.5]} color="#ff69b4" />
      <Marigold position={[3.5, 0, -5.5]} color="#ff69b4" />

      {/* ── NPCs ──────────────────────────────────────────────────────── */}
      <NPC id="priest" position={[-1.5, 0, -11.5]} name="Panditji" outfit={2}
        dialogue={[
          { text: "Welcome to the temple! Please help decorate." },
          { text: "Ganesha's blessings await those who prepare with devotion." },
        ]}
      />
      <NPC id="musician_1" position={[3, 0, -1]} name="Dhol Player" outfit={4}
        dialogue={[
          { text: "The music fills the air with joy! 🥁" },
          { text: "Try the music challenge near the pillar!" },
        ]}
      />
      <NPC id="volunteer_1" position={[-3, 0, 0]} name="Festival Volunteer" outfit={1}
        dialogue={[
          { text: "We need help with the decoration puzzle!" },
          { text: "The temple must be beautiful for Ganesha." },
        ]}
      />
    </group>
  );
}
