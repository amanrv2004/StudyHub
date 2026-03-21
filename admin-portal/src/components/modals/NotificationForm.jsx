import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../../services/api';
import Card from '../common/Card';

function NotificationForm({ students, onClose, onRefresh }) {
    const [formData, setFormData] = useState({ title: '', message: '', recipient: 'All', type: 'General' });
    const [loading, setLoading] = useState(false);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try { 
            await axios.post(`${API_URL}/notifications`, formData); 
            onRefresh(); 
            onClose(); 
        } catch (err) { 
            alert('Failed to send notification'); 
        } finally { 
            setLoading(false); 
        }
    };
    
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300">
            <Card className="w-full max-w-md border-emerald-500/30 relative">
                <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full transition-all text-slate-500"><X size={24} /></button>
                <h3 className="text-xl lg:text-2xl font-black text-white uppercase tracking-tighter mb-8">Send Message</h3>
                <form className="space-y-5 lg:space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Title</label>
                        <input required className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm font-black focus:border-emerald-500/50 outline-none" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Recipient</label>
                        <select className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm font-black focus:border-emerald-500/50 outline-none" value={formData.recipient} onChange={e=>setFormData({...formData, recipient: e.target.value})}>
                            <option value="All">All Students</option>
                            {students.map(s => (
                                <option key={s._id} value={s.studyId}>{s.fullName} ({s.studyId})</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Message</label>
                        <textarea required className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm font-black focus:border-emerald-500/50 outline-none h-32" value={formData.message} onChange={e=>setFormData({...formData, message: e.target.value})} />
                    </div>
                    <button disabled={loading} className="w-full py-5 rounded-2xl bg-emerald-600 text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3">
                        <Send size={16} /> {loading ? 'SENDING...' : 'Send Message'}
                    </button>
                </form>
            </Card>
        </div>
    );
}

export default NotificationForm;
