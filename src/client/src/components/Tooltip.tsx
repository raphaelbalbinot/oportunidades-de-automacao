import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface TooltipProps {
  content: string;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, className = '' }) => {
  const [visible, setVisible] = useState(false);

  return (
    <span
      className={`relative inline-flex items-center ml-1 text-slate-400 hover:text-brand-600 cursor-help transition-colors ${className}`}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setVisible(!visible);
      }}
    >
      <HelpCircle className="w-3.5 h-3.5" />
      {visible && (
        <span className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2.5 bg-slate-900/95 text-white text-xs leading-relaxed font-normal rounded-xl shadow-xl backdrop-blur-sm pointer-events-none transition-all duration-200 border border-slate-700/50">
          {content}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900/95"></span>
        </span>
      )}
    </span>
  );
};
