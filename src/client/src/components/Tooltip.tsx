import React, { useState } from 'react';

interface TooltipProps {
  content: string;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, className = '' }) => {
  const [visible, setVisible] = useState(false);

  return (
    <span
      className={`relative inline-flex items-center ml-1 text-blue-warm-vivid-70 hover:text-blue-warm-vivid-90 cursor-pointer transition-colors ${className}`}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setVisible(!visible);
      }}
      aria-label="Ajuda contextual"
    >
      <i className="fas fa-question-circle text-xs text-blue-600 hover:text-blue-800"></i>
      {visible && (
        <span className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 text-white text-xs leading-relaxed font-normal rounded-lg shadow-xl pointer-events-none transition-all duration-200 border border-slate-700">
          {content}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></span>
        </span>
      )}
    </span>
  );
};

