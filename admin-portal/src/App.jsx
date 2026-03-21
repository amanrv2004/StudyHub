import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  X, Menu, LogOut, ShieldCheck
} from 'lucide-react';
import { 
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, 
  LineElement, BarElement, Title, Tooltip, Legend, ArcElement 
} from 'chart.js';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';

import { API_URL } from './services/api';

// Pages
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Seats from './pages/Seats';
import Attendance from './pages/Attendance';
import Expenses from './pages/Expenses';
import Payments from './pages/Payments';
import NotificationsPage from './pages/Notifications';
import Complaints from './pages/Complaints';
import Settings from './pages/Settings';
import Login from './pages/Login';

// Layout
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';

// Modals
import StudentForm from './components/modals/StudentForm';
import StudentProfile from './components/modals/StudentProfile';
import ExpenseForm from './components/modals/ExpenseForm';
import PaymentForm from './components/modals/PaymentForm';
import NotificationForm from './components/modals/NotificationForm';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, 
  BarElement, Title, Tooltip, Legend, ArcElement
);

export default function AdminApp() {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [seats, setSeats] = useState([]);
  const [stats, setStats] = useState({});
  const [analytics, setAnalytics] = useState({ monthly: {}, yearly: {} });
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Modal states
  const [showForm, setShowForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showNotificationForm, setShowNotificationForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [paymentStudent, setPaymentStudent] = useState(null);
  
  // Login states
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const fetchData = async () => {
    setIsRefreshing(true);
    try {
      const fetchStudents = async () => { try { const r = await axios.get(`${API_URL}/students`); setStudents(r.data); } catch (e) { console.error('Students fetch failed', e); } };
      const fetchExpenses = async () => { try { const r = await axios.get(`${API_URL}/expenses`); setExpenses(r.data); } catch (e) { console.error('Expenses fetch failed', e); } };
      const fetchAttendance = async () => { try { const r = await axios.get(`${API_URL}/attendance`); setAttendance(r.data); } catch (e) { console.error('Attendance fetch failed', e); } };
      const fetchStats = async () => { try { const r = await axios.get(`${API_URL}/stats`); setStats(r.data); } catch (e) { console.error('Stats fetch failed', e); } };
      const fetchAnalytics = async () => { try { const r = await axios.get(`${API_URL}/analytics`); setAnalytics(r.data); } catch (e) { console.error('Analytics fetch failed', e); } };
      const fetchComplaints = async () => { try { const r = await axios.get(`${API_URL}/complaints`); setComplaints(r.data); } catch (e) { console.error('Complaints fetch failed', e); } };
      const fetchNotifications = async () => { try { const r = await axios.get(`${API_URL}/notifications`); setNotifications(r.data); } catch (e) { console.error('Notifications fetch failed', e); } };
      const fetchSeats = async () => { try { const r = await axios.get(`${API_URL}/seats`); setSeats(r.data); } catch (e) { console.error('Seats fetch failed', e); } };

      await Promise.all([
        fetchStudents(), fetchExpenses(), fetchAttendance(), fetchStats(),
        fetchAnalytics(), fetchComplaints(), fetchNotifications(), fetchSeats()
      ]);
    } catch (err) { console.error('Data sync error', err); } 
    finally { setLoading(false); setIsRefreshing(false); }
  };

  useEffect(() => { 
    const storedUser = localStorage.getItem('admin_user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    if (user) {
      fetchData();
      const interval = setInterval(fetchData, 10000);
      return () => clearInterval(interval);
    } else {
      setLoading(false);
    }
  }, [user, location.pathname]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');
    try {
      const res = await axios.post(`${API_URL}/auth/admin/login`, loginData);
      setUser(res.data.user);
      localStorage.setItem('admin_token', res.data.token);
      localStorage.setItem('admin_user', JSON.stringify(res.data.user));
    } catch (err) {
      setLoginError(err.response?.data?.message || 'Login Failed');
    } finally { setIsLoggingIn(false); }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.clear();
    navigate('/');
  };

  const downloadReport = async () => {
    try {
      const response = await axios.get(`${API_URL}/export`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'StudyPoint_Excel_Report.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) { alert('Excel Export failed'); }
  };

  const downloadPDF = async () => {
    try {
      const response = await axios.get(`${API_URL}/export-pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'StudyPoint_PDF_Report.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) { alert('PDF Export failed'); }
  };

  if (!user) return <Login loginData={loginData} setLoginData={setLoginData} handleLogin={handleLogin} loginError={loginError} isLoggingIn={isLoggingIn} />;

  if (loading) return <div className="min-h-screen bg-[#020617] flex items-center justify-center"><div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div></div>;

  const getTabName = (path) => {
    switch(path) {
      case '/': return 'Dashboard';
      case '/students': return 'Students';
      case '/seats': return 'Seats';
      case '/attendance': return 'Attendance';
      case '/expenses': return 'Expenses';
      case '/payments': return 'Payments';
      case '/notifications': return 'News';
      case '/support': return 'Support';
      case '/settings': return 'Settings';
      default: return 'Dashboard';
    }
  };

  const currentTab = getTabName(location.pathname);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans flex overflow-hidden antialiased selection:bg-emerald-500/30">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
         <img src="https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover opacity-20 scale-125" />
         <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-transparent to-[#020617]"></div>
      </div>

      <Sidebar activeTab={currentTab} handleLogout={handleLogout} setMobileMenuOpen={setMobileMenuOpen} attendance={attendance} />

      {mobileMenuOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden">
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
              <aside className="absolute inset-y-0 left-0 w-72 bg-slate-950 border-r border-white/10 p-8 flex flex-col animate-in slide-in-from-left duration-300 overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-center mb-12">
                    <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-xl shadow-emerald-500/20"><ShieldCheck className="text-white" size={20} /></div>
                    <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-white/5 rounded-full"><X size={24} className="text-slate-500" /></button>
                </div>
                <nav className="flex-1 space-y-10">
                    <section>
                        <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.25em] mb-6 pl-2">Management</p>
                        <div className="space-y-2">
                            {[
                              { name: 'Dashboard', path: '/' },
                              { name: 'Students', path: '/students' },
                              { name: 'Seats', path: '/seats' },
                              { name: 'Attendance', path: '/attendance' },
                              { name: 'Expenses', path: '/expenses' },
                              { name: 'Payments', path: '/payments' },
                              { name: 'News', path: '/notifications' },
                              { name: 'Support', path: '/support' },
                              { name: 'Settings', path: '/settings' }
                            ].map(tab => (
                            <button key={tab.name} onClick={() => { navigate(tab.path); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-4 px-6 py-4 rounded-[1.25rem] transition-all duration-300 font-bold group ${location.pathname === tab.path ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
                                <span className="text-sm">{tab.name}</span>
                                {location.pathname === tab.path && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0:10px_rgba(16,185,129,1)]"></div>}
                            </button>
                            ))}
                        </div>
                    </section>
                </nav>
                <div className="mt-auto pt-8 border-t border-white/5 space-y-6">
                    <div className="px-2">
                        <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em] mb-2">System Developer</p>
                        <p className="text-[11px] font-black text-white uppercase">Aman Raj Verma</p>
                        <p className="text-[9px] font-bold text-emerald-500/60">amanrv2004@gmail.com</p>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center gap-4 px-6 py-4 text-rose-500 font-black text-xs uppercase tracking-widest hover:bg-rose-500/10 rounded-2xl transition-all"><LogOut size={16} /> Logout</button>
                </div>
              </aside>
          </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden z-10">
        <Header 
          activeTab={currentTab} 
          isRefreshing={isRefreshing} 
          fetchData={fetchData} 
          downloadReport={downloadReport} 
          downloadPDF={downloadPDF} 
          setEditingStudent={setEditingStudent} 
          setShowForm={setShowForm} 
          setMobileMenuOpen={setMobileMenuOpen} 
          user={user} 
        />

        <main className="flex-1 overflow-y-auto p-6 lg:p-12 custom-scrollbar">
           <Routes>
              <Route path="/" element={<Dashboard stats={stats} attendance={attendance} analytics={analytics} />} />
              <Route path="/students" element={<Students students={students} onRefresh={fetchData} onEdit={(s) => { setEditingStudent(s); setShowForm(true); }} onShowProfile={(s) => { setSelectedStudent(s); setShowProfile(true); }} />} />
              <Route path="/seats" element={<Seats students={students} seats={seats} onRefresh={fetchData} />} />
              <Route path="/attendance" element={<Attendance attendance={attendance} />} />
              <Route path="/expenses" element={<Expenses expenses={expenses} onRefresh={fetchData} onAdd={() => setShowExpenseForm(true)} />} />
              <Route path="/payments" element={<Payments students={students} onCollect={(s) => { setPaymentStudent(s); setShowPaymentForm(true); }} />} />
              <Route path="/notifications" element={<NotificationsPage notifications={notifications} students={students} onRefresh={fetchData} onAdd={() => setShowNotificationForm(true)} />} />
              <Route path="/support" element={<Complaints complaints={complaints} onRefresh={fetchData} />} />
              <Route path="/settings" element={<Settings admin={user} onUpdate={(updatedUser) => { setUser(updatedUser); localStorage.setItem('admin_user', JSON.stringify(updatedUser)); }} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
           </Routes>
        </main>
      </div>

      {showForm && <StudentForm initialData={editingStudent} onClose={() => setShowForm(false)} onRefresh={fetchData} />}
      {showProfile && <StudentProfile student={selectedStudent} onClose={() => setShowProfile(false)} onEdit={(s) => { setEditingStudent(s); setShowForm(true); }} attendance={attendance} />}
      {showExpenseForm && <ExpenseForm onClose={() => setShowExpenseForm(false)} onRefresh={fetchData} />}
      {showPaymentForm && <PaymentForm student={paymentStudent} onClose={() => setShowPaymentForm(false)} onRefresh={fetchData} />}
      {showNotificationForm && <NotificationForm students={students} onClose={() => setShowNotificationForm(false)} onRefresh={fetchData} />}
    </div>
  );
}
