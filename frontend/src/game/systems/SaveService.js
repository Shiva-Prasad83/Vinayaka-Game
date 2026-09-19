import useGameStore from '../../store/useGameStore';
import { getOrCreatePlayerId } from '../../utils/storage';

/**
 * Base URL for the API.
 *
 * - In development: Vite proxies "/api" to localhost:5000, so we use a relative path.
 * - In production (Vercel): VITE_API_URL must be set to the Render backend URL,
 *   e.g.  https://ganesha-festival-api.onrender.com
 *   The env var must NOT have a trailing slash.
 */
const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/progress`
  : '/api/progress';

export const initPlayer = async () => {
  const store = useGameStore.getState();
  const playerId = getOrCreatePlayerId();
  store.setPlayerId(playerId);

  try {
    const res = await fetch(`${API_BASE}/${playerId}`, {
      signal: AbortSignal.timeout(6000),
    });
    if (res.ok) {
      const { data } = await res.json();
      if (data) {
        useGameStore.setState({
          score:            data.score            ?? 0,
          ecoScore:         data.ecoScore         ?? 0,
          currentLevel:     data.currentLevel     ?? 1,
          completedLevels:  data.completedLevels  ?? [],
          unlockedRewards:  data.unlockedRewards  ?? [],
          completedMissions:data.completedMissions?? [],
          inventory:        data.inventory        ?? {},
          character:        data.character        ?? {},
          settings:         data.settings         ?? {},
          selectedGanesha:  data.selectedGanesha  ?? 'basic',
          isSynced:         true,
        });
        return;
      }
    }
  } catch {
    // Server unavailable — fall back to localStorage silently
  }

  store.loadLocal();
};

export const saveProgress = async () => {
  const store = useGameStore.getState();
  // Always persist locally first so progress is never lost
  store.saveLocal();

  try {
    const body = {
      playerId:          store.playerId,
      score:             store.score,
      ecoScore:          store.ecoScore,
      currentLevel:      store.currentLevel,
      completedLevels:   store.completedLevels,
      unlockedRewards:   store.unlockedRewards,
      completedMissions: store.completedMissions,
      inventory:         store.inventory,
      character:         store.character,
      settings:          store.settings,
      selectedGanesha:   store.selectedGanesha,
      gameMode:          store.gameMode,
    };
    const res = await fetch(`${API_BASE}/save`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
      signal:  AbortSignal.timeout(6000),
    });
    if (res.ok) {
      useGameStore.setState({ isSynced: true });
    }
  } catch {
    useGameStore.setState({ isSynced: false });
  }
};

export const resetProgress = async () => {
  const store = useGameStore.getState();
  try {
    await fetch(`${API_BASE}/reset`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ playerId: store.playerId }),
      signal:  AbortSignal.timeout(6000),
    });
  } catch { /* ignore — local reset still happens below */ }
  store.resetProgress();
};

// ── Auto-save every 30 s while the game is running ───────────────────────────
let _autoSaveTimer = null;
export const startAutoSave = () => {
  stopAutoSave();
  _autoSaveTimer = setInterval(saveProgress, 30_000);
};
export const stopAutoSave = () => {
  if (_autoSaveTimer) { clearInterval(_autoSaveTimer); _autoSaveTimer = null; }
};
