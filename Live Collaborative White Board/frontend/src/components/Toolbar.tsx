import { useBoardStore } from '../store/useBoardStore';
import { MousePointer2, Hand, Pencil, Eraser, Type, Square, Circle, Triangle, Minus, ArrowRight } from 'lucide-react';
import clsx from 'clsx';
import type { ToolType } from '../types';

export const Toolbar = () => {
  const { currentTool, setCurrentTool } = useBoardStore();

  const tools: { id: ToolType, icon: React.ReactNode, tooltip: string }[] = [
    { id: 'select', icon: <MousePointer2 size={20} />, tooltip: 'Select (V)' },
    { id: 'hand', icon: <Hand size={20} />, tooltip: 'Pan (H)' },
    { id: 'pencil', icon: <Pencil size={20} />, tooltip: 'Pencil (P)' },
    { id: 'eraser', icon: <Eraser size={20} />, tooltip: 'Eraser (E)' },
    { id: 'text', icon: <Type size={20} />, tooltip: 'Text (T)' },
    { id: 'rectangle', icon: <Square size={20} />, tooltip: 'Rectangle (R)' },
    { id: 'circle', icon: <Circle size={20} />, tooltip: 'Circle (C)' },
    { id: 'triangle', icon: <Triangle size={20} />, tooltip: 'Triangle' },
    { id: 'line', icon: <Minus size={20} />, tooltip: 'Line (L)' },
    { id: 'arrow', icon: <ArrowRight size={20} />, tooltip: 'Arrow (A)' },
  ];

  return (
    <div className="w-14 bg-white/90 backdrop-blur border-r border-pink-200 flex flex-col items-center py-4 gap-2 soft-shadow z-10">
      {tools.map(tool => (
        <button
          key={tool.id}
          onClick={() => setCurrentTool(tool.id)}
          title={tool.tooltip}
          className={clsx(
            'p-2.5 rounded-xl transition-all duration-200',
            currentTool === tool.id 
              ? 'bg-pink-100 text-pink-600 shadow-sm' 
              : 'text-gray-500 hover:bg-pink-50 hover:text-pink-500'
          )}
        >
          {tool.icon}
        </button>
      ))}
    </div>
  );
};