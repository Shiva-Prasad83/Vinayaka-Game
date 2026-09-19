import useGameStore from '../store/useGameStore';

const CARDS = [
  { icon: '🎯', title: 'Complete Missions', text: 'Finish festival activities as directed by your mission tracker.' },
  { icon: '⭐', title: 'Collect Points',    text: 'Decorate, collect items, and complete challenges to earn stars.' },
  { icon: '🐘', title: 'Help Ganesha',      text: 'Prepare the festival — cook modaks, place diyas, decorate!' },
  { icon: '🌱', title: 'Go Eco-Friendly',   text: 'Choose natural materials to earn the Eco Champion badge.' },
];

const CONTROLS = [
  { keys: ['W','A','S','D'],    label: 'Move',       mobile: 'Left joystick' },
  { keys: ['Mouse'],            label: 'Camera',     mobile: 'Swipe right side' },
  { keys: ['E'],                label: 'Interact',   mobile: 'INTERACT button' },
  { keys: ['Shift'],            label: 'Run',        mobile: 'Push joystick far' },
  { keys: ['Space'],            label: 'Jump',       mobile: 'JUMP button' },
  { keys: ['Esc'],              label: 'Pause',      mobile: '☰ button' },
];

const SCORING = [
  ['Mission',      '+100 ⭐'],
  ['Decoration',   '+50 ⭐'],
  ['Puzzle',       '+100 ⭐'],
  ['Modak',        '+10 ⭐'],
  ['Eco Action',   '+100 🌱'],
  ['Festival End', '+1000 ⭐'],
];

function KeyBadge({ k }) {
  return (
    <span className="key-hint" style={{ fontSize: 10 }}>{k}</span>
  );
}

export default function HowToPlay() {
  const { setScreen } = useGameStore();

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
            <h1 className="text-yellow-400 text-xl font-black leading-none">How to Play</h1>
            <p className="text-white/35 text-[11px] mt-0.5">Everything you need to know</p>
          </div>
        </div>

        {/* Objective cards */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {CARDS.map((c, i) => (
            <div
              key={i}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,215,0,0.12)',
                borderRadius: 18,
                padding: '16px 12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                textAlign: 'center',
              }}
            >
              <span style={{ fontSize: 32 }}>{c.icon}</span>
              <span className="text-yellow-400 text-xs font-bold leading-tight">{c.title}</span>
              <p className="text-white/50 text-[10px] leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div
          className="rounded-2xl mb-4"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '16px 18px' }}
        >
          <div className="text-yellow-400 text-xs font-bold tracking-wider uppercase mb-3">🎮 Controls</div>
          <div className="flex flex-col gap-2">
            {CONTROLS.map((c, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {c.keys.map(k => <KeyBadge key={k} k={k} />)}
                  <span className="text-white/60 text-xs ml-1">{c.label}</span>
                </div>
                <span className="text-white/30 text-[10px]">{c.mobile}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scoring */}
        <div
          className="rounded-2xl mb-5"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '16px 18px' }}
        >
          <div className="text-yellow-400 text-xs font-bold tracking-wider uppercase mb-3">⭐ Scoring</div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
            {SCORING.map(([k, v], i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-white/50 text-xs">{k}</span>
                <span className="text-yellow-400 text-xs font-bold">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => setScreen('tutorial')}
          className="w-full py-4 rounded-2xl btn-orange font-black text-lg mb-3"
          style={{ boxShadow: '0 0 24px rgba(255,140,0,0.2)' }}
        >
          🐘 Start Festival!
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
