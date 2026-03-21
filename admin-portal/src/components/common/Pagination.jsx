import React from 'react';

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 py-6 border-t border-white/5 bg-slate-950/10">
      <button 
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-4 py-2 rounded-xl border border-white/10 text-[10px] font-black uppercase text-slate-500 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
      >
        Previous
      </button>
      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
        Page {currentPage} of {totalPages}
      </span>
      <button 
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-4 py-2 rounded-xl border border-white/10 text-[10px] font-black uppercase text-slate-500 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
