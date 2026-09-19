import { useEffect, useState, Suspense, useCallback } from 'react';
import useGameStore from './store/useGameStore';
import { initPlayer, startAutoSave, stopAutoSave } from './game/systems/SaveService';
import inputManager from './game/systems/InputManager';

// Pages
import MainMenu            from './pages/MainMenu';
import HowToPlay           from './pages/HowToPlay';
import Tutorial            from './pages/Tutorial';
import LevelSelect         from './pages/LevelSelect';
import LevelComplete       from './pages/LevelComplete';
import FinalResults        from './pages/FinalResults';
import Rewards             from './pages/Rewards';
import CharacterCustomization from './pages/CharacterCustomization';
import Settings            from './pages/Settings';
import PauseMenu           from './pages/PauseMenu';

// Game
import GameScene from './game/GameScene';
import HUD       from './components/HUD';

/* ─────────────────────────────────────────────────────────────────────────
   LOADING SCREEN
───────────────────────────────────────────────────────────────────────── */
function LoadingScreen() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setPct(p => Math.min(p + 6, 92)), 100);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(160deg,#120920 0%,#0c0618 100%)' }}>
      <div className="text-7xl mb-5 menu-float">🐘</div>
      <h1 className="text-2xl font-black text-yellow-400 mb-1 tracking-wide">GANESHA FESTIVAL</h1>
      <p className="text-orange-300/70 text-sm mb-8 tracking-widest uppercase">Preparing the celebration</p>

      <div className="w-56 rounded-full overflow-hidden mb-2"
        style={{ height: 6, background: 'rgba(255,255,255,0.08)' }}>
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg,#ffd700,#ff8c00)',
            boxShadow: '0 0 8px rgba(255,200,0,0.5)',
            transition: 'width 0.15s ease',
          }}
        />
      </div>
      <p className="text-white/25 text-xs tabular-nums">{pct}%</p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   PAUSE DETECTION — Esc key
   Uses InputManager's edge-triggered pausePressed so there's no
   duplicate handler conflict.
───────────────────────────────────────────────────────────────────────── */
function usePauseInput() {
  const { screen, setScreen } = useGameStore();

  useEffect(() => {
    const handler = (e) => {
      if (e.code !== 'Escape') return;
      // Use Zustand state directly — screen captured in closure is always fresh
      // because this effect re-runs whenever screen changes
      if (screen === 'playing')   setScreen('paused');
      else if (screen === 'paused') setScreen('playing');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [screen, setScreen]);
}

/* ─────────────────────────────────────────────────────────────────────────
   ROOT APP
───────────────────────────────────────────────────────────────────────── */
export default function App() {
  const { screen, setScreen } = useGameStore();
  const [loading, setLoading] = useState(true);

  // Detect mobile once — stable for the session
  const isMobile = inputManager.isMobile;

  usePauseInput();

  // ── Init & auto-save ──────────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      await initPlayer();
      setLoading(false);
      startAutoSave();
    };
    init();
    return () => {
      stopAutoSave();
      // Intentionally NOT calling inputManager.destroy() here because it's a
      // module-level singleton that persists across HMR and is never truly unmounted.
    };
  }, []);

  // ── Prevent browser gestures during gameplay ──────────────────────────
  useEffect(() => {
    const prevent = (e) => {
      // Only block during gameplay — allow scrolling on menu pages
      const playScreens = new Set(['playing', 'paused', 'tutorial', 'levelcomplete']);
      if (playScreens.has(useGameStore.getState().screen)) {
        e.preventDefault();
      }
    };
    document.addEventListener('touchmove',      prevent, { passive: false });
    document.addEventListener('gesturestart',   prevent, { passive: false });
    document.addEventListener('gesturechange',  prevent, { passive: false });
    return () => {
      document.removeEventListener('touchmove',     prevent);
      document.removeEventListener('gesturestart',  prevent);
      document.removeEventListener('gesturechange', prevent);
    };
  }, []);

  const handlePause = useCallback(() => setScreen('paused'),   [setScreen]);

  if (loading) return <LoadingScreen />;

  // The Canvas stays mounted for all gameplay screens so we never
  // re-trigger the full 3-D scene teardown/setup.
  const gameScreens = new Set(['playing', 'paused', 'tutorial', 'levelcomplete']);
  const showGame    = gameScreens.has(screen);

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{ background: '#110820' }}
    >
      {/* ── 3-D world ───────────────────────────────────────────────── */}
      {showGame && (
        <div className="absolute inset-0">
          <Suspense fallback={<LoadingScreen />}>
            <GameScene />
          </Suspense>
        </div>
      )}

      {/* ── Gameplay HUD ────────────────────────────────────────────── */}
      {screen === 'playing' && (
        <HUD isMobile={isMobile} onPause={handlePause} />
      )}

      {/* ── Screen overlays ─────────────────────────────────────────── */}
      {screen === 'mainmenu'   && <MainMenu />}
      {screen === 'howtoplay'  && <HowToPlay />}
      {screen === 'tutorial'   && <Tutorial />}
      {screen === 'levelselect' && <LevelSelect />}
      {screen === 'levelcomplete' && showGame && <LevelComplete />}
      {screen === 'paused'     && <PauseMenu />}
      {screen === 'results'    && <FinalResults />}
      {screen === 'rewards'    && <Rewards />}
      {screen === 'character'  && <CharacterCustomization />}
      {screen === 'settings'   && <Settings />}
    </div>
  );
}
