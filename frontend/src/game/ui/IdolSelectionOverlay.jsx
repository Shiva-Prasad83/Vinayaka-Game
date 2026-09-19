/**
 * IdolSelectionOverlay
 *
 * Rendered OUTSIDE the R3F Canvas (in GameScene.jsx) so that:
 *  - pointer-events work correctly over the WebGL canvas
 *  - z-index stacks properly
 *  - no page navigation occurs
 *
 * Props:
 *  onSelect(variantId)  — called when the player picks an idol
 *  onClose()            — called when the player cancels
 */

import useGameStore from '../../store/useGameStore';

const VARIANTS = [
  {
    id: 'basic',
    label: 'Basic',
    emoji: '🐘',
    color: '#f5d5a0',
    unlockLevel: 0,
    desc: 'Classic terracotta look',
  },
  {
    id: 'festival',
    label: 'Festival',
    emoji: '🔒',
    color: '#ff8c00',
    unlockLevel: 2,
    desc: 'Unlock at Level 2',
  },
  {
    id: 'divine',
    label: 'Divine',
    emoji: '🔒',
    color: '#9370db',
    unlockLevel: 4,
    desc: 'Unlock at Level 4',
  },
  {
    id: 'golden',
    label: 'Golden',
    emoji: '🔒',
    color: '#ffd700',
    unlockLevel: 5,
    desc: 'Complete Grand Festival',
  },
];

export default function IdolSelectionOverlay({ onSelect, onClose }) {
  const completedLevels = useGameStore(s => s.completedLevels);

  return (
    /* Full-screen backdrop — stops all touch/click events reaching canvas */
    <div
      onPointerDown={e => e.stopPropagation()}
      onTouchStart={e => e.stopPropagation()}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(8,4,20,0.88)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
      }}
    >
      {/* Modal panel */}
      <div
        className="scale-in"
        style={{
          width: '100%',
          maxWidth: 340,
          margin: '0 16px',
          background: 'linear-gradient(160deg, rgba(22,10,48,0.98) 0%, rgba(12,6,28,0.98) 100%)',
          border: '1px solid rgba(255,215,0,0.30)',
          borderRadius: 24,
          boxShadow: '0 8px 48px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,215,0,0.06) inset',
          overflow: 'hidden',
        }}
      >
        {/* Gold top accent */}
        <div style={{ height: 3, background: 'linear-gradient(90deg,#ff8c00,#ffd700,#ff8c00)' }} />

        <div style={{ padding: '22px 22px 24px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 44, lineHeight: 1, marginBottom: 8 }}>🐘</div>
            <h2 style={{ color: '#ffd700', fontSize: 20, fontWeight: 900, margin: 0, lineHeight: 1 }}>
              Choose Ganesha Idol
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 6 }}>
              Select the idol for your festival
            </p>
          </div>

          {/* Variant grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
            {VARIANTS.map(v => {
              const isUnlocked = v.unlockLevel === 0 || completedLevels.includes(v.unlockLevel);
              return (
                <button
                  key={v.id}
                  onClick={() => isUnlocked && onSelect(v.id)}
                  disabled={!isUnlocked}
                  style={{
                    padding: '14px 10px',
                    borderRadius: 16,
                    border: `1.5px solid ${isUnlocked ? 'rgba(255,215,0,0.4)' : 'rgba(255,255,255,0.07)'}`,
                    background: isUnlocked
                      ? 'linear-gradient(145deg,rgba(40,22,5,0.9),rgba(20,10,3,0.9))'
                      : 'rgba(255,255,255,0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                    opacity: isUnlocked ? 1 : 0.4,
                    cursor: isUnlocked ? 'pointer' : 'not-allowed',
                    transition: 'all 0.12s ease',
                  }}
                  onMouseEnter={e => isUnlocked && (e.currentTarget.style.borderColor = 'rgba(255,215,0,0.7)')}
                  onMouseLeave={e => isUnlocked && (e.currentTarget.style.borderColor = 'rgba(255,215,0,0.4)')}
                >
                  <span style={{ fontSize: 32, lineHeight: 1 }}>
                    {isUnlocked ? '🐘' : '🔒'}
                  </span>
                  <span style={{
                    color: isUnlocked ? v.color : 'rgba(255,255,255,0.2)',
                    fontSize: 12,
                    fontWeight: 800,
                    lineHeight: 1,
                  }}>
                    {v.label}
                  </span>
                  <span style={{
                    color: 'rgba(255,255,255,0.35)',
                    fontSize: 10,
                    textAlign: 'center',
                    lineHeight: 1.3,
                  }}>
                    {isUnlocked ? '✓ Available' : v.desc}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Cancel */}
          <button
            onClick={onClose}
            style={{
              width: '100%',
              padding: '11px',
              borderRadius: 12,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.6)',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.12s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
