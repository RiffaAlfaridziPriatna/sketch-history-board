import React from 'react';
import { Thumbnail } from '@/components/atoms/Thumbnail';
import { SketchVersion } from '@/types';

interface HistoryPanelProps {
  versions: SketchVersion[];
  selectedVersionId?: string;
  onVersionSelect: (version: SketchVersion) => void;
  onVersionRestore: (version: SketchVersion) => void;
  className?: string;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  versions,
  selectedVersionId,
  onVersionSelect,
  onVersionRestore,
  className = '',
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Version History</h3>
        <span className="text-sm text-gray-500">{versions.length} versions</span>
      </div>
      
      {versions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No versions saved yet</p>
          <p className="text-sm">Draw something and save it as a version!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
          {versions.map((version) => (
            <div key={version.id} className="relative">
              <Thumbnail
                version={version}
                isSelected={selectedVersionId === version.id}
                onClick={() => onVersionSelect(version)}
              />
              {selectedVersionId === version.id && (
                <div className="absolute top-2 right-2">
                  <button
                    className="bg-blue-600 text-white text-xs px-2 py-1 rounded hover:bg-blue-700 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onVersionRestore(version);
                    }}
                  >
                    Restore
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
