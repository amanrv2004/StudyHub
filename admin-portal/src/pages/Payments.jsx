import React, { useState } from 'react';
import { DollarSign, MessageCircle } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../services/api';
import Card from '../components/common/Card';
import Pagination from '../components/common/Pagination';

function Payments({ students, onCollect }) {
    const [showDueOnly, setShowDueOnly] = useState(false);
    const [page, setPage] = useState(1);
    const itemsPerPage = 7;

    const filteredStudents = students.filter(s => {
        const matchesDue = showDueOnly ? (s.dueAmount || 0) > 0 : true;
        return matchesDue;
    });

    const paginatedStudents = filteredStudents.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    const sendReminder = (s) => {
        if ((s.dueAmount || 0) <= 0) return alert('No outstanding balance.');
        
        const message = `Dear ${s.fullName || 'Student'}, your pending fee is Rs.${(s.dueAmount || 0).toLocaleString()}. Please clear it soon. Thank you!`;
        
        let phone = (s.phone || '').replace(/\D/g, '');
        if (!phone) return alert('No phone number available for this student.');
        if (phone.length === 10) phone = `91${phone}`;
        
        const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(waUrl, '_blank');

        axios.post(`${API_URL}/notifications`, { 
            title: 'Fee Reminder', 
            message, 
            recipient: s.studyId, 
            type: 'Fee Reminder' 
        }).catch(err => console.error('Internal notification failed', err));
    };

    return (
        <Card noPadding className="border-emerald-500/10">
           <div className="p-6 lg:p-8 border-b border-white/5 bg-slate-950/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h3 className="text-xs lg:text-sm font-black text-white uppercase tracking-widest">Fee Records</h3>
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                 <button 
                    onClick={() => { setShowDueOnly(!showDueOnly); setPage(1); }}
                    className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${showDueOnly ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' : 'bg-slate-900/50 text-slate-500 border-white/10 hover:border-white/20'}`}
                 >
                    {showDueOnly ? 'Showing Due Only' : 'Show Due Only'}
                 </button>
              </div>
           </div>
           <div className="overflow-x-auto custom-scrollbar">
               <table className="w-full text-left min-w-[750px] lg:min-w-[800px]">
                   <thead className="text-[9px] lg:text-[10px] text-slate-500 uppercase tracking-widest font-black bg-slate-950/30 border-b border-white/5">
                       <tr>
                           <th className="px-4 lg:px-10 py-4 lg:py-6">Student</th>
                           <th className="px-4 lg:px-10 py-4 lg:py-6">Fee</th>
                           <th className="px-4 lg:px-10 py-4 lg:py-6">Paid</th>
                           <th className="px-4 lg:px-10 py-4 lg:py-6">Due</th>
                           <th className="px-4 lg:px-10 py-4 lg:py-6">Mode</th>
                           <th className="px-4 lg:px-10 py-4 lg:py-6 text-right">Actions</th>
                       </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                       {paginatedStudents.map(s => (
                           <tr key={s._id} className="hover:bg-white/[0.03] transition-colors group text-[11px] lg:text-sm font-black">
                               <td className="px-4 lg:px-10 py-4 lg:py-6">
                                   <p className="text-white uppercase truncate max-w-[120px] lg:max-w-[150px]">{s.fullName || 'Unnamed'}</p>
                                   <p className="text-[8px] lg:text-[9px] text-slate-500 uppercase">{s.studyId || 'No ID'}</p>
                               </td>
                               <td className="px-4 lg:px-10 py-4 lg:py-6 text-slate-300">₹{s.monthlyFee || 0}</td>
                               <td className="px-4 lg:px-10 py-4 lg:py-6 text-emerald-400">₹{s.paidAmount || 0}</td>
                               <td className="px-4 lg:px-10 py-4 lg:py-6 text-rose-400 font-mono">₹{s.dueAmount || 0}</td>
                               <td className="px-4 lg:px-10 py-4 lg:py-6 text-slate-500 uppercase text-[9px] lg:text-[10px]">{s.lastPaymentMode || '--'}</td>
                               <td className="px-4 lg:px-10 py-4 lg:py-6 text-right flex justify-end gap-1">
                                   <button onClick={() => onCollect(s)} className="p-1.5 lg:p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-xl transition-all"><DollarSign size={16} /></button>
                                   <button onClick={() => sendReminder(s)} className="p-1.5 lg:p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-xl transition-all"><MessageCircle size={16} /></button>
                               </td>
                           </tr>
                       ))}
                   </tbody>
               </table>
           </div>
           <Pagination 
                totalItems={filteredStudents.length} 
                itemsPerPage={itemsPerPage} 
                currentPage={page} 
                onPageChange={setPage} 
            />
        </Card>
    );
}

export default Payments;
