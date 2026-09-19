import { useEffect } from 'react';
import useGameStore from '../store/useGameStore';
import { saveProgress } from '../game/systems/SaveService';
import inputManager from '../game/systems/InputManager';

/* ── Decorative divider ─────────────────────────────────────────────────── */
function Divider() {
  return (
    <div className="flex items-center gap-2 my-1">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-yellow-400/25" />
      <span className="text-yellow-400/40 text-xs">✦</span>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-yellow-400/25" />
    </div>
  );
}

/* ── Single pause menu item ─────────────────────────────────────────────── */
function PauseItem({ icon, label, onClick, variant = 'normal', subtitle }) {
  const base = 'w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all active:scale-95 text-left';
  const styles = {
    normal:  `${base} btn-glass text-sm`,
    primary: `${base} btn-gold  text-base`,
    danger:  `${base} btn-danger text-sm`,
  };

  return (
    <button onClick={onClick} className={styles[variant]}>
      <span className="text-xl w-7 text-center flex-shrink-0 leading-none">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="leading-none">{label}</div>
        {subtitle && <div className="text-white/40 text-[10px] mt-0.5 font-normal">{subtitle}</div>}
      </div>
    </button>
  );
}

export default function PauseMenu() {
  const { setScreen, currentLevel, character } = useGameStore();

  // Clear movement so the player doesn't drift while paused
  useEffect(() => {
    inputManager.actions.move.x = 0;
    inputManager.actions.move.y = 0;
    inputManager.actions.jump   = false;
  }, []);

  const levelNames = ['', 'Home', 'Street', 'Market', 'Temple', 'Grand Festival'];
  const levelIcons = ['', '🏠', '🛣️', '🛍️', '🛕', '🎉'];

  const handleResume   = () => setScreen('playing');
  const handleRestart  = () => setScreen('playing');   // missions preserved, just unpause
  const handleSettings = () => setScreen('settings');
  const handleMenu     = async () => { await saveProgress(); setScreen('mainmenu'); };

  return (
    /* Full-screen backdrop */
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(8,4,20,0.82)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)' }}>

      {/* Panel */}
      <div
        className="w-full max-w-[320px] mx-4 scale-in"
        style={{
          background: 'linear-gradient(160deg, rgba(20,10,45,0.97) 0%, rgba(12,6,28,0.97) 100%)',
          border: '1px solid rgba(255,215,0,0.25)',
          borderRadius: 24,
          boxShadow: '0 0 0 1px rgba(255,215,0,0.06) inset, 0 8px 40px rgba(0,0,0,0.7), 0 0 60px rgba(255,140,0,0.08)',
        }}
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-3">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h2 className="text-yellow-400 text-xl font-black tracking-wide leading-none">⏸ PAUSED</h2>
              <p className="text-white/40 text-xs mt-1">
                {levelIcons[currentLevel]} Level {currentLevel} — {levelNames[currentLevel]}
              </p>
            </div>
            {/* Player avatar chip */}
            <div className="glass-gold rounded-xl px-3 py-1.5 flex items-center gap-1.5">
              <span className="text-sm">👤</span>
              <span className="text-white text-xs font-bold">{character.name}</span>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent mt-3" />
        </div>

        {/* Actions */}
        <div className="px-4 pb-5 flex flex-col gap-2">
          <PauseItem
            icon="▶"
            label="RESUME"
            subtitle="Continue where you left off"
            onClick={handleResume}
            variant="primary"
          />

          <Divider />

          <PauseItem
            icon="🔄"
            label="Restart Mission"
            subtitle="Keep your score, reset objectives"
            onClick={handleRestart}
          />
          <PauseItem
            icon="⚙️"
            label="Settings"
            subtitle="Audio, graphics, controls"
            onClick={handleSettings}
          />
          <PauseItem
            icon="❓"
            label="How to Play"
            subtitle="Controls & tips"
            onClick={() => setScreen('howtoplay')}
          />

          <Divider />

          <PauseItem
            icon="🏠"
            label="Main Menu"
            subtitle="Progress is auto-saved"
            onClick={handleMenu}
            variant="danger"
          />
        </div>
      </div>
    </div>
  );
}
