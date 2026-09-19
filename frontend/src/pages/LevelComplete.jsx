import { useEffect, useState } from 'react';
import useGameStore from '../store/useGameStore';
import { saveProgress } from '../game/systems/SaveService';

const LEVEL_NAMES = ['', '🏠 Home', '🛣️ Street', '🛍️ Market', '🛕 Temple', '🎉 Grand Festival'];
const LEVEL_DESCS = [
  '',
  'Festival preparations complete!',
  'The street is ready to celebrate!',
  'All materials collected!',
  'The temple shines with devotion!',
  'The Grand Festival begins!',
];
const LEVEL_NEXT_NAMES = ['', 'Street', 'Market', 'Temple', 'Grand Festival', ''];

export default function LevelComplete() {
  const { currentLevel, setCurrentLevel, setScreen, completedLevels } = useGameStore();
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimating(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleNextLevel = async () => {
    const next = currentLevel + 1;
    setCurrentLevel(next);
    setScreen('playing');
    await saveProgress();
  };

  const handleMainMenu = async () => {
    await saveProgress();
    setScreen('mainmenu');
  };

  const pct = Math.round((completedLevels.length / 5) * 100);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(8,4,20,0.9)', backdropFilter: 'blur(20px)' }}
    >
      <div
        className={animating ? 'scale-in' : ''}
        style={{
          width: '100%',
          maxWidth: 340,
          margin: '0 16px',
          background: 'linear-gradient(160deg, rgba(25,12,5,0.98) 0%, rgba(12,6,2,0.98) 100%)',
          border: '1px solid rgba(255,215,0,0.3)',
          borderRadius: 28,
          boxShadow: '0 8px 50px rgba(0,0,0,0.8), 0 0 80px rgba(255,140,0,0.08)',
          overflow: 'hidden',
        }}
      >
        {/* Gold top stripe */}
        <div style={{ height: 4, background: 'linear-gradient(90deg,#ff8c00,#ffd700,#ff8c00)' }} />

        <div style={{ padding: '24px 24px 28px' }}>
          {/* Icon + title */}
          <div className="text-center mb-5">
            <div style={{ fontSize: 52, marginBottom: 4 }}>🎉</div>
            <div className="text-white/50 text-xs font-bold tracking-widest uppercase mb-1">Level Complete</div>
            <h2
              className="font-black text-2xl"
              style={{ color: '#ffd700', textShadow: '0 0 20px rgba(255,200,0,0.4)' }}
            >
              {LEVEL_NAMES[currentLevel]}
            </h2>
            <p className="text-white/50 text-sm mt-1">{LEVEL_DESCS[currentLevel]}</p>
          </div>

          {/* Overall progress */}
          <div
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 14,
              padding: '12px 16px',
              marginBottom: 20,
            }}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/50 text-xs">Festival Progress</span>
              <span className="text-yellow-400 text-xs font-bold">{completedLevels.length} / 5 levels</span>
            </div>
            <div className="progress-bar-track">
              <div
                className="progress-bar-fill"
                style={{ width: `${pct}%`, transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)' }}
              />
            </div>
          </div>

          {/* Next level unlock badge */}
          {currentLevel < 5 && (
            <div
              className="flex items-center gap-2 mb-5"
              style={{
                background: 'rgba(34,197,94,0.1)',
                border: '1px solid rgba(34,197,94,0.25)',
                borderRadius: 12,
                padding: '10px 14px',
              }}
            >
              <span style={{ fontSize: 20 }}>🔓</span>
              <div>
                <div className="text-green-400 text-xs font-bold leading-none">Unlocked!</div>
                <div className="text-white/70 text-xs mt-0.5">{LEVEL_NEXT_NAMES[currentLevel]} is now available</div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col gap-3">
            {currentLevel < 5 ? (
              <button
                onClick={handleNextLevel}
                className="w-full py-4 rounded-2xl font-black text-lg btn-gold"
                style={{ boxShadow: '0 0 24px rgba(255,200,0,0.25)' }}
              >
                Next: {LEVEL_NEXT_NAMES[currentLevel]} ▶
              </button>
            ) : (
              <button
                onClick={() => setScreen('results')}
                className="w-full py-4 rounded-2xl font-black text-lg btn-gold"
                style={{ boxShadow: '0 0 24px rgba(255,200,0,0.25)' }}
              >
                🏆 See Final Results
              </button>
            )}
            <button
              onClick={handleMainMenu}
              className="w-full py-3 rounded-xl btn-glass text-sm font-bold"
            >
              🏠 Main Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
