"use client";

import { DrawingPath, Point, ToolConfig } from '@/types';
import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';

interface DrawingCanvasProps {
  width: number;
  height: number;
  toolConfig: ToolConfig;
  paths: DrawingPath[];
  onDrawingChange: (paths: DrawingPath[]) => void;
  className?: string;
  backgroundImage?: string;
}

export const DrawingCanvas = forwardRef<HTMLCanvasElement, DrawingCanvasProps>(({
  width,
  height,
  toolConfig,
  paths,
  onDrawingChange,
  className = '',
  backgroundImage,
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const currentPathRef = useRef<DrawingPath | null>(null);
  const backgroundImageRef = useRef<HTMLImageElement | null>(null);
  const [mousePosition, setMousePosition] = useState<Point | null>(null);


  const getPointFromEvent = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX: number, clientY: number;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }, []);

  const startDrawing = useCallback((point: Point) => {
    isDrawingRef.current = true;
    currentPathRef.current = {
      points: [point],
      color: toolConfig.color,
      width: toolConfig.tool === 'eraser' ? toolConfig.width * 2 : toolConfig.width,
      tool: toolConfig.tool,
    };
  }, [toolConfig]);

  const drawPath = useCallback((ctx: CanvasRenderingContext2D, path: DrawingPath) => {
    if (path.points.length < 2) return;

    ctx.save();
    
    if (path.tool === 'eraser') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = path.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      ctx.beginPath();
      ctx.moveTo(path.points[0].x, path.points[0].y);
      
      for (let i = 1; i < path.points.length; i++) {
        ctx.lineTo(path.points[i].x, path.points[i].y);
      }
      
      ctx.stroke();
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = path.color;
      ctx.lineWidth = path.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      ctx.beginPath();
      ctx.moveTo(path.points[0].x, path.points[0].y);
      
      for (let i = 1; i < path.points.length; i++) {
        ctx.lineTo(path.points[i].x, path.points[i].y);
      }
      
      ctx.stroke();
    }
    
    ctx.restore();
  }, []);

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#FFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (backgroundImageRef.current) {
      ctx.drawImage(backgroundImageRef.current, 0, 0, canvas.width, canvas.height);
    }

    ctx.save();
    paths.forEach(path => {
      if (path.points.length > 1) {
        drawPath(ctx, path);
      }
    });

    if (currentPathRef.current && currentPathRef.current.points.length > 1) {
      drawPath(ctx, currentPathRef.current);
    }
    ctx.restore();

    if (toolConfig.tool === 'eraser' && mousePosition) {
      ctx.save();
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = '#666';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(mousePosition.x, mousePosition.y, toolConfig.width * 2, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }
  }, [paths, drawPath, toolConfig.tool, toolConfig.width, mousePosition]);

  const draw = useCallback((point: Point) => {
    if (!isDrawingRef.current || !currentPathRef.current) return;

    currentPathRef.current.points.push(point);
    redrawCanvas();
  }, [redrawCanvas]);

  const stopDrawing = useCallback(() => {
    if (!isDrawingRef.current || !currentPathRef.current) return;

    isDrawingRef.current = false;
    const path = currentPathRef.current;
    currentPathRef.current = null;

    onDrawingChange([...paths, path]);
  }, [onDrawingChange, paths]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const point = getPointFromEvent(e);
    startDrawing(point);
  }, [getPointFromEvent, startDrawing]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const point = getPointFromEvent(e);
    
    setMousePosition(point);
    
    draw(point);
  }, [getPointFromEvent, draw]);

  const handleMouseUp = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    stopDrawing();
  }, [stopDrawing]);

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const point = getPointFromEvent(e);
    setMousePosition(point);
  }, [getPointFromEvent]);

  const handleMouseLeave = useCallback(() => {
    setMousePosition(null);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const point = getPointFromEvent(e);
    startDrawing(point);
  }, [getPointFromEvent, startDrawing]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const point = getPointFromEvent(e);
    draw(point);
  }, [getPointFromEvent, draw]);

  const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    stopDrawing();
  }, [stopDrawing]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    ctx.fillStyle = '#FFF';
    ctx.fillRect(0, 0, width, height);
  }, [width, height]);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const container = canvas.parentElement;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const newWidth = Math.floor(rect.width);
      const newHeight = Math.floor(rect.height);

      if (newWidth !== width || newHeight !== height) {
        redrawCanvas();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [width, height, redrawCanvas]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  useEffect(() => {
    if (backgroundImage) {
      const img = new Image();
      img.onload = () => {
        backgroundImageRef.current = img;
        redrawCanvas();
      };
      img.src = backgroundImage;
    } else {
      backgroundImageRef.current = null;
      redrawCanvas();
    }
  }, [backgroundImage, redrawCanvas]);

  return (
    <canvas
      ref={(node) => {
        canvasRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }}
      width={width}
      height={height}
      className={`${toolConfig.tool === 'eraser' ? 'cursor-none' : 'cursor-crosshair'} ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'none' }}
    />
  );
});

DrawingCanvas.displayName = 'DrawingCanvas';
