import React from 'react';

const SnapshotCard = ({ title, value, subtitle, icon: Icon, color }) => {
    const colors = {
        emerald: 'from-emerald-500/20 to-emerald-600/5 text-emerald-400 border-emerald-500/20',
        blue: 'from-blue-500/20 to-blue-600/5 text-blue-400 border-blue-500/20',
        rose: 'from-rose-500/20 to-rose-600/5 text-rose-400 border-rose-500/20',
        purple: 'from-purple-500/20 to-purple-600/5 text-purple-400 border-purple-500/20'
    };

    return (
        <div className={`p-6 rounded-[2.5rem] bg-gradient-to-br ${colors[color]} border backdrop-blur-xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-500`}>
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <Icon size={100} strokeWidth={1} />
            </div>
            <div className="relative z-10">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-4 opacity-60">{title}</p>
                <p className="text-3xl font-black text-white mb-2 tracking-tighter">{value}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{subtitle}</p>
            </div>
        </div>
    );
};

export default SnapshotCard;
