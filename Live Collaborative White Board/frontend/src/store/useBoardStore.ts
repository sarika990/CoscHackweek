import { create } from 'zustand';
import type { ToolType, CanvasProperties, Project } from '../types';

interface BoardState {
  currentTool: ToolType;
  setCurrentTool: (tool: ToolType) => void;
  properties: CanvasProperties;
  updateProperties: (props: Partial<CanvasProperties>) => void;
  activeProject: Project | null;
  setActiveProject: (project: Project | null) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  zoom: number;
  setZoom: (zoom: number) => void;
}

const defaultProperties: CanvasProperties = {
  strokeColor: '#000000',
  fillColor: 'transparent',
  textColor: '#000000',
  fontFamily: 'Inter',
  fontSize: 24,
  isBold: false,
  isItalic: false,
  isUnderline: false,
  textAlign: 'left',
  brushSize: 5,
  opacity: 100,
  strokeWidth: 2,
  borderStyle: 'solid',
  shadowEnabled: false,
};

export const useBoardStore = create<BoardState>((set) => ({
  currentTool: 'select',
  setCurrentTool: (tool) => set({ currentTool: tool }),
  properties: defaultProperties,
  updateProperties: (props) => set((state) => ({ properties: { ...state.properties, ...props } })),
  activeProject: null,
  setActiveProject: (project) => set({ activeProject: project }),
  theme: 'light',
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  zoom: 1,
  setZoom: (zoom) => set({ zoom }),
}));
