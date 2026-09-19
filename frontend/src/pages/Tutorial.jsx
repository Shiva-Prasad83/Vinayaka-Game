import { useState, useEffect } from 'react';
import useGameStore from '../store/useGameStore';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { SceneLighting, Ground, Marigold } from '../game/world/Environment';
import GaneshaIdol from '../game/world/GaneshaIdol';

const STEPS = [
  { icon: '🕹️', title: 'Move Around', desc: 'Use the Joystick (mobile) or WASD (keyboard) to move your character.' },
  { icon: '👁️', title: 'Look Around', desc: 'Swipe the right side of the screen (mobile) or move the mouse to rotate the camera.' },
  { icon: '👆', title: 'Interact', desc: 'Approach objects and NPCs. Tap INTERACT or press [E] to interact.' },
  { icon: '🎯', title: 'Complete Missions', desc: 'Follow the mission tracker at the top of the screen. Finish each task to progress.' },
];

export default function Tutorial() {
  const { setScreen, setCurrentLevel, setCurrentMission, advanceMission, completeMission } = useGameStore();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      setDone(true);
    }
  };

  const handleStart = () => {
    // Mark tutorial missions complete and start Level 1
    completeMission('tutorial_move');
    completeMission('tutorial_interact');
    setCurrentLevel(1);
    setScreen('playing');
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-indigo-950 to-purple-950 overflow-hidden">
      {/* 3D preview */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 2, 6], fov: 55 }}>
          <SceneLighting quality="medium" timeOfDay="day" />
          <Ground size={20} color="#c8a96e" />
          <GaneshaIdol position={[0, -0.5, -1]} variant="basic" size={0.7} showGlow />
          <Marigold position={[-1.5, -0.5, 0]} color="#ff8c00" />
          <Marigold position={[1.5, -0.5, 0]} color="#ffd700" />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} maxPolarAngle={Math.PI / 2.2} minPolarAngle={Math.PI / 4} />
        </Canvas>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 pointer-events-none" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 px-4">
        {!done ? (
          <div className="bg-gray-900/95 backdrop-blur border border-yellow-500 rounded-2xl p-6 w-full max-w-sm slide-up">
            {/* Progress dots */}
            <div className="flex justify-center gap-2 mb-4">
              {STEPS.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === step ? 'bg-yellow-400 w-4' : i < step ? 'bg-green-400' : 'bg-gray-600'}`} />
              ))}
            </div>
            <div className="text-center mb-4">
              <div className="text-5xl mb-2">{STEPS[step].icon}</div>
              <h2 className="text-xl font-black text-yellow-400 mb-2">{STEPS[step].title}</h2>
              <p className="text-gray-300 text-sm leading-relaxed">{STEPS[step].desc}</p>
            </div>
            <button
              onClick={handleNext}
              className="w-full py-3 rounded-xl bg-yellow-500 text-black font-black text-lg hover:bg-yellow-400 active:scale-95 transition-all"
            >
              {step < STEPS.length - 1 ? 'NEXT ▶' : 'DONE! ✓'}
            </button>
            <button
              onClick={handleStart}
              className="w-full mt-2 py-2 rounded-xl bg-transparent text-gray-400 text-sm hover:text-white transition-all"
            >
              Skip Tutorial ▶
            </button>
          </div>
        ) : (
          <div className="bg-gray-900/95 backdrop-blur border border-yellow-500 rounded-2xl p-8 w-full max-w-sm text-center slide-up">
            <div className="text-6xl mb-4">🐘</div>
            <h2 className="text-2xl font-black text-yellow-400 mb-2">Ready to Celebrate!</h2>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              The festival awaits. Help prepare Vinayaka Chavithi and become the Festival Master!
            </p>
            <div className="text-yellow-400 font-bold text-lg mb-6">Jai Ganesh! 🙏</div>
            <button
              onClick={handleStart}
              className="w-full py-4 rounded-2xl bg-orange-500 text-white font-black text-xl hover:bg-orange-400 active:scale-95 transition-all"
            >
              🐘 START FESTIVAL!
            </button>
          </div>
        )}
      </div>

      {/* Mouse companion hint */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-black/70 border border-yellow-400 rounded-xl px-4 py-2">
        <span className="text-yellow-400 text-sm font-bold">💡 Tutorial</span>
      </div>
    </div>
  );
}
