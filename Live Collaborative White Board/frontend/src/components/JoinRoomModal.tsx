import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface JoinRoomModalProps {
  onJoin: (name: string, color: string, userId: string) => void;
}

const colors = [
  '#FF3B30', // Red
  '#FF9500', // Orange
  '#4CD964', // Green
  '#007AFF', // Blue
  '#5856D6', // Purple
  '#FF2D55', // Pink
  '#10B981', // Emerald
  '#8B5CF6', // Violet
  '#EC4899', // Hot Pink
  '#14B8A6'  // Teal
];

export const JoinRoomModal: React.FC<JoinRoomModalProps> = ({ onJoin }) => {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(colors[Math.floor(Math.random() * colors.length)]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const cleanName = name.trim();
    // Unique User ID structure, e.g. SARIKA-5821
    const cleanPrefix = cleanName.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const finalPrefix = cleanPrefix ? cleanPrefix : 'USER';
    const generatedUserId = `${finalPrefix}-${Math.floor(1000 + Math.random() * 9000)}`;

    onJoin(cleanName, selectedColor, generatedUserId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-2xl transition-all duration-300 transform scale-100">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 text-pink-500 rounded-xl flex items-center justify-center mb-3">
            <Sparkles size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome to CollabBoard</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Real-time collaborative digital whiteboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
              Your Display Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sarika"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
              Choose Your Cursor Color
            </label>
            <div className="flex flex-wrap gap-2 justify-between">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border border-white dark:border-gray-900 shadow-sm transition-all hover:scale-115 duration-200 cursor-pointer ${
                    selectedColor === color
                      ? 'ring-4 ring-pink-500 scale-110'
                      : 'hover:opacity-90'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-pink-500 hover:bg-pink-600 active:bg-pink-700 text-white font-semibold rounded-xl shadow-lg shadow-pink-500/25 transition-all cursor-pointer mt-2"
          >
            Start Whiteboard
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
