import { useState, useEffect, useRef, useCallback } from 'react';
import useGameStore from '../../store/useGameStore';

const TOTAL_TIME = 20;
const MODAK_COUNT = 12;

function randomPos() {
  return { x: Math.random() * 80 + 5, y: Math.random() * 60 + 10, id: Math.random() };
}

export default function ModakChallenge({ onComplete }) {
  const [active, setActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [collected, setCollected] = useState(0);
  const [modaks, setModaks] = useState([]);
  const [finished, setFinished] = useState(false);
  const timerRef = useRef(null);

  const startGame = () => {
    setActive(true);
    setTimeLeft(TOTAL_TIME);
    setCollected(0);
    setFinished(false);
    setModaks(Array.from({ length: MODAK_COUNT }, randomPos));
  };

  useEffect(() => {
    if (!active) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setActive(false);
          setFinished(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [active]);

  const collectModak = useCallback((id) => {
    setModaks(m => m.filter(mo => mo.id !== id));
    setCollected(c => {
      const next = c + 1;
      if (next >= MODAK_COUNT) {
        clearInterval(timerRef.current);
        setActive(false);
        setFinished(true);
      }
      return next;
    });
  }, []);

  const handleFinish = () => {
    const store = useGameStore.getState();
    const score = collected * 10;
    store.addScore(score, `🍬 Modak Score: ${score}`);
    store.advanceMission('l4_modak_challenge', collected);
    onComplete?.({ collected, score });
  };

  const timerColor = timeLeft > 10 ? 'text-green-400' : timeLeft > 5 ? 'text-yellow-400' : 'text-red-400';

  if (finished) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
        <div className="bg-gradient-to-b from-yellow-900 to-orange-900 rounded-2xl p-8 max-w-xs w-full mx-4 text-center border-2 border-yellow-400">
          <div className="text-6xl mb-3">🍬</div>
          <h2 className="text-2xl font-bold text-yellow-400 mb-2">Time's Up!</h2>
          <div className="text-4xl font-bold text-white mb-1">{collected} Modaks</div>
          <div className="text-2xl text-yellow-300 mb-6">+{collected * 10} ⭐</div>
          <button
            onClick={handleFinish}
            className="w-full py-3 rounded-xl bg-yellow-400 text-black font-bold text-lg hover:bg-yellow-300 active:scale-95 transition-all"
          >
            CONTINUE ▶
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center px-6 pt-4 pb-2">
        <div className="text-2xl font-bold text-yellow-400">🍬 Modak Challenge</div>
        <div className={`text-3xl font-bold ${timerColor}`}>⏱ {timeLeft}</div>
        <div className="text-xl font-bold text-white">🍬 {collected}</div>
      </div>
      <div className="flex-1 bg-gradient-to-b from-orange-950 to-yellow-950 mx-4 mb-4 rounded-2xl relative overflow-hidden border border-yellow-600">
        {!active ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-6xl mb-4">🍬</div>
            <h3 className="text-white text-xl font-bold mb-2">Collect as many modaks as you can!</h3>
            <p className="text-gray-300 text-sm mb-6">Tap each modak before time runs out. {TOTAL_TIME} seconds!</p>
            <button
              onClick={startGame}
              className="px-8 py-3 rounded-xl bg-yellow-400 text-black font-bold text-lg hover:bg-yellow-300 active:scale-95 transition-all"
            >
              START! 🍬
            </button>
          </div>
        ) : (
          <>
            {modaks.map((m) => (
              <button
                key={m.id}
                onPointerDown={() => collectModak(m.id)}
                className="absolute w-12 h-12 text-3xl flex items-center justify-center hover:scale-125 active:scale-150 transition-transform"
                style={{ left: `${m.x}%`, top: `${m.y}%`, transform: 'translate(-50%,-50%)' }}
              >
                🍬
              </button>
            ))}
            {modaks.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-xl font-bold">All collected! 🎉</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
