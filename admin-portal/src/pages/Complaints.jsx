import React, { useState } from 'react';
import { MessageSquare, Trash2, CheckSquare, Square, X } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../services/api';
import Card from '../components/common/Card';
import Pagination from '../components/common/Pagination';

function Complaints({ complaints, onRefresh }) {
    const [page, setPage] = useState(1);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const itemsPerPage = 7;

    const updateStatus = async (id, status) => { 
        try { 
            await axios.patch(`${API_URL}/complaints/${id}`, { status }); 
            onRefresh(); 
        } catch (err) {} 
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this request?')) return;
        try {
            await axios.delete(`${API_URL}/complaints/${id}`);
            onRefresh();
        } catch (err) {
            alert('Delete failed');
        }
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;
        if (!window.confirm(`Delete ${selectedIds.length} selected requests?`)) return;
        try {
            await Promise.all(selectedIds.map(id => axios.delete(`${API_URL}/complaints/${id}`)));
            setSelectedIds([]);
            setIsSelectionMode(false);
            onRefresh();
        } catch (err) {
            alert('Bulk delete failed');
        }
    };

    const toggleSelect = (id) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        const pageIds = paginatedComplaints.map(c => c._id);
        const allSelected = pageIds.every(id => selectedIds.includes(id));
        
        if (allSelected) {
            setSelectedIds(prev => prev.filter(id => !pageIds.includes(id)));
        } else {
            setSelectedIds(prev => [...new Set([...prev, ...pageIds])]);
        }
    };

    const paginatedComplaints = complaints.slice((page - 1) * itemsPerPage, page * itemsPerPage);
    const isAllSelected = paginatedComplaints.length > 0 && paginatedComplaints.every(c => selectedIds.includes(c._id));

    return (
        <Card noPadding className="border-blue-500/10 animate-in fade-in duration-700">
            <div className="p-6 lg:p-8 border-b border-white/5 bg-slate-950/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                    {isSelectionMode && (
                        <button 
                            onClick={toggleSelectAll}
                            className="p-2 hover:bg-white/5 rounded-xl transition-all text-slate-500 hover:text-white"
                            title="Select All on Page"
                        >
                            {isAllSelected ? <CheckSquare size={20} className="text-blue-500" /> : <Square size={20} />}
                        </button>
                    )}
                    <h3 className="text-xs lg:text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
                        <MessageSquare className="text-blue-500" size={18} /> Student Requests
                        {isSelectionMode && selectedIds.length > 0 && (
                            <span className="ml-2 px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg text-[9px]">
                                {selectedIds.length} Selected
                            </span>
                        )}
                    </h3>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    {!isSelectionMode ? (
                        complaints.length > 0 && (
                            <button 
                                onClick={() => setIsSelectionMode(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-white/10 text-slate-400 text-[10px] font-black uppercase rounded-xl hover:bg-white/5 hover:text-white transition-all"
                            >
                                <Trash2 size={14} /> Bulk Delete
                            </button>
                        )
                    ) : (
                        <>
                            <button 
                                onClick={handleBulkDelete}
                                disabled={selectedIds.length === 0}
                                className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase rounded-xl transition-all disabled:opacity-50"
                            >
                                <Trash2 size={14} /> Delete {selectedIds.length > 0 ? selectedIds.length : ''}
                            </button>
                            <button 
                                onClick={() => { setIsSelectionMode(false); setSelectedIds([]); }}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-white/10 text-slate-400 text-[10px] font-black uppercase rounded-xl hover:bg-white/5 hover:text-white transition-all"
                            >
                                <X size={14} /> Cancel
                            </button>
                        </>
                    )}
                </div>
            </div>
            
            <div className="divide-y divide-white/5">
                {paginatedComplaints.map(c => (
                    <div key={c._id} className={`p-6 lg:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/[0.02] transition-all group ${selectedIds.includes(c._id) ? 'bg-blue-500/[0.03]' : ''}`}>
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                            {isSelectionMode && (
                                <button 
                                    onClick={() => toggleSelect(c._id)}
                                    className={`mt-1 p-1 rounded-lg transition-all ${selectedIds.includes(c._id) ? 'text-blue-500' : 'text-slate-600 group-hover:text-slate-400'}`}
                                >
                                    {selectedIds.includes(c._id) ? <CheckSquare size={18} /> : <Square size={18} />}
                                </button>
                            )}
                            
                            <div className="space-y-2 min-w-0 flex-1">
                                <div className="flex items-center gap-3">
                                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase border shrink-0 ${c.type === 'Complaint' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>{c.type}</span>
                                    <p className="text-xs lg:text-sm font-black text-white uppercase truncate">{c.subject}</p>
                                </div>
                                <p className="text-[10px] lg:text-xs text-slate-400 font-bold truncate lg:whitespace-normal">{c.message}</p>
                                <p className="text-[8px] lg:text-[10px] text-slate-600 font-black uppercase tracking-widest">By {c.studentName || 'Unknown Student'} • {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Unknown Date'}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4 shrink-0 md:justify-end">
                            <select 
                                className={`bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-[9px] lg:text-[10px] font-black uppercase outline-none ${c.status === 'Resolved' ? 'text-emerald-400' : 'text-amber-400'}`} 
                                value={c.status} 
                                onChange={(e) => updateStatus(c._id, e.target.value)}
                            >
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Resolved">Resolved</option>
                            </select>
                            
                            {!isSelectionMode && (
                                <button 
                                    onClick={() => handleDelete(c._id)}
                                    className="p-2 lg:p-3 text-slate-600 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100"
                                    title="Delete Request"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                {complaints.length === 0 && <div className="p-10 lg:p-20 text-center text-slate-600 uppercase font-black tracking-widest text-xs">No active requests</div>}
            </div>
            <Pagination 
                totalItems={complaints.length} 
                itemsPerPage={itemsPerPage} 
                currentPage={page} 
                onPageChange={(p) => { setPage(p); setSelectedIds([]); }} 
            />
        </Card>
    );
}

export default Complaints;
