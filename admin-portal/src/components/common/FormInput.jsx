import React from 'react';

const FormInput = ({ label, icon: Icon, value, onChange, type="text", required=false, placeholder="" }) => (
    <div className="space-y-2 group">
        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
            {label} {required && <div className="w-1 h-1 rounded-full bg-rose-500"></div>}
        </label>
        <div className="relative">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors">
                <Icon size={16} />
            </div>
            <input 
                type={type}
                required={required}
                placeholder={placeholder}
                className="w-full bg-slate-950/40 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-white text-sm font-black focus:border-emerald-500/30 focus:bg-slate-950/60 outline-none transition-all placeholder:text-slate-800 focus:ring-4 focus:ring-emerald-500/5" 
                value={value} 
                onChange={e => onChange(e.target.value)} 
            />
        </div>
    </div>
);

export default FormInput;
