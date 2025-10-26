import React from 'react';

interface ColorPickerProps {
  value: string;
  disabled?: boolean;
  onChange: (color: string) => void;
  className?: string;
}

const PRESET_COLORS = [
  "#000000",
  "#F34822",
  "#FF9D42",
  "#FFC942",
  "#66D575",
  "#3CADFF",
  "#874FFF",
  "#808080",
  "#FF69B4",
  "#8B4513",
  "#FFD700",
  "#00FFFF",
  "#800000",
  "#228B22",
];

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  disabled = false,
  onChange,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="flex gap-4">
        {PRESET_COLORS.slice(0, 7).map((color) => (
          <ColorItem
            key={color}
            color={color}
            isSelected={value === color}
            onSelect={onChange}
            disabled={disabled}
          />
        ))}
      </div>
      <div className="flex gap-4">
        {PRESET_COLORS.slice(7).map((color) => (
          <ColorItem
            key={color}
            color={color}
            isSelected={value === color}
            onSelect={onChange}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
};

const ColorItem: React.FC<{
  color: string;
  isSelected: boolean;
  onSelect: (color: string) => void;
  disabled?: boolean;
}> = ({ color, isSelected, onSelect, disabled }) => {
  return (
    <button
      className={`w-8 h-8 rounded-full transition-all hover:scale-110 p-0.5 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 ${
        isSelected && !disabled ? "border-2 border-blue-500" : ""
      }`}
      onClick={() => onSelect(color)}
      title={color}
      disabled={disabled}
    >
      <div
        className="w-full h-full rounded-full"
        style={{ backgroundColor: color }}
      />
    </button>
  );
};