import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ShieldCheck, QrCode, LogOut, CheckCircle2, CreditCard, 
  Clock, RefreshCcw, Camera, Bell, Activity, MapPin, X, User, History,
  MessageSquare, Send, Plus, Trash2, Mail, Phone, Calendar, Menu, Settings, ChevronRight, LayoutDashboard, Monitor
} from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';

let BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';
BASE_URL = BASE_URL.replace(/\/$/, ''); 
if (BASE_URL.endsWith('/api')) {
  BASE_URL = BASE_URL.replace(/\/api$/, '');
}
const API_URL = `${BASE_URL}/api`;

// --- HELPER COMPONENTS ---

const Card = ({ children, className = "", glow = false }) => (
  <div className={`bg-[#111827]/80 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] shadow-2xl transition-all duration-500 hover:border-white/10 ${glow ? 'ring-1 ring-blue-500/30 shadow-blue-500/10' : ''} ${className}`}>
    <div className="p-6 md:p-10">{children}</div>
  </div>
);

const Badge = ({ children }) => (
  <span className="px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(59,130,246,0.2)]">
    {children}
  </span>
);

function ProfileField({ icon: Icon, label, value }) {
    return (
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 group hover:border-blue-500/30 transition-all flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/5 flex items-center justify-center text-blue-500 shrink-0">
                {Icon && <Icon size={18} />}
            </div>
            <div className="min-w-0">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1 truncate">{label}</p>
                <p className="text-xs font-black text-white uppercase tracking-widest truncate">{value || 'N/A'}</p>
            </div>
        </div>
    );
}

function FinancialCard({ label, value, color }) {
    const colors = {
        slate: 'bg-slate-950/60 border-white/5 text-white',
        blue: 'bg-blue-500/5 border-blue-500/10 text-blue-400',
        emerald: 'bg-emerald-500/5 border-emerald-500/10 text-emerald-400',
        rose: 'bg-rose-500/5 border-rose-500/10 text-rose-400'
    };

    return (
        <div className={`p-6 rounded-[2rem] border ${colors[color]} relative overflow-hidden group hover:scale-[1.02] transition-all duration-500`}>
            <p className="text-[9px] font-black uppercase tracking-widest mb-3 opacity-60">{label}</p>
            <p className="text-2xl font-black font-mono tracking-tighter">₹{value?.toLocaleString() || 0}</p>
            <div className="absolute top-0 right-0 w-16 h-16 bg-current opacity-[0.02] rounded-full -mr-8 -mt-8"></div>
        </div>
    );
}

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
      <button 
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="p-2 rounded-xl bg-slate-950 border border-white/10 text-slate-500 hover:text-white disabled:opacity-30 transition-all"
      >
        <ChevronRight className="rotate-180" size={18} />
      </button>
      <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">
        {currentPage} / {totalPages}
      </span>
      <button 
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="p-2 rounded-xl bg-slate-950 border border-white/10 text-slate-500 hover:text-white disabled:opacity-30 transition-all"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

// --- FEATURE COMPONENTS ---

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
                                    
                                    // Calculate against total days in the month as requested
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

function ComplaintForm({ student, onClose, onRefresh }) {
    const [formData, setFormData] = useState({ studentId: student._id, studentName: student.fullName, studyId: student.studyId, subject: '', message: '', type: 'Complaint' });
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${API_URL}/complaints`, formData);
            alert('Request sent successfully!');
            onRefresh();
            onClose();
        } catch (_) { alert('Failed to send request'); }
        finally { setLoading(false); }
    };
    return (
        <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4">
            <Card className="w-full max-w-md relative border-blue-500/30">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/5 rounded-full transition-all"><X size={24} className="text-slate-500 hover:text-white" /></button>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-10">Submit Request</h3>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Type</label>
                        <select className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm font-black focus:border-blue-500/50 outline-none appearance-none" value={formData.type} onChange={e=>setFormData({...formData, type: e.target.value})}>
                            <option value="Complaint">Complaint</option>
                            <option value="Request">Request</option>
                        </select>
                    </div>
                    <div><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Subject</label><input required className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm font-black focus:border-blue-500/50 outline-none" value={formData.subject} onChange={e=>setFormData({...formData, subject: e.target.value})} /></div>
                    <div><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Message</label><textarea required className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm font-black focus:border-blue-500/50 outline-none h-32" value={formData.message} onChange={e=>setFormData({...formData, message: e.target.value})} /></div>
                    <button disabled={loading} className="w-full py-5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3">
                        <Send size={16} /> {loading ? 'SENDING...' : 'Send Signal'}
                    </button>
                </form>
            </Card>
        </div>
    );
}

// --- MAIN APPLICATION ---

export default function StudentApp() {
  const [student, setStudent] = useState(null);
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [scanned, setScanned] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [payments, setPayments] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [adminInfo, setAdminInfo] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [notifPage, setNotifPage] = useState(1);
  const [supportPage, setSupportPage] = useState(1);

  useEffect(() => {
    const storedStudent = localStorage.getItem('student_user');
    if (storedStudent) {
      setStudent(JSON.parse(storedStudent));
    }
    fetchAdminInfo();
  }, []);

  useEffect(() => {
    if (student?._id) {
      const refreshActiveData = () => {
        if (activeTab === 'Dashboard') {
          refreshStudentData();
          fetchNotifications();
          fetchAttendanceHistory();
        } else if (activeTab === 'Attendance') {
          fetchAttendanceHistory();
        } else if (activeTab === 'Support') {
          fetchComplaints();
        } else if (activeTab === 'Payments') {
          fetchPayments();
        } else if (activeTab === 'Profile') {
          fetchAdminInfo();
        }
      };

      refreshActiveData();
      const interval = setInterval(refreshActiveData, 1000);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [student?._id, activeTab]);

  const fetchAdminInfo = async () => {
    try {
      const res = await axios.get(`${API_URL}/auth/admin-info`);
      setAdminInfo(res.data);
    } catch (err) { console.error('Admin info fetch failed', err); }
  };

  const refreshStudentData = async () => {
    try {
      const res = await axios.get(`${API_URL}/students/${student._id}`);
      setStudent(res.data);
      localStorage.setItem('student_user', JSON.stringify(res.data));
    } catch (err) { console.error('Student refresh failed', err); }
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${API_URL}/notifications`);
      const relevant = res.data.filter(n => n.recipient === 'All' || n.recipient === student.studyId);
      setNotifications(relevant);
    } catch (err) { console.error(err); }
  };

  const fetchPayments = async () => {
    try {
      const res = await axios.get(`${API_URL}/payments/student/${student._id}`);
      setPayments(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchAttendanceHistory = async () => {
    try {
      const res = await axios.get(`${API_URL}/attendance/student/${student._id}`);
      setAttendanceHistory(res.data);
    } catch (err) { console.error('Attendance history fetch failed', err); }
  };

  const fetchComplaints = async () => {
    try {
      const res = await axios.get(`${API_URL}/complaints/student/${student._id}`);
      setComplaints(res.data);
    } catch (err) { 
        console.error('Complaints fetch error:', err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError('');
    try {
      const res = await axios.post(`${API_URL}/auth/student/login`, {
        studyId: loginId.trim(),
        password
      });
      setStudent(res.data.student);
      localStorage.setItem('student_token', res.data.token);
      localStorage.setItem('student_user', JSON.stringify(res.data.student));
    } catch (err) {
      setError(err.response?.data?.message || 'AUTH_FAILED: Invalid Credentials');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setStudent(null);
    localStorage.clear();
  };

  const isProcessingRef = React.useRef(false);

  const startScanner = () => {
    if (isProcessingRef.current) return;
    setShowScanner(true);
    
    setTimeout(() => {
      const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
      scanner.render(async (decodedText) => {
        if (decodedText === "STUDY_HUB_AUTH_2026" && !isProcessingRef.current) {
          isProcessingRef.current = true;
          try {
            await axios.post(`${API_URL}/attendance/sync`, { studentId: student._id, type: 'In' });
            setScanned(true);
            
            try {
              await scanner.clear();
            } catch (clearErr) {
              console.warn("Scanner clear error:", clearErr);
            }

            setTimeout(() => { 
              setShowScanner(false); 
              setScanned(false); 
              isProcessingRef.current = false;
            }, 3000);
            
            refreshStudentData();
            fetchAttendanceHistory();
          } catch (err) { 
            console.error("Attendance Sync Error:", err);
            alert(err.response?.data?.message || 'Verification Failed');
            isProcessingRef.current = false;
            try { scanner.clear(); } catch(_) { /* ignore */ }
            setShowScanner(false);
          }
        }
      });
    }, 100);
  };

  if (!student) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
         <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#020617]/80 to-[#020617]"></div>
      </div>
      <Card className="w-full max-w-md z-10 border-white/10 bg-slate-900/40 backdrop-blur-2xl p-8 md:p-16">
         <div className="w-20 h-20 bg-blue-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-blue-600/40 transform -rotate-6">
            <ShieldCheck className="text-white" size={40} />
         </div>
         <h2 className="text-4xl font-black text-white text-center mb-2 uppercase tracking-tighter">STUDY HUB</h2>
         <p className="text-[10px] text-blue-500 font-black text-center mb-12 uppercase tracking-[0.5em]">Secure Student Access</p>
         
         <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Study ID</label>
               <input required placeholder="SP-XXXX" className="w-full bg-slate-950/60 border border-white/10 rounded-2xl px-6 py-5 text-white text-sm font-black tracking-widest focus:border-blue-500/50 focus:outline-none transition-all placeholder:text-slate-800" value={loginId} onChange={e => setLoginId(e.target.value.toUpperCase())} />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Secure Pin</label>
               <input required type="password" placeholder="••••••••" className="w-full bg-slate-950/60 border border-white/10 rounded-2xl px-6 py-5 text-white text-sm font-black tracking-widest focus:border-blue-500/50 focus:outline-none transition-all placeholder:text-slate-800" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            {error && <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[10px] text-rose-500 font-black uppercase tracking-widest text-center">{error}</div>}
            <button disabled={isLoggingIn} className="w-full py-5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl active:scale-95 disabled:opacity-50">
               {isLoggingIn ? 'LOGGING IN...' : 'Login to Portal'}
            </button>
         </form>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans p-4 md:p-16 antialiased relative overflow-hidden flex flex-col items-center selection:bg-blue-500/30">
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-radial-gradient from-blue-500/30 via-transparent to-transparent animate-pulse z-0"></div>
      
      <header className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 relative z-10 gap-6">
         <div className="space-y-4">
            <Badge>Student Dashboard Online</Badge>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white uppercase leading-none">Welcome, {student.fullName.split(' ')[0]}</h1>
         </div>
         <div className="flex items-center gap-6 md:gap-10">
            <div className="text-right leading-none hidden sm:block">
               <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Student Profile</p>
               <p className="text-lg font-black text-white uppercase">{student.studyId}</p>
            </div>
            <div className="w-14 h-14 md:w-16 md:h-16 bg-slate-900 rounded-3xl border-2 border-blue-500/30 shadow-2xl flex items-center justify-center text-blue-400 font-black text-xl">{student.fullName.charAt(0)}</div>
         </div>
      </header>

      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-10 relative z-10 mb-32">
         <div className="lg:col-span-2 space-y-10">
            {activeTab === 'Dashboard' ? (
                <>
                    <Card glow={scanned} className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 border-blue-500/10 flex flex-col justify-center min-h-[450px]">
                    <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
                        <div className="flex-1 space-y-8 text-center md:text-left order-2 md:order-1">
                            <div>
                                <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter mb-4">Mark Attendance</h3>
                                <p className="text-slate-400 text-sm leading-relaxed max-w-md">Scan the library QR code to record your attendance for today's session.</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="p-6 md:p-8 rounded-[2rem] bg-slate-950/60 border border-white/5 shadow-inner">
                                    <div className="flex items-center justify-center md:justify-start gap-2 mb-2 text-slate-500">
                                        <Activity size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Attendance</span>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        {student.lastCheckIn?.includes(new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()) ? (
                                            <p className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.2em] animate-in fade-in duration-500">Marked</p>
                                        ) : (
                                            <p className="text-[11px] font-black text-rose-500 uppercase tracking-[0.2em] animate-pulse">Not Marked</p>
                                        )}
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
                                            This Month Marked Days:{(() => {
                                                const now = new Date();
                                                return new Set(attendanceHistory.filter(log => {
                                                    if (!log.date) return false;
                                                    const [d, m, y] = log.date.split(' ');
                                                    const logDate = new Date(`${m} ${d} ${y}`);
                                                    return logDate.getMonth() === now.getMonth() && logDate.getFullYear() === now.getFullYear();
                                                }).map(l => l.date)).size;
                                            })()}
                                        </p>
                                    </div>
                                </div>
                                <div className="p-6 md:p-8 rounded-[2rem] bg-slate-950/60 border border-white/5 shadow-inner">
                                <div className="flex items-center justify-center md:justify-start gap-2 mb-2 text-blue-400"><MapPin size={14} /><span className="text-[10px] font-black uppercase tracking-widest">Assigned Seat</span></div>
                                <p className="text-3xl md:text-4xl font-black text-blue-400 leading-none">{student.seat}</p>
                                </div>
                            </div>
                        </div>

                        <button onClick={startScanner} className="relative group shrink-0 order-1 md:order-2">
                            <div className={`w-48 h-48 md:w-64 md:h-64 bg-white rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 flex items-center justify-center transition-all duration-1000 ${scanned ? 'scale-95 shadow-[0_0_100px_rgba(16,185,129,0.3)]' : 'group-hover:scale-105'}`}>
                                {scanned ? (
                                <div className="text-center animate-in zoom-in-50 duration-700">
                                    <CheckCircle2 size={80} className="text-emerald-500 mx-auto" strokeWidth={2.5} />
                                    <p className="text-sm font-black text-slate-900 uppercase mt-4 tracking-[0.2em]">Verified</p>
                                </div>
                                ) : (
                                <QrCode size={150} className="text-slate-900 transition-all duration-700 group-hover:rotate-90" />
                                )}
                            </div>
                            {!scanned && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-blue-600/90 rounded-[2.5rem] md:rounded-[3.5rem] opacity-0 group-hover:opacity-100 transition-all text-white font-black uppercase tracking-[0.3em] text-[10px] gap-4 backdrop-blur-sm pointer-events-none px-4 text-center">
                                <Camera size={32} />
                                <span>Scan QR Code</span>
                                </div>
                            )}
                        </button>
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
                </>
            ) : activeTab === 'Attendance' ? (
                <div className="space-y-10">
                    <AttendanceCalendar history={attendanceHistory} />
                    
                    <Card className="bg-slate-900/40 border-white/5">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-3xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-xl shadow-blue-500/5">
                                <Activity size={28} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white uppercase tracking-tighter">Consistency Metric</h3>
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Real-time attendance performance analytics</p>
                            </div>
                        </div>
                        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                                <p className="text-3xl font-black text-blue-400">{student.lastCheckIn || '--'}</p>
                            </div>
                        </div>
                    </Card>
                </div>
            ) : activeTab === 'Payments' ? (
                <Card className="bg-slate-900/40 border-white/5 h-full">
                    <h4 className="text-xs font-black text-white uppercase tracking-[0.25em] mb-10 flex items-center gap-3">
                        <History className="text-blue-400" size={18} /> Payment History
                    </h4>
                    <div className="overflow-x-auto -mx-6 md:mx-0">
                        <table className="w-full text-left min-w-[500px]">
                            <thead className="text-[10px] text-slate-500 uppercase tracking-widest font-black border-b border-white/5">
                                <tr>
                                    <th className="px-6 py-4">Month</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Method</th>
                                    <th className="px-6 py-4">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {payments.map(p => (
                                    <tr key={p._id} className="text-sm font-bold hover:bg-white/5 transition-all">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <span className="text-white">{p.month}</span>
                                                {p.month === 'Initial Deposit' && (
                                                    <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[8px] font-black uppercase tracking-widest">Security</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-emerald-400">Rs.{p.amount}</td>
                                        <td className="px-6 py-4 text-slate-400">{p.method}</td>
                                        <td className="px-6 py-4 text-slate-500">{new Date(p.paymentDate).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                                {payments.length === 0 && <tr><td colSpan="4" className="p-10 text-center text-slate-600 uppercase font-black text-xs">No records found</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </Card>
            ) : activeTab === 'Support' ? (
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
                        <div className="space-y-6">
                            {complaints.slice((supportPage - 1) * 8, supportPage * 8).map(c => (
                                <div key={c._id} className="p-6 rounded-2xl bg-slate-950/60 border border-white/5 flex flex-col md:flex-row md:justify-between md:items-center gap-6 group hover:border-blue-500/30 transition-all">
                                    <div className="flex-1">
                                        <p className="text-sm font-black text-white uppercase">{c.subject}</p>
                                        <p className="text-[11px] text-slate-500 mt-1 font-bold">{c.message}</p>
                                        <p className="text-[9px] text-slate-600 mt-2 uppercase font-black tracking-widest">{new Date(c.createdAt).toLocaleDateString()} • {c.type}</p>
                                    </div>
                                    <div className="flex items-center justify-between md:justify-end gap-4">
                                        <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${c.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                                            {c.status}
                                        </div>
                                        <button onClick={async () => { if (window.confirm('Delete this request?')) { try { await axios.delete(`${API_URL}/complaints/${c._id}`); fetchComplaints(); } catch (_) { alert('Delete failed'); } } }} className="p-2 text-slate-500 hover:text-rose-500 transition-all">
                                          <Trash2 size={16} />
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
            ) : activeTab === 'Profile' ? (
                <div className="space-y-12 pb-32 animate-in fade-in slide-in-from-bottom-10 duration-1000 relative">
                    {/* Background Orbs */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full"></div>
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full"></div>
                    </div>

                    {/* Header: Identity Dossier */}
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
                                        <ProfileField icon={Activity} label="Overall Attendance" value={`${student.attendancePercentage || 0}%`} />
                                        <ProfileField icon={Clock} label="System Entry" value={student.lastCheckIn} />
                                    </div>
                                </section>
                            </div>
                        </div>
                    </Card>

                    {/* Financial Integrity Section */}
                    <section className="space-y-8">
                        <div className="flex items-center gap-3 ml-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Financial Integrity Report</h4>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <FinancialCard label="Monthly Subscription" value={student.monthlyFee} color="slate" />
                            <FinancialCard label="Security Deposit" value={student.securityDeposit} color="blue" />
                            <FinancialCard label="Total Contribution" value={student.paidAmount} color="emerald" />
                            <FinancialCard label="Outstanding Balance" value={student.dueAmount} color="rose" />
                        </div>
                    </section>

                    {/* Administration & Developer Sections */}
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
            ) : null}
         </div>

         <div className="hidden lg:block space-y-10">
            <Card className="bg-slate-900/40 border-blue-500/10 h-full flex flex-col items-center justify-center py-20 min-h-[600px] text-center">
                <div className="w-24 h-24 rounded-[2.5rem] bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-[0_0_50px_rgba(59,130,246,0.1)] mb-10 mx-auto">
                    <ShieldCheck size={48} className="animate-pulse" />
                </div>
                
                <div className="space-y-2 mb-12">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Security Protocol</p>
                    <p className="text-xl font-black text-white uppercase tracking-widest">Terminal Secured</p>
                </div>

                <div className="px-10 space-y-6 w-full">
                    <p className="text-[11px] text-slate-500 font-bold leading-relaxed uppercase tracking-widest">
                        Your account is secured with end-to-end encryption.
                    </p>
                    
                    <div className="pt-8 border-t border-white/5 space-y-4">
                        <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest">
                            <span className="text-slate-600">Session ID</span>
                            <span className="text-emerald-500">Active</span>
                        </div>
                        <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest">
                            <span className="text-slate-600">IP Address</span>
                            <span className="text-white">Authorized</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] pt-10">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></div>
                        Connection Active
                    </div>
                </div>
            </Card>
         </div>
      </main>

      <nav className="fixed bottom-4 md:bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-1 md:gap-4 bg-slate-950/90 backdrop-blur-3xl border border-white/10 p-2 md:p-4 rounded-3xl md:rounded-[2.5rem] shadow-[0_0_80px_rgba(0,0,0,0.8)] z-50 w-[95%] max-w-fit overflow-hidden justify-center">
         {[
            { id: 'Dashboard', icon: LayoutDashboard },
            { id: 'Attendance', icon: Activity },
            { id: 'Payments', icon: CreditCard },
            { id: 'Support', icon: MessageSquare },
            { id: 'Profile', icon: User }
         ].map(tab => (
           <button 
             key={tab.id} 
             onClick={() => setActiveTab(tab.id)} 
             className={`flex flex-col md:flex-row items-center gap-1 md:gap-3 px-3 md:px-8 py-2 md:py-4 rounded-2xl md:rounded-2xl transition-all duration-500 shrink-0 ${ activeTab === tab.id ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/40' : 'text-slate-500 hover:text-white'}`}
           >
             <tab.icon size={18} className={`${activeTab === tab.id ? 'scale-110' : 'scale-100'} transition-transform md:hidden`} />
             <tab.icon size={16} className="hidden md:block" />
             <span className={`text-[8px] md:text-[11px] font-black uppercase tracking-widest md:tracking-[0.2em] ${activeTab === tab.id ? 'block' : 'hidden md:block'}`}>
                {tab.id}
             </span>
           </button>
         ))}
         <div className="w-[1px] h-6 md:h-8 bg-white/10 mx-1 md:mx-4 shrink-0"></div>
         <button onClick={handleLogout} className="p-3 md:p-4 text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all active:scale-90 flex items-center justify-center"><LogOut size={18} /></button>
      </nav>

      {showScanner && (
          <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4">
             <Card className="w-full max-w-xl relative border-blue-500/30">
                <button onClick={() => setShowScanner(false)} className="absolute top-4 right-4 p-3 hover:bg-white/5 rounded-full transition-all"><X size={24} className="text-slate-500 hover:text-white" /></button>
                <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter mb-10">Attendance Scanner</h3>
                <div id="reader" className="w-full overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/50"></div>
                <p className="text-[9px] md:text-[10px] text-slate-500 text-center mt-10 font-black uppercase tracking-[0.3em]">Point camera at the library QR code</p>
             </Card>
          </div>
      )}

      {showComplaintForm && <ComplaintForm student={student} onClose={() => setShowComplaintForm(false)} onRefresh={fetchComplaints} />}
    </div>
  );
}
