import React from 'react';

const FormSelect = ({ label, icon: Icon, value, onChange, options }) => (
    <div className="space-y-2 group">
        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
        <div className="relative">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors">
                <Icon size={16} />
            </div>
            <select 
                className="w-full bg-slate-950/40 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-white text-sm font-black focus:border-emerald-500/30 focus:bg-slate-950/60 outline-none transition-all focus:ring-4 focus:ring-emerald-500/5 appearance-none cursor-pointer" 
                value={value} 
                onChange={e => onChange(e.target.value)}
            >
                {options.map(opt => <option key={opt} value={opt} className="bg-slate-950">{opt}</option>)}
            </select>
        </div>
    </div>
);

export default FormSelect;
