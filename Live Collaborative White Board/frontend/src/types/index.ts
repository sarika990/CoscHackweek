export type ToolType = 'select' | 'hand' | 'pencil' | 'marker' | 'brush' | 'eraser' | 'highlighter' | 'text' | 'sticky' | 'line' | 'arrow' | 'rectangle' | 'circle' | 'triangle' | 'ellipse' | 'freehand';

export interface User {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
}

export interface Project {
  id: string;
  name: string;
  data: string;
  created_at?: string;
  updated_at?: string;
}

export interface CanvasProperties {
  strokeColor: string;
  fillColor: string;
  textColor: string;
  fontFamily: string;
  fontSize: number;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  textAlign: 'left' | 'center' | 'right';
  brushSize: number;
  opacity: number;
  strokeWidth: number;
  borderStyle: 'solid' | 'dashed' | 'dotted';
  shadowEnabled: boolean;
}
