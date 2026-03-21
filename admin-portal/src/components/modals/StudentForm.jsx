import React, { useState, useEffect } from 'react';
import { X, FileEdit, Plus, User, Mail, Phone, ShieldCheck, Monitor, QrCode, Map, Activity, CreditCard, Lock } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../../services/api';
import Card from '../common/Card';
import FormInput from '../common/FormInput';
import FormSelect from '../common/FormSelect';

const StudentForm = ({ initialData, onClose, onRefresh }) => {
  const [formData, setFormData] = useState({ 
    fullName: '', email: '', password: '', phone: '', 
    gender: 'Male', aadhaarNumber: '',
    studyId: `SP-${Math.floor(1000 + Math.random() * 9000)}`, 
    course: '', monthlyFee: 1500, seat: '', 
    securityDeposit: 0, status: 'Active' 
  });
  
  useEffect(() => { 
    if (initialData) {
      setFormData({ ...initialData, password: '' }); 
    } else {
      setFormData({ 
        fullName: '', email: '', password: '', phone: '', 
        gender: 'Male', aadhaarNumber: '',
        studyId: `SP-${Math.floor(1000 + Math.random() * 9000)}`, 
        course: '', monthlyFee: 1500, seat: '', 
        securityDeposit: 0, status: 'Active' 
      });
    }
  }, [initialData]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = { 
        ...formData, 
        monthlyFee: Number(formData.monthlyFee), 
        securityDeposit: Number(formData.securityDeposit) 
      };
      if (initialData) {
        if (!payload.password) delete payload.password;
        await axios.patch(`${API_URL}/students/${initialData._id}`, payload);
      } else {
        await axios.post(`${API_URL}/students`, { ...payload, dueAmount: payload.monthlyFee });
        
        const message = `*STUDY HUB ENROLLMENT SUCCESS*\n\nDear ${payload.fullName},\n\nYour enrollment is complete. Use the credentials below to access your portal:\n\n*Study ID:* ${payload.studyId}\n*Password:* ${payload.password}\n\n*Portal URL:* https://studentsstudyhub.vercel.app\n\nWelcome to Study Hub!`;
        
        let phone = payload.phone.replace(/\D/g, '');
        if (phone.length === 10) phone = `91${phone}`;
        
        const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(waUrl, '_blank');
      }
      onRefresh(); onClose();
    } catch (err) { 
      console.error('Student Operation Failed:', err);
      alert(err.response?.data?.message || 'Operation failed - Check server connection'); 
    } 
    finally { setIsSubmitting(false); }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#020617]/95 backdrop-blur-3xl animate-in fade-in duration-500">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full"></div>
        </div>
        
        <Card className="w-full max-w-4xl border-white/5 bg-slate-900/40 relative overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button onClick={onClose} className="absolute top-8 right-8 p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-slate-400 hover:text-white z-50 group border border-white/5">
                <X size={24} className="group-hover:rotate-90 transition-transform duration-500" />
            </button>

            <div className="p-4 lg:p-6">
                <div className="flex items-center gap-4 lg:gap-5 mb-10 lg:mb-12">
                    <div className="w-12 h-12 lg:w-14 lg:h-14 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                        {initialData ? <FileEdit className="text-white" size={24} lg:size={28} /> : <Plus className="text-white" size={24} lg:size={28} />}
                    </div>
                    <div>
                        <h3 className="text-xl lg:text-3xl font-black text-white uppercase tracking-tighter">{initialData ? 'Update Profile' : 'New Enrollment'}</h3>
                        <p className="text-[9px] lg:text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-1">{initialData ? 'Modify existing student record' : 'Register a new student to the system'}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-12">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-1 h-4 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Personal Intelligence</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <FormInput label="Full Name" icon={User} value={formData.fullName} onChange={v => setFormData({...formData, fullName: v})} required />
                            <FormInput label="Email ID" icon={Mail} value={formData.email} onChange={v => setFormData({...formData, email: v})} required type="email" />
                            <FormInput label="Contact No" icon={Phone} value={formData.phone} onChange={v => setFormData({...formData, phone: v})} required type="tel" />
                            <FormSelect label="Gender" icon={User} value={formData.gender} onChange={v => setFormData({...formData, gender: v})} options={['Male', 'Female', 'Other']} />
                            <FormInput label="Aadhaar ID" icon={ShieldCheck} value={formData.aadhaarNumber} onChange={v => setFormData({...formData, aadhaarNumber: v})} required />
                            <FormInput label="Current Course" icon={Monitor} value={formData.course} onChange={v => setFormData({...formData, course: v})} required />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-1 h-4 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Institutional Data</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <FormInput label="Study ID" icon={QrCode} value={formData.studyId} onChange={v => setFormData({...formData, studyId: v.toUpperCase()})} required />
                            <FormInput label="Seat Assignment" icon={Map} value={formData.seat} onChange={v => setFormData({...formData, seat: v.toUpperCase()})} required placeholder="e.g., A1" />
                            <FormSelect label="Enrollment Status" icon={Activity} value={formData.status} onChange={v => setFormData({...formData, status: v})} options={['Active', 'Inactive']} />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-1 h-4 bg-rose-500 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.5)]"></div>
                            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Financial Configuration</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <FormInput label="Monthly Fee (INR)" icon={CreditCard} value={formData.monthlyFee} onChange={v => setFormData({...formData, monthlyFee: v})} required type="number" />
                            <FormInput label="Security Deposit" icon={ShieldCheck} value={formData.securityDeposit} onChange={v => setFormData({...formData, securityDeposit: v})} type="number" />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-1 h-4 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Security Protocol</h4>
                        </div>
                        <FormInput 
                            label={initialData ? "Reset Protocol (Leave blank to keep current)" : "Access Password"} 
                            icon={Lock} 
                            value={formData.password} 
                            onChange={v => setFormData({...formData, password: v})} 
                            type="password" 
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="pt-10">
                        <button 
                            disabled={isSubmitting} 
                            className="w-full py-6 rounded-[2rem] bg-emerald-600 text-white font-black text-xs uppercase tracking-[0.5em] shadow-2xl shadow-emerald-500/20 hover:bg-emerald-500 hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:translate-y-0"
                        >
                            {isSubmitting ? 'SYNCHRONIZING DATA...' : initialData ? 'VERIFY & UPDATE RECORD' : 'AUTHORIZE NEW ENROLLMENT'}
                        </button>
                    </div>
                </form>
            </div>
        </Card>
    </div>
  );
};

export default StudentForm;
