/**
 * Level 1 — Home
 *
 * All interactive objects (idol pedestal, idol platform, diya spots,
 * decoration spots, kitchen station, flowers) are registered with the
 * InteractionSystem so the player walks up and presses E / INTERACT.
 *
 * The IdolSelectionOverlay is NO LONGER rendered here — it lives in
 * GameScene.jsx (outside the Canvas) via onOpenIdolSelector prop so
 * that pointer-events and z-index work correctly over the WebGL canvas.
 */

import { useState } from 'react';
import { Html } from '@react-three/drei';
import {
  Ground, Marigold, Diya, Banner,
  Rangoli, Tree, FestivalLights, SceneLighting,
} from '../world/Environment';
import GaneshaIdol from '../world/GaneshaIdol';
import Collectible from '../interaction/Collectible';
import NPC from '../npc/NPC';
import { useRegisterInteractable } from '../interaction/InteractionSystem';
import useGameStore from '../../store/useGameStore';

// ─── Decoration spot ─────────────────────────────────────────────────────────
function DecoratableSpot({ id, position, missionId }) {
  const spotKey = `spot_${id}`;
  const decorated = !!useGameStore(s => s.missionProgress[spotKey]);
  const pos3 = { x: position[0], y: 0, z: position[2] };

  useRegisterInteractable({
    id,
    type: 'decoration',
    displayName: '🎊 Decoration Spot',
    interactionLabel: 'DECORATE',
    position: pos3,
    onInteract: () => {
      const s = useGameStore.getState();
      if (s.missionProgress[spotKey]) return;
      useGameStore.setState(prev => ({
        missionProgress: { ...prev.missionProgress, [spotKey]: 1 },
      }));
      s.addScore(50, '+50 ⭐ Decorated!');
      if (missionId) s.advanceMission(missionId, 1);
    },
    active: !decorated,
  });

  return (
    <group position={position}>
      {!decorated ? (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.2, 0.36, 14]} />
          <meshStandardMaterial color="#ffd700" transparent opacity={0.55} />
        </mesh>
      ) : (
        <group>
          <Marigold position={[0, 0, 0]} color="#ff8c00" />
          <Diya position={[0.32, 0, 0.28]} />
          <Diya position={[-0.32, 0, -0.28]} />
        </group>
      )}
    </group>
  );
}

// ─── Diya spot ────────────────────────────────────────────────────────────────
function DiyaSpot({ id, position, missionId }) {
  const spotKey = `spot_${id}`;
  const placed = !!useGameStore(s => s.missionProgress[spotKey]);
  const pos3 = { x: position[0], y: 0, z: position[2] };

  useRegisterInteractable({
    id,
    type: 'place',
    displayName: '🪔 Diya Spot',
    interactionLabel: 'PLACE DIYA',
    position: pos3,
    onInteract: () => {
      const s = useGameStore.getState();
      if (s.missionProgress[spotKey]) return;
      useGameStore.setState(prev => ({
        missionProgress: { ...prev.missionProgress, [spotKey]: 1 },
      }));
      s.addScore(50, '+50 ⭐ Diya placed!');
      if (missionId) s.advanceMission(missionId, 1);
    },
    active: !placed,
  });

  return placed
    ? <Diya position={position} />
    : (
      <mesh position={[position[0], 0.02, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.18, 10]} />
        <meshStandardMaterial color="#ff8c00" transparent opacity={0.45} />
      </mesh>
    );
}

// ─── Idol platform ────────────────────────────────────────────────────────────
function IdolPlatform({ position, onPlace, placed }) {
  const pos3 = { x: position[0], y: 0, z: position[2] };

  useRegisterInteractable({
    id: 'idol_platform',
    type: 'place',
    displayName: '🐘 Idol Platform',
    interactionLabel: 'PLACE IDOL',
    position: pos3,
    onInteract: () => { if (!placed) onPlace(); },
    active: !placed,
  });

  return (
    <group position={position}>
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[1.6, 0.1, 1.3]} />
        <meshStandardMaterial color="#d4a86a" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[1.4, 0.04, 1.1]} />
        <meshStandardMaterial color="#ffd700" metalness={0.4} roughness={0.4} />
      </mesh>
      <Rangoli position={[0, 0.14, 0]} radius={0.65} />
      {!placed && (
        <>
          <mesh position={[0, 0.18, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.3, 0.5, 14]} />
            <meshStandardMaterial color="#ffd700" transparent opacity={0.6} />
          </mesh>
          <Html position={[0, 0.7, 0]} center style={{ pointerEvents: 'none' }}>
            <div style={{
              background: 'rgba(0,0,0,0.72)',
              color: '#ffd700',
              padding: '3px 10px',
              borderRadius: 8,
              fontSize: 11,
              fontWeight: 700,
              whiteSpace: 'nowrap',
              border: '1px solid rgba(255,215,0,0.4)',
            }}>
              🐘 Place Idol here
            </div>
          </Html>
        </>
      )}
    </group>
  );
}

// ─── Idol selection pedestal ─────────────────────────────────────────────────
// Calls onOpenIdolSelector (lifted to GameScene) instead of rendering any overlay here.
function IdolSelectionPedestal({ position, onOpen, selected }) {
  const pos3 = { x: position[0], y: 0, z: position[2] };

  useRegisterInteractable({
    id: 'idol_select_pedestal',
    type: 'place',
    displayName: '🐘 Choose Your Idol',
    interactionLabel: 'CHOOSE IDOL',
    position: pos3,
    onInteract: () => { if (!selected) onOpen(); },
    active: !selected,
  });

  return (
    <group position={position}>
      {/* Stand */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.45, 0.6, 12]} />
        <meshStandardMaterial color="#d4a86a" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.62, 0]}>
        <cylinderGeometry args={[0.4, 0.35, 0.06, 12]} />
        <meshStandardMaterial color="#ffd700" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Mini idol preview */}
      <GaneshaIdol position={[0, 0.68, 0]} variant="basic" size={0.35} showGlow={!selected} />
      {/* Label */}
      <Html position={[0, 1.5, 0]} center style={{ pointerEvents: 'none' }}>
        <div style={{
          background: selected ? 'rgba(34,197,94,0.85)' : 'rgba(0,0,0,0.75)',
          color: selected ? '#fff' : '#ffd700',
          padding: '3px 10px',
          borderRadius: 8,
          fontSize: 11,
          fontWeight: 700,
          whiteSpace: 'nowrap',
          border: `1px solid ${selected ? 'rgba(74,222,128,0.5)' : 'rgba(255,215,0,0.4)'}`,
        }}>
          {selected ? '✓ Idol Selected!' : '🐘 Choose Idol'}
        </div>
      </Html>
    </group>
  );
}

// ─── Kitchen / Modak station ─────────────────────────────────────────────────
function KitchenStation({ position, onStartModakPrep, missionDone }) {
  const pos3 = { x: position[0], y: 0, z: position[2] };

  useRegisterInteractable({
    id: 'kitchen_station',
    type: 'prepare',
    displayName: '🍬 Kitchen',
    interactionLabel: 'PREPARE MODAKS',
    position: pos3,
    onInteract: () => { if (!missionDone) onStartModakPrep?.(); },
    active: !missionDone,
  });

  return (
    <group position={position}>
      {/* Counter */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.9, 0.7]} />
        <meshStandardMaterial color="#c8864a" roughness={0.8} />
      </mesh>
      {/* Worktop */}
      <mesh position={[0, 0.92, 0]}>
        <boxGeometry args={[1.65, 0.06, 0.75]} />
        <meshStandardMaterial color="#f0c878" roughness={0.6} />
      </mesh>
      {/* Bowl */}
      <mesh position={[0, 1.04, 0]}>
        <cylinderGeometry args={[0.22, 0.18, 0.12, 14]} />
        <meshStandardMaterial color="#c4722a" roughness={0.7} />
      </mesh>
      {/* Rice flour bag */}
      <mesh position={[-0.52, 1.05, 0.05]}>
        <boxGeometry args={[0.18, 0.22, 0.12]} />
        <meshStandardMaterial color="#f5f0e8" roughness={0.9} />
      </mesh>
      {/* Coconut */}
      <mesh position={[-0.25, 1.05, 0.05]}>
        <sphereGeometry args={[0.1, 10, 10]} />
        <meshStandardMaterial color="#6b4226" roughness={0.8} />
      </mesh>
      {/* Jaggery */}
      <mesh position={[0.52, 1.05, 0.05]}>
        <boxGeometry args={[0.16, 0.1, 0.12]} />
        <meshStandardMaterial color="#8b5e2a" roughness={0.7} />
      </mesh>
      {/* Milk pot */}
      <mesh position={[0.28, 1.06, 0.05]}>
        <cylinderGeometry args={[0.07, 0.09, 0.14, 10]} />
        <meshStandardMaterial color="#e8e8e8" roughness={0.5} />
      </mesh>

      {/* Finished modaks on tray */}
      {missionDone && (
        <group position={[0, 1.06, 0]}>
          {[[-0.25, 0, 0], [0, 0, 0], [0.25, 0, 0], [-0.12, 0, 0.18], [0.12, 0, 0.18]].map((p, i) => (
            <mesh key={i} position={p}>
              <sphereGeometry args={[0.07, 8, 8]} />
              <meshStandardMaterial color="#f4d03f" />
            </mesh>
          ))}
        </group>
      )}

      {/* Floating label */}
      <Html position={[0, 1.55, 0]} center style={{ pointerEvents: 'none' }}>
        <div style={{
          background: missionDone ? 'rgba(34,197,94,0.88)' : 'rgba(0,0,0,0.78)',
          color: missionDone ? '#fff' : '#ffd700',
          padding: '3px 10px',
          borderRadius: 8,
          fontSize: 11,
          fontWeight: 700,
          whiteSpace: 'nowrap',
          border: `1px solid ${missionDone ? 'rgba(74,222,128,0.5)' : 'rgba(255,215,0,0.4)'}`,
        }}>
          {missionDone ? '✓ Modaks Ready!' : '🍬 Prepare Modaks'}
        </div>
      </Html>

      {/* Floor glow */}
      {!missionDone && (
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.6, 16]} />
          <meshStandardMaterial color="#ff8c00" transparent opacity={0.15} />
        </mesh>
      )}
    </group>
  );
}

// ─── Level component ─────────────────────────────────────────────────────────
/**
 * Props:
 *  onStartModakPrep()    — open ModakPreparation overlay (from GameScene)
 *  onOpenIdolSelector()  — open IdolSelectionOverlay (from GameScene, outside Canvas)
 */
export default function Level1Home({ onStartModakPrep, onOpenIdolSelector }) {
  const selectedGanesha = useGameStore(s => s.selectedGanesha);
  const completedMissions = useGameStore(s => s.completedMissions);

  // Derive placement state from store so it survives re-renders
  const idolChosen = completedMissions.includes('l1_choose_ganesha');
  const idolPlaced = completedMissions.includes('l1_place_idol');
  const modaksDone = completedMissions.includes('l1_modaks');

  const handlePlaceIdol = () => {
    // Require idol selection before placement
    if (!useGameStore.getState().completedMissions.includes('l1_choose_ganesha')) return;
    const s = useGameStore.getState();
    s.advanceMission('l1_place_idol', 1);
    s.addScore(100, '+100 ⭐ Idol Placed!');
  };

  const flowers = [
    [-3, 0, -2], [3, 0, -2], [-4, 0, 1], [4, 0, 1],
    [-2, 0, 3], [2, 0, 3], [-5, 0, -4], [5, 0, -4],
    [0, 0, 5], [-3, 0, 4],
  ];

  return (
    <group>
      <SceneLighting quality="medium" timeOfDay="day" />
      <Ground size={60} color="#c8a96e" />

      {/* ── House ──────────────────────────────────────────── */}
      <mesh position={[0, 1.5, -8]} castShadow receiveShadow>
        <boxGeometry args={[12, 3, 8]} />
        <meshStandardMaterial color="#f5deb3" roughness={0.8} />
      </mesh>
      <mesh position={[0, 3.5, -8]}>
        <coneGeometry args={[7.5, 2, 4]} />
        <meshStandardMaterial color="#dc143c" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.9, -4.1]}>
        <boxGeometry args={[1.2, 1.8, 0.1]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      <mesh position={[-3, 1.5, -4.1]}>
        <boxGeometry args={[1, 0.8, 0.1]} />
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.7} />
      </mesh>
      <mesh position={[3, 1.5, -4.1]}>
        <boxGeometry args={[1, 0.8, 0.1]} />
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.7} />
      </mesh>

      {/* ── Courtyard ──────────────────────────────────────── */}
      <mesh position={[0, 0.02, -1]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 6]} />
        <meshStandardMaterial color="#e8d5b0" roughness={0.9} />
      </mesh>
      <Rangoli position={[0, 0.03, 0]} radius={1.5} />

      {/* ── Kitchen side-room ──────────────────────────────── */}
      <mesh position={[7.5, 1.0, -6]} castShadow receiveShadow>
        <boxGeometry args={[3, 2, 6]} />
        <meshStandardMaterial color="#f0d9b0" roughness={0.8} />
      </mesh>
      <mesh position={[7.5, 2.2, -6]}>
        <boxGeometry args={[3.2, 0.15, 6.2]} />
        <meshStandardMaterial color="#c8721a" roughness={0.7} />
      </mesh>
      <mesh position={[6.5, 0.02, -5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4, 4]} />
        <meshStandardMaterial color="#d4c090" roughness={0.9} />
      </mesh>

      {/* ── Interactive objects ─────────────────────────────── */}

      {/* Idol selection pedestal — triggers overlay in GameScene (outside Canvas) */}
      <IdolSelectionPedestal
        position={[-5, 0, -2]}
        onOpen={onOpenIdolSelector}
        selected={idolChosen}
      />

      {/* Idol platform */}
      <IdolPlatform
        position={[0, 0, -3]}
        onPlace={handlePlaceIdol}
        placed={idolPlaced}
      />
      {idolPlaced && (<GaneshaIdol
        position={[0, 0.2, -3]}
        variant={selectedGanesha}
        size={0.7}
        showGlow
      />
      )}

      {/* Kitchen (modak preparation) */}
      <KitchenStation
        position={[5.5, 0, -5]}
        onStartModakPrep={onStartModakPrep}
        missionDone={modaksDone}
      />

      {/* Decoration spots */}
      <DecoratableSpot id="dec_1" position={[-2.5, 0, -3]} missionId="l1_decorate" />
      <DecoratableSpot id="dec_2" position={[2.5, 0, -3]} missionId="l1_decorate" />
      <DecoratableSpot id="dec_3" position={[-1.5, 0, -1]} missionId="l1_decorate" />
      <DecoratableSpot id="dec_4" position={[1.5, 0, -1]} missionId="l1_decorate" />

      {/* Diya spots */}
      <DiyaSpot id="diya_1" position={[-1.0, 0, -3.5]} missionId="l1_diyas" />
      <DiyaSpot id="diya_2" position={[0.0, 0, -3.7]} missionId="l1_diyas" />
      <DiyaSpot id="diya_3" position={[1.0, 0, -3.5]} missionId="l1_diyas" />

      {/* Flower collectibles */}
      {flowers.map((pos, i) => (
        <Collectible
          key={`flower_${i}`}
          id={`home_flower_${i}`}
          type="flower"
          position={pos}
          missionId="l1_collect_flowers"
        />
      ))}

      {/* ── Environment ────────────────────────────────────── */}
      <Banner position={[-3, 3.5, -4]} width={3} color="#dc143c" />
      <Banner position={[3, 3.5, -4]} width={3} color="#ff8c00" />
      <FestivalLights
        points={[[-4, 3, -4], [-2, 3.5, -4], [0, 3.8, -4], [2, 3.5, -4], [4, 3, -4]]}
        color="#ffdd00"
      />
      <FestivalLights
        points={[[4.5, 2.2, -4], [6, 2.4, -5], [7.5, 2.2, -6]]}
        color="#ff8c00"
      />

      <Tree position={[-7, 0, -2]} height={4} />
      <Tree position={[7, 0, -2]} height={4} />
      <Tree position={[-6, 0, 4]} height={3} />
      <Tree position={[6, 0, 4]} height={3} />

      <Marigold position={[-0.8, 0, -4.2]} color="#ff8c00" />
      <Marigold position={[0.8, 0, -4.2]} color="#ffd700" />
      <Marigold position={[-1.5, 0, -4.0]} color="#ff69b4" />
      <Marigold position={[1.5, 0, -4.0]} color="#ff69b4" />
      <Marigold position={[4.5, 0, -4.0]} color="#ff8c00" />
      <Marigold position={[4.5, 0, -6.0]} color="#ffd700" />

      {/* ── NPCs ────────────────────────────────────────────── */}
      <NPC
        id="npc_mother"
        position={[3, 0, -2]}
        name="Amma"
        outfit={0}
        dialogue={[
          { text: "Welcome! Let's prepare for Vinayaka Chavithi! 🐘" },
          { text: "Walk left to the golden pedestal and choose Ganesha's idol." },
          { text: "Then bring it to the decorated platform in the courtyard." },
        ]}
      />
      <NPC
        id="npc_nanna"
        position={[-4, 0, 0]}
        name="Nanna"
        outfit={2}
        dialogue={[
          { text: "Collect flowers from the garden for decorations! 🌺" },
          { text: "Fresh marigolds bring Ganesha's blessings." },
        ]}
      />
      <NPC
        id="npc_thatha"
        position={[7, 0, -4]}
        name="Thatha"
        outfit={1}
        dialogue={[
          { text: "The kitchen is ready! Walk over and prepare the modaks. 🍬" },
          { text: "Add rice flour → coconut → jaggery → milk in that order!" },
        ]}
      />
    </group>
  );
}
