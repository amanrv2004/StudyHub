import React from 'react';
import Card from './Card';

const StatCard = ({ title, value, icon: Icon, color, trend }) => {
  const colors = {
    emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    rose: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
    purple: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    amber: 'text-amber-500 bg-amber-500/10 border-amber-500/20'
  };

  return (
    <Card glow className={`${colors[color]} border transition-all duration-500 hover:-translate-y-1`}>
       <div className="flex items-center justify-between mb-4 lg:mb-6">
          <div className={`p-2 lg:p-3 rounded-xl lg:rounded-2xl bg-current border-0 shadow-lg bg-opacity-10`}><Icon size={18} /></div>
          {trend && <span className={`text-[10px] lg:text-xs font-black px-2 py-1 rounded-lg bg-current bg-opacity-10`}>{trend > 0 ? '+' : ''}{trend}%</span>}
       </div>
       <p className="text-[10px] lg:text-xs font-black text-slate-500 uppercase tracking-widest">{title}</p>
       <p className="text-2xl lg:text-4xl font-black text-white mt-1 lg:mt-2 tracking-tighter truncate">{value || 0}</p>
    </Card>
  );
};

export default StatCard;
