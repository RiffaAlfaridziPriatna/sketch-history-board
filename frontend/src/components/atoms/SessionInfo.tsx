"use client";

import { SketchVersion } from '@/types';
import React from 'react';

interface SessionInfoProps {
  session: SketchVersion;
}

export const SessionInfo: React.FC<SessionInfoProps> = ({ session }) => {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(session.updatedAt));

  return (
    <div className="absolute top-4 left-4 z-30 bg-white rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.2)] px-5 py-3 max-w-xs">
      <div className="flex items-start">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">
            {session.name}
          </h3>
          <p className="text-sm text-gray-500">Last saved on {formattedDate}</p>
        </div>
      </div>
    </div>
  );
};
