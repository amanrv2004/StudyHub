import React, { useState } from 'react';
import { Search, TrendingDown, Trash2, Plus } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../services/api';
import Card from '../components/common/Card';
import Pagination from '../components/common/Pagination';

function Expenses({ expenses, onRefresh, onAdd }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [page, setPage] = useState(1);
    const itemsPerPage = 7;

    const filteredExpenses = expenses.filter(e => {
        const matchesSearch = (e.title || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || e.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const paginatedExpenses = filteredExpenses.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <Card noPadding className="border-rose-500/10">
           <div className="p-6 lg:p-8 border-b border-white/5 bg-slate-950/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h3 className="text-xs lg:text-sm font-black text-white uppercase tracking-widest">Expense Records</h3>
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                 <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                    <input 
                       type="text" 
                       placeholder="Search expense..." 
                       className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs font-bold text-white outline-none focus:border-rose-500/50 transition-all"
                       value={searchTerm}
                       onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                    />
                 </div>
                 <select 
                    className="w-full sm:w-auto bg-slate-900/50 border border-white/10 rounded-xl py-2 px-4 text-xs font-black text-slate-400 uppercase outline-none focus:border-rose-500/50 transition-all"
                    value={categoryFilter}
                    onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
                 >
                    <option value="All">All Categories</option>
                    <option value="Rent">Rent</option>
                    <option value="Electricity">Electricity</option>
                    <option value="Internet">Internet</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="General">General</option>
                 </select>
                 <button onClick={onAdd} className="w-full sm:w-auto px-4 lg:px-6 py-2 rounded-xl bg-rose-600 text-white text-[9px] lg:text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 transition-all flex items-center justify-center gap-2"><Plus size={14} /> Add</button>
              </div>
           </div>
           <div className="divide-y divide-white/5">
              {paginatedExpenses.map(e => (
                 <div key={e._id} className="p-4 lg:p-6 flex items-center justify-between hover:bg-white/[0.02] transition-all group">
                    <div className="flex items-center gap-3 lg:gap-5 min-w-0">
                       <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0"><TrendingDown size={18} /></div>
                       <div className="min-w-0"><p className="text-xs lg:text-sm font-black text-white uppercase truncate">{e.title || 'Untitled Expense'}</p><p className="text-[8px] lg:text-[10px] text-slate-500 font-bold uppercase mt-1 truncate">{e.category} • {e.date ? new Date(e.date).toLocaleDateString() : 'Unknown Date'}</p></div>
                    </div>
                    <div className="flex items-center gap-4 lg:gap-6 shrink-0">
                        <p className="text-xs lg:text-sm font-black text-rose-400 font-mono">₹{(e.amount || 0).toLocaleString()}</p>
                        <button onClick={async () => { if(window.confirm('Delete expense?')) { await axios.delete(`${API_URL}/expenses/${e._id}`); onRefresh(); } }} className="p-2 text-slate-600 hover:text-rose-500 transition-opacity"><Trash2 size={16} /></button>
                    </div>
                 </div>
              ))}
              {filteredExpenses.length === 0 && <div className="p-10 lg:p-20 text-center text-slate-600 uppercase font-black tracking-widest text-xs">No records found</div>}
           </div>
           <Pagination 
                totalItems={filteredExpenses.length} 
                itemsPerPage={itemsPerPage} 
                currentPage={page} 
                onPageChange={setPage} 
            />
        </Card>
    );
}

export default Expenses;
