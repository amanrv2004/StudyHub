import React, { useState } from 'react';
import { Bell, Plus, AlertCircle, MessageSquare, Trash2 } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../services/api';
import Card from '../components/common/Card';
import Pagination from '../components/common/Pagination';

function Notifications({ notifications, students, onRefresh, onAdd }) {
    const [page, setPage] = useState(1);
    const itemsPerPage = 7;
    const [isBroadcasting, setIsBroadcasting] = useState(false);

    const deleteNote = async (id) => {
        if (!id) return;
        if (!window.confirm('Delete announcement?')) return;
        try { await axios.delete(`${API_URL}/notifications/${id}`); onRefresh(); } catch (err) { alert('Delete failed'); }
    };

    const deleteAllNotes = async () => {
        if (notifications.length === 0) return;
        if (!window.confirm('CRITICAL: This will permanently delete ALL broadcast messages. This action cannot be undone. Proceed?')) return;
        try {
            await axios.delete(`${API_URL}/notifications/delete-all`);
            alert('All announcements cleared.');
            onRefresh();
            setPage(1);
        } catch (err) {
            alert('Failed to clear announcements.');
        }
    };

    const broadcastDueReminders = async () => {
        const dueStudents = students.filter(s => (s.dueAmount || 0) > 0);
        if (dueStudents.length === 0) return alert('No students have outstanding dues.');
        if (!window.confirm(`Send due reminders to ${dueStudents.length} students?`)) return;

        setIsBroadcasting(true);
        try {
            await Promise.all(dueStudents.map(s => 
                axios.post(`${API_URL}/notifications`, {
                    title: 'System: Fee Reminder',
                    message: `Dear ${s.fullName || 'Student'}, you have an outstanding balance of Rs.${(s.dueAmount || 0).toLocaleString()}. Please clear your dues at the earliest.`,
                    recipient: s.studyId,
                    type: 'Fee Reminder'
                })
            ));
            alert(`Successfully broadcasted reminders to ${dueStudents.length} students.`);
            onRefresh();
        } catch (err) {
            alert('Bulk broadcast failed. Some messages may not have been sent.');
        } finally {
            setIsBroadcasting(false);
        }
    };

    const paginatedNotifications = notifications.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <Card noPadding className="border-emerald-500/10">
                <div className="p-6 lg:p-8 border-b border-white/5 bg-slate-950/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h3 className="text-xs lg:text-sm font-black text-white uppercase tracking-widest flex items-center gap-3"><Bell className="text-emerald-500" size={18} /> Announcements</h3>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        {notifications.length > 0 && (
                            <button 
                                onClick={deleteAllNotes}
                                className="p-2.5 rounded-xl border border-rose-500/30 bg-rose-500/5 text-rose-400 hover:bg-rose-500/10 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-rose-500/5"
                                title="Clear All Announcements"
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                        <button 
                            onClick={broadcastDueReminders} 
                            disabled={isBroadcasting}
                            className="flex-1 sm:flex-initial px-4 lg:px-6 py-2 rounded-xl border border-rose-500/30 bg-rose-500/5 text-rose-400 text-[9px] lg:text-[10px] font-black uppercase tracking-widest hover:bg-rose-500/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <AlertCircle size={14} /> {isBroadcasting ? 'Broadcasting...' : 'Due Reminders'}
                        </button>
                        <button onClick={onAdd} className="flex-1 sm:flex-initial px-4 lg:px-6 py-2 rounded-xl bg-emerald-600 text-white text-[9px] lg:text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20">
                            <Plus size={14} /> <span>New Message</span>
                        </button>
                    </div>
                </div>
                <div className="divide-y divide-white/5">
                    {paginatedNotifications.map(n => (
                        <div key={n._id} className="p-6 lg:p-8 flex items-center justify-between group hover:bg-white/[0.02] transition-all">
                            <div className="flex gap-4 lg:gap-6 min-w-0">
                                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0"><MessageSquare size={18} lg:size={20} /></div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2 lg:gap-3 mb-1 flex-wrap">
                                        <p className="text-xs lg:text-sm font-black text-white uppercase truncate">{n.title}</p>
                                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[7px] lg:text-[8px] font-black text-slate-400 uppercase">TO: {n.recipient}</span>
                                    </div>
                                    <p className="text-[10px] lg:text-xs text-slate-400 font-bold leading-relaxed truncate lg:whitespace-normal">{n.message}</p>
                                </div>
                            </div>
                            <button onClick={() => deleteNote(n._id)} className="p-2 text-slate-600 hover:text-rose-500 transition-opacity"><Trash2 size={16} lg:size={18} /></button>
                        </div>
                    ))}
                    {notifications.length === 0 && (
                        <div className="p-20 text-center">
                            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-slate-700 mx-auto mb-6 border border-white/5">
                                <Bell size={32} />
                            </div>
                            <p className="text-xs text-slate-600 uppercase font-black tracking-widest leading-loose">No broadcast messages found</p>
                        </div>
                    )}
                </div>
                <Pagination 
                    totalItems={notifications.length} 
                    itemsPerPage={itemsPerPage} 
                    currentPage={page} 
                    onPageChange={setPage} 
                />
            </Card>
        </div>
    );
}

export default Notifications;
