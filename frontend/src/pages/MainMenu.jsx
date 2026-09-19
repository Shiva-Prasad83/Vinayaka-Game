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
      <FloatingPetals count={30} area={20} />
      <mesh position={[0, -1.25, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#8b6545" roughness={0.9} />
      </mesh>
      <Rangoli position={[0, -1.24, 0]} radius={2.0} />
      <GaneshaIdol position={[0, -1.2, 0]} variant="golden" size={1.2} showGlow />
      <Marigold position={[-2.4, -1.2, 0.9]} color="#ff8c00" scale={1.2} />
      <Marigold position={[2.4, -1.2, 0.9]} color="#ffd700" scale={1.2} />
      <Marigold position={[-1.6, -1.2, 2.0]} color="#ff69b4" scale={1.0} />
      <Marigold position={[1.6, -1.2, 2.0]} color="#ff69b4" scale={1.0} />
      <Marigold position={[-3.2, -1.2, -0.4]} color="#ff8c00" scale={0.9} />
      <Marigold position={[3.2, -1.2, -0.4]} color="#ff8c00" scale={0.9} />
      <Diya position={[-1.1, -1.2, 1.4]} />
      <Diya position={[1.1, -1.2, 1.4]} />
      <Diya position={[-2.0, -1.2, 0.5]} />
      <Diya position={[2.0, -1.2, 0.5]} />
      <Diya position={[-0.5, -1.2, 2.2]} />
      <Diya position={[0.5, -1.2, 2.2]} />
      <FestivalLights
        points={[[-4, 1.4, 0], [-2, 2.0, 0], [0, 2.4, 0], [2, 2.0, 0], [4, 1.4, 0]]}
        color="#ffdd00"
      />
      <FestivalLights
        points={[[-3, 0.6, 1.8], [-1.5, 1.0, 1.8], [0, 1.2, 1.8], [1.5, 1.0, 1.8], [3, 0.6, 1.8]]}
        color="#ff8c00"
      />
      <FestivalLights
        points={[[-4, 1.4, 0], [-4, 0.8, 1.2], [-4, 0.2, 1.8]]}
        color="#ff69b4"
      />
      <FestivalLights
        points={[[4, 1.4, 0], [4, 0.8, 1.2], [4, 0.2, 1.8]]}
        color="#ff69b4"
      />
    </>
  );
}

/* ── Floating sparkle particles ──────────────────────────────────────────── */
function Sparkles({ count = 18 }) {
  const particles = useRef(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 4,
      dur: 3 + Math.random() * 4,
      delay: Math.random() * 5,
      color: ['#ffd700', '#ff8c00', '#ff69b4', '#fff', '#ffaa00'][Math.floor(Math.random() * 5)],
    }))
  ).current;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            animation: `sparkleFloat ${p.dur}s ${p.delay}s ease-in-out infinite`,
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
}

/* ── Decorative divider ───────────────────────────────────────────────────── */
function FestivalDivider({ className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(255,215,0,0.6))' }} />
      <div className="flex items-center gap-1.5">
        <span style={{ color: '#ff8c00', fontSize: 10 }}>◆</span>
        <span style={{ color: '#ffd700', fontSize: 14 }}>🪔</span>
        <span style={{ color: '#ff8c00', fontSize: 10 }}>◆</span>
      </div>
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(255,215,0,0.6))' }} />
    </div>
  );
}

/* ── Premium main button ─────────────────────────────────────────────────── */
function PrimaryButton({ children, onClick, color = 'gold', icon }) {
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);

  const configs = {
    gold: {
      bg: 'linear-gradient(135deg, #ffe566 0%, #ffd700 30%, #f59e0b 70%, #d97706 100%)',
      shadow: '0 0 40px rgba(255,200,0,0.5), 0 8px 32px rgba(255,140,0,0.3), 0 2px 0 rgba(255,255,255,0.4) inset',
      hoverShadow: '0 0 60px rgba(255,200,0,0.7), 0 12px 40px rgba(255,140,0,0.4)',
      border: '1px solid rgba(255,255,255,0.35)',
      color: '#1a0800',
    },
    orange: {
      bg: 'linear-gradient(135deg, #ff9d2e 0%, #ff8c00 40%, #ea580c 100%)',
      shadow: '0 0 30px rgba(255,120,0,0.45), 0 6px 24px rgba(200,80,0,0.3), 0 2px 0 rgba(255,255,255,0.25) inset',
      hoverShadow: '0 0 50px rgba(255,120,0,0.6), 0 10px 32px rgba(200,80,0,0.4)',
      border: '1px solid rgba(255,200,100,0.3)',
      color: '#fff',
    },
  };

  const cfg = configs[color];

  return (
    <button
      onClick={onClick}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => { setPressed(false); setHovered(false); }}
      onPointerEnter={() => setHovered(true)}
      style={{
        width: '100%',
        padding: '16px 24px',
        borderRadius: 20,
        background: cfg.bg,
        border: cfg.border,
        color: cfg.color,
        fontSize: 18,
        fontWeight: 900,
        letterSpacing: '0.04em',
        boxShadow: hovered ? cfg.hoverShadow : cfg.shadow,
        transform: pressed ? 'scale(0.95) translateY(2px)' : hovered ? 'scale(1.02) translateY(-1px)' : 'scale(1)',
        transition: 'all 0.15s cubic-bezier(0.34,1.56,0.64,1)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Shimmer sweep */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.25) 50%, transparent 60%)',
        transform: hovered ? 'translateX(100%)' : 'translateX(-100%)',
        transition: 'transform 0.4s ease',
      }} />
      {icon && <span style={{ fontSize: 20 }}>{icon}</span>}
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
    </button>
  );
}

/* ── Secondary glass button ──────────────────────────────────────────────── */
function SecondaryButton({ children, onClick, icon }) {
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => { setPressed(false); setHovered(false); }}
      onPointerEnter={() => setHovered(true)}
      style={{
        flex: 1,
        padding: '13px 8px',
        borderRadius: 16,
        background: hovered
          ? 'rgba(255,215,0,0.12)'
          : 'rgba(255,255,255,0.06)',
        border: hovered
          ? '1px solid rgba(255,215,0,0.45)'
          : '1px solid rgba(255,255,255,0.12)',
        color: hovered ? '#ffd700' : 'rgba(255,255,255,0.75)',
        fontSize: 13,
        fontWeight: 700,
        transform: pressed ? 'scale(0.94)' : 'scale(1)',
        transition: 'all 0.14s ease',
        cursor: 'pointer',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
      }}
    >
      {icon && <span style={{ fontSize: 22, lineHeight: 1 }}>{icon}</span>}
      <span>{children}</span>
    </button>
  );
}

/* ── Stat badge ──────────────────────────────────────────────────────────── */
function StatBadge({ icon, value, label, color = '#ffd700' }) {
  return (
    <div style={{
      flex: 1,
      padding: '10px 6px',
      borderRadius: 14,
      background: 'rgba(10,5,25,0.7)',
      border: `1px solid ${color}30`,
      backdropFilter: 'blur(12px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 3,
      boxShadow: `0 0 12px ${color}15`,
    }}>
      <span style={{ fontSize: 20, lineHeight: 1 }}>{icon}</span>
      <span style={{ color, fontSize: 15, fontWeight: 900, lineHeight: 1 }}>{value}</span>
      <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</span>
    </div>
  );
}

/* ── Title letter-by-letter animation ───────────────────────────────────── */
function AnimatedTitle({ text, color, shadowColor, delay = 0 }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
      {text.split('').map((ch, i) => (
        <span
          key={i}
          style={{
            color,
            fontSize: 'clamp(36px, 10vw, 64px)',
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: '0.06em',
            textShadow: `0 0 30px ${shadowColor}80, 0 0 60px ${shadowColor}40, 0 4px 8px rgba(0,0,0,0.9)`,
            animation: `letterDrop 0.5s ${delay + i * 0.06}s cubic-bezier(0.34,1.56,0.64,1) both`,
            display: 'inline-block',
          }}
        >
          {ch === ' ' ? '\u00A0' : ch}
        </span>
      ))}
    </div>
  );
}

/* ── Version badge ───────────────────────────────────────────────────────── */
function VersionBadge() {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 12px',
      borderRadius: 999,
      background: 'rgba(255,140,0,0.15)',
      border: '1px solid rgba(255,140,0,0.35)',
      marginTop: 4,
    }}>
      <span style={{ fontSize: 10, color: '#ff8c00', letterSpacing: '0.15em', fontWeight: 700, textTransform: 'uppercase' }}>
        ✦ Vinayaka Chavithi ✦
      </span>
    </div>
  );
}

/* ── Main export ─────────────────────────────────────────────────────────── */
export default function MainMenu() {
  const { setScreen, completedLevels, score, unlockedRewards } = useGameStore();
  const hasSave = completedLevels.length > 0 || score > 0;
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 120);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: '#0a0414' }}>

      {/* ── 3-D canvas backdrop ───────────────────────────────────── */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0.5, 5.8], fov: 50 }} shadows>
          <MenuBackground />
          <OrbitControls
            enableZoom={false} enablePan={false}
            autoRotate autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 2.2}
            minPolarAngle={Math.PI / 4.5}
          />
        </Canvas>
      </div>

      {/* ── Multi-layer gradient overlay ──────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, transparent 20%, rgba(6,2,14,0.5) 100%)',
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'linear-gradient(to top, rgba(6,2,14,0.97) 0%, rgba(6,2,14,0.75) 38%, rgba(6,2,14,0.15) 65%, transparent 80%)',
      }} />
      {/* Side vignettes */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'linear-gradient(to right, rgba(6,2,14,0.6) 0%, transparent 20%, transparent 80%, rgba(6,2,14,0.6) 100%)',
      }} />

      {/* ── Floating sparkle particles ────────────────────────────── */}
      <Sparkles count={20} />

      {/* ── Top decorative strip ──────────────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ height: 3, background: 'linear-gradient(90deg, #ff8c00, #ffd700, #ff69b4, #ffd700, #ff8c00)' }} />

      {/* ── Main content ──────────────────────────────────────────── */}
      <div
        className="absolute inset-0 flex flex-col"
        style={{ opacity: show ? 1 : 0, transition: 'opacity 0.7s ease' }}
      >
        {/* ── Title area ────────────────────────────────────────────── */}
        <div className="flex flex-col items-center pt-10 px-4">
          {/* Glow orb behind title */}
          <div className="pointer-events-none absolute" style={{
            width: 280, height: 120,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(255,160,0,0.18) 0%, transparent 70%)',
            top: 30,
            filter: 'blur(20px)',
          }} />

          {/* Emoji row with stagger */}
          <div className="flex items-center gap-2 mb-4" style={{ animation: 'slideDown 0.5s 0.1s both' }}>
            {['🪔', '🌺', '🐘', '🌺', '🪔'].map((e, i) => (
              <span
                key={i}
                style={{
                  fontSize: i === 2 ? 28 : 18,
                  filter: i === 2 ? 'drop-shadow(0 0 8px rgba(255,200,0,0.8))' : 'none',
                  animation: `menuFloat ${3.5 + i * 0.3}s ${i * 0.1}s ease-in-out infinite`,
                }}
              >
                {e}
              </span>
            ))}
          </div>

          {/* Main title */}
          <AnimatedTitle text="GANESHA" color="#ffd700" shadowColor="#ffaa00" delay={0.15} />
          <AnimatedTitle text="FESTIVAL" color="#ff8c00" shadowColor="#ff4400" delay={0.4} />

          <VersionBadge />

          <FestivalDivider className="w-full max-w-xs mt-4 mb-1" />
        </div>

        {/* ── Save stats row ────────────────────────────────────────── */}
        {hasSave && (
          <div
            className="flex gap-2 px-5 mt-3"
            style={{ animation: 'slideUp 0.4s 0.6s both', maxWidth: 360, margin: '12px auto 0', width: '100%' }}
          >
            <StatBadge icon="⭐" value={score.toLocaleString()} label="Score" color="#ffd700" />
            <StatBadge icon="🗺️" value={`${completedLevels.length}/5`} label="Levels" color="#ff8c00" />
            <StatBadge icon="🏆" value={unlockedRewards.length} label="Rewards" color="#ff69b4" />
          </div>
        )}

        <div className="flex-1" />

        {/* ── Button panel ──────────────────────────────────────────── */}
        <div
          className="flex flex-col gap-3 px-5"
          style={{
            paddingBottom: 'max(28px, env(safe-area-inset-bottom, 12px))',
            maxWidth: 360,
            margin: '0 auto',
            width: '100%',
            animation: 'slideUp 0.5s 0.3s both',
          }}
        >
          {/* Panel background */}
          <div style={{
            position: 'absolute',
            left: 0, right: 0,
            bottom: 0,
            height: hasSave ? 320 : 280,
            background: 'linear-gradient(to top, rgba(6,2,14,0.98) 60%, transparent 100%)',
            pointerEvents: 'none',
          }} />

          {/* Primary CTA */}
          {hasSave ? (
            <PrimaryButton
              color="gold"
              icon="▶"
              onClick={() => setScreen('playing')}
            >
              CONTINUE
            </PrimaryButton>
          ) : (
            <PrimaryButton
              color="gold"
              icon="▶"
              onClick={() => setScreen('howtoplay')}
            >
              PLAY NOW
            </PrimaryButton>
          )}

          {hasSave && (
            <PrimaryButton
              color="orange"
              icon="🆕"
              onClick={() => setScreen('howtoplay')}
            >
              NEW GAME
            </PrimaryButton>
          )}

          {/* Secondary grid */}
          <div className="flex gap-2">
            <SecondaryButton icon="🗺️" onClick={() => setScreen('levelselect')}>Levels</SecondaryButton>
            <SecondaryButton icon="🏆" onClick={() => setScreen('rewards')}>Rewards</SecondaryButton>
            <SecondaryButton icon="👤" onClick={() => setScreen('character')}>Character</SecondaryButton>
            <SecondaryButton icon="⚙️" onClick={() => setScreen('settings')}>Settings</SecondaryButton>
          </div>

          {/* Bottom ornament */}
          <FestivalDivider className="mt-1" />

          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.18)', fontSize: 10, letterSpacing: '0.12em' }}>
            JAI GANESH 🐘 GANESH CHATURTHI
          </p>
        </div>
      </div>
    </div>
  );
}
