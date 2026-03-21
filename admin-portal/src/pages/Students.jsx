import React, { useState } from 'react';
import { Search, FileEdit, Trash2 } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../services/api';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Pagination from '../components/common/Pagination';

function Students({ students, onRefresh, onEdit, onShowProfile }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [studentsPage, setStudentsPage] = useState(1);
  const itemsPerPage = 7;

  const filteredStudents = students.filter(s => 
    (s.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.studyId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.seat || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedStudents = filteredStudents.slice((studentsPage - 1) * itemsPerPage, studentsPage * itemsPerPage);

  const handleDelete = async (id) => {
    if(window.confirm('Delete student record?')){
      try {
        await axios.delete(`${API_URL}/students/${id}`);
        onRefresh();
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  return (
    <Card noPadding className="border-emerald-500/10 animate-in slide-in-from-bottom-5 duration-700">
       <div className="p-6 lg:p-10 bg-slate-950/20 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h3 className="text-sm lg:text-xl font-black text-white uppercase tracking-widest">Student Management</h3>
          <div className="relative w-full md:w-72">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
             <input 
                type="text" 
                placeholder="Search students..." 
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-xs font-bold text-white outline-none focus:border-emerald-500/50 transition-all"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setStudentsPage(1); }}
             />
          </div>
       </div>
       <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left min-w-[700px] lg:min-w-[800px]">
             <thead className="text-[9px] lg:text-[10px] text-slate-500 uppercase tracking-[0.2em] lg:tracking-[0.25em] font-black bg-slate-950/30 border-b border-white/5">
                <tr>
                   <th className="px-4 lg:px-10 py-4 lg:py-6">Student</th>
                   <th className="px-4 lg:px-10 py-4 lg:py-6">Seat / ID</th>
                   <th className="px-4 lg:px-10 py-4 lg:py-6">Status</th>
                   <th className="px-4 lg:px-10 py-4 lg:py-6">Attendance</th>
                   <th className="px-4 lg:px-10 py-4 lg:py-6 text-right">Actions</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-white/5">
                {paginatedStudents.map(s => (
                   <tr key={s._id} onClick={() => onShowProfile(s)} className="hover:bg-emerald-500/[0.05] transition-all group cursor-pointer border-l-2 border-transparent hover:border-emerald-500">
                      <td className="px-4 lg:px-10 py-4 lg:py-6 flex items-center gap-3 lg:gap-5">
                         <div className="w-8 h-8 lg:w-12 lg:h-12 rounded-lg lg:rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center text-[10px] lg:text-xs font-black text-slate-500 group-hover:border-emerald-500/50 transition-all uppercase">{(s.fullName || '?').charAt(0)}</div>
                         <div className="min-w-0">
                            <p className="text-[11px] lg:text-sm font-black text-white uppercase truncate max-w-[120px] lg:max-w-none">{s.fullName || 'Unnamed'}</p>
                            <p className="text-[8px] lg:text-[10px] text-slate-500 mt-0.5 lg:mt-1 font-bold truncate max-w-[120px] lg:max-w-none">{s.email || 'No Email'}</p>
                         </div>
                      </td>
                      <td className="px-4 lg:px-10 py-4 lg:py-6 text-[9px] lg:text-xs text-emerald-500 font-black font-mono uppercase tracking-widest">
                         <p>{s.studyId}</p>
                         <p className="text-slate-600 text-[7px] lg:text-[9px] mt-0.5 lg:mt-1">SEAT {s.seat}</p>
                      </td>
                      <td className="px-4 lg:px-10 py-4 lg:py-6"><Badge>{s.status}</Badge></td>
                      <td className="px-4 lg:px-10 py-4 lg:py-6">
                         <div className="flex flex-col gap-1.5 lg:gap-2">
                            <div className="flex items-center gap-2 lg:gap-3">
                               <div className="flex-1 h-1 w-16 lg:w-24 bg-slate-900 rounded-full overflow-hidden">
                                  <div className="h-full bg-emerald-500" style={{width: `${s.attendancePercentage || 0}%`}}></div>
                               </div>
                               <span className="text-[8px] lg:text-[10px] font-black text-slate-300">{s.attendancePercentage || 0}%</span>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <p className="text-[7px] lg:text-[9px] font-black text-slate-600 uppercase tracking-widest truncate">Last: {s.lastCheckIn || '--'}</p>
                                <p className="text-[7px] lg:text-[9px] font-black text-emerald-500/60 uppercase tracking-widest shrink-0">{s.daysAttendedThisMonth || 0} Days</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-4 lg:px-10 py-4 lg:py-6 text-right group-hover:opacity-100 transition-opacity">
                         <div className="flex justify-end items-center">
                            <button onClick={(e) => { e.stopPropagation(); onEdit(s); }} className="p-1.5 lg:p-3 text-slate-500 hover:text-emerald-400"><FileEdit size={14} lg:size={18} /></button>
                            <button onClick={(e) => { e.stopPropagation(); handleDelete(s._id); }} className="p-1.5 lg:p-3 text-slate-500 hover:text-rose-500"><Trash2 size={14} lg:size={18} /></button>
                         </div>
                      </td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>
       <Pagination 
          totalItems={filteredStudents.length} 
          itemsPerPage={itemsPerPage} 
          currentPage={studentsPage} 
          onPageChange={setStudentsPage} 
       />
    </Card>
  );
}

export default Students;
