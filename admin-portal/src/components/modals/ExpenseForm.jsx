import React, { useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../../services/api';
import Card from '../common/Card';

function ExpenseForm({ onClose, onRefresh }) {
    const [formData, setFormData] = useState({ title: '', amount: '', category: 'General', date: new Date().toISOString().split('T')[0] });
    const [loading, setLoading] = useState(false);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try { 
            await axios.post(`${API_URL}/expenses`, formData); 
            onRefresh(); 
            onClose(); 
        } catch (err) { 
            alert('Failed to record expense'); 
        } finally { 
            setLoading(false); 
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
           <Card className="w-full max-w-md border-rose-500/30 relative">
              <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full transition-all text-slate-500"><X size={24} /></button>
              <h3 className="text-xl lg:text-2xl font-black text-white uppercase tracking-tighter mb-8">Record Expense</h3>
              <form className="space-y-6" onSubmit={handleSubmit}>
                 <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Title</label>
                    <input required className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm font-black focus:border-rose-500/50 outline-none" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Amount</label>
                        <input required type="number" className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm font-black focus:border-rose-500/50 outline-none" value={formData.amount} onChange={e=>setFormData({...formData, amount: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Category</label>
                        <select className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm font-black focus:border-rose-500/50 outline-none" value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})}>
                            <option value="Rent">Rent</option>
                            <option value="Electricity">Electricity</option>
                            <option value="Internet">Internet</option>
                            <option value="Furniture">Furniture</option>
                            <option value="Maintenance">Maintenance</option>
                            <option value="General">General</option>
                        </select>
                    </div>
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Date</label>
                    <input required type="date" className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm font-black focus:border-rose-500/50 outline-none" value={formData.date} onChange={e=>setFormData({...formData, date: e.target.value})} />
                 </div>
                 <button disabled={loading} className="w-full py-5 rounded-2xl bg-rose-600 text-white font-black text-xs uppercase tracking-[0.3em] shadow-xl">
                    {loading ? 'PROCESSING...' : 'Confirm Expense'}
                 </button>
              </form>
           </Card>
        </div>
    );
}

export default ExpenseForm;
