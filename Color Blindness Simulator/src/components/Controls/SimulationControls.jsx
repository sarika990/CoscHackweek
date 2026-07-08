import React from 'react';
import { useSimulator } from '../../context/SimulatorContext';
import { SIMULATION_MODES } from '../../constants/constants';
import ModeCard from './ModeCard';

export default function SimulationControls() {
  const { activeMode, setActiveMode } = useSimulator();

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-white font-bold text-lg">Simulation Controls</h2>
        <p className="text-xs text-gray-400">
          Select a deficit model to transform the image preview in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {SIMULATION_MODES.map((mode) => (
          <ModeCard
            key={mode.id}
            mode={mode}
            isActive={activeMode === mode.id}
            onSelect={() => setActiveMode(mode.id)}
          />
        ))}
      </div>
    </div>
  );
}
