import { useState } from 'react';
import useGameStore from '../store/useGameStore';

const ALL_REWARDS = [
  { id: 'festival_ganesha', icon: '🐘', name: 'Festival Ganesha', desc: 'Complete Level 2', color: '#ff8c00' },
  { id: 'divine_ganesha',   icon: '✨', name: 'Divine Ganesha',   desc: 'Complete Level 4', color: '#9370db' },
  { id: 'golden_ganesha',   icon: '👑', name: 'Golden Ganesha',   desc: 'Complete Grand Festival', color: '#ffd700' },
  { id: 'golden_mouse',     icon: '🐭', name: 'Golden Mouse',     desc: 'Complete Grand Festival', color: '#ffd700' },
  { id: 'festival_master',  icon: '🏆', name: 'Festival Master',  desc: 'Reach Festival Master rank', color: '#ffd700' },
];

export default function Rewards() {
  const { setScreen, unlockedRewards } = useGameStore();
  const [selected, setSelected] = useState(null);

  const unlocked = unlockedRewards.length;

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
          <div className="flex-1">
            <h1 className="text-yellow-400 text-xl font-black leading-none">🏆 Rewards</h1>
            <p className="text-white/35 text-[11px] mt-0.5">
              {unlocked} of {ALL_REWARDS.length} unlocked
            </p>
          </div>
          {/* Progress pills */}
          <div className="flex gap-1">
            {ALL_REWARDS.map((_, i) => (
              <div
                key={i}
                style={{
                  width: 6, height: 6,
                  borderRadius: '50%',
                  background: i < unlocked ? '#ffd700' : 'rgba(255,255,255,0.12)',
                }}
              />
            ))}
          </div>
        </div>

        {/* Reward grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {ALL_REWARDS.map(r => {
            const isUnlocked = unlockedRewards.includes(r.id);
            return (
              <button
                key={r.id}
                onClick={() => isUnlocked && setSelected(r)}
                style={{
                  borderRadius: 20,
                  padding: '18px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  border: `1.5px solid ${isUnlocked ? 'rgba(255,215,0,0.35)' : 'rgba(255,255,255,0.08)'}`,
                  background: isUnlocked
                    ? 'linear-gradient(160deg,rgba(40,25,5,0.9),rgba(20,12,2,0.9))'
                    : 'rgba(255,255,255,0.03)',
                  cursor: isUnlocked ? 'pointer' : 'default',
                  opacity: isUnlocked ? 1 : 0.45,
                  boxShadow: isUnlocked ? `0 0 20px ${r.color}18` : 'none',
                  transition: 'all 0.15s ease',
                  animation: isUnlocked ? 'glowPulse 3s ease-in-out infinite' : 'none',
                }}
              >
                <div style={{ fontSize: isUnlocked ? 44 : 36 }}>
                  {isUnlocked ? r.icon : '🔒'}
                </div>
                <div
                  className="font-bold text-sm text-center leading-tight"
                  style={{ color: isUnlocked ? '#f5e6c8' : 'rgba(255,255,255,0.3)' }}
                >
                  {r.name}
                </div>
                <div
                  className="text-[10px] text-center leading-tight"
                  style={{ color: isUnlocked ? 'rgba(255,215,0,0.7)' : 'rgba(255,255,255,0.2)' }}
                >
                  {isUnlocked ? '✅ Unlocked' : r.desc}
                </div>
              </button>
            );
          })}
        </div>

        {/* Locked message */}
        {unlocked < ALL_REWARDS.length && (
          <div
            className="rounded-2xl p-4 mb-4 text-center"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <p className="text-white/40 text-xs leading-relaxed">
              Complete levels and missions to unlock all rewards.
              <br />
              <span className="text-yellow-400/60">{ALL_REWARDS.length - unlocked} remaining</span>
            </p>
          </div>
        )}

        <button
          onClick={() => setScreen('mainmenu')}
          className="w-full py-3 rounded-xl btn-glass font-bold text-sm"
        >
          ← Back to Menu
        </button>

        <div style={{ height: 'env(safe-area-inset-bottom,12px)' }} />
      </div>

      {/* Reward detail modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(8,4,20,0.88)', backdropFilter: 'blur(16px)' }}
          onClick={() => setSelected(null)}
        >
          <div
            className="reward-reveal w-full max-w-xs mx-4 text-center"
            style={{
              background: 'linear-gradient(160deg,rgba(40,20,5,0.98),rgba(20,10,2,0.98))',
              border: `1.5px solid ${selected.color}55`,
              borderRadius: 28,
              padding: '32px 24px',
              boxShadow: `0 8px 40px rgba(0,0,0,0.8), 0 0 60px ${selected.color}18`,
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ fontSize: 64, marginBottom: 8, filter: `drop-shadow(0 0 12px ${selected.color}99)` }}>
              {selected.icon}
            </div>
            <h2
              className="font-black text-xl mb-1"
              style={{ color: selected.color }}
            >
              {selected.name}
            </h2>
            <p className="text-white/50 text-sm mb-2">{selected.desc}</p>
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-6"
              style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.3)' }}
            >
              ✅ Unlocked!
            </div>
            <button
              onClick={() => setSelected(null)}
              className="w-full py-3 rounded-xl btn-gold font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
