import React from 'react';
import { History } from 'lucide-react';
import Card from '../components/common/Card';

function Payments({ payments }) {
    return (
        <Card className="bg-slate-900/40 border-white/5 h-full">
            <h4 className="text-xs font-black text-white uppercase tracking-[0.25em] mb-10 flex items-center gap-3">
                <History className="text-blue-400" size={18} /> Payment History
            </h4>
            <div className="overflow-x-auto -mx-4 sm:-mx-6 md:mx-0 custom-scrollbar">
                <table className="w-full text-left min-w-[450px]">
                    <thead className="text-[9px] lg:text-[10px] text-slate-500 uppercase tracking-widest font-black border-b border-white/5">
                        <tr>
                            <th className="px-4 lg:px-6 py-4">Month</th>
                            <th className="px-4 lg:px-6 py-4">Amount</th>
                            <th className="px-4 lg:px-6 py-4">Method</th>
                            <th className="px-4 lg:px-6 py-4">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {payments.map(p => (
                            <tr key={p._id} className="text-xs lg:text-sm font-bold hover:bg-white/5 transition-all">
                                <td className="px-4 lg:px-6 py-4">
                                    <div className="flex items-center gap-2 lg:gap-3">
                                        <span className="text-white truncate max-w-[80px] lg:max-w-none">{p.month}</span>
                                        {p.month === 'Initial Deposit' && (
                                            <span className="px-1.5 lg:px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[7px] lg:text-[8px] font-black uppercase tracking-widest shrink-0">Security</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 lg:px-6 py-4 text-emerald-400 font-mono text-[11px] lg:text-sm">₹{p.amount}</td>
                                <td className="px-4 lg:px-6 py-4 text-slate-400 text-[10px] lg:text-sm">{p.method}</td>
                                <td className="px-4 lg:px-6 py-4 text-slate-500 text-[10px] lg:text-sm whitespace-nowrap">{new Date(p.paymentDate).toLocaleDateString()}</td>
                            </tr>
                        ))}
                        {payments.length === 0 && <tr><td colSpan="4" className="p-10 text-center text-slate-600 uppercase font-black text-xs">No records found</td></tr>}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}

export default Payments;
