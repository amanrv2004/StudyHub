import React from 'react';
import { 
  Activity, MapPin, QrCode, CheckCircle2, Camera, Bell
} from 'lucide-react';
import Card from '../components/common/Card';
import Pagination from '../components/common/Pagination';

function Dashboard({ student, attendanceHistory, scanned, startScanner, setShowActivitySelector, notifications, notifPage, setNotifPage }) {
  return (
    <div className="space-y-6 lg:space-y-10">
        <Card glow={scanned} className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 border-blue-500/10 flex flex-col justify-center min-h-[400px] lg:min-h-[450px] relative overflow-hidden text-center lg:text-left">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none"></div>
            
            <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
                <div className="flex-1 space-y-6 lg:space-y-8 order-2 lg:order-1 w-full">
                    <div>
                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-white uppercase tracking-tighter mb-3 lg:mb-4">Attendance Portal</h3>
                        <p className="text-slate-400 text-xs lg:text-sm leading-relaxed max-w-md mx-auto lg:mx-0 font-bold uppercase tracking-wider opacity-60">Authenticate your session by scanning the institutional QR code. System will prompt for activity type.</p>
                    </div>
                    
                    <div className="pt-6 border-t border-white/5">
                        <div className="flex items-center justify-center lg:justify-start gap-6 lg:gap-10">
                            <div className="text-left">
                                <p className="text-[7px] lg:text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Attendance Status</p>
                                {attendanceHistory.some(log => log.date === new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()) ? (
                                    <div className="flex items-center gap-1.5 lg:gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                        <p className="text-[9px] lg:text-[10px] font-black text-emerald-500 uppercase tracking-widest">Marked Today</p>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1.5 lg:gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"></div>
                                        <p className="text-[9px] lg:text-[10px] font-black text-rose-500 uppercase tracking-widest">Not Marked</p>
                                    </div>
                                )}
                            </div>
                            <div className="w-px h-8 bg-white/5"></div>
                            <div className="text-left">
                                <p className="text-[7px] lg:text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Assigned Unit</p>
                                <p className="text-[9px] lg:text-[10px] font-black text-blue-400 uppercase tracking-widest">Station {student.seat}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative group shrink-0 order-1 lg:order-2">
                    <button 
                        onClick={() => setShowActivitySelector(true)}
                        className={`w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-white rounded-[2rem] md:rounded-[3.5rem] p-6 sm:p-8 md:p-12 flex items-center justify-center transition-all duration-1000 overflow-hidden relative ${scanned ? 'scale-95 shadow-[0_0_100px_rgba(16,185,129,0.3)]' : 'hover:scale-105 shadow-2xl shadow-blue-500/10 active:scale-95'}`}
                    >
                        {scanned ? (
                        <div className="text-center animate-in zoom-in-50 duration-700">
                            <CheckCircle2 size={60} md:size={80} className="text-emerald-500 mx-auto" strokeWidth={2.5} />
                            <p className="text-xs md:text-sm font-black text-slate-900 uppercase mt-4 tracking-[0.2em]">Verified</p>
                        </div>
                        ) : (
                        <>
                            <QrCode size={100} md:size={150} className="text-slate-900 transition-all duration-700 group-hover:rotate-90" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-blue-600/90 opacity-0 group-hover:opacity-100 transition-all text-white font-black uppercase tracking-[0.3em] text-[9px] md:text-[10px] gap-3 md:gap-4 backdrop-blur-sm px-4 text-center">
                                <Camera size={28} md:size={32} />
                                <span>Touch to Scan</span>
                            </div>
                        </>
                        )}
                    </button>
                </div>
            </div>
        </Card>

        <div className="space-y-10">
            <Card className="bg-slate-900/40 border-white/5 flex flex-col">
                <h4 className="text-xs font-black text-white uppercase tracking-[0.25em] mb-10 flex items-center gap-3">
                    <Bell className="text-blue-400" size={18} /> Latest Notifications & Updates
                </h4>
                <div className="space-y-8 flex-1">
                    {notifications.slice((notifPage - 1) * 4, notifPage * 4).map((n, i) => (
                        <div key={i} className="flex gap-6 p-6 rounded-[2rem] bg-slate-950/40 border border-white/5 group hover:border-blue-500/30 transition-all">
                            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shadow-[0_0_10px_rgba(59,130,246,1)] group-hover:scale-125 transition-transform"></div>
                            <div className="flex-1">
                                <p className="text-base font-black text-white uppercase tracking-tight">{n.title}</p>
                                <p className="text-sm text-slate-400 mt-2 leading-relaxed font-bold">{n.message}</p>
                                <div className="flex items-center gap-4 mt-4">
                                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{new Date(n.createdAt || Date.now()).toLocaleDateString()}</span>
                                    <div className="h-px w-8 bg-white/5"></div>
                                    <span className="text-[9px] font-black text-blue-500/60 uppercase tracking-widest">Official Broadcast</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {notifications.length === 0 && (
                        <div className="py-20 text-center">
                            <Bell size={40} className="text-slate-800 mx-auto mb-4" />
                            <p className="text-xs text-slate-600 italic uppercase font-black">No system notifications at this time</p>
                        </div>
                    )}
                </div>
                <Pagination 
                    totalItems={notifications.length} 
                    itemsPerPage={4} 
                    currentPage={notifPage} 
                    onPageChange={setNotifPage} 
                />
            </Card>
        </div>
    </div>
  );
}

export default Dashboard;
