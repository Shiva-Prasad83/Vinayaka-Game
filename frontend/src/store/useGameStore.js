import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { MISSIONS, LEVEL_MISSIONS } from '../game/missions/missionData';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/storage';

const DEFAULT_INVENTORY = {
  flowers: 0, ecoMaterials: 0, modaks: 0,
  diyas: 0, decorations: 0, leaves: 0,
};

const DEFAULT_CHARACTER = {
  name: 'Player', hairstyle: 0, outfit: 0, accessories: 0, footwear: 0,
};

const DEFAULT_SETTINGS = {
  musicVolume: 0.7, sfxVolume: 0.8, vibration: true,
  graphicsQuality: 'medium', controlSensitivity: 1.0, language: 'en',
  autoRun: false, autoInteract: false, cameraAssist: true,
  largerButtons: false, reducedSensitivity: false, objectiveMarkers: true,
};

const INITIAL_STATE = {
  // Screen routing
  screen: 'mainmenu', // mainmenu | howtoplay | levelselect | tutorial | playing | paused | levelcomplete | results | rewards | character | settings

  // Player
  playerId: null,
  character: { ...DEFAULT_CHARACTER },

  // Progress
  currentLevel: 1,
  completedLevels: [],
  selectedGanesha: 'basic',

  // Score
  score: 0,
  ecoScore: 0,
  scoreHistory: [], // [{amount, label, time}]

  // Missions
  currentMissionId: null,
  completedMissions: [],
  missionProgress: {}, // { missionId: number }

  // Inventory
  inventory: { ...DEFAULT_INVENTORY },

  // Rewards
  unlockedRewards: [],

  // Settings
  settings: { ...DEFAULT_SETTINGS },

  // Game mode
  gameMode: 'playing', // playing | cinematic | minigame | celebration

  // Active interaction target
  nearbyInteractable: null,

  // Active NPC dialogue
  activeDialogue: null,

  // Floating scores queue
  floatingScores: [],

  // Save state
  lastSaved: null,
  isSynced: false,
};

let floatingScoreId = 0;

const useGameStore = create(
  subscribeWithSelector((set, get) => ({
    ...INITIAL_STATE,

    // ─── SCREEN NAVIGATION ─────────────────────────────────────────────
    setScreen: (screen) => set({ screen }),

    // ─── PLAYER ID ─────────────────────────────────────────────────────
    setPlayerId: (id) => set({ playerId: id }),

    // ─── CHARACTER ─────────────────────────────────────────────────────
    updateCharacter: (updates) =>
      set((s) => ({ character: { ...s.character, ...updates } })),

    // ─── LEVEL ─────────────────────────────────────────────────────────
    setCurrentLevel: (level) => set({ currentLevel: level }),

    // Replay a previously completed level — strips its missions & spot
    // progress from the store so all interactions work fresh again.
    // completedLevels and rewards are preserved.
    replayLevel: (level) => {
      const levelMissionIds = LEVEL_MISSIONS[level] ?? [];
      set((s) => {
        // Remove this level's missions from completedMissions
        const completedMissions = s.completedMissions.filter(
          (id) => !levelMissionIds.includes(id)
        );
        // Remove this level's mission progress counters
        const missionProgress = { ...s.missionProgress };
        levelMissionIds.forEach((id) => delete missionProgress[id]);
        // Remove per-spot keys so interaction spots reset visually
        Object.keys(missionProgress).forEach((key) => {
          if (key.startsWith('spot_') || key.startsWith('festlight_') || key.startsWith('celebrate_')) {
            delete missionProgress[key];
          }
        });
        return {
          currentLevel: level,
          completedMissions,
          missionProgress,
          currentMissionId: null,
        };
      });
    },

    completeLevel: (level) =>
      set((s) => {
        const completedLevels = s.completedLevels.includes(level)
          ? s.completedLevels
          : [...s.completedLevels, level];
        // Check reward unlocks
        const unlockedRewards = [...s.unlockedRewards];
        if (level === 2 && !unlockedRewards.includes('festival_ganesha')) {
          unlockedRewards.push('festival_ganesha');
        }
        if (level === 4 && !unlockedRewards.includes('divine_ganesha')) {
          unlockedRewards.push('divine_ganesha');
        }
        if (level === 5) {
          if (!unlockedRewards.includes('golden_ganesha')) unlockedRewards.push('golden_ganesha');
          if (!unlockedRewards.includes('festival_master')) unlockedRewards.push('festival_master');
          if (!unlockedRewards.includes('golden_mouse')) unlockedRewards.push('golden_mouse');
        }
        return { completedLevels, unlockedRewards };
      }),

    isLevelUnlocked: (level) => {
      const s = get();
      if (level === 1) return true;
      return s.completedLevels.includes(level - 1);
    },

    // ─── GANESHA ────────────────────────────────────────────────────────
    setSelectedGanesha: (g) => set({ selectedGanesha: g }),

    // ─── SCORE ──────────────────────────────────────────────────────────
    addScore: (amount, label = '') => {
      const id = ++floatingScoreId;
      set((s) => ({
        score: s.score + amount,
        floatingScores: [
          ...s.floatingScores,
          { id, amount, label, time: Date.now() },
        ],
      }));
      // Auto-remove after 2s
      setTimeout(() => {
        set((s) => ({
          floatingScores: s.floatingScores.filter((fs) => fs.id !== id),
        }));
      }, 2000);
    },

    addEcoScore: (amount) =>
      set((s) => ({ ecoScore: Math.min(1000, s.ecoScore + amount) })),

    // ─── MISSIONS ───────────────────────────────────────────────────────
    setCurrentMission: (missionId) => {
      set((s) => ({
        currentMissionId: missionId,
        missionProgress: { ...s.missionProgress, [missionId]: s.missionProgress[missionId] ?? 0 },
      }));
    },

    advanceMission: (missionId, amount = 1) => {
      const s = get();
      const mission = MISSIONS[missionId];
      if (!mission) return;
      const prev = s.missionProgress[missionId] ?? 0;
      const next = Math.min(prev + amount, mission.target);
      set((s2) => ({
        missionProgress: { ...s2.missionProgress, [missionId]: next },
      }));
      if (next >= mission.target) {
        get().completeMission(missionId);
      }
    },

    completeMission: (missionId) => {
      const s = get();
      if (s.completedMissions.includes(missionId)) return;
      const mission = MISSIONS[missionId];
      if (!mission) return;
      set((s2) => ({
        completedMissions: [...s2.completedMissions, missionId],
      }));
      get().addScore(mission.reward, `✓ ${mission.title}`);
      if (mission.ecoReward) get().addEcoScore(mission.ecoReward);
    },

    isMissionComplete: (missionId) => get().completedMissions.includes(missionId),

    getMissionProgress: (missionId) => get().missionProgress[missionId] ?? 0,

    // ─── INVENTORY ──────────────────────────────────────────────────────
    addToInventory: (item, amount = 1) =>
      set((s) => ({
        inventory: { ...s.inventory, [item]: (s.inventory[item] ?? 0) + amount },
      })),

    removeFromInventory: (item, amount = 1) =>
      set((s) => ({
        inventory: { ...s.inventory, [item]: Math.max(0, (s.inventory[item] ?? 0) - amount) },
      })),

    // ─── INTERACTION ────────────────────────────────────────────────────
    setNearbyInteractable: (obj) => set({ nearbyInteractable: obj }),

    // ─── DIALOGUE ───────────────────────────────────────────────────────
    openDialogue: (dialogue) => set({ activeDialogue: dialogue }),
    closeDialogue: () => set({ activeDialogue: null }),

    // ─── REWARDS ────────────────────────────────────────────────────────
    unlockReward: (rewardId) =>
      set((s) => ({
        unlockedRewards: s.unlockedRewards.includes(rewardId)
          ? s.unlockedRewards
          : [...s.unlockedRewards, rewardId],
      })),

    // ─── SETTINGS ───────────────────────────────────────────────────────
    updateSettings: (updates) =>
      set((s) => ({ settings: { ...s.settings, ...updates } })),

    // ─── GAME MODE ──────────────────────────────────────────────────────
    setGameMode: (mode) => set({ gameMode: mode }),

    // ─── SAVE / LOAD ─────────────────────────────────────────────────────
    saveLocal: () => {
      const s = get();
      const data = {
        playerId: s.playerId,
        score: s.score,
        ecoScore: s.ecoScore,
        currentLevel: s.currentLevel,
        completedLevels: s.completedLevels,
        unlockedRewards: s.unlockedRewards,
        completedMissions: s.completedMissions,
        missionProgress: s.missionProgress,
        inventory: s.inventory,
        character: s.character,
        settings: s.settings,
        selectedGanesha: s.selectedGanesha,
      };
      saveToLocalStorage('ganesha_save', data);
      set({ lastSaved: Date.now() });
    },

    loadLocal: () => {
      const data = loadFromLocalStorage('ganesha_save');
      if (!data) return false;
      set({
        playerId: data.playerId ?? null,
        score: data.score ?? 0,
        ecoScore: data.ecoScore ?? 0,
        currentLevel: data.currentLevel ?? 1,
        completedLevels: data.completedLevels ?? [],
        unlockedRewards: data.unlockedRewards ?? [],
        completedMissions: data.completedMissions ?? [],
        missionProgress: data.missionProgress ?? {},
        inventory: { ...DEFAULT_INVENTORY, ...(data.inventory ?? {}) },
        character: { ...DEFAULT_CHARACTER, ...(data.character ?? {}) },
        settings: { ...DEFAULT_SETTINGS, ...(data.settings ?? {}) },
        selectedGanesha: data.selectedGanesha ?? 'basic',
      });
      return true;
    },

    resetProgress: () => {
      saveToLocalStorage('ganesha_save', null);
      set({ ...INITIAL_STATE });
    },

    // ─── FINAL FESTIVAL ──────────────────────────────────────────────────
    completeFestival: () => {
      const s = get();
      get().completeLevel(5);
      get().addScore(1000, '🎉 Festival Complete!');
      get().addEcoScore(200);
      set({ screen: 'results', gameMode: 'celebration' });
    },
  }))
);

export default useGameStore;
