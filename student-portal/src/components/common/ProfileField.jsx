import React from 'react';

function ProfileField({ icon: Icon, label, value }) {
    return (
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 group hover:border-blue-500/30 transition-all flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/5 flex items-center justify-center text-blue-500 shrink-0">
                {Icon && <Icon size={18} />}
            </div>
            <div className="min-w-0">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1 truncate">{label}</p>
                <p className="text-xs font-black text-white uppercase tracking-widest truncate">{value || 'N/A'}</p>
            </div>
        </div>
    );
}

export default ProfileField;
