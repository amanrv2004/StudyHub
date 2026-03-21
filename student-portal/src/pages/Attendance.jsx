import React from 'react';
import { Activity, Clock, ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react';
import Card from '../components/common/Card';
import AttendanceCalendar from '../components/AttendanceCalendar';

function Attendance({ student, attendanceHistory }) {
    return (
        <div className="space-y-10">
            <AttendanceCalendar history={attendanceHistory} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <Card className="bg-slate-900/40 border-white/5 h-full">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-3xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-xl shadow-blue-500/5">
                            <Activity size={28} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter">Consistency Metric</h3>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Real-time attendance performance analytics</p>
                        </div>
                    </div>
                    <div className="mt-10 space-y-6">
                        <div className="p-6 rounded-2xl bg-slate-950/60 border border-white/5">
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Presence This Month</p>
                            <p className="text-3xl font-black text-white">
                                {(() => {
                                    const now = new Date();
                                    return new Set(attendanceHistory.filter(log => {
                                        if (!log.date) return false;
                                        const [d, m, y] = log.date.split(' ');
                                        const logDate = new Date(`${m} ${d} ${y}`);
                                        return logDate.getMonth() === now.getMonth() && logDate.getFullYear() === now.getFullYear();
                                    }).map(l => l.date)).size;
                                })()} Days
                            </p>
                        </div>
                        <div className="p-6 rounded-2xl bg-slate-950/60 border border-white/5">
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Last Active</p>
                            <p className="text-xl font-black text-blue-400 truncate">{student.lastCheckIn || '--'}</p>
                        </div>
                    </div>
                </Card>

                <Card className="bg-slate-900/40 border-white/5 h-full flex flex-col">
                    <div className="flex items-center gap-6 mb-10">
                        <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20 shadow-xl shadow-emerald-500/5">
                            <Clock size={28} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter">Activity Log</h3>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Your recent check-in/out history</p>
                        </div>
                    </div>
                    
                    <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar max-h-[300px] lg:max-h-[400px] pr-1 lg:pr-2">
                        {attendanceHistory.map((log, idx) => (
                            <div key={idx} className="p-3 lg:p-4 rounded-xl lg:rounded-2xl bg-slate-950/40 border border-white/5 flex items-center justify-between group hover:border-emerald-500/20 transition-all">
                                <div className="flex items-center gap-3 lg:gap-4">
                                    <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-2xl flex items-center justify-center transition-all ${log.type === 'Check-In' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                        {log.type === 'Check-In' ? <ArrowUpRight size={14} lg:size={18} /> : <ArrowDownRight size={14} lg:size={18} />}
                                    </div>
                                    <div>
                                        <p className="text-[10px] lg:text-xs font-black text-white uppercase tracking-tighter">{log.type}</p>
                                        <div className="flex items-center gap-1.5 lg:gap-2 mt-0.5">
                                            <Calendar size={10} className="text-slate-600" />
                                            <p className="text-[8px] lg:text-[9px] text-slate-500 font-bold uppercase">{log.date}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[11px] lg:text-sm font-black text-slate-400 font-mono">{log.time}</p>
                                </div>
                            </div>
                        ))}
                        {attendanceHistory.length === 0 && (
                            <div className="p-10 text-center">
                                <p className="text-xs text-slate-600 font-black uppercase tracking-widest">No activity history found</p>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default Attendance;
