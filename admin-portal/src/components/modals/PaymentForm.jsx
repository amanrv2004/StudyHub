import React, { useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../../services/api';
import Card from '../common/Card';

function PaymentForm({ student, onClose, onRefresh }) {
    const [formData, setFormData] = useState({ 
        studentId: student._id, 
        studentName: student.fullName, 
        amount: student.dueAmount, 
        method: 'UPI', 
        month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }), 
        paymentDate: new Date().toISOString().split('T')[0] 
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try { 
            await axios.post(`${API_URL}/payments`, formData); 
            onRefresh(); 
            onClose(); 
        } catch (err) { 
            alert('Failed to record payment'); 
        } finally { 
            setLoading(false); 
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
           <Card className="w-full max-w-md border-emerald-500/30 relative">
              <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full transition-all text-slate-500"><X size={24} /></button>
              <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-8">Collect Fee</h3>
              <form className="space-y-6" onSubmit={handleSubmit}>
                 <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Student</p>
                    <p className="text-lg font-black text-white uppercase truncate">{student.fullName}</p>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Amount</label>
                        <input required type="number" className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm font-black focus:border-emerald-500/50 outline-none" value={formData.amount} onChange={e=>setFormData({...formData, amount: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Method</label>
                        <select className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm font-black focus:border-emerald-500/50 outline-none" value={formData.method} onChange={e=>setFormData({...formData, method: e.target.value})}>
                            <option value="Cash">Cash</option>
                            <option value="UPI">UPI</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                        </select>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Month</label>
                        <input required className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm font-black focus:border-emerald-500/50 outline-none" value={formData.month} onChange={e=>setFormData({...formData, month: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Date</label>
                        <input required type="date" className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm font-black focus:border-emerald-500/50 outline-none" value={formData.paymentDate} onChange={e=>setFormData({...formData, paymentDate: e.target.value})} />
                    </div>
                 </div>
                 <button disabled={loading} className="w-full py-5 rounded-2xl bg-emerald-600 text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl">
                    {loading ? 'PROCESSING...' : 'Confirm Payment'}
                 </button>
              </form>
           </Card>
        </div>
    );
}

export default PaymentForm;
