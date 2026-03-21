import React, { useState } from 'react';
import { Calendar, ChevronRight, ChevronLeft } from 'lucide-react';
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

    const now = new Date();
    const isThisMonth = now.getMonth() === month && now.getFullYear() === year;
    const today = now.getDate();

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
        <Card noPadding className="bg-slate-900/20 border-white/5 overflow-hidden">
            <div className="p-4 border-b border-white/5 bg-slate-950/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                        <Calendar size={14} />
                    </div>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Attendance</span>
                </div>
                <div>
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">{monthName}</span>
                </div>
            </div>

            <div className="p-4">
                <div className="grid grid-cols-7 gap-1 mb-3">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                        <div key={d} className="text-center text-[7px] font-black text-slate-600 uppercase py-1">{d}</div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {days.map((day, i) => {
                        const isPresent = day && attendanceDays[day];
                        const isToday = isThisMonth && day === today;
                        
                        return (
                            <div 
                                key={i} 
                                className={`aspect-square rounded-lg flex flex-col items-center justify-center text-[9px] font-black transition-all relative
                                    ${!day ? 'bg-transparent' : 
                                      isPresent ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 
                                      'bg-slate-950/40 text-slate-600 border border-white/5 hover:border-white/10'}
                                    ${isToday && !isPresent ? 'border-blue-500/50 text-blue-400' : ''}
                                `}
                            >
                                {day}
                                {isToday && (
                                    <div className={`absolute bottom-1 w-1 h-1 rounded-full ${isPresent ? 'bg-white' : 'bg-blue-500'}`}></div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                            <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Present</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-slate-800"></div>
                            <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Absent</span>
                        </div>
                    </div>
                    <div className="px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                        <p className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">{Object.keys(attendanceDays).length} Days Marked</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">
                    <button 
                        onClick={prevMonth}
                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all text-[9px] font-black text-slate-400 hover:text-white uppercase tracking-widest"
                    >
                        <ChevronLeft size={14} /> Previous
                    </button>
                    <button 
                        onClick={nextMonth}
                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all text-[9px] font-black text-slate-400 hover:text-white uppercase tracking-widest"
                    >
                        Next <ChevronRight size={14} />
                    </button>
                </div>
            </div>
        </Card>
    );
}

export default AttendanceCalendar;
