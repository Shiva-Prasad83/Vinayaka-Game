import { useEffect, useRef, useState } from 'react';
import useGameStore from '../store/useGameStore';
import GaneshaIdol from '../game/world/GaneshaIdol';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import {
  Marigold, FestivalLights, SceneLighting,
  FloatingPetals, Rangoli, Diya,
} from '../game/world/Environment';

/* ── 3-D animated background scene ───────────────────────────────────────── */
function MenuBackground() {
  return (
    <>
      <SceneLighting quality="medium" timeOfDay="evening" />
      <FloatingPetals count={25} area={18} />

      {/* Ground */}
      <mesh position={[0, -1.25, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#b8956a" roughness={0.9} />
      </mesh>

      {/* Rangoli under idol */}
      <Rangoli position={[0, -1.24, 0]} radius={1.6} />

      {/* Grand idol */}
      <GaneshaIdol position={[0, -1.2, 0]} variant="golden" size={1.1} showGlow />

      {/* Flanking marigolds */}
      <Marigold position={[-2.2, -1.2,  0.8]} color="#ff8c00" scale={1.1} />
      <Marigold position={[ 2.2, -1.2,  0.8]} color="#ffd700" scale={1.1} />
      <Marigold position={[-1.5, -1.2,  1.8]} color="#ff69b4" scale={0.9} />
      <Marigold position={[ 1.5, -1.2,  1.8]} color="#ff69b4" scale={0.9} />
      <Marigold position={[-3.0, -1.2, -0.5]} color="#ff8c00" scale={0.8} />
      <Marigold position={[ 3.0, -1.2, -0.5]} color="#ff8c00" scale={0.8} />

      {/* Diyas */}
      <Diya position={[-1.0, -1.2, 1.3]} />
      <Diya position={[ 1.0, -1.2, 1.3]} />
      <Diya position={[-1.8, -1.2, 0.4]} />
      <Diya position={[ 1.8, -1.2, 0.4]} />

      {/* Festival lights arc */}
      <FestivalLights
        points={[[-3.5,1.2,0],[-1.8,1.8,0],[0,2.2,0],[1.8,1.8,0],[3.5,1.2,0]]}
        color="#ffdd00"
      />
      <FestivalLights
        points={[[-2.5,0.4,1.5],[-1.2,0.8,1.5],[0,1.0,1.5],[1.2,0.8,1.5],[2.5,0.4,1.5]]}
        color="#ff8c00"
      />
    </>
  );
}

/* ── Decorative SVG border strip ─────────────────────────────────────────── */
function OrnamentStrip({ className = '' }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-yellow-400/50" />
      <span className="text-yellow-400/70 text-sm select-none">✦ ✦ ✦</span>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-yellow-400/50" />
    </div>
  );
}

/* ── Menu button with press animation ───────────────────────────────────── */
function MenuButton({ children, onClick, variant = 'glass', className = '', style }) {
  const [pressed, setPressed] = useState(false);

  const variants = {
    gold:   'btn-gold  text-black  text-lg font-black rounded-2xl py-4',
    orange: 'btn-orange text-white text-lg font-black rounded-2xl py-4',
    glass:  'btn-glass  text-white text-base font-bold  rounded-xl  py-3',
  };

  return (
    <button
      onClick={onClick}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      className={`w-full px-5 transition-all ${variants[variant]} ${className}`}
      style={{
        transform: pressed ? 'scale(0.96)' : 'scale(1)',
        ...style,
      }}
    >
      {children}
    </button>
  );
}

/* ── Animated stat badge ────────────────────────────────────────────────── */
function StatBadge({ icon, value, label }) {
  return (
    <div className="glass-gold rounded-xl px-3 py-2 flex flex-col items-center gap-0.5 min-w-[70px]">
      <span className="text-xl leading-none">{icon}</span>
      <span className="text-yellow-400 text-sm font-black leading-none">{value}</span>
      <span className="text-white/40 text-[9px] uppercase tracking-wider">{label}</span>
    </div>
  );
}

/* ── Main export ─────────────────────────────────────────────────────────── */
export default function MainMenu() {
  const { setScreen, completedLevels, score, unlockedRewards } = useGameStore();
  const hasSave  = completedLevels.length > 0 || score > 0;
  const [show, setShow] = useState(false);

  // Slight delay for entrance animation after loading
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: '#110820' }}>

      {/* ── 3-D animated backdrop ──────────────────────────────────── */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0.4, 5.5], fov: 52 }} shadows>
          <MenuBackground />
          <OrbitControls
            enableZoom={false} enablePan={false}
            autoRotate autoRotateSpeed={0.4}
            maxPolarAngle={Math.PI / 2.1}
            minPolarAngle={Math.PI / 4}
          />
        </Canvas>
      </div>

      {/* ── Gradient overlays ─────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, transparent 40%, rgba(8,4,20,0.6) 100%)' }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(8,4,20,0.92) 0%, rgba(8,4,20,0.35) 45%, transparent 70%)' }} />

      {/* ── Content (entrance fade) ───────────────────────────────── */}
      <div
        className="absolute inset-0 flex flex-col"
        style={{ opacity: show ? 1 : 0, transition: 'opacity 0.6s ease' }}
      >

        {/* ── Title block ───────────────────────────────────────────── */}
        <div className="flex flex-col items-center pt-8 px-4 menu-float" style={{ animationDelay: '0.2s' }}>
          {/* Diya row */}
          <div className="flex items-center gap-3 mb-3">
            {['🪔','🌺','🐘','🌺','🪔'].map((e, i) => (
              <span key={i} className="text-xl opacity-80" style={{ animationDelay: `${i * 0.15}s` }}>{e}</span>
            ))}
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-black text-center leading-none tracking-tight"
            style={{
              color: '#ffd700',
              textShadow: '0 0 30px rgba(255,200,0,0.7), 0 0 60px rgba(255,140,0,0.3), 0 3px 6px rgba(0,0,0,0.9)',
            }}
          >
            GANESHA
          </h1>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-black text-center leading-none tracking-tight mb-1"
            style={{
              color: '#ff8c00',
              textShadow: '0 0 30px rgba(255,140,0,0.6), 0 3px 6px rgba(0,0,0,0.9)',
            }}
          >
            FESTIVAL
          </h1>
          <OrnamentStrip className="w-full max-w-[280px] mb-1" />
          <h2
            className="text-base sm:text-lg font-bold text-center tracking-widest uppercase"
            style={{ color: '#f5d48a', textShadow: '0 2px 6px rgba(0,0,0,0.8)' }}
          >
            Vinayaka Champion
          </h2>
        </div>

        {/* ── Save stats (if returning player) ─────────────────────── */}
        {hasSave && (
          <div className="flex justify-center gap-3 mt-4 px-4">
            <StatBadge icon="⭐" value={score.toLocaleString()} label="Score" />
            <StatBadge icon="🗺️" value={`${completedLevels.length}/5`} label="Levels" />
            <StatBadge icon="🏆" value={unlockedRewards.length} label="Rewards" />
          </div>
        )}

        {/* ── Spacer pushes buttons to bottom ──────────────────────── */}
        <div className="flex-1" />

        {/* ── Button group ─────────────────────────────────────────── */}
        <div className="flex flex-col items-center gap-3 pb-8 px-6"
          style={{ paddingBottom: 'max(28px, env(safe-area-inset-bottom, 12px))' }}>

          {hasSave && (
            <MenuButton variant="gold" onClick={() => setScreen('playing')}
              style={{ boxShadow: '0 0 30px rgba(255,200,0,0.35)' }}>
              ▶ CONTINUE
            </MenuButton>
          )}

          <MenuButton
            variant={hasSave ? 'orange' : 'gold'}
            onClick={() => setScreen('howtoplay')}
            style={!hasSave ? { boxShadow: '0 0 30px rgba(255,200,0,0.35)' } : {}}
          >
            {hasSave ? '🆕 NEW GAME' : '▶ PLAY'}
          </MenuButton>

          {/* Secondary buttons row */}
          <div className="flex gap-3 w-full max-w-xs">
            <MenuButton variant="glass" onClick={() => setScreen('levelselect')} className="flex-1">
              🗺️ Levels
            </MenuButton>
            <MenuButton variant="glass" onClick={() => setScreen('rewards')} className="flex-1">
              🏆 Rewards
            </MenuButton>
          </div>

          <div className="flex gap-3 w-full max-w-xs">
            <MenuButton variant="glass" onClick={() => setScreen('character')} className="flex-1">
              👤 Character
            </MenuButton>
            <MenuButton variant="glass" onClick={() => setScreen('settings')} className="flex-1">
              ⚙️ Settings
            </MenuButton>
          </div>

          <OrnamentStrip className="w-full max-w-xs mt-1" />
        </div>
      </div>
    </div>
  );
}
