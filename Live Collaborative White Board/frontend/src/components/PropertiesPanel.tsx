
import { useBoardStore } from '../store/useBoardStore';

export const PropertiesPanel = () => {
  const { properties, updateProperties } = useBoardStore();

  const colors = ['#000000', '#FFFFFF', '#FF3B30', '#FF9500', '#FFCC00', '#4CD964', '#5AC8FA', '#007AFF', '#5856D6', '#FF2D55'];

  return (
    <div className="w-64 bg-white/90 backdrop-blur border-l border-pink-200 p-4 flex flex-col gap-6 soft-shadow z-10 overflow-y-auto">
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Stroke Color</h3>
        <div className="flex flex-wrap gap-2">
          {colors.map(c => (
            <button
              key={c}
              onClick={() => updateProperties({ strokeColor: c })}
              className={`w-6 h-6 rounded-full border border-gray-200 shadow-sm hover:scale-110 transition-transform ${properties.strokeColor === c ? 'ring-2 ring-pink-400 ring-offset-2' : ''}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Fill Color</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateProperties({ fillColor: 'transparent' })}
            className={`w-6 h-6 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:scale-110 transition-transform ${properties.fillColor === 'transparent' ? 'ring-2 ring-pink-400 ring-offset-2' : ''}`}
          >
            <div className="w-full h-px bg-red-500 rotate-45"></div>
          </button>
          {colors.map(c => (
            <button
              key={c}
              onClick={() => updateProperties({ fillColor: c })}
              className={`w-6 h-6 rounded-full border border-gray-200 shadow-sm hover:scale-110 transition-transform ${properties.fillColor === c ? 'ring-2 ring-pink-400 ring-offset-2' : ''}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Stroke Width</h3>
        <input 
          type="range" 
          min="1" max="20" 
          value={properties.strokeWidth}
          onChange={(e) => updateProperties({ strokeWidth: parseInt(e.target.value) })}
          className="w-full accent-pink-500"
        />
      </div>
    </div>
  );
};