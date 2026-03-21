import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../services/api';
import Card from './common/Card';

function ComplaintForm({ student, onClose, onRefresh }) {
    const [formData, setFormData] = useState({ 
        studentId: student._id, 
        studentName: student.fullName, 
        studyId: student.studyId, 
        subject: '', 
        message: '', 
        type: 'Complaint' 
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${API_URL}/complaints`, formData);
            alert('Request sent successfully!');
            onRefresh();
            onClose();
        } catch (_) { 
            alert('Failed to send request'); 
        } finally { 
            setLoading(false); 
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4">
            <Card className="w-full max-w-md relative border-blue-500/30">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/5 rounded-full transition-all"><X size={24} className="text-slate-500 hover:text-white" /></button>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-10">Submit Request</h3>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Type</label>
                        <select className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm font-black focus:border-blue-500/50 outline-none appearance-none" value={formData.type} onChange={e=>setFormData({...formData, type: e.target.value})}>
                            <option value="Complaint">Complaint</option>
                            <option value="Request">Request</option>
                        </select>
                    </div>
                    <div><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Subject</label><input required className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm font-black focus:border-blue-500/50 outline-none" value={formData.subject} onChange={e=>setFormData({...formData, subject: e.target.value})} /></div>
                    <div><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Message</label><textarea required className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm font-black focus:border-blue-500/50 outline-none h-32" value={formData.message} onChange={e=>setFormData({...formData, message: e.target.value})} /></div>
                    <button disabled={loading} className="w-full py-5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3">
                        <Send size={16} /> {loading ? 'SENDING...' : 'Send Signal'}
                    </button>
                </form>
            </Card>
        </div>
    );
}

export default ComplaintForm;
