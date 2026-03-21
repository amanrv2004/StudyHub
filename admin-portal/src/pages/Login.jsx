import React from 'react';
import { ShieldCheck } from 'lucide-react';
import Card from '../components/common/Card';

function Login({ loginData, setLoginData, handleLogin, loginError, isLoggingIn }) {
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
         <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#020617]/80 to-[#020617]"></div>
      </div>
      <Card className="w-full max-w-md z-10 border-white/10 bg-slate-900/40 backdrop-blur-2xl p-8 md:p-16">
        <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-600/40 transform -rotate-6">
          <ShieldCheck className="text-white" size={32} />
        </div>
        <h2 className="text-3xl font-black text-white text-center mb-2 uppercase tracking-tighter">STUDY HUB</h2>
        <p className="text-[10px] text-emerald-500 font-black text-center mb-10 uppercase tracking-[0.4em]">Admin Management Login</p>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Admin Email</label>
            <input required type="email" placeholder="admin@example.com" className="w-full bg-slate-950/60 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm font-black tracking-widest focus:border-emerald-500/50 outline-none transition-all placeholder:text-slate-800" value={loginData.email} onChange={e => setLoginData({...loginData, email: e.target.value})} />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Password</label>
            <input required type="password" placeholder="••••••••" className="w-full bg-slate-950/60 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm font-black tracking-widest focus:border-emerald-500/50 outline-none transition-all placeholder:text-slate-800" value={loginData.password} onChange={e => setLoginData({...loginData, password: e.target.value})} />
          </div>
          {loginError && <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[10px] text-rose-500 font-black uppercase tracking-widest text-center">{loginError}</div>}
          <button disabled={isLoggingIn} className="w-full py-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50">
            {isLoggingIn ? 'VERIFYING...' : 'Login to Dashboard'}
          </button>
        </form>
      </Card>
    </div>
  );
}

export default Login;
