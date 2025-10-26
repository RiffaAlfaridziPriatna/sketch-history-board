"use client";

import { SketchVersion } from '@/types';
import React from 'react';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: SketchVersion[];
  currentSessionId?: string;
  onSessionSelect: (session: SketchVersion) => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  sessions,
  currentSessionId,
  onSessionSelect,
}) => {
  if (!isOpen) return null;

  const formattedDate = (date: Date) => {
    const d = new Date(date);
    const opts: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
    return new Intl.DateTimeFormat("en-US", opts).format(d);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      
      <div className="relative w-96 bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Sketches</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-2">
            {sessions.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>No sketches saved yet</p>
                <p className="text-sm mt-1">Create your first sketch to get started</p>
              </div>
            ) : (
              sessions.map((session) => (
              <div
                key={session.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  currentSessionId === session.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => onSessionSelect(session)}
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={session.thumbnail}
                    alt={session.name}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {session.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Last saved on {formattedDate(session.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
