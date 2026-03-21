import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  ShieldCheck, X, QrCode, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';

import { API_URL } from './services/api';

// Pages
import Dashboard from './pages/Dashboard';
import Attendance from './pages/Attendance';
import Payments from './pages/Payments';
import Support from './pages/Support';
import Profile from './pages/Profile';
import Login from './pages/Login';

// Components
import Card from './components/common/Card';
import ComplaintForm from './components/ComplaintForm';
import { StudentHeader, StudentNavigation } from './components/layout/Layout';

export default function StudentApp() {
  const [student, setStudent] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [scanned, setScanned] = useState(false);
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [payments, setPayments] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [adminInfo, setAdminInfo] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [showActivitySelector, setShowActivitySelector] = useState(false);
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [notifPage, setNotifPage] = useState(1);
  const [supportPage, setSupportPage] = useState(1);

  const isProcessingRef = useRef(false);

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
        const path = location.pathname;
        if (path === '/') {
          refreshStudentData();
          fetchNotifications();
          fetchAttendanceHistory();
        } else if (path === '/attendance') {
          fetchAttendanceHistory();
        } else if (path === '/support') {
          fetchComplaints();
        } else if (path === '/payments') {
          fetchPayments();
        } else if (path === '/profile') {
          fetchAdminInfo();
          fetchAttendanceHistory();
        }
      };

      refreshActiveData();
      const interval = setInterval(refreshActiveData, 10000);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [student?._id, location.pathname]);

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
    navigate('/');
  };

  const startScanner = (activityType) => {
    if (isProcessingRef.current) return;
    setShowActivitySelector(false);
    setShowScanner(true);
    
    setTimeout(() => {
      const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
      scanner.render(async (decodedText) => {
        if (decodedText === "STUDY_HUB_AUTH_2026" && !isProcessingRef.current) {
          isProcessingRef.current = true;
          try {
            const apiType = activityType === 'Check-In' ? 'In' : 'Out';
            await axios.post(`${API_URL}/attendance/sync`, { studentId: student._id, type: apiType });
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
    <Login 
      loginId={loginId} 
      setLoginId={setLoginId} 
      password={password} 
      setPassword={setPassword} 
      handleLogin={handleLogin} 
      error={error} 
      isLoggingIn={isLoggingIn} 
    />
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans p-4 sm:p-8 md:p-16 antialiased relative overflow-hidden flex flex-col items-center selection:bg-blue-500/30">
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-radial-gradient from-blue-500/30 via-transparent to-transparent animate-pulse z-0"></div>
      
      <StudentHeader student={student} />

      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-10 relative z-10 mb-32">
         <div className="lg:col-span-2 space-y-10">
            <Routes>
              <Route path="/" element={
                <Dashboard 
                  student={student} 
                  attendanceHistory={attendanceHistory} 
                  scanned={scanned} 
                  startScanner={startScanner} 
                  setShowActivitySelector={setShowActivitySelector}
                  notifications={notifications} 
                  notifPage={notifPage} 
                  setNotifPage={setNotifPage} 
                />
              } />
              <Route path="/attendance" element={<Attendance student={student} attendanceHistory={attendanceHistory} />} />
              <Route path="/payments" element={<Payments payments={payments} />} />
              <Route path="/support" element={
                <Support 
                  complaints={complaints} 
                  fetchComplaints={fetchComplaints} 
                  setShowComplaintForm={setShowComplaintForm} 
                  supportPage={supportPage} 
                  setSupportPage={setSupportPage} 
                />
              } />
              <Route path="/profile" element={<Profile student={student} attendanceHistory={attendanceHistory} adminInfo={adminInfo} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
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

      <StudentNavigation 
        activeTab={location.pathname === '/' ? 'Dashboard' : location.pathname.substring(1).charAt(0).toUpperCase() + location.pathname.substring(2)} 
        setActiveTab={(id) => navigate(id === 'Dashboard' ? '/' : `/${id.toLowerCase()}`)} 
        handleLogout={handleLogout} 
      />

      {showActivitySelector && (
          <div className="fixed inset-0 z-[150] bg-[#020617]/95 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in duration-300">
              <Card className="w-full max-w-lg relative border-blue-500/30 p-10 shadow-[0_0_100px_rgba(59,130,246,0.15)] bg-slate-900/40">
                  <button onClick={() => setShowActivitySelector(false)} className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full transition-all text-slate-500 hover:text-white"><X size={20} /></button>
                  <div className="text-center mb-12">
                      <div className="w-20 h-20 rounded-[2rem] bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 mx-auto mb-6 shadow-2xl">
                          <QrCode size={40} />
                      </div>
                      <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Select Activity</h3>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-loose">Choose your session status to proceed with the scanner</p>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                      <button 
                          onClick={() => startScanner('Check-In')}
                          className="flex flex-col items-center gap-5 p-8 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/10 hover:border-emerald-500/30 hover:bg-emerald-500/10 transition-all group active:scale-95"
                      >
                          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-500 border border-emerald-500/20 group-hover:scale-110 transition-transform shadow-xl shadow-emerald-500/10">
                              <ArrowUpRight size={32} />
                          </div>
                          <span className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Check In</span>
                      </button>
                      <button 
                          onClick={() => startScanner('Check-Out')}
                          className="flex flex-col items-center gap-5 p-8 rounded-[2.5rem] bg-rose-500/5 border border-rose-500/10 hover:border-rose-500/30 hover:bg-rose-500/10 transition-all group active:scale-95"
                      >
                          <div className="w-16 h-16 rounded-2xl bg-rose-500/20 flex items-center justify-center text-rose-500 border border-rose-500/20 group-hover:scale-110 transition-transform shadow-xl shadow-rose-500/10">
                              <ArrowDownRight size={32} />
                          </div>
                          <span className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Check Out</span>
                      </button>
                  </div>
              </Card>
          </div>
      )}

      {showScanner && (
          <div className="fixed inset-0 z-[150] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4">
             <Card className="w-full max-w-xl relative border-blue-500/30 bg-slate-900/40">
                <button onClick={() => setShowScanner(false)} className="absolute top-4 right-4 p-3 hover:bg-white/5 rounded-full transition-all text-slate-500 hover:text-white"><X size={24} /></button>
                <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter mb-10">Attendance Scanner</h3>
                <div id="reader" className="w-full overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-950/50"></div>
                <p className="text-[9px] md:text-[10px] text-slate-500 text-center mt-10 font-black uppercase tracking-[0.3em]">Point camera at the library QR code</p>
             </Card>
          </div>
      )}

      {showComplaintForm && <ComplaintForm student={student} onClose={() => setShowComplaintForm(false)} onRefresh={fetchComplaints} />}
    </div>
  );
}
