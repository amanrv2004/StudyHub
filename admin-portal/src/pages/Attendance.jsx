import React, { useState } from 'react';
import { Clock, Search, Filter, ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react';
import Card from '../components/common/Card';
import Pagination from '../components/common/Pagination';

function Attendance({ attendance }) {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchName] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');
    const itemsPerPage = 10;

    const filteredAttendance = attendance.filter(log => {
        const matchesName = log.studentName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === 'All' || log.type === typeFilter;
        return matchesName && matchesType;
    });

    const paginatedAttendance = filteredAttendance.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    const checkIns = attendance.filter(a => a.type === 'Check-In').length;
    const checkOuts = attendance.filter(a => a.type === 'Check-Out').length;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
                <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-emerald-600/10 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-500/20 shadow-xl shadow-emerald-500/5">
                        <Clock size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h3 className="text-xl lg:text-2xl font-black text-white uppercase tracking-tighter">Attendance Registry</h3>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Real-time student activity logs</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                        <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest mb-0.5">Total Check-ins</p>
                        <p className="text-sm font-black text-white">{checkIns}</p>
                    </div>
                    <div className="px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                        <p className="text-[8px] font-black text-rose-500 uppercase tracking-widest mb-0.5">Total Check-outs</p>
                        <p className="text-sm font-black text-white">{checkOuts}</p>
                    </div>
                </div>
            </div>

            <Card noPadding className="border-white/5 bg-slate-900/40 backdrop-blur-3xl overflow-hidden">
                <div className="p-6 lg:p-8 border-b border-white/5 bg-slate-950/20 flex flex-col md:flex-row gap-6 justify-between items-center">
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search Student Name..." 
                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-xs font-bold text-white outline-none focus:border-emerald-500/50 transition-all placeholder:text-slate-600"
                            value={searchTerm}
                            onChange={(e) => { setSearchName(e.target.value); setPage(1); }}
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="flex items-center gap-2 bg-slate-900/50 border border-white/10 rounded-xl p-1 shrink-0">
                            {['All', 'Check-In', 'Check-Out'].map(t => (
                                <button 
                                    key={t}
                                    onClick={() => { setTypeFilter(t); setPage(1); }}
                                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${typeFilter === t ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-500 hover:text-white'}`}
                                >
                                    {t === 'All' ? 'Full View' : t}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[650px] lg:min-w-[800px]">
                        <thead>
                            <tr className="bg-slate-950/40 border-b border-white/5">
                                <th className="p-4 lg:p-6 text-[9px] lg:text-[10px] font-black text-slate-500 uppercase tracking-widest">Student Information</th>
                                <th className="p-4 lg:p-6 text-[9px] lg:text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Seat</th>
                                <th className="p-4 lg:p-6 text-[9px] lg:text-[10px] font-black text-slate-500 uppercase tracking-widest">Activity Type</th>
                                <th className="p-4 lg:p-6 text-[9px] lg:text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {paginatedAttendance.map((log, idx) => (
                                <tr key={idx} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="p-4 lg:p-6">
                                        <p className="text-[11px] lg:text-sm font-black text-white uppercase tracking-tighter group-hover:text-emerald-400 transition-colors truncate max-w-[120px] lg:max-w-none">{log.studentName}</p>
                                        <p className="text-[7px] lg:text-[9px] text-slate-500 font-bold uppercase mt-1 tracking-widest">Active Member</p>
                                    </td>
                                    <td className="p-4 lg:p-6 text-center">
                                        <span className="px-2 lg:px-3 py-0.5 lg:py-1 rounded-lg bg-slate-900 border border-white/5 text-[9px] lg:text-[10px] font-mono font-black text-slate-400">
                                            {log.seatNumber || '--'}
                                        </span>
                                    </td>
                                    <td className="p-4 lg:p-6">
                                        <div className="flex items-center gap-2 lg:gap-3">
                                            <div className={`w-7 h-7 lg:w-8 lg:h-8 rounded-lg lg:rounded-xl flex items-center justify-center ${log.type === 'Check-In' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'}`}>
                                                {log.type === 'Check-In' ? <ArrowUpRight size={12} lg:size={14} /> : <ArrowDownRight size={12} lg:size={14} />}
                                            </div>
                                            <span className={`text-[9px] lg:text-[10px] font-black uppercase tracking-widest ${log.type === 'Check-In' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                {log.type}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4 lg:p-6 text-right font-mono">
                                        <p className="text-[10px] lg:text-xs font-black text-white">{log.time}</p>
                                        <p className="text-[7px] lg:text-[9px] text-slate-600 font-bold mt-1 flex items-center justify-end gap-1"><Calendar size={10} /> {log.date}</p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredAttendance.length === 0 && (
                    <div className="p-20 text-center">
                        <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-slate-700 mx-auto mb-6 border border-white/5">
                            <Clock size={32} />
                        </div>
                        <p className="text-xs text-slate-500 uppercase font-black tracking-widest">No activity logs found</p>
                    </div>
                )}

                <Pagination 
                    totalItems={filteredAttendance.length} 
                    itemsPerPage={itemsPerPage} 
                    currentPage={page} 
                    onPageChange={setPage} 
                />
            </Card>
        </div>
    );
}

export default Attendance;
