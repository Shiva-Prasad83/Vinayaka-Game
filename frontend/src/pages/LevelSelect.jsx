import useGameStore from '../store/useGameStore';

const LEVELS = [
  { id: 1, icon: '🏠', name: 'Home',          desc: 'Choose idol, decorate, cook modaks',  color: '#ff8c00' },
  { id: 2, icon: '🛣️', name: 'Street',        desc: 'Invite neighbours, collect flowers',  color: '#ffd700' },
  { id: 3, icon: '🛍️', name: 'Market',        desc: 'Collect all festival materials',      color: '#ff69b4' },
  { id: 4, icon: '🛕', name: 'Temple',         desc: 'Decorate & play mini-games',          color: '#9370db' },
  { id: 5, icon: '🎉', name: 'Grand Festival', desc: 'The final grand celebration!',        color: '#ffd700' },
];

export default function LevelSelect() {
  const { setScreen, setCurrentLevel, isLevelUnlocked, completedLevels } = useGameStore();

  const handleSelect = (level) => {
    if (!isLevelUnlocked(level)) return;
    setCurrentLevel(level);
    setScreen('playing');
  };

  return (
    <div
      className="w-full h-full overflow-y-auto"
      style={{ background: 'linear-gradient(160deg,#110820 0%,#0c0618 100%)' }}
    >
      <div className="max-w-md mx-auto px-4 py-6">

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => setScreen('mainmenu')}
            className="glass-gold rounded-xl w-9 h-9 flex items-center justify-center text-white/70 hover:text-yellow-400 active:scale-90 transition-all flex-shrink-0"
          >
            ←
          </button>
          <div>
            <h1 className="text-yellow-400 text-xl font-black leading-none">🗺️ Select Level</h1>
            <p className="text-white/35 text-[11px] mt-0.5">
              {completedLevels.length} / {LEVELS.length} completed
            </p>
          </div>
        </div>

        {/* Level list */}
        <div className="flex flex-col gap-2">
          {LEVELS.map((lvl, i) => {
            const unlocked  = isLevelUnlocked(lvl.id);
            const completed = completedLevels.includes(lvl.id);

            return (
              <div key={lvl.id}>
                {/* Connector line */}
                {i > 0 && (
                  <div className="flex justify-center my-0.5">
                    <div
                      style={{
                        width: 2,
                        height: 16,
                        borderRadius: 2,
                        background: unlocked
                          ? 'linear-gradient(to bottom,rgba(255,215,0,0.4),rgba(255,215,0,0.1))'
                          : 'rgba(255,255,255,0.06)',
                      }}
                    />
                  </div>
                )}

                <button
                  onClick={() => handleSelect(lvl.id)}
                  disabled={!unlocked}
                  style={{
                    width: '100%',
                    borderRadius: 20,
                    padding: '16px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    border: completed
                      ? '1.5px solid rgba(34,197,94,0.4)'
                      : unlocked
                        ? `1.5px solid ${lvl.color}44`
                        : '1.5px solid rgba(255,255,255,0.07)',
                    background: completed
                      ? 'rgba(34,197,94,0.08)'
                      : unlocked
                        ? `linear-gradient(135deg,${lvl.color}10,rgba(255,255,255,0.03))`
                        : 'rgba(255,255,255,0.02)',
                    opacity: unlocked ? 1 : 0.4,
                    cursor: unlocked ? 'pointer' : 'not-allowed',
                    transition: 'all 0.15s ease',
                    textAlign: 'left',
                  }}
                >
                  {/* Level icon */}
                  <div
                    style={{
                      width: 48, height: 48,
                      borderRadius: 14,
                      background: unlocked
                        ? `linear-gradient(135deg,${lvl.color}30,${lvl.color}10)`
                        : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${unlocked ? lvl.color + '30' : 'rgba(255,255,255,0.08)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 24,
                      flexShrink: 0,
                    }}
                  >
                    {unlocked ? lvl.icon : '🔒'}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="font-black text-base leading-none"
                        style={{ color: unlocked ? '#f5e6c8' : 'rgba(255,255,255,0.2)' }}
                      >
                        {lvl.name}
                      </span>
                      {completed && (
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(34,197,94,0.2)', color: '#4ade80' }}
                        >
                          ✓ Done
                        </span>
                      )}
                      {!unlocked && (
                        <span className="text-white/25 text-[10px]">Locked</span>
                      )}
                    </div>
                    <p
                      className="text-xs mt-0.5 leading-tight"
                      style={{ color: unlocked ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)' }}
                    >
                      {unlocked ? lvl.desc : 'Complete the previous level to unlock'}
                    </p>
                  </div>

                  {/* Arrow / status */}
                  {unlocked && !completed && (
                    <span style={{ color: lvl.color, fontSize: 18, flexShrink: 0 }}>▶</span>
                  )}
                  {completed && (
                    <span style={{ fontSize: 18, flexShrink: 0 }}>✅</span>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        <div style={{ height: 20 }} />
        <button
          onClick={() => setScreen('mainmenu')}
          className="w-full py-3 rounded-xl btn-glass font-bold text-sm"
        >
          ← Back
        </button>
        <div style={{ height: 'env(safe-area-inset-bottom,12px)' }} />
      </div>
    </div>
  );
}
