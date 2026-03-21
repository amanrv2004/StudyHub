import React from 'react';
import { ShieldCheck } from 'lucide-react';
import Card from '../components/common/Card';

function Login({ loginId, setLoginId, password, setPassword, handleLogin, error, isLoggingIn }) {
  return (
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
}

export default Login;
