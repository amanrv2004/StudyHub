import React from 'react';

const ProfileDataBox = ({ icon: Icon, label, value }) => {
    return (
        <div className="p-4 rounded-2xl bg-slate-950/40 border border-white/5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/5 flex items-center justify-center text-emerald-500 shrink-0">
                <Icon size={18} />
            </div>
            <div className="min-w-0">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">{label}</p>
                <p className="text-xs font-black text-white uppercase truncate">{value || 'N/A'}</p>
            </div>
        </div>
    );
};

export default ProfileDataBox;
