import React from 'react';
import { Menu, RefreshCw, FileSpreadsheet, Download, Plus } from 'lucide-react';

const Header = ({ activeTab, isRefreshing, fetchData, downloadReport, downloadPDF, setEditingStudent, setShowForm, setMobileMenuOpen, user }) => {
  return (
    <header className="h-20 lg:h-24 border-b border-white/5 flex items-center justify-between px-6 lg:px-12 bg-slate-950/30 backdrop-blur-3xl shrink-0">
       <div className="flex items-center gap-4 lg:gap-6">
          <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 hover:bg-white/5 rounded-xl transition-all text-slate-400"><Menu size={24} /></button>
          <h2 className="text-lg lg:text-2xl font-black text-white tracking-tight uppercase truncate">{activeTab}</h2>
          <button onClick={fetchData} className={`p-2 rounded-xl hover:bg-white/5 transition-all text-slate-500 hover:text-emerald-400 ${isRefreshing ? 'animate-spin text-emerald-500' : ''}`} title="Refresh Data">
             <RefreshCw size={18} />
          </button>
       </div>
       
       <div className="flex items-center gap-2 lg:gap-4 overflow-x-auto custom-scrollbar no-scrollbar py-2">
          <button onClick={downloadReport} className="flex items-center gap-2 px-4 lg:px-6 py-2.5 lg:py-3 rounded-xl lg:rounded-2xl border border-emerald-500/20 text-emerald-400 text-[9px] lg:text-[10px] font-black uppercase tracking-[0.1em] lg:tracking-[0.2em] hover:bg-emerald-500/10 transition-all shrink-0">
            <FileSpreadsheet size={14} className="hidden sm:inline" /> <span className="sm:hidden">XLS</span><span className="hidden sm:inline">Excel</span>
          </button>
          <button onClick={downloadPDF} className="flex items-center gap-2 px-4 lg:px-6 py-2.5 lg:py-3 rounded-xl lg:rounded-2xl border border-emerald-500/20 text-emerald-400 text-[9px] lg:text-[10px] font-black uppercase tracking-[0.1em] lg:tracking-[0.2em] hover:bg-emerald-500/10 transition-all shrink-0">
            <Download size={14} className="hidden sm:inline" /> <span className="sm:hidden">PDF</span><span className="hidden sm:inline">PDF</span>
          </button>
          <button onClick={() => { setEditingStudent(null); setShowForm(true); }} className="flex items-center gap-2 px-4 lg:px-8 py-2.5 lg:py-3 rounded-xl lg:rounded-2xl bg-emerald-600 text-white text-[9px] lg:text-[10px] font-black uppercase tracking-[0.1em] lg:tracking-[0.2em] hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-500/20 shrink-0">
            <Plus size={14} className="hidden sm:inline" /> Add <span className="hidden sm:inline">Student</span>
          </button>
          
          <div className="h-8 w-px bg-white/10 mx-1 lg:mx-2 hidden md:block"></div>
          
          <div className="hidden md:flex items-center gap-4 lg:gap-6 shrink-0">
             {user && (
                <div className="text-right leading-none hidden lg:block">
                    <p className="text-sm font-black text-white">{user.fullName}</p>
                    <p className="text-[9px] text-emerald-500 font-black uppercase tracking-widest mt-1">Admin Profile</p>
                </div>
             )}
          </div>
       </div>
    </header>
  );
};

export default Header;
