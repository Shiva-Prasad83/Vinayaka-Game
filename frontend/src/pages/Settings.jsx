import { useState } from 'react';
import useGameStore from '../store/useGameStore';
import { resetProgress } from '../game/systems/SaveService';

/* ── Section card ───────────────────────────────────────────────────────── */
function Section({ title, icon, children }) {
  return (
    <div className="rounded-2xl p-4 mb-3"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,215,0,0.12)',
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base leading-none">{icon}</span>
        <span className="text-yellow-400 text-xs font-bold tracking-wider uppercase">{title}</span>
      </div>
      <div className="flex flex-col gap-0">{children}</div>
    </div>
  );
}

/* ── Toggle row ─────────────────────────────────────────────────────────── */
function Toggle({ label, value, onChange, description }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-white/06 last:border-0">
      <div className="flex-1 min-w-0 pr-4">
        <div className="text-white text-sm font-medium leading-none">{label}</div>
        {description && <div className="text-white/35 text-[10px] mt-0.5">{description}</div>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`toggle-track flex-shrink-0 ${value ? 'on' : 'off'}`}
        aria-label={label}
        aria-checked={value}
        role="switch"
      >
        <div className="toggle-thumb" />
      </button>
    </div>
  );
}

/* ── Slider row ─────────────────────────────────────────────────────────── */
function Slider({ label, value, min = 0, max = 1, step = 0.05, format, onChange }) {
  const display = format ? format(value) : `${Math.round(value * 100)}%`;
  return (
    <div className="py-2.5 border-b border-white/06 last:border-0">
      <div className="flex justify-between items-center mb-2">
        <span className="text-white text-sm font-medium">{label}</span>
        <span className="text-yellow-400 text-xs font-bold tabular-nums">{display}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
      />
    </div>
  );
}

/* ── Quality picker ─────────────────────────────────────────────────────── */
function QualityPicker({ value, onChange }) {
  const opts = [
    { key: 'low',    label: 'Low',    sub: 'Best FPS' },
    { key: 'medium', label: 'Medium', sub: 'Balanced' },
    { key: 'high',   label: 'High',   sub: 'Detailed' },
    { key: 'ultra',  label: 'Ultra',  sub: 'Max quality' },
  ];
  return (
    <div className="py-2.5">
      <div className="text-white text-sm font-medium mb-2.5">Graphics Quality</div>
      <div className="grid grid-cols-4 gap-2">
        {opts.map(o => (
          <button
            key={o.key}
            onClick={() => onChange(o.key)}
            className={`py-2.5 rounded-xl flex flex-col items-center gap-0.5 transition-all active:scale-95 ${
              value === o.key
                ? 'btn-gold'
                : 'btn-glass text-white/70'
            }`}
          >
            <span className="text-xs font-bold leading-none">{o.label}</span>
            <span className="text-[9px] opacity-60 leading-none">{o.sub}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Back button ─────────────────────────────────────────────────────────── */
function BackButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full py-3 rounded-xl btn-glass flex items-center justify-center gap-2 font-bold text-sm"
    >
      ← Back
    </button>
  );
}

/* ── Main export ─────────────────────────────────────────────────────────── */
export default function Settings() {
  const { settings, updateSettings, setScreen, screen } = useGameStore();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const back = () => {
    // Return to pause menu if we came from there, otherwise main menu
    if (screen === 'settings') setScreen('mainmenu');
    else setScreen('mainmenu');
  };

  const handleReset = async () => {
    await resetProgress();
    setShowResetConfirm(false);
    setScreen('mainmenu');
  };

  return (
    <div
      className="w-full h-full overflow-y-auto"
      style={{ background: 'linear-gradient(160deg, #120920 0%, #0c0618 100%)' }}
    >
      <div className="max-w-md mx-auto px-4 py-6">

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={back}
            className="glass-gold rounded-xl w-9 h-9 flex items-center justify-center text-white/70 hover:text-yellow-400 transition-colors active:scale-90 flex-shrink-0"
          >
            ←
          </button>
          <div>
            <h1 className="text-yellow-400 text-xl font-black leading-none">Settings</h1>
            <p className="text-white/35 text-[11px] mt-0.5">Adjust your experience</p>
          </div>
        </div>

        {/* Audio */}
        <Section icon="🔊" title="Audio">
          <Slider
            label="🎵 Music Volume"
            value={settings.musicVolume}
            onChange={v => updateSettings({ musicVolume: v })}
          />
          <Slider
            label="🔊 Sound Effects"
            value={settings.sfxVolume}
            onChange={v => updateSettings({ sfxVolume: v })}
          />
          <Toggle
            label="📳 Vibration"
            description="Haptic feedback on mobile"
            value={settings.vibration}
            onChange={v => updateSettings({ vibration: v })}
          />
        </Section>

        {/* Graphics */}
        <Section icon="🎨" title="Graphics">
          <QualityPicker
            value={settings.graphicsQuality}
            onChange={v => updateSettings({ graphicsQuality: v })}
          />
        </Section>

        {/* Controls */}
        <Section icon="🎮" title="Controls">
          <Slider
            label="🎯 Camera Sensitivity"
            value={settings.controlSensitivity}
            min={0.2} max={2.0} step={0.1}
            format={v => `${v.toFixed(1)}×`}
            onChange={v => updateSettings({ controlSensitivity: v })}
          />
          <Toggle
            label="📷 Camera Assist"
            description="Gently re-aligns camera behind player"
            value={settings.cameraAssist}
            onChange={v => updateSettings({ cameraAssist: v })}
          />
          <Toggle
            label="🐢 Reduced Sensitivity"
            description="Halves all camera movement speed"
            value={settings.reducedSensitivity}
            onChange={v => updateSettings({ reducedSensitivity: v })}
          />
        </Section>

        {/* Accessibility */}
        <Section icon="♿" title="Accessibility">
          <Toggle
            label="🔡 Larger Buttons"
            description="Bigger joystick & action buttons"
            value={settings.largerButtons}
            onChange={v => updateSettings({ largerButtons: v })}
          />
          <Toggle
            label="🏃 Auto-Run"
            description="Player runs to objectives automatically"
            value={settings.autoRun}
            onChange={v => updateSettings({ autoRun: v })}
          />
          <Toggle
            label="👆 Auto-Interact"
            description="Collect nearby items without pressing interact"
            value={settings.autoInteract}
            onChange={v => updateSettings({ autoInteract: v })}
          />
          <Toggle
            label="🧭 Objective Markers"
            description="Show distance arrows to objectives"
            value={settings.objectiveMarkers}
            onChange={v => updateSettings({ objectiveMarkers: v })}
          />
        </Section>

        {/* Danger zone */}
        <div className="rounded-2xl p-4 mb-4"
          style={{ background: 'rgba(180,30,30,0.12)', border: '1px solid rgba(220,60,60,0.2)' }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">⚠️</span>
            <span className="text-red-400 text-xs font-bold tracking-wider uppercase">Danger Zone</span>
          </div>
          {showResetConfirm ? (
            <div>
              <p className="text-white/70 text-sm mb-3 leading-relaxed">
                This will permanently erase all progress, scores, and unlocks. Are you sure?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-500 active:scale-95 transition-all"
                >
                  Yes, Reset
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl btn-glass text-sm font-bold"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full py-2.5 rounded-xl btn-danger text-sm font-bold"
            >
              🔄 Reset All Progress
            </button>
          )}
        </div>

        {/* Back */}
        <BackButton onClick={back} />

        {/* Bottom safe area padding */}
        <div style={{ height: 'env(safe-area-inset-bottom, 12px)' }} />
      </div>
    </div>
  );
}
