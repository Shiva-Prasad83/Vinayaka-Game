import { useState, useEffect, useCallback } from 'react';
import useGameStore from '../../store/useGameStore';

const INGREDIENTS = [
  { id: 'flour',   emoji: '🌾', label: 'Rice Flour', color: '#f5f0e8' },
  { id: 'coconut', emoji: '🥥', label: 'Coconut',    color: '#fff8ee' },
  { id: 'jaggery', emoji: '🍯', label: 'Jaggery',    color: '#c8783a' },
  { id: 'milk',    emoji: '🥛', label: 'Milk',       color: '#f0f8ff' },
];
const CORRECT_ORDER = ['flour', 'coconut', 'jaggery', 'milk'];
const TARGET = 5;

// Step indicators for progress
function ModakTray({ made, target }) {
  return (
    <div className="flex justify-center gap-2 my-3">
      {Array.from({ length: target }).map((_, i) => (
        <div
          key={i}
          className="transition-all duration-300"
          style={{
            fontSize: i < made ? 24 : 18,
            opacity: i < made ? 1 : 0.25,
            filter: i < made ? 'drop-shadow(0 0 4px rgba(255,200,0,0.6))' : 'none',
          }}
        >
          🍬
        </div>
      ))}
    </div>
  );
}

// Rotating spinner for "preparing" step
function PreparingSpinner() {
  return (
    <div className="flex flex-col items-center py-8 gap-3">
      <div style={{ fontSize: 48, display: 'inline-block', animation: 'spin 1s linear infinite' }}>
        🍬
      </div>
      <p className="text-white/80 text-sm">Preparing modak...</p>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function ModakPreparation({ onComplete, missionId = 'l1_modaks' }) {
  // All state lives here — useKey resets everything when component remounts
  const [step,       setStep]       = useState('select');  // select | preparing | done
  const [sequence,   setSequence]   = useState([]);
  const [modaksMade, setModaksMade] = useState(0);
  const [feedback,   setFeedback]   = useState('');
  const [isError,    setIsError]    = useState(false);
  const [animKey,    setAnimKey]    = useState(0);          // bump to replay entrance anim

  // Check if this mission was already finished (e.g. player reopens the kitchen)
  const alreadyDone = useGameStore(s => s.completedMissions.includes(missionId));

  // If player already finished, jump straight to done screen
  useEffect(() => {
    if (alreadyDone) setStep('done');
  }, [alreadyDone]);

  const handleIngredient = useCallback((id) => {
    if (step !== 'select') return;

    const expected = CORRECT_ORDER[sequence.length];

    if (id !== expected) {
      // Wrong ingredient — show hint, reset sequence
      setIsError(true);
      const hint = INGREDIENTS.find(i => i.id === expected)?.label ?? expected;
      setFeedback(`Try ${hint} next!`);
      setTimeout(() => { setIsError(false); setFeedback(''); }, 1200);
      setSequence([]);
      return;
    }

    const next = [...sequence, id];
    setSequence(next);

    if (next.length === CORRECT_ORDER.length) {
      // All ingredients added — animate preparation
      setStep('preparing');
      setTimeout(() => {
        const newCount = modaksMade + 1;
        setModaksMade(newCount);
        setSequence([]);

        const store = useGameStore.getState();
        store.addScore(10, '+10 ⭐ Modak!');
        store.addToInventory('modaks', 1);
        if (missionId) store.advanceMission(missionId, 1);

        if (newCount >= TARGET) {
          setStep('done');
        } else {
          setStep('select');
          setAnimKey(k => k + 1);   // replay entrance animation for next round
        }
      }, 1100);
    }
  }, [step, sequence, modaksMade, missionId]);

  const handleFinish = () => {
    onComplete?.({ modaksMade });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(8,4,20,0.88)', backdropFilter: 'blur(18px)' }}
    >
      <div
        className="w-full max-w-xs mx-4 scale-in"
        style={{
          background: 'linear-gradient(160deg, rgba(40,20,5,0.98) 0%, rgba(20,10,3,0.98) 100%)',
          border: '1px solid rgba(255,165,0,0.35)',
          borderRadius: 24,
          boxShadow: '0 8px 40px rgba(0,0,0,0.7), 0 0 60px rgba(255,140,0,0.1)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(200,90,0,0.4), rgba(100,40,0,0.4))',
            padding: '16px 20px 12px',
            borderBottom: '1px solid rgba(255,165,0,0.2)',
          }}
        >
          <div className="text-center">
            <div style={{ fontSize: 32 }}>🍬</div>
            <h2 className="text-yellow-400 text-lg font-black mt-1 leading-none">Modak Preparation</h2>
            <p className="text-white/50 text-xs mt-1">Add ingredients in the correct order</p>
          </div>
        </div>

        <div style={{ padding: '16px 20px 20px' }}>

          {/* Progress tray */}
          <ModakTray made={modaksMade} target={TARGET} />
          <p className="text-center text-white/50 text-xs mb-4">
            {modaksMade} / {TARGET} modaks ready
          </p>

          {/* ── DONE ──────────────────────────────────────────── */}
          {step === 'done' && (
            <div className="text-center">
              <div style={{ fontSize: 48, marginBottom: 8 }}>🎉</div>
              <p className="text-yellow-400 font-black text-lg mb-1">All modaks ready!</p>
              <p className="text-white/60 text-xs mb-5">
                +{TARGET * 10} ⭐ — Ganesha will be pleased!
              </p>
              <button
                onPointerDown={handleFinish}
                className="w-full py-3 rounded-xl btn-gold text-base font-black"
              >
                CONTINUE ▶
              </button>
            </div>
          )}

          {/* ── PREPARING ANIMATION ───────────────────────────── */}
          {step === 'preparing' && <PreparingSpinner />}

          {/* ── SELECT INGREDIENTS ────────────────────────────── */}
          {step === 'select' && (
            <div key={animKey}>
              {/* Current sequence display */}
              <div
                className="flex items-center justify-center gap-1 mb-3 min-h-[36px]"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  borderRadius: 12,
                  padding: '6px 12px',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {sequence.length === 0 ? (
                  <span className="text-white/30 text-xs">
                    Start with {INGREDIENTS[0].emoji} {INGREDIENTS[0].label}
                  </span>
                ) : (
                  sequence.map((id, i) => (
                    <span key={i} style={{ fontSize: 22 }}>
                      {INGREDIENTS.find(ing => ing.id === id)?.emoji}
                    </span>
                  ))
                )}
                {/* Next expected ingredient hint */}
                {sequence.length > 0 && sequence.length < CORRECT_ORDER.length && (
                  <span className="text-white/20 text-lg ml-1">
                    + {INGREDIENTS.find(i => i.id === CORRECT_ORDER[sequence.length])?.emoji}?
                  </span>
                )}
              </div>

              {/* Feedback message */}
              {feedback && (
                <div
                  className="text-center text-xs font-bold mb-3 py-1.5 px-3 rounded-lg"
                  style={{
                    background: isError ? 'rgba(220,30,30,0.2)' : 'rgba(34,197,94,0.2)',
                    color:      isError ? '#f87171' : '#4ade80',
                    border:     `1px solid ${isError ? 'rgba(220,30,30,0.3)' : 'rgba(34,197,94,0.3)'}`,
                  }}
                >
                  {isError ? '❌ ' : '✓ '}{feedback}
                </div>
              )}

              {/* Ingredient buttons */}
              <div className="grid grid-cols-2 gap-2.5 mb-4">
                {INGREDIENTS.map(ing => {
                  const isAdded = sequence.includes(ing.id);
                  return (
                    <button
                      key={ing.id}
                      onPointerDown={() => !isAdded && handleIngredient(ing.id)}
                      disabled={isAdded}
                      style={{
                        padding: '12px 8px',
                        borderRadius: 14,
                        border: `1.5px solid ${isAdded ? 'rgba(74,222,128,0.4)' : 'rgba(255,165,0,0.3)'}`,
                        background: isAdded ? 'rgba(34,197,94,0.12)' : 'rgba(255,140,0,0.08)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 4,
                        opacity: isAdded ? 0.5 : 1,
                        cursor: isAdded ? 'default' : 'pointer',
                        transition: 'all 0.1s ease',
                      }}
                    >
                      <span style={{ fontSize: 28, lineHeight: 1 }}>{ing.emoji}</span>
                      <span style={{ fontSize: 10, color: '#e5d5b0', fontWeight: 600 }}>{ing.label}</span>
                      {isAdded && (
                        <span style={{ fontSize: 10, color: '#4ade80', fontWeight: 700 }}>✓ Added</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Order hint */}
              <div
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  borderRadius: 10,
                  padding: '8px 12px',
                  marginBottom: 12,
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                <p className="text-white/40 text-[10px] text-center leading-relaxed">
                  Correct order: {CORRECT_ORDER.map(id => INGREDIENTS.find(i => i.id === id)?.emoji).join(' → ')}
                </p>
              </div>

              {/* Skip button */}
              <button
                onPointerDown={handleFinish}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: 10,
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.3)',
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                Skip ▶
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
