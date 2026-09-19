import { useState, useCallback } from 'react';
import useGameStore from '../../store/useGameStore';

const ITEMS = [
  { id: 'marigold', emoji: '🌺', label: 'Marigold', slot: 0 },
  { id: 'diya',     emoji: '🪔', label: 'Diya',     slot: 1 },
  { id: 'leaf',     emoji: '🍃', label: 'Leaf',     slot: 2 },
  { id: 'banner',   emoji: '🎊', label: 'Banner',   slot: 3 },
  { id: 'light',    emoji: '✨', label: 'Light',    slot: 4 },
];

const SLOTS = [
  { id: 0, label: 'Left Corner',   hint: '🌺' },
  { id: 1, label: 'Center Front',  hint: '🪔' },
  { id: 2, label: 'Right Corner',  hint: '🍃' },
  { id: 3, label: 'Top Left',      hint: '🎊' },
  { id: 4, label: 'Top Right',     hint: '✨' },
];

export default function DecorationPuzzle({ onComplete }) {
  const [placements, setPlacements] = useState({}); // slotId -> itemId
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState({});
  const [finished, setFinished] = useState(false);
  const [totalScore, setTotalScore] = useState(0);

  const handleSelectItem = (itemId) => setSelected(selected === itemId ? null : itemId);

  const handlePlaceInSlot = useCallback((slotId) => {
    if (!selected) return;
    const item = ITEMS.find(i => i.id === selected);
    const isCorrect = item?.slot === slotId;

    setFeedback(f => ({ ...f, [slotId]: isCorrect ? 'correct' : 'wrong' }));
    setTimeout(() => setFeedback(f => ({ ...f, [slotId]: null })), 800);

    if (isCorrect) {
      setPlacements(p => {
        const next = { ...p, [slotId]: selected };
        const allDone = SLOTS.every(s => next[s.id] && ITEMS.find(i => i.id === next[s.id])?.slot === s.id);
        if (allDone) {
          setFinished(true);
          setTotalScore(500);
        }
        return next;
      });
      setSelected(null);
    }
  }, [selected]);

  const handleFinish = () => {
    const store = useGameStore.getState();
    store.addScore(totalScore, `🧩 Puzzle: +${totalScore} ⭐`);
    store.advanceMission('l4_puzzle', 1);
    onComplete?.({ score: totalScore });
  };

  const placedItems = new Set(Object.values(placements));
  const availableItems = ITEMS.filter(i => !placedItems.has(i.id));

  if (finished) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
        <div className="bg-gradient-to-b from-indigo-900 to-purple-900 rounded-2xl p-8 max-w-xs w-full mx-4 text-center border-2 border-yellow-400">
          <div className="text-6xl mb-3">🧩</div>
          <h2 className="text-2xl font-bold text-yellow-400 mb-2">Puzzle Complete!</h2>
          <p className="text-white mb-2">Perfect decoration!</p>
          <div className="text-4xl font-bold text-yellow-300 mb-6">+{totalScore} ⭐</div>
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
      <div className="bg-gradient-to-b from-indigo-900 to-purple-900 rounded-2xl p-5 max-w-sm w-full mx-4 border-2 border-yellow-400">
        <h2 className="text-xl font-bold text-yellow-400 text-center mb-1">🧩 Decoration Puzzle</h2>
        <p className="text-gray-300 text-xs text-center mb-4">Select an item, then tap the matching slot</p>

        {/* Temple preview with slots */}
        <div className="relative bg-orange-950 rounded-xl p-4 mb-4 border border-orange-700" style={{ minHeight: 180 }}>
          {/* Temple outline */}
          <div className="flex justify-center mb-2 gap-2">
            {[3, 4].map((slotId) => {
              const placement = placements[slotId];
              const item = placement ? ITEMS.find(i => i.id === placement) : null;
              const fb = feedback[slotId];
              return (
                <button
                  key={slotId}
                  onPointerDown={() => handlePlaceInSlot(slotId)}
                  className={`w-16 h-16 rounded-xl border-2 text-3xl flex items-center justify-center transition-all ${
                    fb === 'correct' ? 'border-green-400 bg-green-900 scale-110' :
                    fb === 'wrong' ? 'border-red-400 bg-red-900 scale-90' :
                    item ? 'border-yellow-400 bg-yellow-900' :
                    selected ? 'border-white bg-gray-800 hover:border-yellow-400' :
                    'border-gray-600 bg-gray-800'
                  }`}
                >
                  {item ? item.emoji : (
                    <span className="text-lg opacity-40">{SLOTS.find(s => s.id === slotId)?.hint}</span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="text-center text-4xl mb-2">🏛️</div>
          <div className="flex justify-center gap-2">
            {[0, 1, 2].map((slotId) => {
              const placement = placements[slotId];
              const item = placement ? ITEMS.find(i => i.id === placement) : null;
              const fb = feedback[slotId];
              return (
                <button
                  key={slotId}
                  onPointerDown={() => handlePlaceInSlot(slotId)}
                  className={`w-16 h-16 rounded-xl border-2 text-3xl flex items-center justify-center transition-all ${
                    fb === 'correct' ? 'border-green-400 bg-green-900 scale-110' :
                    fb === 'wrong' ? 'border-red-400 bg-red-900 scale-90' :
                    item ? 'border-yellow-400 bg-yellow-900' :
                    selected ? 'border-white bg-gray-800 hover:border-yellow-400' :
                    'border-gray-600 bg-gray-800'
                  }`}
                >
                  {item ? item.emoji : (
                    <span className="text-lg opacity-40">{SLOTS.find(s => s.id === slotId)?.hint}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Item selection */}
        <div className="flex flex-wrap gap-2 justify-center">
          {availableItems.map(item => (
            <button
              key={item.id}
              onPointerDown={() => handleSelectItem(item.id)}
              className={`w-16 h-16 rounded-xl border-2 text-3xl flex flex-col items-center justify-center transition-all ${
                selected === item.id
                  ? 'border-yellow-400 bg-yellow-900 scale-110'
                  : 'border-gray-500 bg-gray-800 hover:border-yellow-400'
              }`}
            >
              {item.emoji}
              <span className="text-xs text-gray-300 mt-0.5">{item.label}</span>
            </button>
          ))}
          {availableItems.length === 0 && (
            <div className="text-green-400 font-bold text-sm">All placed! ✓</div>
          )}
        </div>

        {selected && (
          <p className="text-center text-yellow-300 text-sm mt-3">
            Selected: {ITEMS.find(i => i.id === selected)?.emoji} — tap a slot to place it
          </p>
        )}

        <button
          onClick={() => onComplete?.({ score: 0 })}
          className="w-full mt-3 py-2 rounded-xl bg-gray-700 text-gray-300 text-sm hover:bg-gray-600 transition-all"
        >
          Skip ▶
        </button>
      </div>
    </div>
  );
}
