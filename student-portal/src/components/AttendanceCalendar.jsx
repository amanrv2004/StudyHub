import React, { useState } from 'react';
import { Calendar, ChevronRight, History } from 'lucide-react';
import Card from './common/Card';

function AttendanceCalendar({ history }) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    
    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const startDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const totalDays = daysInMonth(year, month);
    const startDay = startDayOfMonth(year, month);

    const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

    const attendanceDays = history.reduce((acc, log) => {
        if (!log.date) return acc;
        const [d, m, y] = log.date.split(' ');
        const logDate = new Date(`${m} ${d} ${y}`);
        if (logDate.getMonth() === month && logDate.getFullYear() === year) {
            acc[parseInt(d)] = true;
        }
        return acc;
    }, {});

    const days = [];
    for (let i = 0; i < startDay; i++) days.push(null);
    for (let i = 1; i <= totalDays; i++) days.push(i);

    const monthName = currentMonth.toLocaleString('default', { month: 'long' });

    return (
        <Card className="bg-slate-900/40 border-white/5">
            <div className="flex items-center justify-between mb-8">
                <h4 className="text-xs font-black text-white uppercase tracking-[0.25em] flex items-center gap-3">
                    <Calendar className="text-blue-400" size={18} /> Attendance Log
                </h4>
                <div className="flex items-center gap-4">
                    <button onClick={prevMonth} className="p-2 hover:bg-white/5 rounded-xl transition-all text-slate-500 hover:text-white"><ChevronRight className="rotate-180" size={16} /></button>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest min-w-[100px] text-center">{monthName} {year}</span>
                    <button onClick={nextMonth} className="p-2 hover:bg-white/5 rounded-xl transition-all text-slate-500 hover:text-white"><ChevronRight size={16} /></button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} className="text-center text-[8px] font-black text-slate-600 uppercase tracking-widest">{d}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
                {days.map((day, i) => (
                    <div key={i} className={`aspect-square rounded-xl flex items-center justify-center text-[10px] font-black transition-all ${!day ? 'bg-transparent' : attendanceDays[day] ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-slate-950/40 text-slate-600 border border-white/5'}`}>
                        {day}
                    </div>
                ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <span className="text-[8px] font-black text-slate-500 uppercase">Present</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-slate-800"></div>
                        <span className="text-[8px] font-black text-slate-500 uppercase">Absent</span>
                    </div>
                </div>
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Selected Month: {Object.keys(attendanceDays).length} Days</p>
            </div>

            <div className="mt-12 pt-10 border-t border-white/5">
                <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                    <History className="text-blue-400" size={16} /> Monthly Performance History
                </h4>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="text-[9px] text-slate-500 uppercase tracking-widest font-black border-b border-white/5">
                            <tr>
                                <th className="px-2 py-4">Month Name</th>
                                <th className="px-2 py-4 text-center">Total Attendance</th>
                                <th className="px-2 py-4 text-right">Percentage</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {(() => {
                                const months = {};
                                history.forEach(log => {
                                    if (!log.date) return;
                                    const [d, m, y] = log.date.split(' ');
                                    const key = `${m} ${y}`;
                                    if (!months[key]) months[key] = new Set();
                                    months[key].add(d);
                                });

                                return Object.entries(months).map(([monthKey, days]) => {
                                    const [mName, yStr] = monthKey.split(' ');
                                    const year = parseInt(yStr);
                                    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
                                    const mIdx = monthNames.indexOf(mName.toUpperCase());
                                    
                                    const now = new Date();
                                    const isCurrentMonth = now.getMonth() === mIdx && now.getFullYear() === year;
                                    
                                    const totalDaysInMonth = new Date(year, mIdx + 1, 0).getDate();
                                    const percentage = Math.round((days.size / totalDaysInMonth) * 100);
                                    
                                    return (
                                        <tr key={monthKey} className="text-xs font-bold hover:bg-white/5 transition-all">
                                            <td className="px-2 py-5 text-white uppercase font-black">{monthKey} {isCurrentMonth && <span className="ml-2 text-[7px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-md">Current</span>}</td>
                                            <td className="px-2 py-5 text-center text-blue-400 font-mono">{days.size} Days</td>
                                            <td className="px-2 py-5 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <span className={`text-[10px] font-mono font-black ${percentage >= 75 ? 'text-emerald-400' : 'text-amber-400'}`}>{percentage}%</span>
                                                    <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden">
                                                        <div className={`h-full ${percentage >= 75 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${Math.min(percentage, 100)}%` }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                });
                            })()}
                        </tbody>
                    </table>
                </div>
            </div>
        </Card>
    );
}

export default AttendanceCalendar;
