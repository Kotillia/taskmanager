import React from 'react';
import { Layout, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const StatCard = ({ title, count, icon, colorClass }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-lg ${colorClass}`}>{icon}</div>
      <span className="text-2xl font-bold text-slate-800">{count}</span>
    </div>
    <p className="text-sm text-slate-500 font-medium">{title}</p>
  </div>
);

const StatCards = ({ tasks }) => {
  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'TODO').length,
    done: tasks.filter(t => t.status === 'DONE').length,
    blocked: tasks.filter(t => t.status === 'BLOCKED').length,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <StatCard title="Total" count={stats.total} icon={<Layout size={20} />} colorClass="bg-blue-50 text-blue-500" />
      <StatCard title="To Do" count={stats.todo} icon={<Clock size={20} />} colorClass="bg-slate-50 text-slate-500" />
      <StatCard title="Done" count={stats.done} icon={<CheckCircle size={20} />} colorClass="bg-green-50 text-green-500" />
      <StatCard title="Blocked" count={stats.blocked} icon={<AlertCircle size={20} />} colorClass="bg-red-50 text-red-500" />
    </div>
  );
};

export default StatCards;