import { useState } from 'react';
import useGameStore from '../store/useGameStore';
import { PageShell, PageHeader, BackButton, ProgressBar } from '../components/PageShell';

const LEVELS = [
  { id: 1, icon: '🏠', name: 'Home', desc: 'Choose idol, decorate, cook modaks', color: '#ff8c00', bg: 'rgba(255,140,0,0.08)' },
  { id: 2, icon: '🛣️', name: 'Street', desc: 'Invite neighbours, collect flowers', color: '#ffd700', bg: 'rgba(255,215,0,0.08)' },
  { id: 3, icon: '🛍️', name: 'Market', desc: 'Collect all festival materials', color: '#ff69b4', bg: 'rgba(255,105,180,0.08)' },
  { id: 4, icon: '🛕', name: 'Temple', desc: 'Decorate & play mini-games', color: '#9370db', bg: 'rgba(147,112,219,0.08)' },
  { id: 5, icon: '🎉', name: 'Grand Festival', desc: 'The final grand celebration!', color: '#ffd700', bg: 'rgba(255,215,0,0.08)' },
];

function LevelCard({ lvl, unlocked, completed, index, onClick }) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  return (
    <button
      onClick={onClick}
      disabled={!unlocked}
      onPointerEnter={() => unlocked && setHovered(true)}
      onPointerLeave={() => { setHovered(false); setPressed(false); }}
      onPointerDown={() => unlocked && setPressed(true)}
      onPointerUp={() => setPressed(false)}
      style={{
        width: '100%', borderRadius: 22, padding: '0',
        border: completed
          ? '1.5px solid rgba(74,222,128,0.45)'
          : unlocked
            ? `1.5px solid ${hovered ? lvl.color + '60' : lvl.color + '28'}`
            : '1.5px solid rgba(255,255,255,0.06)',
        background: completed
          ? 'rgba(34,197,94,0.07)'
          : unlocked
            ? hovered ? lvl.bg.replace('0.08', '0.14') : lvl.bg
            : 'rgba(255,255,255,0.02)',
        opacity: unlocked ? 1 : 0.38,
        cursor: unlocked ? 'pointer' : 'not-allowed',
        transform: pressed ? 'scale(0.97)' : hovered ? 'scale(1.015)' : 'scale(1)',
        transition: 'all 0.18s cubic-bezier(0.34,1.56,0.64,1)',
        boxShadow: hovered && unlocked
          ? `0 8px 30px ${lvl.color}20, 0 0 0 1px ${lvl.color}20`
          : 'none',
        textAlign: 'left', overflow: 'hidden',
        animation: `slideUp 0.35s ${index * 0.07}s both`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px' }}>

        {/* Level number + icon */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 18,
            background: unlocked
              ? `linear-gradient(135deg, ${lvl.color}35, ${lvl.color}12)`
              : 'rgba(255,255,255,0.04)',
            border: `1.5px solid ${unlocked ? lvl.color + '40' : 'rgba(255,255,255,0.08)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26,
            boxShadow: unlocked ? `0 0 16px ${lvl.color}20` : 'none',
          }}>
            {unlocked ? lvl.icon : '🔒'}
          </div>
          {/* Level number badge */}
          {unlocked && (
            <div style={{
              position: 'absolute', bottom: -4, right: -4,
              width: 20, height: 20, borderRadius: 99,
              background: completed ? '#22c55e' : lvl.color,
              color: completed ? '#fff' : '#1a0800',
              fontSize: 10, fontWeight: 900,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid #0a0414',
            }}>
              {completed ? '✓' : lvl.id}
            </div>
          )}
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{
              color: unlocked ? '#f5e6c8' : 'rgba(255,255,255,0.2)',
              fontSize: 16, fontWeight: 900, lineHeight: 1,
            }}>
              {lvl.name}
            </span>
            {completed && (
              <span style={{
                fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 99,
                background: 'rgba(34,197,94,0.18)', color: '#4ade80',
                border: '1px solid rgba(34,197,94,0.3)',
              }}>✓ DONE</span>
            )}
          </div>
          <p style={{
            color: unlocked ? 'rgba(255,255,255,0.38)' : 'rgba(255,255,255,0.14)',
            fontSize: 12, lineHeight: 1.4, margin: 0,
          }}>
            {unlocked ? lvl.desc : 'Complete the previous level to unlock'}
          </p>
        </div>

        {/* Right arrow / replay */}
        {unlocked && (
          <div style={{
            flexShrink: 0, width: 32, height: 32, borderRadius: 10,
            background: completed ? 'rgba(34,197,94,0.15)' : `${lvl.color}18`,
            border: `1px solid ${completed ? 'rgba(34,197,94,0.3)' : lvl.color + '30'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, color: completed ? '#4ade80' : lvl.color,
          }}>
            {completed ? '↺' : '▶'}
          </div>
        )}
      </div>

      {/* Bottom glow bar for completed */}
      {completed && (
        <div style={{
          height: 2,
          background: `linear-gradient(90deg, transparent, #22c55e, transparent)`,
        }} />
      )}
      {unlocked && !completed && hovered && (
        <div style={{
          height: 2,
          background: `linear-gradient(90deg, transparent, ${lvl.color}, transparent)`,
        }} />
      )}
    </button>
  );
}

export default function LevelSelect() {
  const { setScreen, isLevelUnlocked, completedLevels, replayLevel, setCurrentLevel } = useGameStore();

  const handleSelect = (level) => {
    if (!isLevelUnlocked(level)) return;
    if (completedLevels.includes(level)) {
      replayLevel(level);
    } else {
      setCurrentLevel(level);
    }
    setScreen('playing');
  };

  const pct = Math.round((completedLevels.length / LEVELS.length) * 100);

  return (
    <PageShell>
      <PageHeader
        icon="🗺️"
        title="Select Level"
        subtitle={`${completedLevels.length} of ${LEVELS.length} levels completed`}
        onBack={() => setScreen('mainmenu')}
        right={
          <div style={{
            padding: '5px 12px', borderRadius: 99,
            background: 'rgba(255,215,0,0.1)',
            border: '1px solid rgba(255,215,0,0.25)',
            color: '#ffd700', fontSize: 13, fontWeight: 800,
          }}>
            {pct}%
          </div>
        }
      />

      {/* Overall progress bar */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>Festival Progress</span>
          <span style={{ color: '#ffd700', fontSize: 11, fontWeight: 700 }}>{completedLevels.length}/{LEVELS.length}</span>
        </div>
        <ProgressBar value={completedLevels.length} max={LEVELS.length} color="#ffd700" />
      </div>

      {/* Level cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {LEVELS.map((lvl, i) => {
          const unlocked = isLevelUnlocked(lvl.id);
          const completed = completedLevels.includes(lvl.id);
          return (
            <div key={lvl.id}>
              {i > 0 && (
                <div style={{ display: 'flex', justifyContent: 'center', margin: '2px 0' }}>
                  <div style={{
                    width: 2, height: 14, borderRadius: 2,
                    background: unlocked
                      ? `linear-gradient(to bottom, ${LEVELS[i - 1].color}60, ${lvl.color}30)`
                      : 'rgba(255,255,255,0.06)',
                  }} />
                </div>
              )}
              <LevelCard
                lvl={lvl}
                unlocked={unlocked}
                completed={completed}
                index={i}
                onClick={() => handleSelect(lvl.id)}
              />
            </div>
          );
        })}
      </div>

      <div style={{ height: 16 }} />
      <BackButton onClick={() => setScreen('mainmenu')} />
    </PageShell>
  );
}
