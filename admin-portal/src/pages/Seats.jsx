import React, { useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../services/api';
import Card from '../components/common/Card';

function Seats({ students, seats, onRefresh }) {
  const [isInitializing, setIsInitializing] = useState(false);
  const [newSeat, setNewSeat] = useState('');

  const handleInitialize = async () => {
    if (!window.confirm('This will create 60 default seats (A1-F10). Continue?')) return;
    setIsInitializing(true);
    try {
      await axios.post(`${API_URL}/seats/initialize`);
      onRefresh();
    } catch (err) { alert('Init failed'); }
    finally { setIsInitializing(false); }
  };

  const handleAddSeat = async (e) => {
    e.preventDefault();
    if (!newSeat) return;
    try {
      await axios.post(`${API_URL}/seats`, { seatNumber: newSeat.toUpperCase() });
      setNewSeat('');
      onRefresh();
    } catch (err) { alert(err.response?.data?.message || 'Failed to add seat'); }
  };

  const handleDeleteSeat = async (id) => {
    if (!window.confirm('Delete this seat?')) return;
    try {
      await axios.delete(`${API_URL}/seats/${id}`);
      onRefresh();
    } catch (err) { alert('Delete failed'); }
  };

  return (
    <Card className="animate-in fade-in duration-700 p-6 lg:p-12 bg-slate-950/40 border-emerald-500/10">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 lg:gap-8 mb-10 lg:mb-16">
          <div><h3 className="text-xl lg:text-2xl font-black text-white uppercase tracking-tighter">Seat Management</h3><p className="text-[9px] lg:text-[10px] text-slate-500 font-black uppercase tracking-widest mt-2">Configure study spaces</p></div>
          <div className="flex flex-wrap gap-3 lg:gap-4 w-full md:w-auto">
             <form onSubmit={handleAddSeat} className="flex gap-2 flex-1 md:flex-initial">
                <input placeholder="G1" className="flex-1 md:w-24 bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-xs font-black uppercase text-white outline-none focus:border-emerald-500/50" value={newSeat} onChange={e => setNewSeat(e.target.value)} />
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white text-[9px] lg:text-[10px] font-black uppercase rounded-xl hover:bg-emerald-500 transition-all shrink-0">Add</button>
             </form>
             <button onClick={handleInitialize} disabled={isInitializing} className="flex-1 md:flex-initial px-4 lg:px-6 py-2 border border-emerald-500/20 text-emerald-400 text-[9px] lg:text-[10px] font-black uppercase rounded-xl hover:bg-emerald-500/10 transition-all disabled:opacity-50 shrink-0">
                {isInitializing ? '...' : 'Auto-Setup'}
             </button>
          </div>
       </div>

       <div className="flex flex-wrap gap-4 lg:gap-8 mb-8 lg:mb-10 pb-8 lg:pb-10 border-b border-white/5">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div><span className="text-[9px] lg:text-[10px] text-slate-500 uppercase font-black">Occupied</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-slate-800"></div><span className="text-[9px] lg:text-[10px] text-slate-500 uppercase font-black">Available</span></div>
          <div className="ml-auto text-[9px] lg:text-[10px] text-slate-500 uppercase font-black">Total: {seats.length}</div>
       </div>

       <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 lg:gap-6">
          {seats.sort((a,b) => a.seatNumber.localeCompare(b.seatNumber, undefined, {numeric: true})).map(seat => {
            const student = students.find(s => s.seat === seat.seatNumber);
            return (
              <div key={seat._id} className={`aspect-square rounded-xl lg:rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer group relative ${student ? 'border-emerald-500/40 bg-emerald-500/5 text-emerald-500' : 'border-slate-800 bg-slate-900/40 text-slate-600 hover:border-slate-600'}`}>
                 <span className="text-[9px] lg:text-[10px] font-black">{seat.seatNumber}</span>
                 <div className={`w-1.5 h-0.5 rounded-full ${student ? 'bg-emerald-500' : 'bg-slate-800'}`}></div>
                 
                 <button onClick={(e) => { e.stopPropagation(); handleDeleteSeat(seat._id); }} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10">
                    <X size={10} strokeWidth={4} />
                 </button>

                 {student && (
                   <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-950 border border-emerald-500/30 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50 whitespace-nowrap shadow-2xl">
                      <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">{student.fullName || 'Unnamed'}</p>
                   </div>
                 )}
              </div>
            );
          })}
       </div>
    </Card>
  );
}

export default Seats;
