import React from 'react';

const Badge = ({ children }) => {
  const styles = {
    Active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]",
    Inactive: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    Pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    'Premium Access': "bg-purple-500/10 text-purple-400 border-purple-500/20",
  };
  return <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-[0.15em] ${styles[children] || 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>{children}</span>;
};

export default Badge;
