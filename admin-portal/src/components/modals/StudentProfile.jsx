import React from 'react';
import { X, FileEdit, ShieldCheck, User, Phone, Mail, Activity, Map, Calendar, CreditCard, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import ProfileDataBox from '../common/ProfileDataBox';
import AttendanceCalendar from '../AttendanceCalendar';

function StudentProfile({ student, onClose, onEdit, attendance = [] }) {
    if (!student) return null;

    const studentAttendance = attendance.filter(a => a.studentId === student._id);

    return (
        <div className="fixed inset-0 z-[150] flex items-start justify-center p-0 lg:p-10 bg-[#020617]/95 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-500 overflow-y-auto custom-scrollbar">
            <div className="absolute inset-0 overflow-hidden pointer-events-none fixed">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full"></div>
            </div>

            <Card noPadding className="w-full max-w-5xl border-white/5 bg-slate-900/40 relative overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] my-auto lg:my-0 rounded-none lg:rounded-[2rem]">
                <div className="absolute top-4 right-4 lg:top-8 lg:right-8 flex items-center gap-2 lg:gap-3 z-50">
                    <button onClick={() => { onEdit(student); onClose(); }} className="flex items-center gap-2 px-3 py-1.5 lg:px-4 lg:py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-xl text-emerald-400 text-[8px] lg:text-[10px] font-black uppercase tracking-widest transition-all group">
                        <FileEdit size={12} lg:size={14} className="group-hover:scale-110 transition-transform" /> Modify
                    </button>
                    <button onClick={onClose} className="p-2 lg:p-3 bg-white/5 hover:bg-white/10 rounded-xl lg:rounded-2xl transition-all text-slate-400 hover:text-white group border border-white/5">
                        <X size={20} lg:size={24} className="group-hover:rotate-90 transition-transform duration-500" />
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0 p-4 lg:p-12 pt-16 lg:pt-12">
                    <div className="lg:col-span-4 space-y-6 lg:space-y-8 lg:border-r lg:border-white/5 lg:pr-12">
                        <div className="text-center">
                            <div className="relative inline-block mb-6 lg:mb-8">
                                <div className="w-28 h-28 lg:w-40 lg:h-40 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-[2.5rem] lg:rounded-[3rem] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20 transform rotate-3 hover:rotate-0 transition-transform duration-700">
                                    <span className="text-4xl lg:text-6xl font-black text-white drop-shadow-2xl">{student.fullName?.charAt(0)}</span>
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-10 h-10 lg:w-12 lg:h-12 bg-[#020617] border-4 border-[#0a0f1d] rounded-2xl flex items-center justify-center text-emerald-500 shadow-xl">
                                    <ShieldCheck size={18} lg:size={22} strokeWidth={2.5} />
                                </div>
                            </div>
                            <h3 className="text-xl lg:text-3xl font-black text-white uppercase tracking-tighter mb-2">{student.fullName}</h3>
                            <div className="flex flex-col items-center gap-3">
                                <Badge>{student.status}</Badge>
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mt-1">ID: {student.studyId}</p>
                            </div>
                        </div>

                        <div className="space-y-4 pt-8 border-t border-white/5">
                            <div className="p-6 rounded-3xl bg-slate-950/40 border border-white/5 text-center">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Attendance Score</p>
                                <div className="relative inline-flex items-center justify-center">
                                    <svg className="w-24 h-24 transform -rotate-90">
                                        <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                                        <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * (student.attendancePercentage || 0)) / 100} className="text-emerald-500 transition-all duration-1000" />
                                    </svg>
                                    <span className="absolute text-xl font-black text-white">{student.attendancePercentage || 0}%</span>
                                </div>
                                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-4">{student.daysAttendedThisMonth || 0} Days Present This Month</p>
                                <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mt-2 mb-8 italic">Last Seen: {student.lastCheckIn || '--'}</p>
                                
                                <div className="text-left">
                                    <AttendanceCalendar history={studentAttendance} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-8 pt-10 border-t border-white/5 lg:border-t-0 lg:pt-0">
                        <div className="mb-10">
                            <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-2">Student Dossier</h4>
                            <h2 className="text-2xl lg:text-3xl font-black text-white uppercase tracking-tighter">Detailed Credentials</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ProfileDataBox icon={User} label="Gender" value={student.gender} />
                            <ProfileDataBox icon={ShieldCheck} label="Aadhaar ID" value={student.aadhaarNumber} />
                            <ProfileDataBox icon={Phone} label="Primary Contact" value={student.phone} />
                            <ProfileDataBox icon={Mail} label="Secure Email" value={student.email} />
                            <ProfileDataBox icon={Activity} label="Attendance" value={`${student.attendancePercentage || 0}% (${student.daysAttendedThisMonth || 0} Days)`} />
                            <ProfileDataBox icon={Map} label="Library Seat" value={`Station ${student.seat}`} />
                            <ProfileDataBox icon={Calendar} label="Date Enrolled" value={student.joiningDate ? new Date(student.joiningDate).toLocaleDateString() : 'N/A'} />
                            </div>

                            <div className="mt-10 pt-10 border-t border-white/5">

                            <div className="flex items-center justify-between mb-8">
                                <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                                    <CreditCard className="text-emerald-500" size={16} /> Financial Integrity
                                </h4>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div className="p-6 rounded-[2rem] bg-slate-950/40 border border-white/5">
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Monthly Subscription</p>
                                    <p className="text-xl font-black text-white font-mono">₹{student.monthlyFee?.toLocaleString()}</p>
                                </div>
                                <div className="p-6 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10">
                                    <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-2">Total Contributed</p>
                                    <p className="text-xl font-black text-emerald-400 font-mono">₹{student.paidAmount?.toLocaleString()}</p>
                                </div>
                                <div className="p-6 rounded-[2rem] bg-rose-500/5 border border-rose-500/10">
                                    <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest mb-2">Outstanding Due</p>
                                    <p className="text-xl font-black text-rose-400 font-mono">₹{student.dueAmount?.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 pt-10 border-t border-white/5">
                            <div className="flex items-center justify-between mb-8">
                                <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                                    <Clock className="text-emerald-500" size={16} /> Live Activity Timeline
                                </h4>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {studentAttendance.slice(0, 6).map((log, idx) => (
                                    <div key={idx} className="p-4 rounded-2xl bg-slate-950/40 border border-white/5 flex items-center justify-between group/log">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${log.type === 'Check-In' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                                {log.type === 'Check-In' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-white uppercase tracking-tighter">{log.type}</p>
                                                <p className="text-[8px] text-slate-500 font-bold uppercase">{log.date}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-slate-400 font-mono">{log.time}</p>
                                        </div>
                                    </div>
                                ))}
                                {studentAttendance.length === 0 && (
                                    <div className="sm:col-span-2 p-10 rounded-3xl bg-slate-950/20 border border-dashed border-white/5 text-center">
                                        <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">No activity history recorded yet</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-10 flex items-center gap-4">
                           <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                               <div className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 w-full animate-pulse"></div>
                           </div>
                           <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Digital Authentication Verified</p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}

export default StudentProfile;
