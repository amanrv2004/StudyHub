import React from 'react';
import { 
  LayoutDashboard, Activity, CreditCard, MessageSquare, User, LogOut, Badge
} from 'lucide-react';

export const StudentHeader = ({ student }) => (
  <header className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 relative z-10 gap-6">
     <div className="space-y-4">
        <span className="px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(59,130,246,0.2)]">
          Student Dashboard Online
        </span>
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
);

export const StudentNavigation = ({ activeTab, setActiveTab, handleLogout }) => (
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
);
