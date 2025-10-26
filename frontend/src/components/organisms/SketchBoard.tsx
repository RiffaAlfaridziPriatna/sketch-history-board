"use client";

import { ColorPicker } from '@/components/atoms/ColorPicker';
import { ConfirmationDialog } from '@/components/atoms/ConfirmationDialog';
import { SessionInfo } from '@/components/atoms/SessionInfo';
import { DrawingCanvas } from '@/components/molecules/DrawingCanvas';
import { NavigationDrawer } from '@/components/molecules/NavigationDrawer';
import { useAuth } from '@/hooks/useAuth';
import { useSketches } from '@/hooks/useSketches';
import { DrawingPath, SketchVersion, ToolConfig } from '@/types';
import { mdiContentSaveOutline, mdiEraser, mdiHistory, mdiPencilOutline, mdiPlus, mdiRedoVariant, mdiUndoVariant } from '@mdi/js';
import { Icon } from '@mdi/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

export const SketchBoard: React.FC = () => {
  const [toolConfig, setToolConfig] = useState<ToolConfig>({
    color: '#000000',
    width: 5,
    tool: 'pen',
  });

  const [paths, setPaths] = useState<DrawingPath[]>([]);
  const [history, setHistory] = useState<DrawingPath[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const { loading: authLoading, error: authError } = useAuth();
  const { sketches, saveSketch, loadSketch } = useSketches();

  const [currentSketch, setCurrentSketch] = useState<SketchVersion | null>(null);
  const [isNavigationDrawerOpen, setIsNavigationDrawerOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [viewportDimensions, setViewportDimensions] = useState({ width: 0, height: 0 });
  const [baseHistoryIndex, setBaseHistoryIndex] = useState(0);

  useEffect(() => {
    const updateViewportDimensions = () => {
      setViewportDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateViewportDimensions();
    window.addEventListener('resize', updateViewportDimensions);
    return () => window.removeEventListener('resize', updateViewportDimensions);
  }, []);

  const handleDrawingChange = useCallback((newPaths: DrawingPath[]) => {
    setPaths(newPaths);
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(newPaths);
      return newHistory;
    });
    setHistoryIndex(prev => prev + 1);
    setHasUnsavedChanges(true);
  }, [historyIndex]);

  const handleUndo = useCallback(() => {
    const minIndex = baseHistoryIndex;
    if (historyIndex > minIndex) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setPaths(history[newIndex] || []);
    }
  }, [historyIndex, history, baseHistoryIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setPaths(history[newIndex] || []);
    }
  }, [historyIndex, history]);

  const handleSaveSketch = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return;

      tempCanvas.width = viewportDimensions.width;
      tempCanvas.height = viewportDimensions.height;

      tempCtx.fillStyle = '#FFF';
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

      if (currentSketch) {
        const img = new Image();
        await new Promise((resolve) => {
          img.onload = () => {
            tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);
            resolve(void 0);
          };
          img.src = currentSketch.data;
        });
      }

      paths.forEach(path => {
        if (path.points.length > 1) {
          tempCtx.save();
          if (path.tool === 'eraser') {
            tempCtx.globalCompositeOperation = 'source-over';
            tempCtx.strokeStyle = '#FFFFFF';
          } else {
            tempCtx.globalCompositeOperation = 'source-over';
            tempCtx.strokeStyle = path.color;
          }
          tempCtx.lineWidth = path.width;
          tempCtx.lineCap = 'round';
          tempCtx.lineJoin = 'round';
          
          tempCtx.beginPath();
          tempCtx.moveTo(path.points[0].x, path.points[0].y);
          
          for (let i = 1; i < path.points.length; i++) {
            tempCtx.lineTo(path.points[i].x, path.points[i].y);
          }
          
          tempCtx.stroke();
          tempCtx.restore();
        }
      });

      const dataURL = tempCanvas.toDataURL('image/png');
      const thumbnail = tempCanvas.toDataURL('image/png', 0.1);

      if (currentSketch) {
        const updatedSketch = await saveSketch({
          id: currentSketch.id,
          name: currentSketch.name,
          thumbnail,
          data: dataURL,
        });
        setCurrentSketch(updatedSketch);
      } else {
        const sketchTitle = prompt('Enter sketch title:', `Sketch ${sketches.length + 1}`);
        if (!sketchTitle) return;

        const newSketch = await saveSketch({
          name: sketchTitle,
          thumbnail,
          data: dataURL,
        });
        setCurrentSketch(newSketch);
      }

      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving sketch:', error);
      alert('Failed to save sketch. Please try again.');
    }
  }, [sketches.length, saveSketch, currentSketch, viewportDimensions, paths]);

  const handleNewSketch = useCallback(() => {
    if (hasUnsavedChanges) {
      setPendingAction(() => () => {
        setPaths([]);
        setHistory([[]]);
        setHistoryIndex(0);
        setBaseHistoryIndex(0);
        setCurrentSketch(null);
        setHasUnsavedChanges(false);
        setIsNavigationDrawerOpen(false);
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#FFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
        }
      });
      setShowConfirmation(true);
    } else {
      setPaths([]);
      setHistory([[]]);
      setHistoryIndex(0);
      setBaseHistoryIndex(0);
      setCurrentSketch(null);
      setHasUnsavedChanges(false);
      setIsNavigationDrawerOpen(false);
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = '#FFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }
    }
  }, [hasUnsavedChanges]);

  const handleSketchSelect = useCallback(async (sketch: SketchVersion) => {
    if (hasUnsavedChanges) {
      setPendingAction(() => async () => {
        setCurrentSketch(sketch);
        setHasUnsavedChanges(false);
        setIsNavigationDrawerOpen(false);
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#FFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
        }
        setPaths([]);
        setHistory([[]]);
        setHistoryIndex(0);
        setBaseHistoryIndex(0);
        try {
          const sketchData = await loadSketch(sketch.id);
          setBaseHistoryIndex(0);
        } catch (error) {
          console.error('Error loading sketch:', error);
          alert('Failed to load sketch. Please try again.');
        }
      });
      setShowConfirmation(true);
    } else {
      setCurrentSketch(sketch);
      setHasUnsavedChanges(false);
      setIsNavigationDrawerOpen(false);
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = '#FFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }
      setPaths([]);
      setHistory([[]]);
      setHistoryIndex(0);
      setBaseHistoryIndex(0);
    }
  }, [hasUnsavedChanges, loadSketch]);

  const handleConfirmAction = useCallback(() => {
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
    setShowConfirmation(false);
  }, [pendingAction]);

  const handleCancelAction = useCallback(() => {
    setPendingAction(null);
    setShowConfirmation(false);
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing sketches...</p>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {authError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-dvh w-full bg-gray-100 relative overflow-hidden">
      {currentSketch && <SessionInfo session={currentSketch} />}

      <div className="absolute top-4 right-6 z-20 flex items-center space-x-2">
        {sketches.length > 0 && (
          <button
            onClick={() => setIsNavigationDrawerOpen(!isNavigationDrawerOpen)}
            className="relative p-2 rounded-lg hover:bg-gray-200 text-gray-700 mr-3"
          >
            <Icon path={mdiHistory} size={1.25} />
            <div className="absolute -top-1 -right-1 bg-purple-600 flex items-center justify-center rounded-full p-1 w-auto h-6 aspect-square">
              <span className="text-white text-sm">{sketches.length}</span>
            </div>
          </button>
        )}

        {hasUnsavedChanges && (
          <button
            onClick={handleSaveSketch}
            className="hover:bg-gray-200 text-gray-700 px-2 py-2 rounded-lg"
          >
            <Icon
              path={mdiContentSaveOutline}
              size={1.25}
              className="text-green-600"
            />
          </button>
        )}

        {(currentSketch || hasUnsavedChanges) && (
          <button
            onClick={handleNewSketch}
            className="hover:bg-gray-200 text-gray-700 px-2 py-2 rounded-lg"
          >
            <Icon path={mdiPlus} size={1.25} className="text-blue-600" />
          </button>
        )}
      </div>

      <DrawingCanvas
        ref={canvasRef}
        width={viewportDimensions.width || 1200}
        height={viewportDimensions.height || 800}
        toolConfig={toolConfig}
        paths={paths}
        onDrawingChange={handleDrawingChange}
        className="w-full h-full"
        backgroundImage={currentSketch?.data}
      />

      <div className="absolute bottom-6 left-0 right-0 z-20 bg-white shadow-[0_0_5px_rgba(0,0,0,0.2)] px-6 py-4 w-fit mx-auto rounded-xl">
        <div className="flex items-center justify-center space-x-8">
          <div className="flex flex-col space-y-2">
            <button
              onClick={() =>
                setToolConfig((prev) => ({ ...prev, tool: "pen" }))
              }
              className={`px-4 py-2 rounded-lg transition-colors ${
                toolConfig.tool === "pen"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Icon path={mdiPencilOutline} size={1} />
            </button>
            <button
              onClick={() =>
                setToolConfig((prev) => ({ ...prev, tool: "eraser" }))
              }
              className={`px-4 py-2 rounded-lg transition-colors ${
                toolConfig.tool === "eraser"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Icon path={mdiEraser} size={1} />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <ColorPicker
              value={toolConfig.color}
              disabled={toolConfig.tool === "eraser"}
              onChange={(color: string) =>
                setToolConfig((prev) => ({ ...prev, color }))
              }
            />
          </div>

          <div className="flex flex-col space-y-2">
            <button
              onClick={handleUndo}
              disabled={historyIndex <= baseHistoryIndex}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Icon path={mdiUndoVariant} size={1} />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Icon path={mdiRedoVariant} size={1} />
            </button>
          </div>
        </div>
      </div>

      <NavigationDrawer
        isOpen={isNavigationDrawerOpen}
        onClose={() => setIsNavigationDrawerOpen(false)}
        sessions={sketches}
        currentSessionId={currentSketch?.id}
        onSessionSelect={handleSketchSelect}
      />

      <ConfirmationDialog
        isOpen={showConfirmation}
        title="Unsaved Changes"
        message="You have unsaved changes. Are you sure you want to continue? Your changes will be lost."
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction}
        confirmText="Continue"
        cancelText="Cancel"
      />
    </div>
  );
};
