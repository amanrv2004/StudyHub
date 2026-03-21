import React from 'react';
import { ShieldCheck, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ handleLogout, setMobileMenuOpen }) => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Students', path: '/students' },
    { name: 'Seats', path: '/seats' },
    { name: 'Attendance', path: '/attendance' },
    { name: 'Expenses', path: '/expenses' },
    { name: 'Payments', path: '/payments' },
    { name: 'News', path: '/notifications' },
    { name: 'Support', path: '/support' },
    { name: 'Settings', path: '/settings' }
  ];

  const Navigation = () => (
    <nav className="space-y-10">
        <section>
            <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.25em] mb-6 pl-2">Management</p>
            <div className="space-y-2">
                {menuItems.map(item => (
                <Link 
                  key={item.name} 
                  to={item.path}
                  onClick={() => setMobileMenuOpen && setMobileMenuOpen(false)} 
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-[1.25rem] transition-all duration-300 font-bold group ${location.pathname === item.path ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                >
                    <span className="text-sm">{item.name}</span>
                    {location.pathname === item.path && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0:10px_rgba(16,185,129,1)]"></div>}
                </Link>
                ))}
            </div>
        </section>
    </nav>
  );

  return (
    <aside className="hidden lg:flex w-80 border-r border-white/5 flex-col z-20 bg-slate-950/60 backdrop-blur-3xl p-8 shrink-0 overflow-y-auto custom-scrollbar">
        <div className="flex items-center gap-4 mb-16">
           <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/50 transform -rotate-6"><ShieldCheck className="text-white" size={26} strokeWidth={2.5} /></div>
           <div><h1 className="text-2xl font-black tracking-tighter text-white leading-none uppercase">STUDY HUB</h1><p className="text-[9px] uppercase tracking-[0.4em] text-emerald-500 font-black mt-2">Admin Dashboard</p></div>
        </div>
        <Navigation />
        
        <div className="mt-auto pt-10 border-t border-white/5 space-y-6">
            <div className="px-2">
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mb-3">System Developer</p>
                <p className="text-xs font-black text-white uppercase tracking-tighter">Aman Raj Verma</p>
                <a href="mailto:amanrv2004@gmail.com" className="text-[10px] font-bold text-emerald-500/60 hover:text-emerald-400 transition-colors">amanrv2004@gmail.com</a>
            </div>
            <button onClick={handleLogout} className="w-full flex items-center gap-4 px-6 py-4 text-rose-500 font-black text-sm uppercase tracking-widest hover:bg-rose-500/10 rounded-2xl transition-all"><LogOut size={18} /> Logout</button>
        </div>
    </aside>
  );
};

export default Sidebar;
