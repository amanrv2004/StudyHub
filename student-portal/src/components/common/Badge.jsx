import React from 'react';

const Badge = ({ children }) => (
  <span className="px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(59,130,246,0.2)]">
    {children}
  </span>
);

export default Badge;
