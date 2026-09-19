import { useState, useEffect, useRef, useCallback } from 'react';
import useGameStore from '../store/useGameStore';
import inputManager from '../game/systems/InputManager';
import { MISSIONS } from '../game/missions/missionData';

/* ─────────────────────────────────────────────────────────────────────────────
   VIRTUAL JOYSTICK
   Tracks a single touch by identifier. Reports normalised x/y to InputManager.
   Handles touchcancel and pointerup outside element correctly.
───────────────────────────────────────────────────────────────────────────── */
export function VirtualJoystick({ size = 120 }) {
  const baseRef   = useRef(null);
  const thumbRef  = useRef(null);
  const stateRef  = useRef({ id: null, cx: 0, cy: 0, maxR: 0 });

  // Register global pointer-cancel handler so releasing outside still resets
  useEffect(() => {
    const reset = () => {
      stateRef.current.id = null;
      if (thumbRef.current) thumbRef.current.style.transform = 'translate(0px,0px)';
      inputManager.setJoystick(0, 0);
    };
    window.addEventListener('pointercancel', reset);
    window.addEventListener('pointerup',     reset);   // catches release anywhere
    return () => {
      window.removeEventListener('pointercancel', reset);
      window.removeEventListener('pointerup',     reset);
    };
  }, []);

  const onTouchStart = useCallback((e) => {
    e.preventDefault();
    if (stateRef.current.id !== null) return;
    const touch = e.changedTouches[0];
    stateRef.current.id = touch.identifier;
    const rect = baseRef.current.getBoundingClientRect();
    stateRef.current.cx   = rect.left + rect.width  / 2;
    stateRef.current.cy   = rect.top  + rect.height / 2;
    stateRef.current.maxR = size / 2 - 12;
  }, [size]);

  const onTouchMove = useCallback((e) => {
    e.preventDefault();
    const { id, cx, cy, maxR } = stateRef.current;
    if (id === null) return;
    const touch = Array.from(e.touches).find(t => t.identifier === id);
    if (!touch) return;

    const dx = touch.clientX - cx;
    const dy = touch.clientY - cy;
    const dist  = Math.sqrt(dx * dx + dy * dy);
    const clamped = Math.min(dist, maxR);
    const angle   = Math.atan2(dy, dx);
    const ox = Math.cos(angle) * clamped;
    const oy = Math.sin(angle) * clamped;

    if (thumbRef.current) {
      thumbRef.current.style.transform = `translate(${ox}px,${oy}px)`;
    }
    // normalise to -1..1; invert Y so up = positive
    inputManager.setJoystick(ox / maxR, -(oy / maxR));
  }, []);

  const onTouchEnd = useCallback((e) => {
    const { id } = stateRef.current;
    const released = Array.from(e.changedTouches).some(t => t.identifier === id);
    if (!released) return;
    stateRef.current.id = null;
    if (thumbRef.current) thumbRef.current.style.transform = 'translate(0px,0px)';
    inputManager.setJoystick(0, 0);
  }, []);

  return (
    <div
      ref={baseRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="joystick-base rounded-full relative flex items-center justify-center select-none"
      style={{ width: size, height: size, touchAction: 'none' }}
    >
      {/* Outer ring decoration */}
      <div className="absolute inset-2 rounded-full border border-white/10 pointer-events-none" />
      {/* Crosshair guides */}
      <div className="absolute w-px h-3/5 bg-white/08 pointer-events-none" />
      <div className="absolute h-px w-3/5 bg-white/08 pointer-events-none" />
      {/* Thumb */}
      <div
        ref={thumbRef}
        className="joystick-thumb rounded-full absolute pointer-events-none"
        style={{
          width:  size * 0.36,
          height: size * 0.36,
          transition: 'transform 0.06s cubic-bezier(0.2,0,0,1)',
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   TOUCH CAMERA ZONE
   Covers the right half. Single-touch drag = camera look. Two-finger pinch = zoom.
   Uses InputManager.setTouchCameraDelta / setTouchZoom (new API).
───────────────────────────────────────────────────────────────────────────── */
export function TouchCameraZone() {
  const lookRef  = useRef({ id: null, lx: 0, ly: 0 });
  const pinchRef = useRef(null);

  const onTouchStart = useCallback((e) => {
    e.preventDefault();
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchRef.current    = Math.sqrt(dx * dx + dy * dy);
      lookRef.current.id  = null;
      return;
    }
    if (lookRef.current.id !== null) return;
    const t = e.changedTouches[0];
    lookRef.current = { id: t.identifier, lx: t.clientX, ly: t.clientY };
  }, []);

  const onTouchMove = useCallback((e) => {
    e.preventDefault();
    // Pinch zoom
    if (e.touches.length === 2 && pinchRef.current !== null) {
      const dx   = e.touches[0].clientX - e.touches[1].clientX;
      const dy   = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      inputManager.setTouchZoom((dist - pinchRef.current) * 0.012);
      pinchRef.current = dist;
      return;
    }
    const { id, lx, ly } = lookRef.current;
    if (id === null) return;
    const t = Array.from(e.touches).find(t2 => t2.identifier === id);
    if (!t) return;
    inputManager.setTouchCameraDelta(t.clientX - lx, t.clientY - ly);
    lookRef.current.lx = t.clientX;
    lookRef.current.ly = t.clientY;
  }, []);

  const onTouchEnd = useCallback((e) => {
    if (e.touches.length < 2) pinchRef.current = null;
    const { id } = lookRef.current;
    if (Array.from(e.changedTouches).some(t => t.identifier === id)) {
      lookRef.current.id = null;
    }
  }, []);

  return (
    <div
      className="absolute inset-0"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{ touchAction: 'none' }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   FLOATING SCORE TOASTS
───────────────────────────────────────────────────────────────────────────── */
function FloatingScores() {
  const floatingScores = useGameStore(s => s.floatingScores);
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 30 }}>
      {floatingScores.map(fs => (
        <div
          key={fs.id}
          className="float-score absolute left-1/2 -translate-x-1/2"
          style={{
            top: '38%',
            fontSize: 20,
            fontWeight: 900,
            color: fs.amount >= 100 ? '#ffd700' : '#4ade80',
            textShadow: '0 2px 8px rgba(0,0,0,0.9), 0 0 20px rgba(255,200,0,0.5)',
            whiteSpace: 'nowrap',
          }}
        >
          {fs.label || `+${fs.amount} ⭐`}
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MISSION TRACKER — top centre
───────────────────────────────────────────────────────────────────────────── */
function MissionTracker() {
  const currentMissionId = useGameStore(s => s.currentMissionId);
  const missionProgress  = useGameStore(s => s.missionProgress);
  const completedMissions = useGameStore(s => s.completedMissions);
  const [prevId, setPrevId] = useState(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (currentMissionId && currentMissionId !== prevId) {
      setAnimate(true);
      setPrevId(currentMissionId);
      const t = setTimeout(() => setAnimate(false), 500);
      return () => clearTimeout(t);
    }
  }, [currentMissionId]);

  if (!currentMissionId) return null;
  const mission = MISSIONS[currentMissionId];
  if (!mission) return null;

  const progress = missionProgress[currentMissionId] ?? 0;
  const isDone   = completedMissions.includes(currentMissionId);
  const pct      = Math.min((progress / mission.target) * 100, 100);

  return (
    <div className={`glass-gold rounded-2xl px-3 py-2 min-w-[160px] max-w-[220px] ${animate ? 'mission-pop' : ''} ${isDone ? 'mission-done' : ''}`}>
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-yellow-400 text-[10px] font-bold tracking-wider uppercase">🎯 Objective</span>
      </div>
      <div className="text-white text-xs font-semibold leading-snug truncate">{mission.title}</div>
      {isDone ? (
        <div className="flex items-center gap-1 mt-1">
          <span className="text-green-400 text-xs font-bold">✓ Complete!</span>
        </div>
      ) : (
        <div className="mt-1.5">
          <div className="flex justify-between mb-1">
            <span className="text-white/60 text-[10px]">{progress}/{mission.target}</span>
            <span className="text-yellow-400 text-[10px] font-bold">{Math.round(pct)}%</span>
          </div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SCORE & ECO STRIP — top right
───────────────────────────────────────────────────────────────────────────── */
function ScoreStrip() {
  const score    = useGameStore(s => s.score);
  const ecoScore = useGameStore(s => s.ecoScore);
  const ecoPct   = Math.round((ecoScore / 1000) * 100);

  return (
    <div className="flex flex-col gap-1 items-end">
      <div className="glass-gold rounded-xl px-3 py-1.5 flex items-center gap-1.5">
        <span className="text-yellow-400 text-sm font-black leading-none">⭐</span>
        <span className="text-yellow-300 text-sm font-black leading-none">{score.toLocaleString()}</span>
      </div>
      <div className="glass rounded-xl px-3 py-1.5 flex items-center gap-1.5 min-w-[80px]">
        <span className="text-green-400 text-xs leading-none">🌱</span>
        <div className="flex-1 progress-bar-track" style={{ height: 4 }}>
          <div className="progress-bar-fill" style={{
            width: `${ecoPct}%`,
            background: 'linear-gradient(90deg,#22c55e,#4ade80)',
          }} />
        </div>
        <span className="text-green-400 text-[10px] font-bold">{ecoPct}%</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PLAYER CARD — top left
───────────────────────────────────────────────────────────────────────────── */
function PlayerCard({ name, onPause }) {
  const currentLevel = useGameStore(s => s.currentLevel);
  const LEVEL_NAMES  = ['', 'Home', 'Street', 'Market', 'Temple', 'Grand Festival'];
  const LEVEL_ICONS  = ['', '🏠', '🛣️', '🛍️', '🛕', '🎉'];

  return (
    <div className="flex items-center gap-2">
      <div className="glass-gold rounded-2xl px-3 py-2 flex flex-col">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-xs">
            👤
          </div>
          <span className="text-white text-xs font-bold leading-none">{name}</span>
        </div>
        <div className="mt-1 flex items-center gap-1">
          <span className="text-[10px]">{LEVEL_ICONS[currentLevel]}</span>
          <span className="text-yellow-400/80 text-[10px] font-semibold">{LEVEL_NAMES[currentLevel]}</span>
        </div>
      </div>
      <button
        onPointerDown={onPause}
        className="glass-gold rounded-xl w-9 h-9 flex items-center justify-center text-white/80 pointer-events-auto hover:text-yellow-400 transition-colors active:scale-90"
        style={{ fontSize: 16 }}
      >
        ☰
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   INTERACTION PROMPT — appears near bottom-right, slides up
───────────────────────────────────────────────────────────────────────────── */
function InteractionPrompt({ onInteract }) {
  const nearbyInteractable = useGameStore(s => s.nearbyInteractable);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (nearbyInteractable) {
      setVisible(true);
    } else {
      const t = setTimeout(() => setVisible(false), 180);
      return () => clearTimeout(t);
    }
  }, [nearbyInteractable]);

  if (!visible) return null;
  const { displayName, interactionLabel } = nearbyInteractable ?? {};

  return (
    <div
      className="flex flex-col items-center gap-2 slide-up pointer-events-auto"
      style={{ opacity: nearbyInteractable ? 1 : 0, transition: 'opacity 0.18s' }}
    >
      {/* Object name badge */}
      <div className="glass-gold rounded-xl px-3 py-1.5 flex items-center gap-1.5">
        <span className="text-white/80 text-xs font-semibold">{displayName}</span>
      </div>
      {/* Interact button */}
      <button
        onPointerDown={(e) => { e.preventDefault(); onInteract?.(); }}
        className="action-btn action-btn-gold interact-bounce"
        style={{ minWidth: 76, minHeight: 76 }}
      >
        <span style={{ fontSize: 22 }}>👆</span>
        <span style={{ fontSize: 10, fontWeight: 700, whiteSpace: 'nowrap' }}>
          {interactionLabel ?? 'INTERACT'}
        </span>
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   JUMP BUTTON
───────────────────────────────────────────────────────────────────────────── */
function JumpButton() {
  return (
    <button
      onPointerDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        inputManager.triggerJump();
      }}
      className="action-btn action-btn-blue"
      style={{ minWidth: 56, minHeight: 56 }}
    >
      <span style={{ fontSize: 18 }}>↑</span>
      <span style={{ fontSize: 9, fontWeight: 700 }}>JUMP</span>
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   DIALOGUE PANEL — slides up from bottom centre
───────────────────────────────────────────────────────────────────────────── */
function DialoguePanel() {
  const activeDialogue = useGameStore(s => s.activeDialogue);
  const closeDialogue  = useGameStore(s => s.closeDialogue);
  const advanceMission = useGameStore(s => s.advanceMission);
  const [lineIdx, setLineIdx] = useState(0);

  useEffect(() => { if (activeDialogue) setLineIdx(0); }, [activeDialogue]);

  if (!activeDialogue) return null;
  const lines  = activeDialogue.lines ?? [];
  const cur    = lines[lineIdx];
  const isLast = lineIdx >= lines.length - 1;

  const next = () => {
    if (isLast) {
      closeDialogue();
      activeDialogue.onComplete?.();
      if (activeDialogue.missionId) advanceMission(activeDialogue.missionId, 1);
    } else {
      setLineIdx(i => i + 1);
    }
  };

  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 w-full max-w-sm px-4 slide-up pointer-events-auto"
      style={{ bottom: 'max(140px, 20%)' }}
    >
      <div className="glass-gold rounded-2xl p-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-yellow-500 flex items-center justify-center text-sm flex-shrink-0">
            👤
          </div>
          <div>
            <div className="text-yellow-400 text-xs font-bold leading-none">{activeDialogue.npcName}</div>
            <div className="text-white/40 text-[10px] leading-none mt-0.5">
              {lineIdx + 1} / {lines.length}
            </div>
          </div>
        </div>
        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent mb-2.5" />
        {/* Text */}
        <p className="text-white/90 text-sm leading-relaxed mb-3">{cur?.text}</p>
        {/* Actions */}
        <div className="flex gap-2 justify-end">
          {cur?.action === 'invite' ? (
            <>
              <button onPointerDown={next}
                className="btn-gold px-4 py-2 rounded-xl text-sm">
                ✓ ACCEPT
              </button>
              <button onPointerDown={closeDialogue}
                className="btn-glass px-4 py-2 rounded-xl text-sm">
                Not now
              </button>
            </>
          ) : (
            <button onPointerDown={next}
              className="btn-gold px-5 py-2 rounded-xl text-sm">
              {isLast ? 'OK ✓' : 'CONTINUE ▶'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PC KEY HINT BAR — bottom centre, only on desktop
───────────────────────────────────────────────────────────────────────────── */
function PCHintBar() {
  const nearbyInteractable = useGameStore(s => s.nearbyInteractable);

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 pointer-events-none fade-in">
      {nearbyInteractable ? (
        <div className="glass-gold rounded-xl px-4 py-2 flex items-center gap-2 slide-up">
          <span className="key-hint">E</span>
          <span className="text-yellow-400 text-xs font-bold">
            {nearbyInteractable.interactionLabel} — {nearbyInteractable.displayName}
          </span>
        </div>
      ) : (
        <div className="glass rounded-xl px-4 py-2 flex items-center gap-3">
          {[['W','A','S','D'], null, ['Mouse', 'Camera'], null, ['E','Interact'], null, ['Shift','Run'], null, ['Space','Jump']].map((item, i) => {
            if (!item) return <div key={i} className="w-px h-4 bg-white/10" />;
            if (item.length === 2 && item[0].length > 1) {
              return (
                <div key={i} className="flex items-center gap-1">
                  <span className="key-hint">{item[0]}</span>
                  <span className="text-white/40 text-[10px]">{item[1]}</span>
                </div>
              );
            }
            return (
              <div key={i} className="flex items-center gap-0.5">
                {item.map(k => <span key={k} className="key-hint">{k}</span>)}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN HUD EXPORT
───────────────────────────────────────────────────────────────────────────── */
export default function HUD({ onPause, isMobile }) {
  const characterName      = useGameStore(s => s.character.name);
  const nearbyInteractable = useGameStore(s => s.nearbyInteractable);
  const gameMode           = useGameStore(s => s.gameMode);
  const largerButtons      = useGameStore(s => s.settings.largerButtons);

  const isSimplified = gameMode === 'celebration' || gameMode === 'cinematic';
  const joystickSize = largerButtons ? 140 : 120;

  const handleInteract = useCallback(() => {
    nearbyInteractable?.onInteract?.();
    inputManager.triggerInteract();
  }, [nearbyInteractable]);

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden hud-safe"
      style={{ zIndex: 10 }}
    >
      {/* ── Floating score toasts ─────────────────────────────────────── */}
      <FloatingScores />

      {/* ── Top bar ───────────────────────────────────────────────────── */}
      {!isSimplified && (
        <div className="absolute top-0 left-0 right-0 flex items-start justify-between px-3 pt-2"
          style={{ paddingTop: 'max(8px, var(--safe-top))' }}>
          <div className="pointer-events-auto">
            <PlayerCard name={characterName} onPause={onPause} />
          </div>
          <div className="flex-1 flex justify-center px-2">
            <MissionTracker />
          </div>
          <ScoreStrip />
        </div>
      )}

      {/* Simplified pause button for cinematic/celebration */}
      {isSimplified && (
        <div className="absolute top-3 right-3 pointer-events-auto">
          <button
            onPointerDown={onPause}
            className="glass-gold rounded-xl w-10 h-10 flex items-center justify-center text-white/80 hover:text-yellow-400 active:scale-90 transition-all"
          >
            ☰
          </button>
        </div>
      )}

      {/* ── Dialogue panel ────────────────────────────────────────────── */}
      <DialoguePanel />

      {/* ── MOBILE CONTROLS ───────────────────────────────────────────── */}
      {isMobile && !isSimplified && (
        <>
          {/* Camera swipe zone — right half, behind UI elements */}
          <div className="absolute right-0 top-0 bottom-0 pointer-events-auto" style={{ width: '55%', zIndex: 11 }}>
            <TouchCameraZone />
          </div>

          {/* Joystick — bottom left */}
          <div
            className="absolute pointer-events-auto"
            style={{
              left:   'max(16px, var(--safe-left))',
              bottom: 'max(20px, calc(var(--safe-bottom) + 8px))',
              zIndex: 22,
            }}
          >
            <VirtualJoystick size={joystickSize} />
          </div>

          {/* Right action cluster — bottom right */}
          <div
            className="absolute flex flex-col items-center gap-3 pointer-events-auto"
            style={{
              right:  'max(16px, var(--safe-right))',
              bottom: 'max(20px, calc(var(--safe-bottom) + 8px))',
              zIndex: 22,
            }}
          >
            <JumpButton />
            <InteractionPrompt onInteract={handleInteract} />
          </div>
        </>
      )}

      {/* ── PC CONTROLS ───────────────────────────────────────────────── */}
      {!isMobile && !isSimplified && (
        <>
          <PCHintBar />
          {/* Right-click hint on first load */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none fade-in"
            style={{ opacity: 0, animation: 'fadeIn 0.5s 1s forwards, fadeIn 0.5s 4s reverse forwards' }}
          >
            <div className="glass rounded-xl px-4 py-2 text-white/60 text-xs text-center">
              Right-click drag to rotate camera<br />Left-click canvas to lock cursor
            </div>
          </div>
        </>
      )}
    </div>
  );
}
