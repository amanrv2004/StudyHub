import React from 'react';
import { ChevronRight } from 'lucide-react';

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
      <button 
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="p-2 rounded-xl bg-slate-950 border border-white/10 text-slate-500 hover:text-white disabled:opacity-30 transition-all"
      >
        <ChevronRight className="rotate-180" size={18} />
      </button>
      <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">
        {currentPage} / {totalPages}
      </span>
      <button 
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="p-2 rounded-xl bg-slate-950 border border-white/10 text-slate-500 hover:text-white disabled:opacity-30 transition-all"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;
