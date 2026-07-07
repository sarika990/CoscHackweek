import { useBoardStore } from '../store/useBoardStore';
import { Moon, Sun, Save, FolderOpen, Share2, Download, Undo, Redo, Eraser } from 'lucide-react';

export const Navbar = () => {
  const { theme, toggleTheme, activeProject } = useBoardStore();

  return (
    <nav className="h-14 border-b border-pink-200 bg-white/80 backdrop-blur flex items-center justify-between px-4 soft-shadow">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-pink-600">CollabBoard</h1>
        <div className="h-6 w-px bg-pink-200"></div>
        <span className="text-gray-600 font-medium">{activeProject?.name || 'Untitled Project'}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <button className="p-2 hover:bg-pink-50 rounded-lg text-gray-600"><Undo size={18} /></button>
        <button className="p-2 hover:bg-pink-50 rounded-lg text-gray-600"><Redo size={18} /></button>
        <button className="p-2 hover:bg-pink-50 rounded-lg text-gray-600"><Eraser size={18} /></button>
        <div className="h-6 w-px bg-pink-200 mx-2"></div>
        <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-pink-50 rounded-lg text-gray-600 font-medium"><Save size={18} /> Save</button>
        <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-pink-50 rounded-lg text-gray-600 font-medium"><FolderOpen size={18} /> Open</button>
        <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-pink-50 rounded-lg text-gray-600 font-medium"><Download size={18} /> Export</button>
        <div className="h-6 w-px bg-pink-200 mx-2"></div>
        <button className="flex items-center gap-2 px-4 py-1.5 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-medium transition-colors shadow-sm"><Share2 size={18} /> Share</button>
        <button onClick={toggleTheme} className="p-2 hover:bg-pink-50 rounded-lg text-gray-600 ml-2">
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>
    </nav>
  );
};