import React from 'react';
import { ListChecks, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

const QuickStats = ({ tasks }) => {
  const stats = [
    { label: 'Wszystkie', count: tasks.length, icon: <ListChecks size={18}/>, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'W toku', count: tasks.filter(t => t.status === 'IN_PROGRESS').length, icon: <Clock size={18}/>, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Blokady', count: tasks.filter(t => t.status === 'BLOCKED').length, icon: <AlertCircle size={18}/>, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Gotowe', count: tasks.filter(t => t.status === 'DONE').length, icon: <CheckCircle2 size={18}/>, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map(s => (
        <div key={s.label} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className={`p-2.5 ${s.bg} ${s.color} rounded-xl`}>{s.icon}</div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">{s.label}</p>
            <p className="text-xl font-black text-slate-800">{s.count}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;