import { Button } from '@/components/atoms/Button';
import { ColorPicker } from '@/components/atoms/ColorPicker';
import { Slider } from '@/components/atoms/Slider';
import { DrawingTool, ToolConfig } from '@/types';
import React from 'react';

interface ToolPanelProps {
  config: ToolConfig;
  onConfigChange: (config: ToolConfig) => void;
  onClear: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  canUndo: boolean;
  canRedo: boolean;
  className?: string;
}

export const ToolPanel: React.FC<ToolPanelProps> = ({
  config,
  onConfigChange,
  onClear,
  onUndo,
  onRedo,
  onSave,
  canUndo,
  canRedo,
  className = '',
}) => {
  const handleToolChange = (tool: DrawingTool) => {
    onConfigChange({ ...config, tool });
  };

  const handleColorChange = (color: string) => {
    onConfigChange({ ...config, color });
  };

  const handleWidthChange = (width: number) => {
    onConfigChange({ ...config, width });
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800">Drawing Tools</h3>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Tool</label>
        <div className="flex gap-2">
          <Button
            variant={config.tool === 'pen' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => handleToolChange('pen')}
          >
            Pen
          </Button>
          <Button
            variant={config.tool === 'eraser' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => handleToolChange('eraser')}
          >
            Eraser
          </Button>
        </div>
      </div>

      {config.tool === 'pen' && (
        <ColorPicker
          value={config.color}
          onChange={handleColorChange}
        />
      )}

      <Slider
        label="Brush Size"
        value={config.width}
        onChange={handleWidthChange}
        min={1}
        max={20}
      />

      <div className="space-y-2">
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onUndo}
            disabled={!canUndo}
          >
            Undo
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onRedo}
            disabled={!canRedo}
          >
            Redo
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="danger"
            size="sm"
            onClick={onClear}
          >
            Clear
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onSave}
          >
            Save as Version
          </Button>
        </div>
      </div>
    </div>
  );
};
