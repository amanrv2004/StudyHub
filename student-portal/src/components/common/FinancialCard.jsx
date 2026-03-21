import React from 'react';

function FinancialCard({ label, value, color }) {
    const colors = {
        slate: 'bg-slate-950/60 border-white/5 text-white',
        blue: 'bg-blue-500/5 border-blue-500/10 text-blue-400',
        emerald: 'bg-emerald-500/5 border-emerald-500/10 text-emerald-400',
        rose: 'bg-rose-500/5 border-rose-500/10 text-rose-400'
    };

    return (
        <div className={`p-6 rounded-[2rem] border ${colors[color]} relative overflow-hidden group hover:scale-[1.02] transition-all duration-500`}>
            <p className="text-[9px] font-black uppercase tracking-widest mb-3 opacity-60">{label}</p>
            <p className="text-2xl font-black font-mono tracking-tighter">₹{value?.toLocaleString() || 0}</p>
            <div className="absolute top-0 right-0 w-16 h-16 bg-current opacity-[0.02] rounded-full -mr-8 -mt-8"></div>
        </div>
    );
}

export default FinancialCard;
