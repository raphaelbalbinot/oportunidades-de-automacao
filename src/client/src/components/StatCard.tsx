import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  iconFa?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  colorScheme?: 'blue' | 'emerald' | 'violet' | 'amber' | 'rose' | 'cyan';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  iconFa = 'fas fa-chart-bar',
  trend,
  colorScheme = 'blue',
}) => {

  const schemeClasses = {
    blue: {
      iconBg: 'bg-[var(--govbr-blue-warm-vivid-70)] text-white shadow-xs',
      border: 'border-l-4 border-l-[var(--govbr-blue-warm-vivid-70)] border-slate-200',
    },
    emerald: {
      iconBg: 'bg-emerald-600 text-white shadow-xs',
      border: 'border-l-4 border-l-emerald-600 border-slate-200',
    },
    violet: {
      iconBg: 'bg-purple-600 text-white shadow-xs',
      border: 'border-l-4 border-l-purple-600 border-slate-200',
    },
    amber: {
      iconBg: 'bg-amber-600 text-white shadow-xs',
      border: 'border-l-4 border-l-amber-500 border-slate-200',
    },
    rose: {
      iconBg: 'bg-red-600 text-white shadow-xs',
      border: 'border-l-4 border-l-red-600 border-slate-200',
    },
    cyan: {
      iconBg: 'bg-cyan-600 text-white shadow-xs',
      border: 'border-l-4 border-l-cyan-600 border-slate-200',
    },
  };

  const currentScheme = schemeClasses[colorScheme] || schemeClasses.blue;

  return (
    <div className={`br-card bg-white rounded-lg p-5 border ${currentScheme.border} shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-600">{title}</span>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentScheme.iconBg}`}>
          {iconFa && <i className={`${iconFa} text-base text-white`}></i>}
        </div>
      </div>

      <div>
        <div className="text-2xl font-bold text-slate-900 tracking-tight">{value}</div>
        {subtitle && <p className="text-xs text-slate-500 mt-1 font-medium">{subtitle}</p>}
        {trend && (
          <div className="flex items-center mt-2.5 text-xs">
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
              trend.isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              <i className={`fas fa-arrow-${trend.isPositive ? 'up' : 'down'} mr-1 text-[10px]`}></i>
              {trend.value}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

