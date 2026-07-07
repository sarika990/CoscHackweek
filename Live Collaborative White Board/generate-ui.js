const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'frontend', 'src');

const files = {
  'components/Navbar.tsx': `
import React from 'react';
import { useBoardStore } from '../store/useBoardStore';
import { Moon, Sun, Save, FolderOpen, Share2, Download, Trash2, Undo, Redo, Eraser } from 'lucide-react';

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
  `,
  'components/Toolbar.tsx': `
import React from 'react';
import { useBoardStore } from '../store/useBoardStore';
import { MousePointer2, Hand, Pencil, Eraser, Type, Square, Circle, Triangle, Minus, ArrowRight, Image as ImageIcon } from 'lucide-react';
import clsx from 'clsx';
import { ToolType } from '../types';

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
  `,
  'components/PropertiesPanel.tsx': `
import React from 'react';
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
              className={\`w-6 h-6 rounded-full border border-gray-200 shadow-sm hover:scale-110 transition-transform \${properties.strokeColor === c ? 'ring-2 ring-pink-400 ring-offset-2' : ''}\`}
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
            className={\`w-6 h-6 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:scale-110 transition-transform \${properties.fillColor === 'transparent' ? 'ring-2 ring-pink-400 ring-offset-2' : ''}\`}
          >
            <div className="w-full h-px bg-red-500 rotate-45"></div>
          </button>
          {colors.map(c => (
            <button
              key={c}
              onClick={() => updateProperties({ fillColor: c })}
              className={\`w-6 h-6 rounded-full border border-gray-200 shadow-sm hover:scale-110 transition-transform \${properties.fillColor === c ? 'ring-2 ring-pink-400 ring-offset-2' : ''}\`}
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
  `,
  'components/CanvasArea.tsx': `
import React, { useEffect, useRef } from 'react';
import * as fabric from 'fabric';
import { useBoardStore } from '../store/useBoardStore';

export const CanvasArea = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { currentTool, properties } = useBoardStore();
  const fabricRef = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    if (canvasRef.current && !fabricRef.current) {
      // Initialize Canvas
      const canvas = new fabric.Canvas(canvasRef.current, {
        width: window.innerWidth - 56 - 256, // Subtracting toolbar and properties panel widths
        height: window.innerHeight - 56, // Subtracting navbar height
        backgroundColor: '#f9fafb', // Light gray background
        selection: true,
      });
      fabricRef.current = canvas;

      const handleResize = () => {
        canvas.setDimensions({
          width: window.innerWidth - 56 - 256,
          height: window.innerHeight - 56
        });
      };

      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        canvas.dispose();
      };
    }
  }, []);

  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    // Reset modes
    canvas.isDrawingMode = false;
    canvas.selection = true;
    canvas.defaultCursor = 'default';

    if (currentTool === 'pencil') {
      canvas.isDrawingMode = true;
      const brush = new fabric.PencilBrush(canvas);
      brush.color = properties.strokeColor;
      brush.width = properties.strokeWidth;
      canvas.freeDrawingBrush = brush;
    } else if (currentTool === 'hand') {
      canvas.selection = false;
      canvas.defaultCursor = 'grab';
    } else {
      // For shapes, we will handle mousedown
      canvas.selection = (currentTool === 'select');
    }
  }, [currentTool, properties]);

  return (
    <div className="flex-1 bg-gray-50 overflow-hidden relative" id="canvas-container">
      <canvas ref={canvasRef} />
    </div>
  );
};
  `,
  'pages/Dashboard.tsx': `
import React from 'react';
import { Navbar } from '../components/Navbar';
import { Toolbar } from '../components/Toolbar';
import { PropertiesPanel } from '../components/PropertiesPanel';
import { CanvasArea } from '../components/CanvasArea';

export const Dashboard = () => {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-white text-gray-800">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Toolbar />
        <CanvasArea />
        <PropertiesPanel />
      </div>
    </div>
  );
};
  `,
  'App.tsx': `
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
  `,
  'main.tsx': `
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
  `
};

for (const [relativePath, content] of Object.entries(files)) {
  const absolutePath = path.join(srcDir, relativePath);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, content.trim());
}
console.log("UI Components generated successfully.");
