import { useBoardStore } from '../store/useBoardStore';
import { 
  MousePointer2, Hand, Pencil, Brush, Eraser, Type, 
  Square, Circle, Triangle, Minus, ArrowUpRight 
} from 'lucide-react';
import clsx from 'clsx';
import type { ToolType } from '../types';

export const Toolbar = () => {
  const { currentTool, setCurrentTool, theme } = useBoardStore();

  const tools: { id: ToolType; icon: React.ReactNode; tooltip: string }[] = [
    { id: 'select', icon: <MousePointer2 size={18} />, tooltip: 'Select (V)' },
    { id: 'hand', icon: <Hand size={18} />, tooltip: 'Pan (H)' },
    { id: 'pencil', icon: <Pencil size={18} />, tooltip: 'Pencil (P)' },
    { id: 'brush', icon: <Brush size={18} />, tooltip: 'Brush (B)' },
    { id: 'eraser', icon: <Eraser size={18} />, tooltip: 'Eraser (E)' },
    { id: 'text', icon: <Type size={18} />, tooltip: 'Text (T)' },
    { id: 'rectangle', icon: <Square size={18} />, tooltip: 'Rectangle (R)' },
    { id: 'circle', icon: <Circle size={18} />, tooltip: 'Circle (C)' },
    { id: 'triangle', icon: <Triangle size={18} />, tooltip: 'Triangle' },
    { id: 'line', icon: <Minus size={18} />, tooltip: 'Line (L)' },
    { id: 'arrow', icon: <ArrowUpRight size={18} />, tooltip: 'Arrow (A)' },
  ];

  return (
    <div className={clsx(
      'w-14 border-r flex flex-col items-center py-4 gap-2 z-10 transition-colors duration-300',
      theme === 'dark' 
        ? 'bg-gray-900 border-gray-800' 
        : 'bg-white border-pink-100'
    )}>
      {tools.map(tool => (
        <button
          key={tool.id}
          onClick={() => setCurrentTool(tool.id)}
          title={tool.tooltip}
          className={clsx(
            'p-2.5 rounded-xl transition-all duration-200 cursor-pointer',
            currentTool === tool.id 
              ? 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400 font-bold shadow-sm' 
              : theme === 'dark'
                ? 'text-gray-400 hover:bg-gray-800 hover:text-pink-400'
                : 'text-gray-500 hover:bg-pink-50 hover:text-pink-500'
          )}
        >
          {tool.icon}
        </button>
      ))}
    </div>
  );
};