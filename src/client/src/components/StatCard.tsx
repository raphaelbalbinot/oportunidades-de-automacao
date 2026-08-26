import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
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
  icon: Icon,
  trend,
  colorScheme = 'blue',
}) => {
  const schemeClasses = {
    blue: {
      bg: 'bg-blue-50/70 text-blue-600 border-blue-200/60',
      border: 'border-slate-200 hover:border-blue-300',
    },
    emerald: {
      bg: 'bg-emerald-50/70 text-emerald-600 border-emerald-200/60',
      border: 'border-slate-200 hover:border-emerald-300',
    },
    violet: {
      bg: 'bg-violet-50/70 text-violet-600 border-violet-200/60',
      border: 'border-slate-200 hover:border-violet-300',
    },
    amber: {
      bg: 'bg-amber-50/70 text-amber-600 border-amber-200/60',
      border: 'border-slate-200 hover:border-amber-300',
    },
    rose: {
      bg: 'bg-rose-50/70 text-rose-600 border-rose-200/60',
      border: 'border-slate-200 hover:border-rose-300',
    },
    cyan: {
      bg: 'bg-cyan-50/70 text-cyan-600 border-cyan-200/60',
      border: 'border-slate-200 hover:border-cyan-300',
    },
  };

  const currentScheme = schemeClasses[colorScheme] || schemeClasses.blue;

  return (
    <div className={`bg-white rounded-2xl p-5 border ${currentScheme.border} shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</span>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${currentScheme.bg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div>
        <div className="text-2xl font-extrabold text-slate-900 tracking-tight">{value}</div>
        {subtitle && <p className="text-xs text-slate-500 mt-1 font-medium">{subtitle}</p>}
        {trend && (
          <div className="flex items-center mt-2 text-xs">
            <span className={`font-semibold ${trend.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
              {trend.value}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
