import React, { useState } from 'react';
import { ShieldCheck, Mail, Phone, Settings, User, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../services/api';
import Card from '../components/common/Card';
import FormInput from '../components/common/FormInput';

function SettingsPage({ admin, onUpdate }) {
    const [formData, setFormData] = useState({ fullName: admin.fullName, email: admin.email, phone: admin.phone || '', password: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const adminId = admin.id || admin._id;
            const res = await axios.patch(`${API_URL}/auth/admin/update/${adminId}`, formData);
            onUpdate(res.data.user);
            setMessage('Profile updated successfully!');
            setFormData({ ...formData, password: '' });
        } catch (err) {
            setMessage(err.response?.data?.message || 'Update failed - Server connection issue');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-10 duration-1000 relative">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative z-10">
                <div className="lg:col-span-4">
                    <Card glow className="bg-gradient-to-b from-slate-900/90 to-slate-950/90 border-emerald-500/20 text-center sticky top-0 py-10 px-8">
                        <div className="relative inline-block mb-10">
                            <div className="w-32 h-32 lg:w-40 lg:h-40 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-[3rem] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/40 transform -rotate-3 hover:rotate-0 transition-transform duration-700 group">
                                <span className="text-5xl lg:text-6xl font-black text-white drop-shadow-2xl">{admin.fullName?.charAt(0)}</span>
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-[#020617] border-4 border-[#0a0f1d] rounded-2xl flex items-center justify-center text-emerald-500 shadow-xl">
                                <ShieldCheck size={22} strokeWidth={3} />
                            </div>
                        </div>
                        
                        <div className="mb-8">
                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-1">{admin.fullName}</h3>
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                <p className="text-[10px] text-emerald-500 font-black uppercase tracking-[0.4em]">Master Administrator</p>
                            </div>
                        </div>
                        
                        <div className="space-y-4 pt-8 border-t border-white/5 text-left">
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500"><Mail size={18} /></div>
                                <div className="min-w-0"><p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Primary Email</p><p className="text-xs font-bold text-slate-300 truncate">{admin.email}</p></div>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500"><Phone size={18} /></div>
                                <div className="min-w-0"><p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">System Contact</p><p className="text-xs font-bold text-slate-300 truncate">{admin.phone || 'Not configured'}</p></div>
                            </div>
                        </div>

                        <div className="mt-8 p-4 rounded-2xl bg-slate-950/50 border border-emerald-500/10 flex items-center justify-between">
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Security Status</p>
                            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase border border-emerald-500/20">Encrypted</span>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-8">
                    <Card className="bg-slate-900/40 backdrop-blur-3xl border-white/5 p-8 lg:p-12">
                        <div className="flex items-center gap-5 mb-16">
                            <div className="w-14 h-14 bg-emerald-600/10 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-500/20 shadow-2xl shadow-emerald-500/5">
                                <Settings size={28} strokeWidth={2.5} className="animate-spin-slow" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-white uppercase tracking-tighter">System Access</h3>
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-1">Configure Administrative Protocols</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-12">
                            <div className="space-y-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-1 h-4 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                    <h4 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Identity Protocol</h4>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <FormInput label="Full Name" icon={User} value={formData.fullName} onChange={v => setFormData({...formData, fullName: v})} required />
                                    <FormInput label="Contact No" icon={Phone} value={formData.phone} onChange={v => setFormData({...formData, phone: v})} required type="tel" />
                                </div>
                                <FormInput label="Admin ID (System Email)" icon={Mail} value={formData.email} onChange={v => setFormData({...formData, email: v})} required type="email" />
                            </div>

                            <div className="space-y-8 pt-8 border-t border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-1 h-4 bg-rose-500 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.5)]"></div>
                                    <h4 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Security Authorization</h4>
                                </div>
                                <div className="space-y-4">
                                    <FormInput 
                                        label="New Access Key (Password)" 
                                        icon={Lock} 
                                        value={formData.password} 
                                        onChange={v => setFormData({...formData, password: v})} 
                                        type="password" 
                                        placeholder="••••••••"
                                    />
                                    <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest ml-1 flex items-center gap-2 italic">
                                        <AlertCircle size={10} /> Authentication required only for credential modification
                                    </p>
                                </div>
                            </div>

                            {message && (
                                <div className={`p-6 rounded-3xl text-[10px] font-black uppercase tracking-widest text-center border animate-in zoom-in-95 duration-300 ${message.includes('success') ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                                    <div className="flex items-center justify-center gap-3">
                                        {message.includes('success') ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                                        {message}
                                    </div>
                                </div>
                            )}

                            <div className="pt-6">
                                <button 
                                    disabled={loading} 
                                    className="w-full py-6 rounded-[2rem] bg-emerald-600 text-white font-black text-xs uppercase tracking-[0.5em] shadow-2xl shadow-emerald-500/30 hover:bg-emerald-500 hover:-translate-y-1 active:scale-[0.98] transition-all duration-500 disabled:opacity-50 disabled:translate-y-0"
                                >
                                    {loading ? 'SYNCHRONIZING AUTH...' : 'VERIFY & COMMIT CHANGES'}
                                </button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default SettingsPage;
