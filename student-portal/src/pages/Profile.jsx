import React from 'react';
import { 
  ShieldCheck, User, Phone, MapPin, Monitor, Calendar, Mail, Activity, Clock, Settings 
} from 'lucide-react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import ProfileField from '../components/common/ProfileField';
import FinancialCard from '../components/common/FinancialCard';

function Profile({ student, attendanceHistory, adminInfo }) {
    return (
        <div className="space-y-12 pb-32 animate-in fade-in slide-in-from-bottom-10 duration-1000 relative">
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full"></div>
            </div>

            <Card className="bg-slate-900/40 border-white/5 overflow-hidden p-0 md:p-0">
                <div className="h-48 bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-emerald-600/20 relative">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                    <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-slate-950/40 to-transparent"></div>
                </div>
                <div className="px-6 md:px-12 pb-12">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-10 -mt-24 relative z-10">
                        <div className="w-44 h-44 bg-slate-800 rounded-[3.5rem] border-[10px] border-[#020617] flex items-center justify-center text-blue-400 text-7xl font-black uppercase shadow-2xl transform hover:rotate-2 transition-transform duration-500">
                            {student.fullName.charAt(0)}
                        </div>
                        <div className="text-center md:text-left mb-6">
                            <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-3 leading-none">{student.fullName}</h3>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                <Badge>{student.studyId}</Badge>
                                <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.1)]">Authorized Student</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
                        <section className="space-y-8">
                            <div className="flex items-center gap-3 px-1">
                                <div className="w-1 h-4 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                                <h4 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Personal Identity</h4>
                            </div>
                            <div className="space-y-5">
                                <ProfileField icon={User} label="Gender" value={student.gender} />
                                <ProfileField icon={ShieldCheck} label="Aadhaar ID" value={student.aadhaarNumber} />
                                <ProfileField icon={Phone} label="Primary Contact" value={student.phone} />
                            </div>
                        </section>

                        <section className="space-y-8">
                            <div className="flex items-center gap-3 px-1">
                                <div className="w-1 h-4 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                <h4 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Institutional Data</h4>
                            </div>
                            <div className="space-y-5">
                                <ProfileField icon={MapPin} label="Assigned Station" value={`SEAT ${student.seat}`} />
                                <ProfileField icon={Monitor} label="Current Course" value={student.course} />
                                <ProfileField icon={Calendar} label="Joining Date" value={student.joiningDate ? new Date(student.joiningDate).toLocaleDateString() : 'N/A'} />
                            </div>
                        </section>

                        <section className="space-y-8">
                            <div className="flex items-center gap-3 px-1">
                                <div className="w-1 h-4 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
                                <h4 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">System Credentials</h4>
                            </div>
                            <div className="space-y-5">
                                <ProfileField icon={Mail} label="Secure Email" value={student.email} />
                                <ProfileField 
                                    icon={Activity} 
                                    label="Attendance This Month" 
                                    value={(() => {
                                        const now = new Date();
                                        const currentMonthLogs = attendanceHistory.filter(log => {
                                            if (!log.date) return false;
                                            const [d, m, y] = log.date.split(' ');
                                            const logDate = new Date(`${m} ${d} ${y}`);
                                            return logDate.getMonth() === now.getMonth() && logDate.getFullYear() === now.getFullYear();
                                        });
                                        const distinctDays = new Set(currentMonthLogs.map(l => l.date)).size;
                                        const totalDaysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
                                        const percentage = Math.min(100, Math.round((distinctDays / totalDaysInMonth) * 100));
                                        return `${distinctDays} Days (${percentage}%)`;
                                    })()} 
                                />
                                <ProfileField icon={Clock} label="System Entry" value={student.lastCheckIn} />
                            </div>
                        </section>
                    </div>
                </div>
            </Card>

            <section className="space-y-8">
                <div className="flex items-center gap-3 ml-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                    <h4 className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Financial Integrity Report</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <FinancialCard label="Monthly Subscription" value={student.monthlyFee} color="slate" />
                    <FinancialCard label="Security Deposit" value={student.securityDeposit} color="blue" />
                    <FinancialCard label="Total Paid Fees" value={student.paidAmount} color="emerald" />
                    <FinancialCard label="Due Balance" value={student.dueAmount} color="rose" />
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {adminInfo && (
                    <Card className="bg-slate-900/40 border-blue-500/10 hover:border-blue-500/30 transition-all">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-xl">
                                <ShieldCheck size={22} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-white uppercase tracking-tight">Library Administration</h4>
                                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-1">Institutional Oversight</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/40 border border-white/5">
                                <span className="text-[9px] font-black text-slate-500 uppercase">Administrator</span>
                                <span className="text-xs font-black text-white uppercase">{adminInfo.fullName}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/40 border border-white/5">
                                <span className="text-[9px] font-black text-slate-500 uppercase">Support Channel</span>
                                <span className="text-xs font-black text-blue-400">{adminInfo.email}</span>
                            </div>
                        </div>
                    </Card>
                )}

                <Card className="bg-slate-900/40 border-emerald-500/10 hover:border-emerald-500/30 transition-all relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-all"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-xl">
                                <Settings size={22} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-white uppercase tracking-tight">System Engineering</h4>
                                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-1">Digital Infrastructure</p>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Architected By</p>
                                <h3 className="text-xl font-black text-white uppercase tracking-tighter">Aman Raj Verma</h3>
                            </div>
                            <a href="mailto:amanrv2004@gmail.com" className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500/20 transition-all">
                                <Mail size={14} /> Contact
                            </a>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default Profile;
