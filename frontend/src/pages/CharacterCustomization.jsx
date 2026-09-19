import { useState } from 'react';
import useGameStore from '../store/useGameStore';

const OUTFITS = [
  { label: 'Orange',  color: '#ff8c00', bg: 'rgba(255,140,0,0.15)' },
  { label: 'Red',     color: '#dc143c', bg: 'rgba(220,20,60,0.15)' },
  { label: 'Purple',  color: '#9370db', bg: 'rgba(147,112,219,0.15)' },
  { label: 'Blue',    color: '#2196f3', bg: 'rgba(33,150,243,0.15)' },
  { label: 'Green',   color: '#4caf50', bg: 'rgba(76,175,80,0.15)' },
];

const ACCESSORIES = ['None', '🌺 Flowers', '👑 Crown', '📿 Beads', '✨ Sparkle'];

const GANESHA_VARIANTS = [
  { id: 'basic',    label: 'Basic',    color: '#f5d5a0', unlockLevel: 0, icon: '🐘' },
  { id: 'festival', label: 'Festival', color: '#ff8c00', unlockLevel: 2, icon: '🐘' },
  { id: 'divine',   label: 'Divine',   color: '#9370db', unlockLevel: 4, icon: '🐘' },
  { id: 'golden',   label: 'Golden',   color: '#ffd700', unlockLevel: 5, icon: '🐘' },
];

function Section({ title, icon, children }) {
  return (
    <div
      className="rounded-2xl p-4 mb-3"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,215,0,0.10)' }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">{icon}</span>
        <span className="text-yellow-400 text-xs font-bold tracking-wider uppercase">{title}</span>
      </div>
      {children}
    </div>
  );
}

export default function CharacterCustomization() {
  const {
    character, updateCharacter, setScreen,
    selectedGanesha, setSelectedGanesha, completedLevels,
  } = useGameStore();

  const [name, setName] = useState(character.name ?? 'Player');

  const handleSave = () => {
    updateCharacter({ name: name.trim() || 'Player' });
    setScreen('mainmenu');
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
            <h1 className="text-yellow-400 text-xl font-black leading-none">👤 Character</h1>
            <p className="text-white/35 text-[11px] mt-0.5">Customise your festival look</p>
          </div>
        </div>

        {/* Character preview strip */}
        <div
          className="flex items-center gap-4 p-4 rounded-2xl mb-4"
          style={{ background: 'rgba(255,140,0,0.06)', border: '1px solid rgba(255,140,0,0.2)' }}
        >
          <div
            style={{
              width: 56, height: 56,
              borderRadius: 16,
              background: `linear-gradient(135deg,${OUTFITS[character.outfit ?? 0].color}40,${OUTFITS[character.outfit ?? 0].color}15)`,
              border: `1.5px solid ${OUTFITS[character.outfit ?? 0].color}50`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28,
            }}
          >
            👤
          </div>
          <div>
            <div className="text-white font-black text-base leading-none">{name || 'Player'}</div>
            <div className="text-white/40 text-xs mt-0.5">
              {OUTFITS[character.outfit ?? 0].label} outfit
              {character.accessories > 0 ? ` · ${ACCESSORIES[character.accessories]}` : ''}
            </div>
          </div>
        </div>

        {/* Name */}
        <Section icon="✏️" title="Name">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={20}
            placeholder="Enter your name"
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,215,0,0.2)',
              borderRadius: 12,
              padding: '12px 16px',
              color: '#f5e6c8',
              fontSize: 14,
              outline: 'none',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(255,215,0,0.5)'}
            onBlur={e  => e.target.style.borderColor = 'rgba(255,215,0,0.2)'}
          />
        </Section>

        {/* Outfit */}
        <Section icon="👕" title="Outfit Color">
          <div className="flex flex-wrap gap-2">
            {OUTFITS.map((o, i) => {
              const selected = (character.outfit ?? 0) === i;
              return (
                <button
                  key={i}
                  onClick={() => updateCharacter({ outfit: i })}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 12,
                    border: `1.5px solid ${selected ? o.color : 'rgba(255,255,255,0.12)'}`,
                    background: selected ? o.bg : 'transparent',
                    color: selected ? o.color : 'rgba(255,255,255,0.5)',
                    fontSize: 12,
                    fontWeight: 700,
                    transition: 'all 0.12s',
                    cursor: 'pointer',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      width: 8, height: 8,
                      borderRadius: '50%',
                      background: o.color,
                      marginRight: 5,
                      verticalAlign: 'middle',
                    }}
                  />
                  {o.label}
                </button>
              );
            })}
          </div>
        </Section>

        {/* Accessories */}
        <Section icon="🌟" title="Accessories">
          <div className="flex flex-wrap gap-2">
            {ACCESSORIES.map((a, i) => {
              const selected = (character.accessories ?? 0) === i;
              return (
                <button
                  key={i}
                  onClick={() => updateCharacter({ accessories: i })}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 12,
                    border: `1.5px solid ${selected ? 'rgba(255,215,0,0.5)' : 'rgba(255,255,255,0.1)'}`,
                    background: selected ? 'rgba(255,215,0,0.1)' : 'transparent',
                    color: selected ? '#ffd700' : 'rgba(255,255,255,0.45)',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.12s',
                  }}
                >
                  {a}
                </button>
              );
            })}
          </div>
        </Section>

        {/* Ganesha variant */}
        <Section icon="🐘" title="Ganesha Idol">
          <div className="grid grid-cols-2 gap-2.5">
            {GANESHA_VARIANTS.map(g => {
              const isUnlocked = completedLevels.includes(g.unlockLevel) || g.unlockLevel === 0;
              const isSelected = selectedGanesha === g.id;
              return (
                <button
                  key={g.id}
                  onClick={() => isUnlocked && setSelectedGanesha(g.id)}
                  disabled={!isUnlocked}
                  style={{
                    padding: '14px 8px',
                    borderRadius: 16,
                    border: `1.5px solid ${isSelected ? g.color : isUnlocked ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)'}`,
                    background: isSelected
                      ? `linear-gradient(135deg,${g.color}20,${g.color}08)`
                      : 'rgba(255,255,255,0.03)',
                    opacity: isUnlocked ? 1 : 0.35,
                    cursor: isUnlocked ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'all 0.12s',
                  }}
                >
                  <span style={{ fontSize: 28 }}>{isUnlocked ? g.icon : '🔒'}</span>
                  <span style={{ color: isUnlocked ? g.color : 'rgba(255,255,255,0.2)', fontSize: 11, fontWeight: 700 }}>
                    {g.label}
                  </span>
                  {!isUnlocked && (
                    <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10 }}>Lv.{g.unlockLevel}</span>
                  )}
                  {isSelected && (
                    <span style={{ color: '#4ade80', fontSize: 10, fontWeight: 700 }}>✓ Selected</span>
                  )}
                </button>
              );
            })}
          </div>
        </Section>

        {/* Save */}
        <button
          onClick={handleSave}
          className="w-full py-4 rounded-2xl btn-gold font-black text-lg mb-3"
          style={{ boxShadow: '0 0 24px rgba(255,200,0,0.2)' }}
        >
          💾 Save Character
        </button>
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
