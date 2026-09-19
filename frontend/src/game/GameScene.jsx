import { useRef, useState, useEffect, Suspense, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import PlayerCharacter from './player/PlayerCharacter';
import ThirdPersonCamera from './camera/ThirdPersonCamera';
import InteractionSystem from './interaction/InteractionSystem';
import MouseCompanion from './npc/MouseCompanion';
import Level1Home from './levels/Level1Home';
import Level2Street from './levels/Level2Street';
import Level3Market from './levels/Level3Market';
import Level4Temple from './levels/Level4Temple';
import Level5GrandFestival from './levels/Level5GrandFestival';
import { FloatingPetals } from './world/Environment';
import useGameStore from '../store/useGameStore';
import { getNextMission, LEVEL_MISSIONS } from './missions/missionData';
import { saveProgress } from './systems/SaveService';
import DecorationPuzzle from './minigames/DecorationPuzzle';
import MusicChallenge from './minigames/MusicChallenge';
import ModakChallenge from './minigames/ModakChallenge';
import ModakPreparation from './minigames/ModakPreparation';
import IdolSelectionOverlay from './ui/IdolSelectionOverlay';

function LevelContent({ level, playerPositionRef, onStartPuzzle, onStartMusic, onStartModak, onStartModakPrep, onOpenIdolSelector }) {
  switch (level) {
    case 1: return <Level1Home playerPositionRef={playerPositionRef} onStartModakPrep={onStartModakPrep} onOpenIdolSelector={onOpenIdolSelector} />;
    case 2: return <Level2Street />;
    case 3: return <Level3Market />;
    case 4: return <Level4Temple onStartPuzzle={onStartPuzzle} onStartMusic={onStartMusic} onStartModak={onStartModak} />;
    case 5: return <Level5GrandFestival />;
    default: return <Level1Home playerPositionRef={playerPositionRef} onStartModakPrep={onStartModakPrep} onOpenIdolSelector={onOpenIdolSelector} />;
  }
}

const SHADOW_QUALITY = {
  low: false,
  medium: true,
  high: true,
  ultra: true,
};

// Atomic level-complete flag — prevents double-fire across effect re-runs
const levelCompleteFired = new Set();

export default function GameScene() {
  const playerPositionRef = useRef({ x: 0, y: 0, z: 3 });
  const playerAngleRef = useRef(0);

  const [activeMiniGame, setActiveMiniGame] = useState(null);
  // Idol selector lives outside Canvas — renders as a proper React portal
  const [showIdolSelector, setShowIdolSelector] = useState(false);

  const {
    currentLevel,
    settings,
    completedMissions,
    setCurrentMission,
    currentMissionId,
  } = useGameStore();

  const quality = settings.graphicsQuality ?? 'medium';

  // ── Set initial mission when level changes ────────────────────────────
  // FIXED: completedMissions included in deps so it re-evaluates correctly
  useEffect(() => {
    const next = getNextMission(currentLevel, completedMissions);
    if (next) setCurrentMission(next);
  }, [currentLevel, completedMissions.length]); // length as proxy for change

  // ── Watch for level completion ─────────────────────────────────────────
  // Only fires if the level wasn't already completed before entering it.
  // This prevents replaying a completed level from immediately auto-advancing.
  const levelAlreadyCompletedOnEntry = useRef(false);

  useEffect(() => {
    // Record whether this level was completed BEFORE the player started playing it
    levelAlreadyCompletedOnEntry.current =
      useGameStore.getState().completedLevels.includes(currentLevel);
    // Also clear the atomic fired-set for this level on entry
    levelCompleteFired.delete(currentLevel);
  }, [currentLevel]);

  useEffect(() => {
    // Never auto-advance a level the player had already completed when they entered it
    if (levelAlreadyCompletedOnEntry.current) return;

    const levelMissions = LEVEL_MISSIONS[currentLevel] ?? [];
    if (levelMissions.length === 0) return;

    const allDone = levelMissions.every(m => completedMissions.includes(m));
    if (!allDone) return;

    // Atomic check — prevents double-score if effect fires twice
    if (levelCompleteFired.has(currentLevel)) return;
    levelCompleteFired.add(currentLevel);

    const store = useGameStore.getState();
    store.completeLevel(currentLevel);
    store.addScore(500, `🎉 Level ${currentLevel} Complete! +500`);
    saveProgress();

    const timer = setTimeout(() => {
      if (currentLevel < 5) {
        useGameStore.getState().setScreen('levelcomplete');
      } else {
        useGameStore.getState().completeFestival();
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [completedMissions, currentLevel]);

  // Clear the fired-set when level changes (moving to a new level)
  useEffect(() => {
    levelCompleteFired.delete(currentLevel - 1);
  }, [currentLevel]);

  // ── Auto-advance mission tracker ──────────────────────────────────────
  // FIXED: currentMissionId included in deps
  useEffect(() => {
    if (!currentMissionId || completedMissions.includes(currentMissionId)) {
      const next = getNextMission(currentLevel, completedMissions);
      if (next && next !== currentMissionId) setCurrentMission(next);
    }
  }, [completedMissions, currentMissionId, currentLevel]);

  const handlePosUpdate = useCallback((pos, angle) => {
    playerPositionRef.current = pos;
    playerAngleRef.current = angle;
  }, []);

  const closeMiniGame = useCallback(() => {
    setActiveMiniGame(null);
    saveProgress();
  }, []);

  return (
    <>
      <Canvas
        shadows={SHADOW_QUALITY[quality]}
        camera={{ position: [0, 4, 10], fov: 60, near: 0.1, far: 200 }}
        gl={{ antialias: quality !== 'low', powerPreference: 'high-performance' }}
        dpr={
          quality === 'low' ? 0.75 :
            quality === 'ultra' ? Math.min(window.devicePixelRatio, 2) : 1
        }
        style={{ position: 'absolute', inset: 0 }}
      >
        <Suspense fallback={null}>
          <LevelContent
            level={currentLevel}
            playerPositionRef={playerPositionRef}
            onStartPuzzle={() => setActiveMiniGame('puzzle')}
            onStartMusic={() => setActiveMiniGame('music')}
            onStartModak={() => setActiveMiniGame('modak')}
            onStartModakPrep={() => setActiveMiniGame('modakprep')}
            onOpenIdolSelector={() => setShowIdolSelector(true)}
          />
          <PlayerCharacter onPositionUpdate={handlePosUpdate} />
          <ThirdPersonCamera
            playerPositionRef={playerPositionRef}
            playerAngleRef={playerAngleRef}
          />
          <InteractionSystem playerPositionRef={playerPositionRef} />
          <MouseCompanion
            playerPositionRef={playerPositionRef}
            hint={!currentMissionId ? 'Follow me!' : null}
          />
          {(quality === 'high' || quality === 'ultra') && (
            <FloatingPetals count={15} area={30} />
          )}
        </Suspense>
      </Canvas>

      {/* Mini-game overlays — all rendered OUTSIDE Canvas so they get proper DOM stacking */}
      {activeMiniGame === 'puzzle' && <DecorationPuzzle onComplete={closeMiniGame} />}
      {activeMiniGame === 'music' && <MusicChallenge onComplete={closeMiniGame} />}
      {activeMiniGame === 'modak' && <ModakChallenge onComplete={closeMiniGame} />}
      {activeMiniGame === 'modakprep' && <ModakPreparation onComplete={closeMiniGame} />}

      {/* Idol selector — rendered outside Canvas so pointer events work correctly */}
      {showIdolSelector && (
        <IdolSelectionOverlay
          onClose={() => setShowIdolSelector(false)}
          onSelect={(variantId) => {
            const store = useGameStore.getState();
            store.setSelectedGanesha(variantId);
            store.advanceMission('l1_choose_ganesha', 1);
            store.addScore(100, '+100 ⭐ Idol chosen!');
            setShowIdolSelector(false);
          }}
        />
      )}
    </>
  );
}
