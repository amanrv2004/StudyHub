import React, { useState } from 'react';
import { 
  Users, TrendingUp, TrendingDown, ShieldCheck, AlertCircle, 
  BarChart3, Clock, ArrowUpRight, ArrowDownRight, Monitor 
} from 'lucide-react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import QRCodePackage from 'react-qr-code';
import Card from '../components/common/Card';
import StatCard from '../components/common/StatCard';
import SnapshotCard from '../components/common/SnapshotCard';
import Pagination from '../components/common/Pagination';

const QRCode = QRCodePackage.default || QRCodePackage;

function Dashboard({ stats, attendance, analytics }) {
  const currentYear = new Date().getFullYear();
  const [viewType, setViewType] = useState('monthly'); // 'monthly', 'yearly', or 'total'
  const [selectedYear, setSelectedYear] = useState(Math.max(2026, currentYear));
  const [pieViewType, setPieViewType] = useState('monthly'); // 'monthly', 'yearly', or 'total'


  // Process Monthly Data for 12 months of the selected year
  const allMonths = Array.from({ length: 12 }, (_, i) => {
    const month = String(i + 1).padStart(2, '0');
    const key = `${selectedYear}-${month}`;
    const date = new Date(selectedYear, i);
    return {
      key,
      label: date.toLocaleString('default', { month: 'short' }),
      income: analytics?.monthly?.[key]?.income || 0,
      expenses: analytics?.monthly?.[key]?.expenses || 0
    };
  });

  const monthlyLabels = allMonths.map(m => m.label);
  const monthlyIncome = allMonths.map(m => m.income);
  const monthlyExpenses = allMonths.map(m => m.expenses);

  // Process Yearly Data (2026 to currentYear)
  const yearlyRange = [];
  for (let y = 2026; y <= Math.max(2026, currentYear); y++) {
    yearlyRange.push({
      year: String(y),
      income: analytics?.yearly?.[String(y)]?.income || 0,
      expenses: analytics?.yearly?.[String(y)]?.expenses || 0
    });
  }

  const yearlyLabels = yearlyRange.map(y => y.year);
  const yearlyIncome = yearlyRange.map(y => y.income);
  const yearlyExpenses = yearlyRange.map(y => y.expenses);

  // Process Total Data
  const totalLabels = ['Cumulative Total'];
  const totalIncome = [stats.totalIncome || 0];
  const totalExpenses = [stats.totalExpenses || 0];

  let activeLabels, activeIncome, activeExpenses;
  if (viewType === 'monthly') {
    activeLabels = monthlyLabels;
    activeIncome = monthlyIncome;
    activeExpenses = monthlyExpenses;
  } else if (viewType === 'yearly') {
    activeLabels = yearlyLabels;
    activeIncome = yearlyIncome;
    activeExpenses = yearlyExpenses;
  } else {
    activeLabels = totalLabels;
    activeIncome = totalIncome;
    activeExpenses = totalExpenses;
  }

  const trendData = {
    labels: activeLabels,
    datasets: [
      {
        label: 'Income',
        data: activeIncome,
        backgroundColor: '#10b981',
        borderRadius: 8,
        barThickness: viewType === 'total' ? 100 : (viewType === 'yearly' ? 40 : 15),
      },
      {
        label: 'Expenses',
        data: activeExpenses,
        backgroundColor: '#f43f5e',
        borderRadius: 8,
        barThickness: viewType === 'total' ? 100 : (viewType === 'yearly' ? 40 : 15),
      }
    ]
  };

  // Dynamic Stats Calculation
  const peakIncome = Math.max(...activeIncome, 0);
  const totalViewIncome = activeIncome.reduce((a, b) => a + b, 0);
  const totalViewExpenses = activeExpenses.reduce((a, b) => a + b, 0);
  const avgCost = activeExpenses.length > 0 ? totalViewExpenses / activeExpenses.length : 0;
  const viewNetProfit = totalViewIncome - totalViewExpenses;

  // Pie Chart Data Calculation
  let pieIncome = stats.totalIncome || 0;
  let pieExpenses = stats.totalExpenses || 0;

  if (pieViewType === 'monthly') {
    // Current month of selected year
    const now = new Date();
    const currentMonthKey = `${selectedYear}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    pieIncome = analytics?.monthly?.[currentMonthKey]?.income || 0;
    pieExpenses = analytics?.monthly?.[currentMonthKey]?.expenses || 0;
  } else if (pieViewType === 'yearly') {
    pieIncome = analytics?.yearly?.[String(selectedYear)]?.income || 0;
    pieExpenses = analytics?.yearly?.[String(selectedYear)]?.expenses || 0;
  }

  const pieChartData = {
    labels: ['Income', 'Expenses'],
    datasets: [{
      data: [pieIncome, pieExpenses],
      backgroundColor: ['#10b981', '#f43f5e'],
      borderWidth: 0,
    }]
  };

  // Matrix Data Calculation
  const allMonthlyData = Object.values(analytics?.monthly || {});
  const activeMonths = allMonthlyData.filter(m => (m.income || 0) > 0 || (m.expenses || 0) > 0).length || 1;
  const avgMonthlyIncome = allMonthlyData.reduce((acc, m) => acc + (m.income || 0), 0) / activeMonths;
  const avgMonthlyInvestment = allMonthlyData.reduce((acc, m) => acc + (m.expenses || 0), 0) / activeMonths;

  const allYearlyData = Object.values(analytics?.yearly || {});
  const activeYears = allYearlyData.filter(y => (y.income || 0) > 0 || (y.expenses || 0) > 0).length || 1;
  const avgYearlyIncome = allYearlyData.reduce((acc, y) => acc + (y.income || 0), 0) / activeYears;
  const avgYearlyInvestment = allYearlyData.reduce((acc, y) => acc + (y.expenses || 0), 0) / activeYears;

  const totalIncomeVal = stats.totalIncome || 0;
  const totalInvestmentVal = stats.totalExpenses || 0;

  const performanceMatrix = [
    { label: 'Avg. Monthly', income: avgMonthlyIncome, investment: avgMonthlyInvestment, profit: avgMonthlyIncome - avgMonthlyInvestment },
    { label: 'Avg. Yearly', income: avgYearlyIncome, investment: avgYearlyInvestment, profit: avgYearlyIncome - avgYearlyInvestment },
    { label: 'Absolute Total', income: totalIncomeVal, investment: totalInvestmentVal, profit: totalIncomeVal - totalInvestmentVal }
  ];

  return (
    <div className="space-y-8 lg:space-y-12 animate-in fade-in duration-700">
       <div className="flex justify-between items-center px-2">
          <div className="flex items-center gap-5">
             <div className="w-12 h-12 bg-emerald-600/10 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-500/20 shadow-2xl shadow-emerald-500/5">
                <ShieldCheck size={24} strokeWidth={2.5} />
             </div>
             <div>
                <h3 className="text-xl lg:text-2xl font-black text-white uppercase tracking-tighter">System Performance</h3>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Real-time financial and occupancy metrics</p>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-8">
          <StatCard title="Active Students" value={stats.totalStudents || 0} color="emerald" icon={Users} trend={+12.4} />
          <StatCard title="Occupied Seats" value={`${stats.occupiedSeats || 0}/${stats.totalSeats || 0}`} color="blue" icon={Monitor} />
          <StatCard title="Total Revenue" value={`₹${(stats.totalIncome || 0).toLocaleString()}`} color="emerald" icon={TrendingUp} trend={+8.2} />
          <StatCard title="Expenses" value={`₹${(stats.totalExpenses || 0).toLocaleString()}`} color="purple" icon={TrendingDown} />
          <StatCard title="Security Deposits" value={`₹${(stats.totalSecurityDeposits || 0).toLocaleString()}`} color="blue" icon={ShieldCheck} />
          <StatCard title="Total Due" value={`₹${(stats.dueFees || 0).toLocaleString()}`} color="rose" icon={AlertCircle} />
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
          <div className="lg:col-span-8 space-y-8 lg:space-y-10">
             <Card noPadding className="border-white/5 bg-slate-900/40 backdrop-blur-3xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none"></div>
                <div className="p-6 lg:p-10 border-b border-white/5 bg-slate-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-500/20 shadow-xl shadow-emerald-500/5">
                         <BarChart3 size={20} lg:size={22} strokeWidth={2.5} />
                      </div>
                      <div>
                         <h3 className="text-lg lg:text-xl font-black text-white uppercase tracking-tighter">Financial Intelligence</h3>
                         <div className="flex flex-wrap items-center gap-2 lg:gap-3 mt-1.5">
                            <div className="flex items-center gap-1 bg-slate-950/40 p-0.5 rounded-lg border border-white/5">
                               {['monthly', 'yearly', 'total'].map((type) => (
                                  <button 
                                     key={type}
                                     onClick={() => setViewType(type)}
                                     className={`text-[8px] lg:text-[9px] font-black uppercase tracking-widest px-2 lg:px-2.5 py-1 rounded-md transition-all ${viewType === type ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-600 hover:text-slate-400'}`}
                                  >
                                     {type}
                                  </button>
                               ))}
                            </div>

                            {(viewType === 'monthly' || viewType === 'yearly') && (
                               <select 
                                  value={selectedYear}
                                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                                  className="bg-slate-950/40 border border-white/5 rounded-lg px-2 py-1 text-[8px] lg:text-[9px] font-black text-emerald-400 uppercase outline-none cursor-pointer"
                               >
                                  {Array.from({ length: (Math.max(2026, currentYear) - 2026) + 1 }, (_, i) => 2026 + i).map(y => (
                                     <option key={y} value={y}>{y}</option>
                                  ))}
                               </select>
                            )}
                         </div>
                      </div>
                   </div>
                   <div className="flex items-center gap-4 lg:gap-6 sm:pr-4">
                      <div className="flex items-center gap-2">
                         <div className="w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                         <span className="text-[8px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest">Revenue</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <div className="w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"></div>
                         <span className="text-[8px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest">Expenses</span>
                      </div>
                   </div>
                </div>
                <div className="p-4 lg:p-10 h-[280px] sm:h-[350px] lg:h-[450px]">
                   <Bar 
                     data={trendData} 
                     options={{ 
                         maintainAspectRatio: false, 
                         responsive: true,
                         plugins: { 
                             legend: { display: false },
                             tooltip: {
                               backgroundColor: '#020617',
                               titleFont: { family: 'Plus Jakarta Sans', weight: '900', size: 12 },
                               bodyFont: { family: 'Plus Jakarta Sans', weight: 'bold', size: 11 },
                               padding: 16,
                               cornerRadius: 16,
                               borderColor: 'rgba(255,255,255,0.05)',
                               borderWidth: 1,
                               displayColors: true,
                               usePointStyle: true,
                               boxPadding: 8
                             }
                         }, 
                         scales: { 
                             y: { 
                               grid: { color: 'rgba(255,255,255,0.03)', drawBorder: false }, 
                               ticks: { 
                                   color: '#64748b', 
                                   font: { weight: '800', size: 8 },
                                   callback: (val) => '₹' + (val || 0).toLocaleString()
                               } 
                             }, 
                             x: { 
                               grid: { display: false }, 
                               ticks: { 
                                   color: '#64748b', 
                                   font: { weight: '800', size: 8 } 
                               } 
                             } 
                         },
                         interaction: { intersect: false, mode: 'index' }
                     }} 
                   />
                </div>
                <div className="px-6 lg:px-10 py-6 border-t border-white/5 bg-slate-950/20 flex flex-wrap gap-6 lg:gap-10">
                    <div>
                        <p className="text-[8px] lg:text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Peak {viewType} Income</p>
                        <p className="text-sm lg:text-lg font-black text-emerald-400 font-mono">₹{peakIncome.toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-[8px] lg:text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Investment Cost ({viewType})</p>
                        <p className="text-sm lg:text-lg font-black text-rose-400 font-mono">₹{totalViewExpenses.toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-[8px] lg:text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{viewType === 'total' ? 'Overall' : viewType} Net Profit</p>
                        <p className={`text-sm lg:text-lg font-black font-mono ${viewNetProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>₹{viewNetProfit.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto sm:ml-auto justify-end sm:justify-start">
                        <div className={`px-4 py-2 rounded-2xl text-[9px] lg:text-[10px] font-black uppercase tracking-widest ${viewNetProfit >= 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                            {viewNetProfit >= 0 ? 'Profitable' : 'Loss-making'}
                        </div>
                    </div>
                </div>
             </Card>

             <section>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-4 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                    <h4 className="text-[10px] lg:text-[11px] font-black text-white uppercase tracking-[0.3em]">Institutional Performance Analytics</h4>
                </div>
                <Card noPadding className="border-white/5 bg-slate-900/40 backdrop-blur-3xl overflow-hidden mb-10">
                   <div className="overflow-x-auto custom-scrollbar">
                      <table className="w-full text-left border-collapse min-w-[600px]">
                         <thead>
                            <tr className="bg-slate-950/40 border-b border-white/5">
                               <th className="p-4 lg:p-6 text-[9px] lg:text-[10px] font-black text-slate-500 uppercase tracking-widest">Performance Period</th>
                               <th className="p-4 lg:p-6 text-[9px] lg:text-[10px] font-black text-emerald-500 uppercase tracking-widest">Net Revenue (Income)</th>
                               <th className="p-4 lg:p-6 text-[9px] lg:text-[10px] font-black text-rose-500 uppercase tracking-widest">Investment Cost</th>
                               <th className="p-4 lg:p-6 text-[9px] lg:text-[10px] font-black text-blue-500 uppercase tracking-widest">Net Profit/Loss</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-white/5">
                            {performanceMatrix.map((row, idx) => (
                               <tr key={idx} className="hover:bg-white/[0.02] transition-colors group">
                                  <td className="p-4 lg:p-6">
                                     <p className="text-[10px] lg:text-xs font-black text-white uppercase tracking-tighter">{row.label}</p>
                                     <p className="text-[7px] lg:text-[8px] text-slate-500 font-bold uppercase mt-1">Aggregated Metrics</p>
                                  </td>
                                  <td className="p-4 lg:p-6">
                                     <p className="text-xs lg:text-sm font-mono font-black text-emerald-400">₹{Math.round(row.income).toLocaleString()}</p>
                                  </td>
                                  <td className="p-4 lg:p-6">
                                     <p className="text-xs lg:text-sm font-mono font-black text-rose-400">₹{Math.round(row.investment).toLocaleString()}</p>
                                  </td>
                                  <td className="p-4 lg:p-6">
                                     <div className="flex items-center gap-3">
                                        <p className={`text-xs lg:text-sm font-mono font-black ${row.profit >= 0 ? 'text-blue-400' : 'text-rose-500'}`}>
                                           ₹{Math.round(row.profit).toLocaleString()}
                                        </p>
                                        {row.profit >= 0 ? (
                                           <div className="w-4 h-4 lg:w-5 lg:h-5 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                                              <TrendingUp size={10} lg:size={12} />
                                           </div>
                                        ) : (
                                           <div className="w-4 h-4 lg:w-5 lg:h-5 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20">
                                              <TrendingDown size={10} lg:size={12} />
                                           </div>
                                        )}
                                     </div>
                                  </td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                </Card>
             </section>
          </div>
          <div className="lg:col-span-4 space-y-8 lg:space-y-10">
             <Card glow className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 border-emerald-500/20 text-center">
                <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-6 lg:mb-10">Attendance QR Code</h4>
                <div className="aspect-square bg-white rounded-3xl p-6 lg:p-10 flex flex-col items-center justify-center gap-6 shadow-2xl group overflow-hidden">
                   <QRCode value="STUDY_HUB_AUTH_2026" size={180} />
                </div>
                <p className="text-[9px] lg:text-[10px] text-slate-500 mt-6 lg:mt-10 font-bold uppercase tracking-widest leading-loose">Display for students to mark attendance.</p>
             </Card>
             <Card>
                <div className="flex flex-col items-center gap-4 mb-8">
                   <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Revenue Share</h4>
                   <div className="flex items-center gap-2 bg-slate-950/40 p-1 rounded-lg border border-white/5">
                      {['monthly', 'yearly', 'total'].map((type) => (
                         <button 
                            key={type}
                            onClick={() => setPieViewType(type)}
                            className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md transition-all ${pieViewType === type ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-600 hover:text-slate-400'}`}
                         >
                            {type}
                         </button>
                      ))}
                   </div>
                </div>
                <div className="aspect-square flex items-center justify-center p-2">
                   <Pie data={pieChartData} options={{ plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', font: { weight: 'bold', size: 10 } } } } }} />
                </div>
             </Card>
          </div>
       </div>
    </div>
  );
}

export default Dashboard;
