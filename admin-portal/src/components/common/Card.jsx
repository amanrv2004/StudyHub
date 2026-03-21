import React from 'react';

const Card = ({ children, className = "", glow = false, noPadding = false }) => (
  <div className={`bg-[#111827]/80 backdrop-blur-3xl border border-white/5 rounded-[2rem] shadow-2xl transition-all duration-500 hover:border-white/10 ${glow ? 'ring-1 ring-emerald-500/30 shadow-emerald-500/10' : ''} ${className}`}>
    <div className={noPadding ? '' : 'p-6 md:p-8'}>{children}</div>
  </div>
);

export default Card;
