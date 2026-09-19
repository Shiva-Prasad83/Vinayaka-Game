import { useState } from 'react';
import useGameStore from '../store/useGameStore';
import { resetProgress } from '../game/systems/SaveService';
import { PageShell, PageHeader, SectionCard, SectionRow, BackButton } from '../components/PageShell';

/* ── Toggle ──────────────────────────────────────────────────────────────── */
function Toggle({ label, value, onChange, description, icon }) {
  return (
    <SectionRow>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: '#f5e6c8', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            {icon && <span>{icon}</span>}
            {label}
          </div>
          {description && (
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 2 }}>{description}</div>
          )}
        </div>
        <button
          onClick={() => onChange(!value)}
          style={{
            width: 48, height: 26, borderRadius: 99, flexShrink: 0,
            background: value
              ? 'linear-gradient(90deg, #ffd700, #f59e0b)'
              : 'rgba(255,255,255,0.12)',
            border: 'none', cursor: 'pointer', position: 'relative',
            transition: 'background 0.2s',
            boxShadow: value ? '0 0 10px rgba(255,200,0,0.4)' : 'none',
          }}
        >
          <div style={{
            position: 'absolute', top: 3,
            left: value ? 25 : 3,
            width: 20, height: 20, borderRadius: '50%',
            background: '#fff',
            boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
            transition: 'left 0.2s cubic-bezier(0.4,0,0.2,1)',
          }} />
        </button>
      </div>
    </SectionRow>
  );
}

/* ── Slider ──────────────────────────────────────────────────────────────── */
function Slider({ label, value, min = 0, max = 1, step = 0.05, format, onChange, icon }) {
  const display = format ? format(value) : `${Math.round(value * 100)}%`;
  return (
    <SectionRow>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ color: '#f5e6c8', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
          {icon && <span>{icon}</span>}
          {label}
        </span>
        <span style={{ color: '#ffd700', fontSize: 13, fontWeight: 800 }}>{display}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        style={{ width: '100%' }}
      />
    </SectionRow>
  );
}

/* ── Quality picker ──────────────────────────────────────────────────────── */
function QualityPicker({ value, onChange }) {
  const opts = [
    { key: 'low', label: 'Low', sub: 'Best FPS', color: '#4ade80' },
    { key: 'medium', label: 'Med', sub: 'Balanced', color: '#ffd700' },
    { key: 'high', label: 'High', sub: 'Detailed', color: '#ff8c00' },
    { key: 'ultra', label: 'Ultra', sub: 'Max', color: '#ff69b4' },
  ];
  return (
    <SectionRow noBorder>
      <div style={{ color: '#f5e6c8', fontSize: 14, fontWeight: 600, marginBottom: 10 }}>
        🎨 Graphics Quality
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
        {opts.map(o => {
          const sel = value === o.key;
          return (
            <button
              key={o.key}
              onClick={() => onChange(o.key)}
              style={{
                padding: '10px 4px', borderRadius: 14,
                border: sel ? `1.5px solid ${o.color}` : '1.5px solid rgba(255,255,255,0.1)',
                background: sel ? `${o.color}20` : 'rgba(255,255,255,0.04)',
                color: sel ? o.color : 'rgba(255,255,255,0.5)',
                cursor: 'pointer', transition: 'all 0.14s',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                boxShadow: sel ? `0 0 12px ${o.color}30` : 'none',
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 900 }}>{o.label}</span>
              <span style={{ fontSize: 9, opacity: 0.65 }}>{o.sub}</span>
            </button>
          );
        })}
      </div>
    </SectionRow>
  );
}

export default function Settings() {
  const { settings, updateSettings, setScreen } = useGameStore();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleReset = async () => {
    await resetProgress();
    setShowResetConfirm(false);
    setScreen('mainmenu');
  };

  return (
    <PageShell>
      <PageHeader
        icon="⚙️"
        title="Settings"
        subtitle="Adjust your experience"
        onBack={() => setScreen('mainmenu')}
      />

      {/* Audio */}
      <SectionCard icon="🔊" title="Audio" accentColor="#ff8c00">
        <Slider icon="🎵" label="Music Volume" value={settings.musicVolume}
          onChange={v => updateSettings({ musicVolume: v })} />
        <Slider icon="🔊" label="Sound Effects" value={settings.sfxVolume}
          onChange={v => updateSettings({ sfxVolume: v })} />
        <Toggle icon="📳" label="Vibration" description="Haptic feedback on mobile"
          value={settings.vibration} onChange={v => updateSettings({ vibration: v })} />
      </SectionCard>

      {/* Graphics */}
      <SectionCard icon="🖼️" title="Graphics" accentColor="#ff69b4">
        <QualityPicker value={settings.graphicsQuality}
          onChange={v => updateSettings({ graphicsQuality: v })} />
      </SectionCard>

      {/* Controls */}
      <SectionCard icon="🎮" title="Controls" accentColor="#9370db">
        <Slider icon="🎯" label="Camera Sensitivity"
          value={settings.controlSensitivity} min={0.2} max={2.0} step={0.1}
          format={v => `${v.toFixed(1)}×`}
          onChange={v => updateSettings({ controlSensitivity: v })} />
        <Toggle icon="📷" label="Camera Assist"
          description="Gently re-aligns camera behind player"
          value={settings.cameraAssist} onChange={v => updateSettings({ cameraAssist: v })} />
        <Toggle icon="🐢" label="Reduced Sensitivity"
          description="Halves all camera movement speed"
          value={settings.reducedSensitivity} onChange={v => updateSettings({ reducedSensitivity: v })} />
      </SectionCard>

      {/* Accessibility */}
      <SectionCard icon="♿" title="Accessibility" accentColor="#4ade80">
        <Toggle icon="🔡" label="Larger Buttons"
          description="Bigger joystick & action buttons"
          value={settings.largerButtons} onChange={v => updateSettings({ largerButtons: v })} />
        <Toggle icon="🏃" label="Auto-Run"
          description="Player runs to objectives automatically"
          value={settings.autoRun} onChange={v => updateSettings({ autoRun: v })} />
        <Toggle icon="👆" label="Auto-Interact"
          description="Collect nearby items without pressing interact"
          value={settings.autoInteract} onChange={v => updateSettings({ autoInteract: v })} />
        <Toggle icon="🧭" label="Objective Markers"
          description="Show distance arrows to objectives"
          value={settings.objectiveMarkers} onChange={v => updateSettings({ objectiveMarkers: v })} />
      </SectionCard>

      {/* Danger zone */}
      <div style={{
        borderRadius: 20, marginBottom: 12, overflow: 'hidden',
        border: '1px solid rgba(220,60,60,0.25)',
        background: 'rgba(180,30,30,0.08)',
      }}>
        <div style={{
          padding: '12px 16px 10px',
          background: 'linear-gradient(90deg, rgba(220,60,60,0.12), transparent)',
          borderBottom: '1px solid rgba(220,60,60,0.12)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ fontSize: 16 }}>⚠️</span>
          <span style={{ color: '#f87171', fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Danger Zone
          </span>
        </div>
        <div style={{ padding: '14px 16px' }}>
          {showResetConfirm ? (
            <>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, lineHeight: 1.6, marginBottom: 14 }}>
                This will permanently erase <strong style={{ color: '#f87171' }}>all progress</strong>, scores, and unlocks. This cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={handleReset}
                  style={{
                    flex: 1, padding: '12px', borderRadius: 14,
                    background: 'linear-gradient(135deg,#dc2626,#b91c1c)',
                    border: '1px solid rgba(248,113,113,0.3)',
                    color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer',
                  }}
                >
                  Yes, Reset Everything
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  style={{
                    flex: 1, padding: '12px', borderRadius: 14,
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={() => setShowResetConfirm(true)}
              style={{
                width: '100%', padding: '12px', borderRadius: 14,
                background: 'rgba(220,60,60,0.15)',
                border: '1px solid rgba(220,60,60,0.3)',
                color: '#fca5a5', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                transition: 'all 0.14s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(220,60,60,0.25)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(220,60,60,0.15)'}
            >
              🔄 Reset All Progress
            </button>
          )}
        </div>
      </div>

      <BackButton onClick={() => setScreen('mainmenu')} />
    </PageShell>
  );
}
