import { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { useBoardStore } from '../store/useBoardStore';
import { Navigation } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export const CanvasArea = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    currentTool,
    properties,
    collabRoomId,
    collabPartner,
    socket,
    roomUsers,
    updateUserCursor,
    addUser,
    theme
  } = useBoardStore();

  const fabricRef = useRef<fabric.Canvas | null>(null);
  const [toasts, setToasts] = useState<{ id: string; text: string }[]>([]);
  
  const [isDrawing, setIsDrawing] = useState(false);
  const startPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentShape = useRef<any | null>(null);

  // Store variables in refs so mouse handlers don't close over stale values
  const toolRef = useRef(currentTool);
  const propertiesRef = useRef(properties);
  const collabRoomIdRef = useRef(collabRoomId);
  const isDrawingRef = useRef(isDrawing);

  // Undo/Redo Stacks
  const undoStack = useRef<string[]>([]);
  const redoStack = useRef<string[]>([]);
  const isSyncingRef = useRef(false);

  useEffect(() => {
    toolRef.current = currentTool;
  }, [currentTool]);

  useEffect(() => {
    propertiesRef.current = properties;
  }, [properties]);

  useEffect(() => {
    collabRoomIdRef.current = collabRoomId;
  }, [collabRoomId]);

  useEffect(() => {
    isDrawingRef.current = isDrawing;
  }, [isDrawing]);

  // Toast notifier helper
  const addToast = (text: string) => {
    const id = uuidv4();
    setToasts((prev) => [...prev, { id, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // Listeners for drawing actions in private collab session
  useEffect(() => {
    if (!socket) return;

    if (collabRoomId) {
      addToast(`Entered Collaboration Room`);
    }

    // cursor event
    socket.on('cursor', (data: { id: string; x: number; y: number }) => {
      if (!roomUsers[data.id] && collabPartner) {
        addUser({
          id: data.id,
          name: collabPartner.username,
          color: '#EC4899',
          x: data.x,
          y: data.y
        });
      } else {
        updateUserCursor(data.id, data.x, data.y);
      }
    });

    // drawing event
    socket.on('drawing', (data: { event: string; objectData?: any; objId?: string }) => {
      if (isSyncingRef.current || !fabricRef.current) return;
      isSyncingRef.current = true;

      if (data.event === 'object-added' && data.objectData) {
        fabric.util.enlivenObjects([data.objectData]).then((enlivened) => {
          enlivened.forEach((obj: any) => {
            const exists = fabricRef.current?.getObjects().some((existing: any) => existing.id === obj.id);
            if (!exists) {
              fabricRef.current?.add(obj);
            }
          });
          fabricRef.current?.requestRenderAll();
          saveToHistory();
          isSyncingRef.current = false;
        });
      } else if (data.event === 'object-modified' && data.objectData) {
        const canvasObjects = fabricRef.current.getObjects();
        const targetObj: any = canvasObjects.find((obj: any) => obj.id === data.objectData.id);
        if (targetObj) {
          targetObj.set(data.objectData);
          targetObj.setCoords();
          fabricRef.current.requestRenderAll();
          saveToHistory();
        }
        isSyncingRef.current = false;
      } else if (data.event === 'object-removed' && data.objId) {
        const targetObj: any = fabricRef.current.getObjects().find((obj: any) => obj.id === data.objId);
        if (targetObj) {
          fabricRef.current.remove(targetObj);
          fabricRef.current.requestRenderAll();
          saveToHistory();
        }
        isSyncingRef.current = false;
      } else {
        isSyncingRef.current = false;
      }
    });

    // undo event
    socket.on('undo', (data: { canvasJson: string }) => {
      if (isSyncingRef.current || !fabricRef.current) return;
      isSyncingRef.current = true;
      fabricRef.current.loadFromJSON(data.canvasJson).then(() => {
        fabricRef.current?.requestRenderAll();
        saveToHistory();
        isSyncingRef.current = false;
      });
    });

    // redo event
    socket.on('redo', (data: { canvasJson: string }) => {
      if (isSyncingRef.current || !fabricRef.current) return;
      isSyncingRef.current = true;
      fabricRef.current.loadFromJSON(data.canvasJson).then(() => {
        fabricRef.current?.requestRenderAll();
        saveToHistory();
        isSyncingRef.current = false;
      });
    });

    // clear-board event
    socket.on('clear-board', () => {
      if (isSyncingRef.current || !fabricRef.current) return;
      isSyncingRef.current = true;
      fabricRef.current.clear();
      fabricRef.current.backgroundColor = theme === 'dark' ? '#111827' : '#f9fafb';
      fabricRef.current.requestRenderAll();
      saveToHistory();
      isSyncingRef.current = false;
    });

    return () => {
      socket.off('cursor');
      socket.off('drawing');
      socket.off('undo');
      socket.off('redo');
      socket.off('clear-board');
    };
  }, [socket, collabRoomId]);

  // Load from local storage or server on mount
  const loadInitialState = (canvas: fabric.Canvas) => {
    const cached = localStorage.getItem(`collab_board_cache_${collabRoomId || 'solo'}`);
    if (cached) {
      canvas.loadFromJSON(cached).then(() => {
        canvas.requestRenderAll();
        saveToHistory();
      });
    }
  };

  // Save Local State (Auto-save) & History
  const saveToHistory = () => {
    if (!fabricRef.current) return;
    const json = JSON.stringify((fabricRef.current as any).toJSON(['id']));
    
    // Auto-save to LocalStorage
    localStorage.setItem(`collab_board_cache_${collabRoomId || 'solo'}`, json);

    // Save to Undo stack if it's new
    if (undoStack.current[undoStack.current.length - 1] !== json) {
      undoStack.current.push(json);
      if (undoStack.current.length > 50) undoStack.current.shift();
      redoStack.current = [];
    }
  };

  // External Undo/Redo/Clear triggering
  useEffect(() => {
    const handleTriggerUndo = () => {
      if (undoStack.current.length <= 1 || !fabricRef.current) return;
      isSyncingRef.current = true;
      const current = undoStack.current.pop();
      if (current) redoStack.current.push(current);
      
      const previous = undoStack.current[undoStack.current.length - 1];
      if (previous) {
        fabricRef.current.loadFromJSON(previous).then(() => {
          fabricRef.current?.requestRenderAll();
          if (collabRoomId) {
            socket?.emit('undo', { roomId: collabRoomId, canvasJson: previous });
          }
          localStorage.setItem(`collab_board_cache_${collabRoomId || 'solo'}`, previous);
          isSyncingRef.current = false;
        });
      } else {
        fabricRef.current.clear();
        fabricRef.current.backgroundColor = theme === 'dark' ? '#111827' : '#f9fafb';
        fabricRef.current.requestRenderAll();
        if (collabRoomId) {
          socket?.emit('clear-board', { roomId: collabRoomId });
        }
        localStorage.setItem(`collab_board_cache_${collabRoomId || 'solo'}`, '');
        isSyncingRef.current = false;
      }
    };

    const handleTriggerRedo = () => {
      if (redoStack.current.length === 0 || !fabricRef.current) return;
      isSyncingRef.current = true;
      const nextState = redoStack.current.pop();
      if (nextState) {
        undoStack.current.push(nextState);
        fabricRef.current.loadFromJSON(nextState).then(() => {
          fabricRef.current?.requestRenderAll();
          if (collabRoomId) {
            socket?.emit('redo', { roomId: collabRoomId, canvasJson: nextState });
          }
          localStorage.setItem(`collab_board_cache_${collabRoomId || 'solo'}`, nextState);
          isSyncingRef.current = false;
        });
      }
    };

    const handleTriggerClear = () => {
      if (!fabricRef.current) return;
      fabricRef.current.clear();
      fabricRef.current.backgroundColor = theme === 'dark' ? '#111827' : '#f9fafb';
      fabricRef.current.requestRenderAll();
      if (collabRoomId) {
        socket?.emit('clear-board', { roomId: collabRoomId });
      }
      saveToHistory();
    };

    const handleTriggerExport = (e: any) => {
      if (!fabricRef.current) return;
      const format = e.detail?.format || 'png';
      const dataURL = fabricRef.current.toDataURL({
        format: format === 'png' ? 'png' : 'jpeg',
        quality: 1.0,
        multiplier: 1,
      } as any);
      const link = document.createElement('a');
      link.download = `whiteboard-${collabRoomId || 'export'}.${format}`;
      link.href = dataURL;
      link.click();
    };

    window.addEventListener('whiteboard-undo', handleTriggerUndo);
    window.addEventListener('whiteboard-redo', handleTriggerRedo);
    window.addEventListener('whiteboard-clear', handleTriggerClear);
    window.addEventListener('whiteboard-export', handleTriggerExport);

    return () => {
      window.removeEventListener('whiteboard-undo', handleTriggerUndo);
      window.removeEventListener('whiteboard-redo', handleTriggerRedo);
      window.removeEventListener('whiteboard-clear', handleTriggerClear);
      window.removeEventListener('whiteboard-export', handleTriggerExport);
    };
  }, [collabRoomId, theme, socket]);

  // Main Canvas & Tool Configuration (Created exactly ONCE on mount)
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const { clientWidth, clientHeight } = containerRef.current;
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: clientWidth,
      height: clientHeight,
      backgroundColor: theme === 'dark' ? '#111827' : '#f9fafb',
      selection: true,
      isDrawingMode: false,
      enableRetinaScaling: true,
    });
    fabricRef.current = canvas;

    loadInitialState(canvas);

    const handleResize = () => {
      if (containerRef.current && fabricRef.current) {
        fabricRef.current.setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
        fabricRef.current.requestRenderAll();
      }
    };
    window.addEventListener('resize', handleResize);

    // Throttled cursor position emitting
    let lastEmitTime = 0;
    canvas.on('mouse:move', (options) => {
      const pointer = canvas.getViewportPoint(options.e);
      const now = Date.now();
      if (now - lastEmitTime > 40 && collabRoomIdRef.current) {
        socket?.emit('cursor', { roomId: collabRoomIdRef.current, x: pointer.x, y: pointer.y });
        lastEmitTime = now;
      }
    });

    // Shape and Line Creation Listeners
    canvas.on('mouse:down', (options) => {
      const evt = options.e as MouseEvent;
      const currentTool = toolRef.current;
      const properties = propertiesRef.current;

      if (['select', 'hand', 'pencil', 'brush', 'eraser', 'text'].includes(currentTool)) {
        if (currentTool === 'text') {
          const pointer = canvas.getViewportPoint(evt);
          const textObj = new fabric.IText('Click & Type...', {
            left: pointer.x,
            top: pointer.y,
            fontFamily: properties.fontFamily,
            fontSize: properties.fontSize,
            fill: properties.strokeColor,
            fontWeight: properties.isBold ? 'bold' : 'normal',
            fontStyle: properties.isItalic ? 'italic' : 'normal',
            underline: properties.isUnderline,
          } as any);
          (textObj as any).set({ id: uuidv4() });
          canvas.add(textObj);
          canvas.setActiveObject(textObj);
          textObj.enterEditing();
          textObj.selectAll();
          
          if (collabRoomIdRef.current) {
            socket?.emit('drawing', { 
              roomId: collabRoomIdRef.current, 
              event: 'object-added', 
              objectData: (textObj as any).toJSON(['id']) 
            });
          }
          saveToHistory();
        }
        return;
      }

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
        opacity: properties.opacity / 100,
      };

      const objId = uuidv4();

      if (currentTool === 'rectangle') {
        currentShape.current = new fabric.Rect({ ...commonProps, width: 1, height: 1 });
      } else if (currentTool === 'circle') {
        currentShape.current = new fabric.Circle({ ...commonProps, radius: 1 });
      } else if (currentTool === 'triangle') {
        currentShape.current = new fabric.Triangle({ ...commonProps, width: 1, height: 1 });
      } else if (currentTool === 'line') {
        currentShape.current = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], commonProps);
      } else if (currentTool === 'arrow') {
        currentShape.current = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
          ...commonProps,
          strokeDashArray: undefined,
        });
      }

      if (currentShape.current) {
        currentShape.current.set({ id: objId });
        canvas.add(currentShape.current);
      }
    });

    canvas.on('mouse:move', (options) => {
      const isDrawingVal = isDrawingRef.current;
      const currentTool = toolRef.current;
      if (!isDrawingVal || !currentShape.current || !fabricRef.current) return;
      const pointer = fabricRef.current.getViewportPoint(options.e);

      if (currentTool === 'rectangle' || currentTool === 'triangle') {
        const width = Math.abs(pointer.x - startPos.current.x);
        const height = Math.abs(pointer.y - startPos.current.y);
        currentShape.current.set({
          left: pointer.x < startPos.current.x ? pointer.x : startPos.current.x,
          top: pointer.y < startPos.current.y ? pointer.y : startPos.current.y,
          width,
          height,
        });
      } else if (currentTool === 'circle') {
        const radius = Math.sqrt(
          Math.pow(pointer.x - startPos.current.x, 2) + Math.pow(pointer.y - startPos.current.y, 2)
        ) / 2;
        currentShape.current.set({
          left: pointer.x < startPos.current.x ? pointer.x : startPos.current.x,
          top: pointer.y < startPos.current.y ? pointer.y : startPos.current.y,
          radius,
        });
      } else if (currentTool === 'line' || currentTool === 'arrow') {
        currentShape.current.set({
          x2: pointer.x,
          y2: pointer.y,
        });
      }
      fabricRef.current.requestRenderAll();
    });

    canvas.on('mouse:up', () => {
      const isDrawingVal = isDrawingRef.current;
      if (isDrawingVal && currentShape.current && fabricRef.current) {
        currentShape.current.set({ selectable: true, evented: true });
        currentShape.current.setCoords();
        
        const targetObj = currentShape.current;
        setIsDrawing(false);
        currentShape.current = null;

        // Emit addition via 'drawing'
        if (collabRoomIdRef.current) {
          socket?.emit('drawing', { 
            roomId: collabRoomIdRef.current, 
            event: 'object-added', 
            objectData: targetObj.toJSON(['id']) 
          });
        }
        saveToHistory();
      }
    });

    // Sync modifications
    canvas.on('object:modified', (options) => {
      const target: any = options.target;
      if (target && collabRoomIdRef.current) {
        socket?.emit('drawing', { 
          roomId: collabRoomIdRef.current, 
          event: 'object-modified', 
          objectData: target.toJSON(['id']) 
        });
        saveToHistory();
      }
    });

    // Freehand drawing support
    canvas.on('path:created', (options: any) => {
      const path = options.path;
      if (path) {
        const objId = uuidv4();
        path.set({ id: objId });
        if (collabRoomIdRef.current) {
          socket?.emit('drawing', { 
            roomId: collabRoomIdRef.current, 
            event: 'object-added', 
            objectData: path.toJSON(['id']) 
          });
        }
        saveToHistory();
      }
    });

    // Keyboard Shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeObj = canvas.getActiveObject();
      const isEditingText = activeObj && activeObj.type === 'i-text' && (activeObj as any).isEditing;
      if (isEditingText) return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('whiteboard-undo'));
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('whiteboard-redo'));
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const activeObjects = canvas.getActiveObjects();
        if (activeObjects && activeObjects.length > 0) {
          activeObjects.forEach((obj: any) => {
            canvas.remove(obj);
            if (collabRoomIdRef.current) {
              socket?.emit('drawing', { 
                roomId: collabRoomIdRef.current, 
                event: 'object-removed', 
                objId: obj.id 
              });
            }
          });
          canvas.discardActiveObject();
          canvas.requestRenderAll();
          saveToHistory();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      canvas.dispose();
    };
  }, [socket]);

  // Sync canvas background on theme changes
  useEffect(() => {
    if (fabricRef.current) {
      fabricRef.current.backgroundColor = theme === 'dark' ? '#111827' : '#f9fafb';
      fabricRef.current.requestRenderAll();
    }
  }, [theme]);

  // Handle configuration changes on tool toggles
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    // Pencil / Brush configuration
    canvas.isDrawingMode = currentTool === 'pencil' || currentTool === 'brush' || currentTool === 'eraser';
    
    if (canvas.isDrawingMode) {
      const brush = new fabric.PencilBrush(canvas);
      if (currentTool === 'eraser') {
        brush.color = theme === 'dark' ? '#111827' : '#f9fafb';
        brush.width = properties.brushSize * 2.5;
      } else {
        brush.color = properties.strokeColor;
        brush.width = currentTool === 'brush' ? properties.brushSize * 2 : properties.brushSize;
      }
      canvas.freeDrawingBrush = brush;
    }

    canvas.selection = currentTool === 'select';
    canvas.defaultCursor = currentTool === 'hand' ? 'grab' : 'default';

  }, [currentTool, properties.strokeColor, properties.brushSize, theme]);

  return (
    <div className="flex-1 overflow-hidden relative" ref={containerRef} id="canvas-container">
      <canvas ref={canvasRef} />

      {/* Floating Join/Leave Notifications */}
      <div className="absolute bottom-4 left-4 flex flex-col gap-2 z-40 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="px-4 py-2.5 rounded-xl shadow-xl text-xs font-bold text-white bg-gray-850 dark:bg-gray-750/90 backdrop-blur pointer-events-none"
          >
            {toast.text}
          </div>
        ))}
      </div>

      {/* Live Peer Cursors Overlay */}
      {collabRoomId && Object.values(roomUsers).map((peer) => {
        if (!peer.x || !peer.y) return null;
        return (
          <div
            key={peer.id}
            className="absolute pointer-events-none transition-all duration-75 z-50 flex items-center gap-1.5"
            style={{
              left: `${peer.x}px`,
              top: `${peer.y}px`,
            }}
          >
            <Navigation
              size={18}
              style={{
                color: peer.color,
                fill: peer.color,
                transform: 'rotate(-90deg) translate(-2px, -2px)',
              }}
            />
            <div
              className="px-2 py-0.5 rounded-md text-[10px] font-bold text-white shadow-md border whitespace-nowrap"
              style={{
                backgroundColor: peer.color,
                borderColor: peer.color,
              }}
            >
              {peer.name}
            </div>
          </div>
        );
      })}
    </div>
  );
};