import React from 'react';
import { MessageSquare, Plus, Trash2 } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../services/api';
import Card from '../components/common/Card';
import Pagination from '../components/common/Pagination';

function Support({ complaints, fetchComplaints, setShowComplaintForm, supportPage, setSupportPage }) {
    return (
        <div className="space-y-10">
            <Card className="bg-slate-900/40 border-white/5">
                <div className="flex justify-between items-center mb-10">
                    <h4 className="text-xs font-black text-white uppercase tracking-[0.25em] flex items-center gap-3">
                        <MessageSquare className="text-blue-400" size={18} /> Support Center
                    </h4>
                    <button onClick={() => setShowComplaintForm(true)} className="px-4 md:px-6 py-2 rounded-xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all flex items-center gap-2 shadow-xl shadow-blue-500/20">
                        <Plus size={14} /> <span className="hidden sm:inline">New Request</span><span className="sm:hidden">New</span>
                    </button>
                </div>
                <div className="space-y-4 lg:space-y-6">
                    {complaints.slice((supportPage - 1) * 8, supportPage * 8).map(c => (
                        <div key={c._id} className="p-4 lg:p-6 rounded-xl lg:rounded-2xl bg-slate-950/60 border border-white/5 flex flex-col md:flex-row md:justify-between md:items-center gap-4 lg:gap-6 group hover:border-blue-500/30 transition-all">
                            <div className="flex-1">
                                <p className="text-[13px] lg:text-sm font-black text-white uppercase truncate max-w-[250px] lg:max-w-none">{c.subject}</p>
                                <p className="text-[10px] lg:text-[11px] text-slate-500 mt-1 font-bold line-clamp-2 lg:line-clamp-none">{c.message}</p>
                                <p className="text-[8px] lg:text-[9px] text-slate-600 mt-2 uppercase font-black tracking-widest">{new Date(c.createdAt).toLocaleDateString()} • {c.type}</p>
                            </div>
                            <div className="flex items-center justify-between md:justify-end gap-3 lg:gap-4">
                                <div className={`px-2 lg:px-3 py-1 rounded-full text-[8px] lg:text-[9px] font-black uppercase border ${c.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                                    {c.status}
                                </div>
                                <button 
                                    onClick={async () => { 
                                        if (window.confirm('Delete or cancel this request?')) { 
                                            try { 
                                                await axios.delete(`${API_URL}/complaints/${c._id}`); 
                                                fetchComplaints(); 
                                            } catch (_) { 
                                                alert('Delete failed'); 
                                            } 
                                        } 
                                    }} 
                                    className="p-1.5 lg:p-2 text-slate-500 hover:text-rose-500 transition-all"
                                    title="Delete Request"
                                >
                                    <Trash2 size={14} lg:size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {complaints.length === 0 && <p className="text-xs text-slate-600 italic uppercase font-black text-center py-10">No requests sent yet</p>}
                </div>
                <Pagination 
                    totalItems={complaints.length} 
                    itemsPerPage={8} 
                    currentPage={supportPage} 
                    onPageChange={setSupportPage} 
                />
            </Card>
        </div>
    );
}

export default Support;
