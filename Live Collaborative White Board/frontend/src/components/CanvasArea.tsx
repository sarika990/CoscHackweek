import { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { io, Socket } from 'socket.io-client';
import { useBoardStore } from '../store/useBoardStore';

export const CanvasArea = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { currentTool, properties, activeProject } = useBoardStore();
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const startPos = useRef<{x: number, y: number}>({x: 0, y: 0});
  const currentShape = useRef<fabric.Object | null>(null);

  useEffect(() => {
    // Setup Socket
    socketRef.current = io('http://localhost:4000');
    
    if (activeProject) {
      socketRef.current.emit('join-room', activeProject.id, { name: 'User', color: '#E98DB0' });
    }

    return () => {
      socketRef.current?.disconnect();
    };
  }, [activeProject]);

  useEffect(() => {
    if (canvasRef.current && containerRef.current && !fabricRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      const canvas = new fabric.Canvas(canvasRef.current, {
        width: clientWidth,
        height: clientHeight,
        backgroundColor: '#f9fafb',
        selection: true,
        isDrawingMode: false,
      });
      fabricRef.current = canvas;

      const handleResize = () => {
        if (containerRef.current) {
           canvas.setDimensions({
             width: containerRef.current.clientWidth,
             height: containerRef.current.clientHeight
           });
        }
      };
      window.addEventListener('resize', handleResize);

      // Event Listeners for Drawing
      canvas.on('mouse:down', (options) => {
        const evt = options.e as MouseEvent;
        if (currentTool === 'select' || currentTool === 'hand' || currentTool === 'pencil' || currentTool === 'text') return;
        
        setIsDrawing(true);
        const pointer = canvas.getViewportPoint(evt);
        startPos.current = { x: pointer.x, y: pointer.y };

        const commonProps = {
          left: pointer.x,
          top: pointer.y,
          stroke: properties.strokeColor,
          strokeWidth: properties.strokeWidth,
          fill: properties.fillColor,
          selectable: false,
          evented: false,
        };

        if (currentTool === 'rectangle') {
          currentShape.current = new fabric.Rect({ ...commonProps, width: 1, height: 1 });
        } else if (currentTool === 'circle') {
          currentShape.current = new fabric.Circle({ ...commonProps, radius: 1 });
        } else if (currentTool === 'triangle') {
          currentShape.current = new fabric.Triangle({ ...commonProps, width: 1, height: 1 });
        } else if (currentTool === 'line') {
          currentShape.current = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], commonProps);
        }

        if (currentShape.current) {
          canvas.add(currentShape.current);
        }
      });

      canvas.on('mouse:move', (options) => {
        if (!isDrawing || !currentShape.current) return;
        const pointer = canvas.getViewportPoint(options.e as MouseEvent);
        
        if (currentTool === 'rectangle' || currentTool === 'triangle') {
          currentShape.current.set({
            width: Math.abs(pointer.x - startPos.current.x),
            height: Math.abs(pointer.y - startPos.current.y),
          });
        } else if (currentTool === 'circle') {
          const radius = Math.abs(pointer.x - startPos.current.x) / 2;
          currentShape.current.set({ radius });
        } else if (currentTool === 'line') {
          (currentShape.current as fabric.Line).set({
            x2: pointer.x,
            y2: pointer.y
          });
        }
        canvas.requestRenderAll();
      });

      canvas.on('mouse:up', () => {
        if (isDrawing && currentShape.current) {
          currentShape.current.set({ selectable: true, evented: true });
          setIsDrawing(false);
          currentShape.current = null;
          
          if (socketRef.current && activeProject) {
            socketRef.current.emit('canvas-update', activeProject.id, canvas.toJSON());
          }
        }
      });

      canvas.on('object:modified', () => {
         if (socketRef.current && activeProject) {
            socketRef.current.emit('canvas-update', activeProject.id, canvas.toJSON());
         }
      });

      return () => {
        window.removeEventListener('resize', handleResize);
        canvas.dispose();
      };
    }
  }, [currentTool, properties, activeProject]);

  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    canvas.isDrawingMode = currentTool === 'pencil';
    if (canvas.isDrawingMode) {
      const brush = new fabric.PencilBrush(canvas);
      brush.color = properties.strokeColor;
      brush.width = properties.strokeWidth;
      canvas.freeDrawingBrush = brush;
    }
    
    canvas.selection = currentTool === 'select';
    canvas.defaultCursor = currentTool === 'hand' ? 'grab' : 'default';

  }, [currentTool, properties]);

  return (
    <div className="flex-1 bg-gray-50 overflow-hidden relative" ref={containerRef} id="canvas-container">
      <canvas ref={canvasRef} />
    </div>
  );
};