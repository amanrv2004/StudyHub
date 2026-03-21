import React from 'react';

const Card = ({ children, className = "", glow = false }) => (
  <div className={`bg-[#111827]/80 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] shadow-2xl transition-all duration-500 hover:border-white/10 ${glow ? 'ring-1 ring-blue-500/30 shadow-blue-500/10' : ''} ${className}`}>
    <div className="p-6 md:p-10">{children}</div>
  </div>
);

export default Card;
