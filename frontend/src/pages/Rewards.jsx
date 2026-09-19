import { useState } from 'react';
import useGameStore from '../store/useGameStore';
import { PageShell, PageHeader, BackButton, GemDivider, ProgressBar } from '../components/PageShell';

const ALL_REWARDS = [
  {
    id: 'festival_ganesha', icon: '🐘', name: 'Festival Ganesha', desc: 'Complete Level 2', color: '#ff8c00',
    detail: 'A vibrant orange-adorned Ganesha full of festive energy. Earned by spreading joy through the streets.'
  },
  {
    id: 'divine_ganesha', icon: '✨', name: 'Divine Ganesha', desc: 'Complete Level 4', color: '#9370db',
    detail: 'A celestial violet Ganesha glowing with divine light. Earned by completing the sacred temple rituals.'
  },
  {
    id: 'golden_ganesha', icon: '👑', name: 'Golden Ganesha', desc: 'Complete Grand Festival', color: '#ffd700',
    detail: 'The legendary golden idol — the highest honour of the festival. Only true champions earn this.'
  },
  {
    id: 'golden_mouse', icon: '🐭', name: 'Golden Mouse', desc: 'Complete Grand Festival', color: '#ffd700',
    detail: "Ganesha's beloved companion in pure gold. A symbol of loyalty and devotion to the festival."
  },
  {
    id: 'festival_master', icon: '🏆', name: 'Festival Master', desc: 'Reach Festival Master rank', color: '#ff8c00',
    detail: 'The ultimate badge of a Festival Master. You have brought joy to all five celebration zones.'
  },
];

function RewardCard({ reward, unlocked, index, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={() => unlocked && onClick(reward)}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      style={{
        borderRadius: 22, padding: '20px 14px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
        border: unlocked
          ? `1.5px solid ${hovered ? reward.color + '70' : reward.color + '30'}`
          : '1.5px solid rgba(255,255,255,0.07)',
        background: unlocked
          ? hovered
            ? `linear-gradient(160deg, ${reward.color}20, ${reward.color}08)`
            : `linear-gradient(160deg, ${reward.color}12, rgba(10,4,20,0.9))`
          : 'rgba(255,255,255,0.025)',
        cursor: unlocked ? 'pointer' : 'default',
        opacity: unlocked ? 1 : 0.4,
        transform: hovered && unlocked ? 'translateY(-3px) scale(1.02)' : 'scale(1)',
        transition: 'all 0.2s cubic-bezier(0.34,1.56,0.64,1)',
        boxShadow: hovered && unlocked ? `0 12px 32px ${reward.color}25, 0 0 0 1px ${reward.color}15` : 'none',
        animation: `scaleIn 0.4s ${index * 0.08}s both`,
      }}
    >
      {/* Icon */}
      <div style={{
        width: 72, height: 72, borderRadius: 22,
        background: unlocked
          ? `radial-gradient(circle, ${reward.color}30 0%, ${reward.color}08 70%)`
          : 'rgba(255,255,255,0.04)',
        border: `1px solid ${unlocked ? reward.color + '35' : 'rgba(255,255,255,0.06)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: unlocked ? 38 : 30,
        filter: unlocked ? `drop-shadow(0 0 10px ${reward.color}60)` : 'none',
      }}>
        {unlocked ? reward.icon : '🔒'}
      </div>

      {/* Name */}
      <span style={{
        color: unlocked ? '#f5e6c8' : 'rgba(255,255,255,0.25)',
        fontSize: 13, fontWeight: 800, textAlign: 'center', lineHeight: 1.3,
      }}>
        {reward.name}
      </span>

      {/* Status */}
      {unlocked ? (
        <span style={{
          fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 99,
          background: 'rgba(34,197,94,0.15)', color: '#4ade80',
          border: '1px solid rgba(34,197,94,0.3)',
        }}>✅ UNLOCKED</span>
      ) : (
        <span style={{
          fontSize: 10, color: 'rgba(255,255,255,0.25)', textAlign: 'center', lineHeight: 1.4,
        }}>
          {reward.desc}
        </span>
      )}
    </button>
  );
}

function RewardModal({ reward, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(4,2,12,0.92)', backdropFilter: 'blur(20px)' }}
      onClick={onClose}
    >
      <div
        className="reward-reveal"
        style={{
          width: '100%', maxWidth: 320, margin: '0 20px',
          background: `linear-gradient(160deg, rgba(20,10,4,0.99) 0%, rgba(10,4,20,0.99) 100%)`,
          border: `1.5px solid ${reward.color}45`,
          borderRadius: 28, padding: '36px 24px 28px', textAlign: 'center',
          boxShadow: `0 0 80px ${reward.color}20, 0 20px 60px rgba(0,0,0,0.8)`,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Glow top bar */}
        <div style={{ height: 3, background: `linear-gradient(90deg, transparent, ${reward.color}, transparent)`, borderRadius: 99, marginBottom: 24 }} />

        {/* Icon */}
        <div style={{
          fontSize: 72, lineHeight: 1, marginBottom: 16,
          filter: `drop-shadow(0 0 20px ${reward.color}90)`,
          animation: 'menuFloat 3s ease-in-out infinite',
        }}>
          {reward.icon}
        </div>

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '4px 14px', borderRadius: 99, marginBottom: 12,
          background: `${reward.color}18`, border: `1px solid ${reward.color}40`,
          color: reward.color, fontSize: 11, fontWeight: 800, letterSpacing: '0.1em',
        }}>
          ✦ REWARD UNLOCKED ✦
        </div>

        <h2 style={{ color: reward.color, fontSize: 22, fontWeight: 900, margin: '0 0 8px' }}>
          {reward.name}
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 1.6, margin: '0 0 20px' }}>
          {reward.detail}
        </p>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center',
          padding: '8px 0', marginBottom: 20,
          borderTop: '1px solid rgba(255,255,255,0.06)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <span style={{ color: '#4ade80', fontSize: 13 }}>✅</span>
          <span style={{ color: '#4ade80', fontSize: 13, fontWeight: 700 }}>Added to your collection</span>
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%', padding: '14px', borderRadius: 16,
            background: `linear-gradient(135deg, ${reward.color}, ${reward.color}cc)`,
            border: 'none', color: '#1a0800', fontSize: 15, fontWeight: 900,
            cursor: 'pointer',
          }}
        >
          Awesome! 🎉
        </button>
      </div>
    </div>
  );
}

export default function Rewards() {
  const { setScreen, unlockedRewards } = useGameStore();
  const [selected, setSelected] = useState(null);
  const unlocked = unlockedRewards.length;

  return (
    <PageShell>
      <PageHeader
        icon="🏆"
        title="Rewards"
        subtitle={`${unlocked} of ${ALL_REWARDS.length} unlocked`}
        onBack={() => setScreen('mainmenu')}
        right={
          <div style={{ display: 'flex', gap: 5 }}>
            {ALL_REWARDS.map((r, i) => (
              <div key={i} style={{
                width: 8, height: 8, borderRadius: '50%',
                background: i < unlocked ? r.color : 'rgba(255,255,255,0.1)',
                boxShadow: i < unlocked ? `0 0 6px ${r.color}` : 'none',
                transition: 'all 0.3s ease',
              }} />
            ))}
          </div>
        }
      />

      {/* Collection progress */}
      <div style={{
        borderRadius: 18, padding: '14px 16px', marginBottom: 18,
        background: 'rgba(255,215,0,0.06)', border: '1px solid rgba(255,215,0,0.15)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Collection Progress</span>
          <span style={{ color: '#ffd700', fontSize: 12, fontWeight: 800 }}>
            {unlocked}/{ALL_REWARDS.length} Collected
          </span>
        </div>
        <ProgressBar value={unlocked} max={ALL_REWARDS.length} color="#ffd700" />
        {unlocked === ALL_REWARDS.length && (
          <p style={{ color: '#ffd700', fontSize: 11, textAlign: 'center', marginTop: 10, fontWeight: 700 }}>
            🌟 Complete Collection! Festival Master! 🌟
          </p>
        )}
      </div>

      {/* Reward grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        {ALL_REWARDS.map((r, i) => (
          <RewardCard
            key={r.id}
            reward={r}
            unlocked={unlockedRewards.includes(r.id)}
            index={i}
            onClick={setSelected}
          />
        ))}
      </div>

      {unlocked < ALL_REWARDS.length && (
        <>
          <GemDivider />
          <div style={{
            borderRadius: 16, padding: '14px 18px', textAlign: 'center',
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, lineHeight: 1.7, margin: 0 }}>
              Complete all 5 levels to unlock every reward.<br />
              <span style={{ color: '#ffd700', opacity: 0.6 }}>
                {ALL_REWARDS.length - unlocked} reward{ALL_REWARDS.length - unlocked !== 1 ? 's' : ''} remaining
              </span>
            </p>
          </div>
        </>
      )}

      <div style={{ height: 16 }} />
      <BackButton onClick={() => setScreen('mainmenu')} />

      {selected && <RewardModal reward={selected} onClose={() => setSelected(null)} />}
    </PageShell>
  );
}
