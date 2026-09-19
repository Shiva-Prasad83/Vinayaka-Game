import { useState } from 'react';
import useGameStore from '../store/useGameStore';
import { PageShell, PageHeader, SectionCard, SectionRow, GoldButton, BackButton } from '../components/PageShell';

const OUTFITS = [
  { label: 'Orange', color: '#ff8c00' },
  { label: 'Red', color: '#dc143c' },
  { label: 'Purple', color: '#9370db' },
  { label: 'Blue', color: '#2196f3' },
  { label: 'Green', color: '#4caf50' },
];

const ACCESSORIES = [
  { label: 'None', icon: '—' },
  { label: 'Flowers', icon: '🌺' },
  { label: 'Crown', icon: '👑' },
  { label: 'Beads', icon: '📿' },
  { label: 'Sparkle', icon: '✨' },
];

const GANESHA_VARIANTS = [
  { id: 'basic', label: 'Basic', color: '#f5d5a0', unlockLevel: 0, icon: '🐘', desc: 'Classic terracotta' },
  { id: 'festival', label: 'Festival', color: '#ff8c00', unlockLevel: 2, icon: '🐘', desc: 'Unlock at Lv.2' },
  { id: 'divine', label: 'Divine', color: '#9370db', unlockLevel: 4, icon: '🐘', desc: 'Unlock at Lv.4' },
  { id: 'golden', label: 'Golden', color: '#ffd700', unlockLevel: 5, icon: '🐘', desc: 'Full festival' },
];

export default function CharacterCustomization() {
  const {
    character, updateCharacter, setScreen,
    selectedGanesha, setSelectedGanesha, completedLevels,
  } = useGameStore();

  const [name, setName] = useState(character.name ?? 'Player');
  const outfit = character.outfit ?? 0;
  const accessory = character.accessories ?? 0;

  const handleSave = () => {
    updateCharacter({ name: name.trim() || 'Player' });
    setScreen('mainmenu');
  };

  return (
    <PageShell>
      <PageHeader
        icon="👤"
        title="Character"
        subtitle="Customise your festival look"
        onBack={() => setScreen('mainmenu')}
      />

      {/* Character preview card */}
      <div style={{
        borderRadius: 24, padding: '20px', marginBottom: 16,
        background: `linear-gradient(135deg, ${OUTFITS[outfit].color}18, rgba(10,4,20,0.9))`,
        border: `1.5px solid ${OUTFITS[outfit].color}35`,
        boxShadow: `0 0 30px ${OUTFITS[outfit].color}12`,
        display: 'flex', alignItems: 'center', gap: 16,
        animation: 'slideDown 0.4s both',
      }}>
        {/* Avatar */}
        <div style={{
          width: 72, height: 72, borderRadius: 22, flexShrink: 0,
          background: `radial-gradient(circle, ${OUTFITS[outfit].color}40 0%, ${OUTFITS[outfit].color}10 80%)`,
          border: `2px solid ${OUTFITS[outfit].color}50`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 36,
          boxShadow: `0 0 20px ${OUTFITS[outfit].color}30`,
          position: 'relative',
        }}>
          👤
          {accessory > 0 && (
            <span style={{ position: 'absolute', top: -8, right: -8, fontSize: 18 }}>
              {ACCESSORIES[accessory].icon}
            </span>
          )}
        </div>

        {/* Info */}
        <div style={{ flex: 1 }}>
          <div style={{ color: '#f5e6c8', fontSize: 20, fontWeight: 900, lineHeight: 1 }}>
            {name || 'Player'}
          </div>
          <div style={{ color: OUTFITS[outfit].color, fontSize: 12, marginTop: 4, fontWeight: 700 }}>
            {OUTFITS[outfit].label} Outfit
            {accessory > 0 ? ` · ${ACCESSORIES[accessory].icon} ${ACCESSORIES[accessory].label}` : ''}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 2 }}>
            Idol: {GANESHA_VARIANTS.find(g => g.id === selectedGanesha)?.label ?? 'Basic'} 🐘
          </div>
        </div>
      </div>

      {/* Name */}
      <SectionCard icon="✏️" title="Player Name" accentColor="#ffd700">
        <SectionRow noBorder>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={20}
            placeholder="Enter your name"
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,215,0,0.2)',
              borderRadius: 12, padding: '12px 16px',
              color: '#f5e6c8', fontSize: 15, outline: 'none',
              transition: 'border-color 0.15s',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(255,215,0,0.55)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,215,0,0.2)'}
          />
        </SectionRow>
      </SectionCard>

      {/* Outfit */}
      <SectionCard icon="👕" title="Outfit Color" accentColor="#ff8c00">
        <SectionRow noBorder>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {OUTFITS.map((o, i) => {
              const sel = outfit === i;
              return (
                <button
                  key={i}
                  onClick={() => updateCharacter({ outfit: i })}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    padding: '9px 16px', borderRadius: 12,
                    border: `1.5px solid ${sel ? o.color : 'rgba(255,255,255,0.1)'}`,
                    background: sel ? `${o.color}20` : 'rgba(255,255,255,0.03)',
                    color: sel ? o.color : 'rgba(255,255,255,0.45)',
                    fontSize: 13, fontWeight: 700, cursor: 'pointer',
                    transition: 'all 0.14s ease',
                    boxShadow: sel ? `0 0 12px ${o.color}30` : 'none',
                  }}
                >
                  <span style={{
                    width: 10, height: 10, borderRadius: '50%',
                    background: o.color, display: 'inline-block',
                    boxShadow: sel ? `0 0 6px ${o.color}` : 'none',
                  }} />
                  {o.label}
                </button>
              );
            })}
          </div>
        </SectionRow>
      </SectionCard>

      {/* Accessories */}
      <SectionCard icon="🌟" title="Accessories" accentColor="#ff69b4">
        <SectionRow noBorder>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {ACCESSORIES.map((a, i) => {
              const sel = accessory === i;
              return (
                <button
                  key={i}
                  onClick={() => updateCharacter({ accessories: i })}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '9px 14px', borderRadius: 12,
                    border: `1.5px solid ${sel ? 'rgba(255,215,0,0.55)' : 'rgba(255,255,255,0.1)'}`,
                    background: sel ? 'rgba(255,215,0,0.12)' : 'rgba(255,255,255,0.03)',
                    color: sel ? '#ffd700' : 'rgba(255,255,255,0.4)',
                    fontSize: 13, fontWeight: 700, cursor: 'pointer',
                    transition: 'all 0.14s ease',
                  }}
                >
                  <span>{a.icon}</span>
                  <span>{a.label}</span>
                </button>
              );
            })}
          </div>
        </SectionRow>
      </SectionCard>

      {/* Ganesha idol */}
      <SectionCard icon="🐘" title="Ganesha Idol" accentColor="#9370db">
        <SectionRow noBorder>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {GANESHA_VARIANTS.map(g => {
              const isUnlocked = g.unlockLevel === 0 || completedLevels.includes(g.unlockLevel);
              const isSel = selectedGanesha === g.id;
              return (
                <button
                  key={g.id}
                  onClick={() => isUnlocked && setSelectedGanesha(g.id)}
                  disabled={!isUnlocked}
                  style={{
                    padding: '16px 10px', borderRadius: 18,
                    border: isSel
                      ? `2px solid ${g.color}`
                      : isUnlocked
                        ? `1.5px solid rgba(255,255,255,0.12)`
                        : `1.5px solid rgba(255,255,255,0.05)`,
                    background: isSel
                      ? `linear-gradient(135deg, ${g.color}22, ${g.color}08)`
                      : 'rgba(255,255,255,0.03)',
                    opacity: isUnlocked ? 1 : 0.35,
                    cursor: isUnlocked ? 'pointer' : 'not-allowed',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                    transition: 'all 0.15s ease',
                    boxShadow: isSel ? `0 0 16px ${g.color}30` : 'none',
                    position: 'relative',
                  }}
                >
                  <span style={{
                    fontSize: 30,
                    filter: isSel ? `drop-shadow(0 0 8px ${g.color}80)` : 'none',
                  }}>
                    {isUnlocked ? g.icon : '🔒'}
                  </span>
                  <span style={{ color: isUnlocked ? g.color : 'rgba(255,255,255,0.2)', fontSize: 12, fontWeight: 800 }}>
                    {g.label}
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>
                    {isUnlocked ? g.desc : g.desc}
                  </span>
                  {isSel && (
                    <div style={{
                      position: 'absolute', top: 8, right: 8,
                      width: 18, height: 18, borderRadius: '50%',
                      background: '#22c55e', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, color: '#fff', fontWeight: 900,
                    }}>✓</div>
                  )}
                </button>
              );
            })}
          </div>
        </SectionRow>
      </SectionCard>

      <GoldButton onClick={handleSave} icon="💾" style={{ marginBottom: 10 }}>
        Save Character
      </GoldButton>
      <BackButton onClick={() => setScreen('mainmenu')} />
    </PageShell>
  );
}
