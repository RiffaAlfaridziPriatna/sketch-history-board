export interface Point {
  x: number;
  y: number;
}

export interface DrawingPath {
  points: Point[];
  color: string;
  width: number;
  tool: 'pen' | 'eraser' | 'clear';
}

export interface SketchVersion {
  id: string;
  name: string;
  thumbnail: string;
  data: string;
  createdAt: Date;
  updatedAt: Date;
}


export interface DrawingState {
  isDrawing: boolean;
  currentPath: DrawingPath | null;
  paths: DrawingPath[];
  history: DrawingPath[][];
  historyIndex: number;
}

export type DrawingTool = 'pen' | 'eraser' | 'clear';

export interface ToolConfig {
  color: string;
  width: number;
  tool: DrawingTool;
}
