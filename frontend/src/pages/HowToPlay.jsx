import { useState } from 'react';
import useGameStore from '../store/useGameStore';
import { PageShell, PageHeader, GoldButton, OrangeButton, BackButton, GemDivider } from '../components/PageShell';

const OBJECTIVES = [
  { icon: '🎯', title: 'Complete Missions', text: 'Follow your mission tracker and finish festival activities in each level.', color: '#ff8c00' },
  { icon: '⭐', title: 'Earn Stars', text: 'Decorate, collect items, and complete challenges to earn stars & score.', color: '#ffd700' },
  { icon: '🐘', title: 'Help Ganesha', text: 'Prepare the festival — cook modaks, place diyas, and decorate the home!', color: '#ff69b4' },
  { icon: '🌱', title: 'Go Eco-Friendly', text: 'Choose natural materials to earn the Eco Champion badge and green score.', color: '#4ade80' },
];

const CONTROLS = [
  { keys: ['W', 'A', 'S', 'D'], label: 'Move', mobile: '🕹️ Left joystick' },
  { keys: ['Mouse'], label: 'Camera', mobile: '👆 Swipe right side' },
  { keys: ['E'], label: 'Interact', mobile: '✋ INTERACT button' },
  { keys: ['Shift'], label: 'Run', mobile: '🕹️ Push joystick far' },
  { keys: ['Space'], label: 'Jump', mobile: '⬆️ JUMP button' },
  { keys: ['Esc'], label: 'Pause/Menu', mobile: '☰ Pause button' },
];

const SCORING = [
  { action: 'Complete Mission', points: '+100 ⭐', color: '#ffd700' },
  { action: 'Decoration', points: '+50 ⭐', color: '#ff8c00' },
  { action: 'Puzzle Complete', points: '+100 ⭐', color: '#9370db' },
  { action: 'Modak Collected', points: '+10 ⭐', color: '#f59e0b' },
  { action: 'Eco Action', points: '+100 🌱', color: '#4ade80' },
  { action: 'Level Complete', points: '+500 ⭐', color: '#ff8c00' },
  { action: 'Festival End', points: '+1000 ⭐', color: '#ffd700' },
];

const LEVELS_PREVIEW = [
  { icon: '🏠', name: 'Home', hint: 'Start the preparations — choose your idol!' },
  { icon: '🛣️', name: 'Street', hint: 'Invite the neighbourhood to celebrate.' },
  { icon: '🛍️', name: 'Market', hint: 'Shop for flowers, diyas, and sweets.' },
  { icon: '🛕', name: 'Temple', hint: 'Decorate and play temple mini-games.' },
  { icon: '🎉', name: 'Grand Festival', hint: 'Place the grand idol and celebrate!' },
];

function KeyBadge({ k }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      minWidth: 26, height: 26, padding: '0 7px', borderRadius: 7,
      background: 'rgba(255,255,255,0.1)',
      border: '1px solid rgba(255,255,255,0.22)',
      borderBottom: '2px solid rgba(255,255,255,0.12)',
      fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.85)',
      fontFamily: 'monospace',
    }}>
      {k}
    </span>
  );
}

function ObjectiveCard({ obj, index }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      style={{
        borderRadius: 20, padding: '18px 14px',
        border: `1.5px solid ${hovered ? obj.color + '50' : obj.color + '20'}`,
        background: hovered ? `${obj.color}12` : `${obj.color}07`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
        textAlign: 'center', cursor: 'default',
        transform: hovered ? 'translateY(-2px)' : 'none',
        transition: 'all 0.2s ease',
        boxShadow: hovered ? `0 8px 24px ${obj.color}18` : 'none',
        animation: `scaleIn 0.4s ${index * 0.08}s both`,
      }}
    >
      <div style={{
        width: 52, height: 52, borderRadius: 16,
        background: `radial-gradient(circle, ${obj.color}35 0%, ${obj.color}10 70%)`,
        border: `1px solid ${obj.color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 26,
        boxShadow: `0 0 14px ${obj.color}25`,
      }}>
        {obj.icon}
      </div>
      <span style={{ color: obj.color, fontSize: 12, fontWeight: 800, lineHeight: 1.2 }}>{obj.title}</span>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, lineHeight: 1.6, margin: 0 }}>{obj.text}</p>
    </div>
  );
}

export default function HowToPlay() {
  const { setScreen } = useGameStore();

  return (
    <PageShell>
      <PageHeader
        icon="📖"
        title="How to Play"
        subtitle="Everything you need to know"
        onBack={() => setScreen('mainmenu')}
      />

      {/* Hero banner */}
      <div style={{
        borderRadius: 22, padding: '18px 20px', marginBottom: 16,
        background: 'linear-gradient(135deg, rgba(255,140,0,0.15), rgba(255,215,0,0.08), rgba(147,112,219,0.1))',
        border: '1px solid rgba(255,215,0,0.2)',
        display: 'flex', alignItems: 'center', gap: 16,
        animation: 'slideDown 0.4s both',
      }}>
        <span style={{ fontSize: 44, flexShrink: 0, filter: 'drop-shadow(0 0 12px rgba(255,200,0,0.6))' }}>🐘</span>
        <div>
          <div style={{ color: '#ffd700', fontSize: 16, fontWeight: 900, marginBottom: 4 }}>
            Vinayaka Chavithi Festival
          </div>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, lineHeight: 1.6, margin: 0 }}>
            Help celebrate Ganesha's arrival across 5 beautiful levels — from home preparations to the grand festival stage!
          </p>
        </div>
      </div>

      {/* Objectives */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ color: '#ffd700', fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
          🎯 Your Goals
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {OBJECTIVES.map((o, i) => <ObjectiveCard key={i} obj={o} index={i} />)}
        </div>
      </div>

      {/* Level journey */}
      <div style={{
        borderRadius: 20, padding: '16px', marginBottom: 14,
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,215,0,0.12)',
      }}>
        <div style={{ color: '#ffd700', fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
          🗺️ Your Journey
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {LEVELS_PREVIEW.map((lv, i) => (
            <div key={i}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 12, flexShrink: 0,
                  background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18,
                }}>
                  {lv.icon}
                </div>
                <div>
                  <div style={{ color: '#f5e6c8', fontSize: 13, fontWeight: 800 }}>
                    Level {i + 1}: {lv.name}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, marginTop: 1 }}>{lv.hint}</div>
                </div>
              </div>
              {i < LEVELS_PREVIEW.length - 1 && (
                <div style={{ marginLeft: 17, width: 2, height: 8, background: 'rgba(255,215,0,0.15)', borderRadius: 1 }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div style={{
        borderRadius: 20, padding: '16px 18px', marginBottom: 14,
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(147,112,219,0.2)',
      }}>
        <div style={{ color: '#9370db', fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
          🎮 Controls
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {CONTROLS.map((c, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {c.keys.map(k => <KeyBadge key={k} k={k} />)}
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginLeft: 4 }}>{c.label}</span>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11 }}>{c.mobile}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scoring */}
      <div style={{
        borderRadius: 20, padding: '16px 18px', marginBottom: 18,
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,140,0,0.15)',
      }}>
        <div style={{ color: '#ff8c00', fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
          ⭐ Scoring Guide
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {SCORING.map((s, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: s.color, boxShadow: `0 0 4px ${s.color}`,
                }} />
                <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13 }}>{s.action}</span>
              </div>
              <span style={{ color: s.color, fontSize: 13, fontWeight: 800 }}>{s.points}</span>
            </div>
          ))}
        </div>
      </div>

      <GemDivider />

      <OrangeButton icon="🐘" onClick={() => setScreen('tutorial')} style={{ marginBottom: 10 }}>
        Start Festival!
      </OrangeButton>
      <BackButton onClick={() => setScreen('mainmenu')} />
    </PageShell>
  );
}
