import { useState, useEffect } from 'react';
import useGameStore from '../store/useGameStore';

const RANKS = [
  { min: 5000, icon: '🏆', title: 'FESTIVAL MASTER',     color: '#ffd700' },
  { min: 3000, icon: '🥇', title: 'VINAYAKA CHAMPION',   color: '#ffd700' },
  { min: 1500, icon: '🥈', title: 'FESTIVAL STAR',       color: '#c0c0c0' },
  { min: 0,    icon: '🥉', title: 'FESTIVAL HELPER',     color: '#cd7f32' },
];

function StatRow({ icon, label, value, sub }) {
  return (
    <div className="flex items-center justify-between py-2.5"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-center gap-2">
        <span style={{ fontSize: 16 }}>{icon}</span>
        <span className="text-white/60 text-sm">{label}</span>
      </div>
      <div className="text-right">
        <span className="text-white font-bold text-sm">{value}</span>
        {sub && <span className="text-white/30 text-xs ml-1.5">{sub}</span>}
      </div>
    </div>
  );
}

export default function FinalResults() {
  const { score, ecoScore, completedMissions, completedLevels, unlockedRewards, setScreen } = useGameStore();
  const [show, setShow] = useState(false);

  useEffect(() => { const t = setTimeout(() => setShow(true), 120); return () => clearTimeout(t); }, []);

  const rank      = RANKS.find(r => score >= r.min) ?? RANKS[RANKS.length - 1];
  const ecoPercent = Math.round((ecoScore / 1000) * 100);
  const isEcoChamp = ecoScore >= 800;

  return (
    <div
      className="w-full h-full overflow-y-auto"
      style={{ background: 'linear-gradient(160deg,#110820 0%,#0c0618 100%)' }}
    >
      <div className="max-w-md mx-auto px-4 py-8">

        {/* Rank hero */}
        <div
          className={`text-center mb-6 ${show ? 'scale-in' : ''}`}
          style={{ opacity: show ? 1 : 0 }}
        >
          <div style={{ fontSize: 64, marginBottom: 6 }}>🎉</div>
          <div className="text-white/50 text-xs font-bold tracking-widest uppercase mb-2">Festival Complete!</div>
          <div style={{ fontSize: 56, lineHeight: 1, marginBottom: 4 }}>{rank.icon}</div>
          <h1
            className="text-2xl font-black tracking-wide"
            style={{ color: rank.color, textShadow: `0 0 24px ${rank.color}55` }}
          >
            {rank.title}
          </h1>
          {isEcoChamp && (
            <div
              className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-bold"
              style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.3)' }}
            >
              🌱 ECO CHAMPION
            </div>
          )}
        </div>

        {/* Score card */}
        <div
          className="rounded-2xl mb-4"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,215,0,0.15)',
            padding: '4px 20px 8px',
          }}
        >
          {/* Big score */}
          <div className="text-center py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-white/40 text-xs tracking-wider uppercase mb-1">Final Score</div>
            <div
              className="font-black text-4xl"
              style={{ color: '#ffd700', textShadow: '0 0 20px rgba(255,200,0,0.4)' }}
            >
              {score.toLocaleString()} ⭐
            </div>
          </div>

          {/* Eco bar */}
          <div className="py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/50 text-xs flex items-center gap-1">🌱 Eco Score</span>
              <span className="text-green-400 text-xs font-bold">{ecoScore} / 1000</span>
            </div>
            <div className="progress-bar-track">
              <div
                className="progress-bar-fill"
                style={{ width: `${ecoPercent}%`, background: 'linear-gradient(90deg,#22c55e,#4ade80)' }}
              />
            </div>
          </div>

          <StatRow icon="🎯" label="Missions Completed" value={completedMissions.length} />
          <StatRow icon="🗺️" label="Levels Completed"   value={completedLevels.length}   sub="/ 5" />
          <StatRow icon="🏆" label="Rewards Unlocked"   value={unlockedRewards.length} />
        </div>

        {/* Rewards unlocked */}
        {unlockedRewards.length > 0 && (
          <div
            className="rounded-2xl p-4 mb-4"
            style={{ background: 'rgba(255,215,0,0.06)', border: '1px solid rgba(255,215,0,0.2)' }}
          >
            <div className="text-yellow-400 text-xs font-bold text-center mb-3 tracking-wider uppercase">
              🏆 Rewards Unlocked
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {unlockedRewards.map(id => (
                <div
                  key={id}
                  className="reward-reveal px-3 py-1.5 rounded-xl text-xs font-bold"
                  style={{ background: 'rgba(255,215,0,0.12)', color: '#ffd700', border: '1px solid rgba(255,215,0,0.25)' }}
                >
                  {id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setScreen('rewards')}
            className="w-full py-4 rounded-2xl btn-gold font-black text-lg"
            style={{ boxShadow: '0 0 24px rgba(255,200,0,0.2)' }}
          >
            🏆 View Rewards
          </button>
          <button
            onClick={() => setScreen('levelselect')}
            className="w-full py-3 rounded-xl font-bold text-sm"
            style={{ background: 'rgba(124,58,237,0.3)', border: '1px solid rgba(167,139,250,0.3)', color: '#c4b5fd' }}
          >
            🗺️ Play Again
          </button>
          <button
            onClick={() => setScreen('mainmenu')}
            className="w-full py-3 rounded-xl btn-glass font-bold text-sm"
          >
            🏠 Main Menu
          </button>
        </div>

        {/* Bottom safe area padding */}
        <div style={{ height: 'env(safe-area-inset-bottom,12px)' }} />
      </div>
    </div>
  );
}
