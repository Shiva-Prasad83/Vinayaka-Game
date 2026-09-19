import { useState, useEffect, useRef, useCallback } from 'react';
import useGameStore from '../../store/useGameStore';

const BEATS = ['🥁', '🔔', '🥁', '🌟', '🥁', '🔔', '🌟', '🥁'];
const BEAT_DURATION = 800; // ms per beat
const TOTAL_BEATS = 8;

export default function MusicChallenge({ onComplete }) {
  const [active, setActive] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState([]);
  const [finished, setFinished] = useState(false);
  const [markerPos, setMarkerPos] = useState(0);
  const timerRef = useRef(null);
  const beatTimeRef = useRef(0);
  const animRef = useRef(null);

  const startGame = () => {
    setActive(true);
    setCurrentBeat(0);
    setScore(0);
    setResults([]);
    setFinished(false);
    beatTimeRef.current = performance.now();
    advanceBeat(0);
  };

  const advanceBeat = useCallback((idx) => {
    if (idx >= TOTAL_BEATS) {
      setActive(false);
      setFinished(true);
      return;
    }
    setCurrentBeat(idx);
    beatTimeRef.current = performance.now();
    timerRef.current = setTimeout(() => advanceBeat(idx + 1), BEAT_DURATION);
  }, []);

  useEffect(() => () => {
    clearTimeout(timerRef.current);
    cancelAnimationFrame(animRef.current);
  }, []);

  // Animate marker
  useEffect(() => {
    if (!active) return;
    const animate = () => {
      const elapsed = (performance.now() - beatTimeRef.current) / BEAT_DURATION;
      setMarkerPos(Math.min(elapsed, 1));
      if (elapsed < 1) animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [active, currentBeat]);

  const handleTap = (beatIcon) => {
    if (!active) return;
    const elapsed = performance.now() - beatTimeRef.current;
    const accuracy = Math.abs(elapsed - BEAT_DURATION * 0.5) / (BEAT_DURATION * 0.5);
    let result;
    if (accuracy < 0.3) { result = 'PERFECT'; setScore(s => s + 100); }
    else if (accuracy < 0.6) { result = 'GOOD'; setScore(s => s + 50); }
    else { result = 'MISS'; }
    setResults(r => [...r, { beat: currentBeat, result }]);
  };

  const handleFinish = () => {
    const store = useGameStore.getState();
    store.addScore(score, `🥁 Music Score: ${score}`);
    store.advanceMission('l4_music', 1);
    onComplete?.({ score });
  };

  if (finished) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
        <div className="bg-gradient-to-b from-purple-900 to-indigo-900 rounded-2xl p-8 max-w-sm w-full mx-4 text-center border-2 border-yellow-400">
          <div className="text-5xl mb-4">🥁</div>
          <h2 className="text-2xl font-bold text-yellow-400 mb-2">Music Complete!</h2>
          <div className="text-4xl font-bold text-white mb-4">+{score} ⭐</div>
          <div className="flex flex-col gap-2 mb-6">
            {results.map((r, i) => (
              <div key={i} className={`text-sm font-bold ${
                r.result === 'PERFECT' ? 'text-yellow-400' :
                r.result === 'GOOD' ? 'text-green-400' : 'text-gray-400'
              }`}>
                Beat {i + 1}: {r.result}
              </div>
            ))}
          </div>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="bg-gradient-to-b from-purple-900 to-indigo-900 rounded-2xl p-6 max-w-sm w-full mx-4 border-2 border-yellow-400">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-yellow-400">🥁 Music Challenge</h2>
          <p className="text-gray-300 text-sm mt-1">Tap the beat at the right moment!</p>
        </div>

        {!active ? (
          <div className="text-center">
            <div className="text-6xl mb-4">🎵</div>
            <p className="text-white mb-6">Match the rhythm! Tap when the marker hits center.</p>
            <button
              onClick={startGame}
              className="w-full py-3 rounded-xl bg-yellow-400 text-black font-bold text-lg hover:bg-yellow-300 active:scale-95 transition-all"
            >
              START 🥁
            </button>
          </div>
        ) : (
          <>
            {/* Beat display */}
            <div className="flex justify-center gap-3 mb-6 flex-wrap">
              {BEATS.map((b, i) => (
                <div key={i} className={`text-3xl transition-all duration-100 ${
                  i === currentBeat ? 'scale-150 opacity-100' :
                  i < currentBeat ? 'scale-75 opacity-30' : 'scale-100 opacity-60'
                }`}>{b}</div>
              ))}
            </div>

            {/* Rhythm track */}
            <div className="relative h-12 bg-gray-800 rounded-full overflow-hidden mb-6 border border-purple-500">
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-yellow-400 z-10" />
              <div
                className="absolute top-1 bottom-1 w-8 rounded-full bg-yellow-400 transition-none"
                style={{ left: `${markerPos * 85}%` }}
              />
            </div>

            {/* Beat buttons */}
            <div className="grid grid-cols-4 gap-3">
              {['🥁', '🔔', '🌟', '🎵'].map((icon, i) => (
                <button
                  key={i}
                  onPointerDown={() => handleTap(icon)}
                  className="h-16 rounded-xl bg-purple-700 border-2 border-purple-400 text-3xl hover:bg-purple-600 active:scale-90 transition-all"
                >
                  {icon}
                </button>
              ))}
            </div>

            <div className="text-center mt-4 text-yellow-400 font-bold">
              Score: {score}  |  Beat: {currentBeat + 1}/{TOTAL_BEATS}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
